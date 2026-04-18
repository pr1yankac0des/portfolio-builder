const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { renderTemplate } = require('../services/templateRenderer');

const router = express.Router();
const exportsDir = path.join(__dirname, '../exports');

router.post('/html', async (req, res) => {
  const { portfolioData, templateId, theme } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const html = renderTemplate(portfolioData, templateId || 'professional', theme || {});
    const filename = `portfolio-${uuidv4()}.html`;
    const filepath = path.join(exportsDir, filename);
    fs.writeFileSync(filepath, html);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio.html"`);
    res.send(html);
  } catch (err) {
    console.error('HTML export error:', err);
    res.status(500).json({ error: 'Failed to export HTML' });
  }
});

router.post('/pdf', async (req, res) => {
  const { portfolioData, templateId, theme } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  let browser;
  try {
    const puppeteer = require('puppeteer');
    const html = renderTemplate(portfolioData, templateId || 'professional', theme || {});

    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${(portfolioData.name || 'portfolio').replace(/\s+/g,'-').toLowerCase()}-portfolio.pdf"`);
    res.send(pdf);
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error('PDF export error:', err);
    res.status(500).json({ error: 'Failed to export PDF. Make sure Puppeteer is installed.' });
  }
});

router.post('/share', async (req, res) => {
  const { portfolioData, templateId, theme } = req.body;
  if (!portfolioData) return res.status(400).json({ error: 'Portfolio data required' });

  try {
    const html = renderTemplate(portfolioData, templateId || 'professional', theme || {});
    const slug = uuidv4().slice(0, 8);
    const filename = `${slug}.html`;
    const filepath = path.join(exportsDir, filename);
    fs.writeFileSync(filepath, html);

    const shareUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/exports/${filename}`;
    res.json({ success: true, url: shareUrl, slug });
  } catch (err) {
    console.error('Share error:', err);
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

module.exports = router;
