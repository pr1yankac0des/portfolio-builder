const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/feedback', async (req, res) => {
  const { portfolioData } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are a career coach reviewing a student portfolio. Return ONLY a JSON object with no markdown, no backticks, no explanation:
{"scores":{"readability":85,"impact":78,"completeness":90,"actionVerbs":82,"overall":84},"strengths":["strength 1","strength 2"],"suggestions":["improvement 1","improvement 2","improvement 3","improvement 4"]}

Base scores (0-100) on bullet quality, action verb usage, metrics presence, section completeness.
Suggestions must each be under 15 words and actionable.

Portfolio data:
${JSON.stringify(portfolioData)}

Return ONLY the JSON object.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, '').trim();
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;
