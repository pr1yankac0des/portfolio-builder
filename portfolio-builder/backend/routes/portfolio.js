const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/feedback', async (req, res) => {
  const { portfolioData } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 800,
      system: `You are a career coach reviewing a student portfolio. Return ONLY a JSON object:
{
  "scores": {
    "readability": number (0-100),
    "impact": number (0-100),
    "completeness": number (0-100),
    "actionVerbs": number (0-100),
    "overall": number (0-100)
  },
  "strengths": ["string", "string"],
  "suggestions": ["actionable improvement string under 15 words", "...", "...", "..."]
}
Base scores on: bullet quality, action verb usage, metrics presence, section completeness, about section quality.`,
      messages: [{ role: 'user', content: JSON.stringify(portfolioData) }]
    });

    const raw = message.content[0].text.replace(/```json|```/g, '').trim();
    res.json({ success: true, data: JSON.parse(raw) });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;
