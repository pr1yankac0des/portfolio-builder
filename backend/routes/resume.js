const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
  }
});

async function extractText(filePath, mimetype) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }
  throw new Error('Unsupported file type');
}

const PARSE_SYSTEM_PROMPT = `You are an expert career assistant for students. Parse the given resume text and return ONLY a valid JSON object — no markdown fences, no extra text.

JSON schema:
{
  "name": "string",
  "tagline": "string (1 sentence professional summary)",
  "email": "string or empty string",
  "phone": "string or empty string",
  "linkedin": "string or empty string",
  "github": "string or empty string",
  "website": "string or empty string",
  "about": "string (2-3 engaging sentences in first person using strong action verbs)",
  "experience": [
    {
      "role": "string",
      "company": "string",
      "location": "string or empty string",
      "dates": "string",
      "bullets": ["enriched bullet strings with action verbs and metrics"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": "string (comma-separated technologies)",
      "link": "string or empty string",
      "bullets": ["enriched bullet strings"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "dates": "string",
      "gpa": "string or empty string",
      "courses": []
    }
  ],
  "skills": {
    "languages": [],
    "frameworks": [],
    "tools": [],
    "other": []
  },
  "achievements": ["string"],
  "certifications": ["string"],
  "languages": ["string"]
}

For EVERY experience and project bullet:
- Start with a strong action verb (Led, Built, Engineered, Designed, Reduced, Increased, Launched, Optimized...)
- Add metrics where inferable (%, numbers, scale, impact)
- Use achievement-based phrasing (not task-based)
- Keep each bullet under 25 words

If a field is missing from the resume, use an empty string or empty array. Never invent data that is not present.`;

router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = req.file.path;
  try {
    const rawText = await extractText(filePath, req.file.mimetype);
    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from the file. Please try a different format.' });
    }

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: PARSE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Parse this resume:\n\n${rawText}` }]
    });

    const raw = message.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    fs.unlink(filePath, () => {});
    res.json({ success: true, data: parsed });
  } catch (err) {
    fs.unlink(filePath, () => {});
    console.error('Parse error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume' });
  }
});

router.post('/parse-text', async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim().length < 30) {
    return res.status(400).json({ error: 'Please provide resume text (minimum 30 characters)' });
  }
  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      system: PARSE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Parse this resume:\n\n${text}` }]
    });
    const raw = message.content[0].text;
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume' });
  }
});

module.exports = router;
