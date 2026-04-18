# PortfolioAI — Resume to Portfolio Builder

A full-stack AI-powered web app that transforms student resumes (PDF, DOCX, TXT) into polished, exportable portfolios.

## Features

- **Upload resume** — PDF, DOCX, DOC, or TXT (up to 10 MB)
- **AI parsing** — Claude extracts and enriches all sections automatically
- **4 templates** — Classic Professional, Tech Minimal, Creative Grid, Academic Scholar
- **Theme customisation** — 10 accent colours, 4 font families, custom hex picker
- **Live preview** — Rendered iframe preview before export
- **AI feedback** — Scores readability, impact, completeness, and action verbs
- **Export options** — HTML download, PDF download (Puppeteer), shareable link

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, react-dropzone, axios |
| Backend | Node.js, Express |
| AI | Anthropic Claude API (claude-opus-4-5) |
| PDF parsing | pdf-parse |
| DOCX parsing | mammoth |
| PDF export | Puppeteer |
| File upload | multer |

---

## Project Structure

```
portfolio-builder/
├── backend/
│   ├── server.js               # Express entry point
│   ├── routes/
│   │   ├── resume.js           # Upload + parse endpoints
│   │   ├── portfolio.js        # Feedback endpoint
│   │   └── export.js           # HTML / PDF / share endpoints
│   ├── services/
│   │   └── templateRenderer.js # 4 HTML template renderers
│   ├── uploads/                # Temp upload dir (auto-created)
│   ├── exports/                # Exported portfolio files
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js              # Root component + step state
    │   ├── index.js
    │   ├── components/
    │   │   ├── StepBar.js      # Progress stepper
    │   │   ├── UploadStep.js   # File upload + text paste
    │   │   ├── TemplateStep.js # Template + theme picker
    │   │   ├── PreviewStep.js  # Live iframe preview (4 templates)
    │   │   ├── FeedbackStep.js # AI feedback scores
    │   │   └── ExportStep.js   # HTML / PDF / share export
    │   └── styles/
    │       ├── globals.css
    │       └── app.css
    └── package.json
```

---

## Setup & Run

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd portfolio-builder
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
FRONTEND_URL=http://localhost:3000
```

Get an API key at: https://console.anthropic.com

Start the backend:

```bash
npm run dev       # development (nodemon)
# or
npm start         # production
```

Backend runs at: http://localhost:5000

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: http://localhost:3000

The frontend proxies `/api` requests to `localhost:5000` automatically (via `package.json` proxy field).

---

## API Endpoints

### Resume

| Method | Path | Description |
|---|---|---|
| POST | `/api/resume/upload` | Upload a PDF/DOCX/TXT file |
| POST | `/api/resume/parse-text` | Parse plain text resume |

### Portfolio

| Method | Path | Description |
|---|---|---|
| POST | `/api/portfolio/feedback` | Get AI feedback scores |

### Export

| Method | Path | Description |
|---|---|---|
| POST | `/api/export/html` | Download HTML portfolio |
| POST | `/api/export/pdf` | Download PDF (requires Puppeteer) |
| POST | `/api/export/share` | Generate shareable public link |

---

## PDF Export Notes

PDF export uses Puppeteer (headless Chrome). On Linux servers, you may need:

```bash
sudo apt-get install -y chromium-browser
```

Or if running in Docker, add `--no-sandbox` flag (already included in `export.js`).

---

## Deployment

### Backend — Railway / Render / Fly.io

1. Set environment variables: `ANTHROPIC_API_KEY`, `PORT`, `FRONTEND_URL`
2. Run `npm start`

### Frontend — Vercel / Netlify

1. Set `REACT_APP_API_URL` if using a custom API URL (update axios base URL in components)
2. Run `npm run build`
3. Deploy the `build/` folder

### One-machine deployment

Update `frontend/package.json` proxy to point to your live backend URL, or serve the built frontend from Express:

```js
// In backend/server.js after routes:
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/build/index.html')));
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Claude API key |
| `PORT` | No | Backend port (default: 5000) |
| `FRONTEND_URL` | No | CORS origin (default: http://localhost:3000) |
| `BACKEND_URL` | No | Used for shareable link URLs |

---

## Customisation

### Adding a new template

1. Add a renderer function in `backend/services/templateRenderer.js`
2. Add a new case in the `renderTemplate` switch
3. Add the template card in `frontend/src/components/TemplateStep.js` (TEMPLATES array)
4. Add the client-side renderer in `frontend/src/components/PreviewStep.js` (TEMPLATE_RENDERERS object)

### Changing the AI model

In `backend/routes/resume.js` and `backend/routes/portfolio.js`, change:

```js
model: 'claude-opus-4-5'
// to any available Claude model
```

---

## License

MIT
