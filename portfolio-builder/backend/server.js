require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const resumeRoutes = require('./routes/resume');
const portfolioRoutes = require('./routes/portfolio');
const exportRoutes = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const exportsDir = path.join(__dirname, 'exports');
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '10mb' }));
app.use('/exports', express.static(exportsDir));

app.use('/api/resume', resumeRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/export', exportRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\n  Portfolio Builder API running on http://localhost:${PORT}\n`);
});
