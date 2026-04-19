const express = require('express');
const router = express.Router();

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
      max_tokens: 800
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'AI API error');
  return data.choices[0].message.content.replace(/```json|```/g, '').trim();
}

router.post('/feedback', async (req, res) => {
  const { portfolioData } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const prompt = `You are a career coach reviewing a student portfolio. Return ONLY a JSON object with no markdown, no backticks, no explanation.

Return exactly this structure:
{"scores":{"readability":85,"impact":78,"completeness":90,"actionVerbs":82,"overall":84},"strengths":["strength 1","strength 2"],"suggestions":["improvement 1","improvement 2","improvement 3","improvement 4"]}

Base scores (0-100) on bullet quality, action verb usage, metrics presence, section completeness.
Suggestions must each be under 15 words and actionable.

Portfolio data: ${JSON.stringify(portfolioData)}

Return ONLY the JSON object. No markdown. No backticks.`;

    const raw = await callAI(prompt);
    const data = JSON.parse(raw);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

module.exports = router;
