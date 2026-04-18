const express = require('express');
const router = express.Router();

async function callGemini(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API error');
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.replace(/```json|```/g, '').trim();
}

router.post('/feedback', async (req, res) => {
  const { portfolioData } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const prompt = `You are a career coach reviewing a student portfolio. Return ONLY a JSON object with no markdown, no backticks, no explanation:
{"scores":{"readability":85,"impact":78,"completeness":90,"actionVerbs":82,"overall":84},"strengths":["strength 1","strength 2"],"suggestions":["improvement 1","improvement 2","improvement 3","improvement 4"]}

Base scores (0-100) on bullet quality, action verb usage, metrics presence, section completeness.
Suggestions must each be under 15 words and actionable.

Portfolio data:
${JSON.stringify(portfolioData)}

Return ONLY the JSON object.`;

    const raw = await callGemini(prompt);
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;
