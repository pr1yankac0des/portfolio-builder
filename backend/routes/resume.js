const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const router = express.Router();

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

async function extractText(filePath) {
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

const PARSE_PROMPT = `You are an expert career assistant for students. Parse the given resume text and return ONLY a valid JSON object with no markdown fences, no extra text, no explanation.

Return this exact JSON structure:
{"name":"","tagline":"","email":"","phone":"","linkedin":"","github":"","website":"","about":"","experience":[{"role":"","company":"","location":"","dates":"","bullets":[]}],"projects":[{"name":"","tech":"","link":"","bullets":[]}],"education":[{"degree":"","institution":"","dates":"","gpa":"","courses":[]}],"skills":{"languages":[],"frameworks":[],"tools":[],"other":[]},"achievements":[],"certifications":[],"languages":[]}

Rules for bullets: Start with action verb, add metrics, keep under 25 words each.
Return ONLY the JSON. No markdown. No backticks. No explanation.`;

async function callAI(promptText) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.3,
      max_tokens: 2000
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'AI API error');
  return data.choices[0].message.content.replace(/```json|```/g, '').trim();
}

router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = req.file.path;
  try {
    const rawText = await extractText(filePath);
    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract enough text from the file.' });
    }
    const raw = await callAI(`${PARSE_PROMPT}\n\nParse this resume:\n\n${rawText}`);
    const parsed = JSON.parse(raw);
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
    const raw = await callAI(`${PARSE_PROMPT}\n\nParse this resume:\n\n${text}`);
    const parsed = JSON.parse(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: err.message || 'Failed to parse resume' });
  }
});

module.exports = router;
