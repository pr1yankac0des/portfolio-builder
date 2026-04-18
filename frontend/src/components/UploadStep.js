import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './UploadStep.css';

export default function UploadStep({ onParsed }) {
  const [mode, setMode] = useState('file'); // 'file' | 'text'
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected.length > 0) {
      setError('File type not supported. Please upload PDF, DOCX, DOC, or TXT.');
      return;
    }
    if (accepted.length > 0) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const simulate = (msg, pct) => { setStatusMsg(msg); setProgress(pct); };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file first.'); return; }
    setError(''); setLoading(true);
    try {
      simulate('Uploading file...', 20);
      const form = new FormData();
      form.append('resume', file);
      simulate('Extracting text from document...', 45);
      const res = await axios.post('/api/resume/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      simulate('AI is parsing and enriching your resume...', 75);
      await new Promise(r => setTimeout(r, 300));
      simulate('Done!', 100);
      setTimeout(() => onParsed(res.data.data), 400);
    } catch (e) {
      setError(e.response?.data?.error || 'Upload failed. Please try again.');
      setLoading(false); setProgress(0); setStatusMsg('');
    }
  };

  const handleTextParse = async () => {
    if (text.trim().length < 30) { setError('Please paste more resume content (minimum 30 characters).'); return; }
    setError(''); setLoading(true);
    try {
      simulate('Sending to AI parser...', 30);
      const res = await axios.post('/api/resume/parse-text', { text });
      simulate('Enriching bullets with action verbs and metrics...', 70);
      await new Promise(r => setTimeout(r, 300));
      simulate('Done!', 100);
      setTimeout(() => onParsed(res.data.data), 400);
    } catch (e) {
      setError(e.response?.data?.error || 'Parsing failed. Please try again.');
      setLoading(false); setProgress(0); setStatusMsg('');
    }
  };

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Upload your resume</h1>
        <p className="card-sub">We'll parse it with AI, enrich every bullet, and build your portfolio in seconds.</p>

        <div className="mode-tabs">
          <button className={`mode-tab ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')}>
            Upload file
          </button>
          <button className={`mode-tab ${mode === 'text' ? 'active' : ''}`} onClick={() => setMode('text')}>
            Paste text
          </button>
        </div>

        {mode === 'file' && (
          <div>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}>
              <input {...getInputProps()} />
              {file ? (
                <div className="file-selected">
                  <div className="file-icon">
                    <FileIcon type={file.name.split('.').pop()} />
                  </div>
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{(file.size / 1024).toFixed(0)} KB</div>
                  </div>
                  <button className="file-remove" onClick={e => { e.stopPropagation(); setFile(null); }}>✕</button>
                </div>
              ) : (
                <div className="drop-prompt">
                  <div className="drop-icon">
                    <UploadIcon />
                  </div>
                  <p className="drop-text">{isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}</p>
                  <p className="drop-sub">or click to browse</p>
                  <div className="drop-types">PDF · DOCX · DOC · TXT &nbsp;·&nbsp; max 10 MB</div>
                </div>
              )}
            </div>
          </div>
        )}

        {mode === 'text' && (
          <div>
            <textarea
              rows={14}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`Paste your resume text here...\n\nExample:\nJane Smith | jane@email.com | github.com/janesmith\n\nEDUCATION\nB.Tech Computer Science, IIT Delhi, 2024 | GPA 8.9\n\nEXPERIENCE\nSoftware Intern — Flipkart (Jun–Aug 2023)\n- Built analytics dashboard used by 200+ analysts\n- Cut load time by 40% using Redis caching\n\nSKILLS: Python, React, Node.js, SQL, Figma`}
              style={{ resize: 'vertical', lineHeight: 1.65 }}
            />
          </div>
        )}

        {error && <div className="error-msg">{error}</div>}

        {loading && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--purple-600)', marginBottom: 6 }}>{statusMsg}</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: progress + '%' }} /></div>
          </div>
        )}

        <div className="row-end" style={{ marginTop: 20 }}>
          <button
            className="btn btn-primary"
            onClick={mode === 'file' ? handleUpload : handleTextParse}
            disabled={loading || (mode === 'file' ? !file : text.trim().length < 10)}
          >
            {loading ? 'Processing...' : 'Parse with AI →'}
          </button>
        </div>
      </div>

      <div className="tip-box">
        <strong>Tips for best results:</strong> Include your full name, contact info, all work experience with dates, projects with tech stacks, education details, and a skills list. The more detail you provide, the richer your portfolio will be.
      </div>
    </div>
  );
}

function FileIcon({ type }) {
  const colors = { pdf: '#e74c3c', docx: '#2980b9', doc: '#2980b9', txt: '#7f8c8d' };
  return (
    <div style={{ width: 40, height: 40, borderRadius: 8, background: colors[type] || '#95a5a6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>
      {type?.toUpperCase()}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="var(--purple-50)"/>
      <path d="M20 26V14M14 20l6-6 6 6" stroke="var(--purple-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 28h14" stroke="var(--purple-600)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
