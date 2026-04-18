import React from 'react';
import './TemplateStep.css';

const TEMPLATES = [
  {
    id: 'professional',
    name: 'Classic professional',
    desc: 'Single column, formal layout. Ideal for business, finance, law.',
    tags: ['Business', 'Finance', 'Law'],
    preview: { bg: '#fff', accent: '#1a365d', style: 'serif' },
    defaultColor: '#1a365d',
    defaultFont: 'Georgia, serif'
  },
  {
    id: 'tech',
    name: 'Tech minimal',
    desc: 'Dark sidebar, monospace accents. Perfect for CS, engineering, data science.',
    tags: ['CS', 'Engineering', 'Data'],
    preview: { bg: '#0f1117', accent: '#00b894', style: 'mono' },
    defaultColor: '#00b894',
    defaultFont: "'Courier New', monospace"
  },
  {
    id: 'creative',
    name: 'Creative grid',
    desc: 'Bold hero header, card layout. Great for design, media, arts.',
    tags: ['Design', 'Media', 'Arts'],
    preview: { bg: '#fafafa', accent: '#e84393', style: 'sans' },
    defaultColor: '#e84393',
    defaultFont: 'Inter, sans-serif'
  },
  {
    id: 'academic',
    name: 'Academic scholar',
    desc: 'Publication-style, dense CV layout. Built for grad students and researchers.',
    tags: ['Research', 'Grad School', 'Academia'],
    preview: { bg: '#fff', accent: '#5c3317', style: 'serif' },
    defaultColor: '#5c3317',
    defaultFont: 'Georgia, serif'
  }
];

const COLORS = [
  { label: 'Navy', value: '#1a365d' },
  { label: 'Indigo', value: '#534AB7' },
  { label: 'Teal', value: '#0F6E56' },
  { label: 'Crimson', value: '#c0392b' },
  { label: 'Coral', value: '#993C1D' },
  { label: 'Ocean', value: '#185FA5' },
  { label: 'Amber', value: '#854F0B' },
  { label: 'Forest', value: '#27500A' },
  { label: 'Slate', value: '#444441' },
  { label: 'Purple', value: '#3C3489' }
];

const FONTS = [
  { label: 'Inter (modern)', value: 'Inter, sans-serif' },
  { label: 'Georgia (classic)', value: 'Georgia, serif' },
  { label: 'Courier (tech)', value: "'Courier New', monospace" },
  { label: 'System default', value: '-apple-system, BlinkMacSystemFont, sans-serif' }
];

export default function TemplateStep({ template, theme, setTemplate, setTheme, onBack, onNext }) {
  const handleSelectTemplate = (tmpl) => {
    setTemplate(tmpl.id);
    setTheme(t => ({ ...t, primaryColor: tmpl.defaultColor, fontFamily: tmpl.defaultFont }));
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Choose your template</h2>
        <p className="card-sub">Pick the style that fits your career path. You can customise colors and fonts below.</p>

        <div className="tmpl-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`tmpl-card ${template === t.id ? 'selected' : ''}`}
              onClick={() => handleSelectTemplate(t)}
            >
              <div className="tmpl-preview" style={{ background: t.preview.bg }}>
                <div className="tmpl-line-h" style={{ background: t.preview.accent, width: '60%' }} />
                <div className="tmpl-line" style={{ background: t.preview.accent + '44', width: '80%' }} />
                <div className="tmpl-line" style={{ background: t.preview.accent + '33', width: '55%' }} />
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[40, 55, 35].map((w, i) => (
                    <div key={i} className="tmpl-tag-pre" style={{ width: w, background: t.preview.accent + '22', borderColor: t.preview.accent + '55', color: t.preview.accent }} />
                  ))}
                </div>
                {template === t.id && (
                  <div className="tmpl-check">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="tmpl-info">
                <div className="tmpl-name">{t.name}</div>
                <div className="tmpl-desc">{t.desc}</div>
                <div className="tmpl-tags">
                  {t.tags.map(tag => <span key={tag} className="tmpl-tag">{tag}</span>)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="card-title" style={{ fontSize: 16 }}>Customise theme</h2>
        <p className="card-sub" style={{ marginBottom: 20 }}>Fine-tune colors and typography to match your style.</p>

        <div className="theme-row">
          <div className="theme-block">
            <label className="label">Accent color</label>
            <div className="color-swatches">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  title={c.label}
                  className={`swatch ${theme.primaryColor === c.value ? 'active' : ''}`}
                  style={{ background: c.value }}
                  onClick={() => setTheme(t => ({ ...t, primaryColor: c.value }))}
                />
              ))}
              <label className="swatch custom-color" title="Custom color">
                <input type="color" value={theme.primaryColor} onChange={e => setTheme(t => ({ ...t, primaryColor: e.target.value }))} />
                <span>+</span>
              </label>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
              Selected: <span style={{ color: theme.primaryColor, fontWeight: 600 }}>{theme.primaryColor}</span>
            </div>
          </div>

          <div className="theme-block">
            <label className="label">Font family</label>
            <select value={theme.fontFamily} onChange={e => setTheme(t => ({ ...t, fontFamily: e.target.value }))}>
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="row-between">
        <button className="btn" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Generate preview →</button>
      </div>
    </div>
  );
}
