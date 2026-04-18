function getSkillsFlat(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || []),
    ...(skills.other || [])
  ];
}

function renderTemplate(data, templateId, theme = {}) {
  const color = theme.primaryColor || defaultColors[templateId] || '#534AB7';
  const font = theme.fontFamily || defaultFonts[templateId] || 'Inter, sans-serif';
  const accentColor = theme.accentColor || lightenColor(color);

  switch (templateId) {
    case 'tech': return techTemplate(data, color, font, accentColor);
    case 'creative': return creativeTemplate(data, color, font, accentColor);
    case 'academic': return academicTemplate(data, color, font, accentColor);
    default: return professionalTemplate(data, color, font, accentColor);
  }
}

const defaultColors = {
  professional: '#1a365d',
  tech: '#00b894',
  creative: '#e84393',
  academic: '#5c3317'
};
const defaultFonts = {
  professional: 'Georgia, serif',
  tech: "'Courier New', monospace",
  creative: 'Inter, sans-serif',
  academic: 'Georgia, serif'
};

function lightenColor(hex) {
  return hex + '18';
}

function baseHead(title, extraCss = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Portfolio</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
a{text-decoration:none;color:inherit}
${extraCss}
</style>
</head>`;
}

function professionalTemplate(p, color, font, accent) {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};color:#222;background:#fff;max-width:900px;margin:0 auto;padding:40px}
.header{border-bottom:3px solid ${color};padding-bottom:20px;margin-bottom:28px}
.name{font-size:32px;font-weight:700;color:${color};letter-spacing:-0.5px}
.tagline{font-size:15px;color:#555;margin-top:6px}
.contact{display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:13px;color:#666}
.contact a{color:${color}}
.section{margin-bottom:28px}
.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:${color};border-bottom:1.5px solid ${color};padding-bottom:4px;margin-bottom:14px}
.exp-item{margin-bottom:18px}
.exp-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px}
.exp-role{font-size:15px;font-weight:600;color:#111}
.exp-company{font-size:14px;color:${color};font-weight:500}
.exp-dates{font-size:12px;color:#888}
.bullet{font-size:13.5px;color:#333;padding:3px 0 3px 16px;border-left:2px solid #ddd;margin:4px 0;line-height:1.55}
.proj-tech{font-size:12px;color:${color};font-style:italic;margin:3px 0 6px}
.skills-wrap{display:flex;flex-wrap:wrap;gap:8px}
.skill-tag{font-size:12px;padding:4px 12px;border-radius:4px;background:${accent};color:${color};border:1px solid ${color}30;font-weight:500}
.edu-row{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.edu-degree{font-size:14px;font-weight:600}
.edu-inst{font-size:13px;color:#555}
.achievement{font-size:13.5px;padding:3px 0 3px 16px;border-left:2px solid ${color};margin:4px 0;color:#333}
.about{font-size:14px;color:#444;line-height:1.75}
@media print{body{padding:20px;max-width:100%}}
`) + `
<body>
<div class="header">
  <div class="name">${p.name || 'Your Name'}</div>
  <div class="tagline">${p.tagline || ''}</div>
  <div class="contact">
    ${p.email ? `<span>${p.email}</span>` : ''}
    ${p.phone ? `<span>${p.phone}</span>` : ''}
    ${p.linkedin ? `<a href="${p.linkedin}" target="_blank">${p.linkedin}</a>` : ''}
    ${p.github ? `<a href="${p.github}" target="_blank">${p.github}</a>` : ''}
    ${p.website ? `<a href="${p.website}" target="_blank">${p.website}</a>` : ''}
  </div>
</div>

${p.about ? `<div class="section"><div class="section-title">About</div><p class="about">${p.about}</p></div>` : ''}

${(p.experience || []).length ? `<div class="section"><div class="section-title">Experience</div>
${(p.experience || []).map(e => `<div class="exp-item">
  <div class="exp-header">
    <div><span class="exp-role">${e.role}</span> &nbsp;·&nbsp; <span class="exp-company">${e.company}</span>${e.location ? `, ${e.location}` : ''}</div>
    <div class="exp-dates">${e.dates || ''}</div>
  </div>
  ${(e.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
</div>`).join('')}
</div>` : ''}

${(p.projects || []).length ? `<div class="section"><div class="section-title">Projects</div>
${(p.projects || []).map(pr => `<div class="exp-item">
  <div class="exp-role">${pr.name}${pr.link ? ` — <a href="${pr.link}" target="_blank" style="color:${color};font-size:13px">${pr.link}</a>` : ''}</div>
  <div class="proj-tech">${pr.tech || ''}</div>
  ${(pr.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
</div>`).join('')}
</div>` : ''}

${(p.education || []).length ? `<div class="section"><div class="section-title">Education</div>
${(p.education || []).map(e => `<div class="exp-item">
  <div class="edu-row">
    <div><div class="edu-degree">${e.degree}</div><div class="edu-inst">${e.institution}</div></div>
    <div style="text-align:right"><div class="exp-dates">${e.dates || ''}</div>${e.gpa ? `<div style="font-size:12px;color:#666">GPA: ${e.gpa}</div>` : ''}</div>
  </div>
</div>`).join('')}
</div>` : ''}

${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-wrap">${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></div>` : ''}

${(p.achievements || []).length ? `<div class="section"><div class="section-title">Achievements</div>${(p.achievements || []).map(a => `<div class="achievement">${a}</div>`).join('')}</div>` : ''}

${(p.certifications || []).length ? `<div class="section"><div class="section-title">Certifications</div>${(p.certifications || []).map(c => `<div class="achievement">${c}</div>`).join('')}</div>` : ''}
</body></html>`;
}

function techTemplate(p, color, font, accent) {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#0f1117;color:#e0e0e0;min-height:100vh;display:flex}
.sidebar{width:260px;min-height:100vh;background:#1a1d27;padding:32px 20px;flex-shrink:0;border-right:1px solid #2a2d3a}
.main{flex:1;padding:36px 40px;background:#0f1117}
.avatar{width:64px;height:64px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:${color};margin-bottom:16px}
.s-name{font-size:20px;font-weight:700;color:#fff;margin-bottom:4px}
.s-tagline{font-size:12px;color:${color};margin-bottom:20px;line-height:1.5}
.s-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${color};margin:18px 0 8px;font-weight:600}
.s-val{font-size:12px;color:#aaa;margin-bottom:4px;word-break:break-all}
.s-val a{color:${color}}
.s-skill{font-family:'Courier New',monospace;font-size:12px;color:#ccc;padding:2px 0;display:block}
.s-skill::before{content:'> ';color:${color}}
.section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:${color};margin-bottom:14px;padding-bottom:6px;border-bottom:1px solid ${color}40}
.section{margin-bottom:30px}
.exp-role{font-size:15px;font-weight:600;color:#fff}
.exp-company{font-size:13px;color:${color};margin:2px 0 4px}
.exp-dates{font-size:11px;color:#666;margin-bottom:8px}
.bullet{font-size:13px;color:#bbb;padding:3px 0 3px 14px;border-left:1px solid ${color}60;margin:4px 0;line-height:1.5}
.proj-tech{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}
.tech-badge{font-size:11px;padding:2px 8px;background:${color}22;color:${color};border:1px solid ${color}50;border-radius:3px;font-family:'Courier New',monospace}
.edu-degree{font-size:14px;font-weight:600;color:#fff}
.edu-inst{font-size:13px;color:#888}
.about{font-size:13.5px;color:#bbb;line-height:1.75;margin-bottom:28px}
@media print{body{display:block}.sidebar{width:100%;min-height:auto;border:none}.main{padding:20px}}
`) + `
<body>
<div class="sidebar">
  <div class="avatar">${(p.name || 'P').charAt(0).toUpperCase()}</div>
  <div class="s-name">${p.name || 'Your Name'}</div>
  <div class="s-tagline">${p.tagline || ''}</div>
  ${p.email ? `<div class="s-label">Email</div><div class="s-val">${p.email}</div>` : ''}
  ${p.phone ? `<div class="s-label">Phone</div><div class="s-val">${p.phone}</div>` : ''}
  ${p.linkedin ? `<div class="s-label">LinkedIn</div><div class="s-val"><a href="${p.linkedin}">${p.linkedin}</a></div>` : ''}
  ${p.github ? `<div class="s-label">GitHub</div><div class="s-val"><a href="${p.github}">${p.github}</a></div>` : ''}
  ${skills.length ? `<div class="s-label">Skills</div>${skills.map(s => `<span class="s-skill">${s}</span>`).join('')}` : ''}
</div>
<div class="main">
  ${p.about ? `<p class="about">${p.about}</p>` : ''}
  ${(p.experience || []).length ? `<div class="section"><div class="section-title">Experience</div>
  ${(p.experience || []).map(e => `<div style="margin-bottom:20px">
    <div class="exp-role">${e.role}</div>
    <div class="exp-company">${e.company}${e.location ? ` — ${e.location}` : ''}</div>
    <div class="exp-dates">${e.dates || ''}</div>
    ${(e.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
  </div>`).join('')}</div>` : ''}
  ${(p.projects || []).length ? `<div class="section"><div class="section-title">Projects</div>
  ${(p.projects || []).map(pr => `<div style="margin-bottom:20px">
    <div class="exp-role">${pr.name}${pr.link ? ` <a href="${pr.link}" style="font-size:12px;color:${color}" target="_blank">[link]</a>` : ''}</div>
    <div class="proj-tech">${(pr.tech || '').split(',').map(t => `<span class="tech-badge">${t.trim()}</span>`).join('')}</div>
    ${(pr.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
  </div>`).join('')}</div>` : ''}
  ${(p.education || []).length ? `<div class="section"><div class="section-title">Education</div>
  ${(p.education || []).map(e => `<div style="margin-bottom:14px">
    <div class="edu-degree">${e.degree}</div>
    <div class="edu-inst">${e.institution} ${e.gpa ? `· GPA ${e.gpa}` : ''} · ${e.dates || ''}</div>
  </div>`).join('')}</div>` : ''}
  ${(p.achievements || []).length ? `<div class="section"><div class="section-title">Achievements</div>${(p.achievements || []).map(a => `<div class="bullet">${a}</div>`).join('')}</div>` : ''}
</div>
</body></html>`;
}

function creativeTemplate(p, color, font, accent) {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#fafafa;color:#111;margin:0;padding:0}
.hero{background:${color};color:#fff;padding:56px 60px 40px;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:rgba(255,255,255,.08)}
.hero-name{font-size:42px;font-weight:800;letter-spacing:-1px;margin-bottom:8px}
.hero-tagline{font-size:17px;opacity:.85;max-width:550px;line-height:1.55}
.hero-contact{display:flex;flex-wrap:wrap;gap:16px;margin-top:20px;font-size:13px;opacity:.8}
.hero-contact a{color:#fff}
.body{max-width:900px;margin:0 auto;padding:48px 60px}
.section{margin-bottom:40px}
.section-title{font-size:22px;font-weight:800;color:${color};margin-bottom:20px;position:relative;padding-left:18px}
.section-title::before{content:'';position:absolute;left:0;top:4px;bottom:4px;width:4px;background:${color};border-radius:2px}
.card{background:#fff;border-radius:10px;padding:20px 24px;margin-bottom:16px;border:1px solid #eee;transition:box-shadow .2s}
.card-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.card-role{font-size:16px;font-weight:700;color:#111}
.card-company{font-size:14px;color:${color};font-weight:500;margin-top:2px}
.card-dates{font-size:12px;color:#999;white-space:nowrap}
.bullet{font-size:13.5px;color:#444;padding:4px 0 4px 16px;border-left:3px solid ${color}40;margin:4px 0;line-height:1.55}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px}
.skill-pill{background:${color};color:#fff;font-size:12px;font-weight:600;padding:8px 14px;border-radius:24px;text-align:center}
.about{font-size:15px;color:#444;line-height:1.8;background:#fff;padding:24px;border-radius:10px;border-left:4px solid ${color}}
.proj-tech{font-size:12px;color:${color};font-style:italic;margin-bottom:8px;font-weight:500}
.edu-card{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:16px 20px;border-radius:10px;margin-bottom:10px;border:1px solid #eee;flex-wrap:wrap;gap:8px}
.ach-item{background:${accent};border-left:4px solid ${color};padding:10px 16px;border-radius:0 8px 8px 0;margin-bottom:8px;font-size:13.5px;color:#333}
@media(max-width:600px){.hero,.body{padding:32px 24px}.hero-name{font-size:28px}}
@media print{body{background:#fff}.card{box-shadow:none;border:1px solid #ddd}}
`) + `
<body>
<div class="hero">
  <div class="hero-name">${p.name || 'Your Name'}</div>
  <div class="hero-tagline">${p.tagline || ''}</div>
  <div class="hero-contact">
    ${p.email ? `<span>${p.email}</span>` : ''}
    ${p.phone ? `<span>${p.phone}</span>` : ''}
    ${p.linkedin ? `<a href="${p.linkedin}" target="_blank">LinkedIn</a>` : ''}
    ${p.github ? `<a href="${p.github}" target="_blank">GitHub</a>` : ''}
    ${p.website ? `<a href="${p.website}" target="_blank">${p.website}</a>` : ''}
  </div>
</div>
<div class="body">
  ${p.about ? `<div class="section"><div class="section-title">About me</div><p class="about">${p.about}</p></div>` : ''}
  ${(p.experience || []).length ? `<div class="section"><div class="section-title">Experience</div>
  ${(p.experience || []).map(e => `<div class="card">
    <div class="card-top">
      <div><div class="card-role">${e.role}</div><div class="card-company">${e.company}${e.location ? ` · ${e.location}` : ''}</div></div>
      <div class="card-dates">${e.dates || ''}</div>
    </div>
    ${(e.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
  </div>`).join('')}</div>` : ''}
  ${(p.projects || []).length ? `<div class="section"><div class="section-title">Projects</div>
  ${(p.projects || []).map(pr => `<div class="card">
    <div class="card-role">${pr.name}${pr.link ? ` — <a href="${pr.link}" target="_blank" style="color:${color};font-size:13px">${pr.link}</a>` : ''}</div>
    <div class="proj-tech">${pr.tech || ''}</div>
    ${(pr.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
  </div>`).join('')}</div>` : ''}
  ${skills.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills-grid">${skills.map(s => `<div class="skill-pill">${s}</div>`).join('')}</div></div>` : ''}
  ${(p.education || []).length ? `<div class="section"><div class="section-title">Education</div>
  ${(p.education || []).map(e => `<div class="edu-card">
    <div><div style="font-size:15px;font-weight:700">${e.degree}</div><div style="font-size:13px;color:#666">${e.institution}${e.gpa ? ` · GPA ${e.gpa}` : ''}</div></div>
    <div style="font-size:12px;color:#999">${e.dates || ''}</div>
  </div>`).join('')}</div>` : ''}
  ${(p.achievements || []).length ? `<div class="section"><div class="section-title">Achievements</div>${(p.achievements || []).map(a => `<div class="ach-item">${a}</div>`).join('')}</div>` : ''}
</div>
</body></html>`;
}

function academicTemplate(p, color, font, accent) {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#fff;color:#111;max-width:820px;margin:0 auto;padding:48px 56px;font-size:14px;line-height:1.65}
.header{text-align:center;padding-bottom:24px;margin-bottom:28px;border-bottom:2px solid ${color}}
.name{font-size:28px;font-weight:700;color:${color};letter-spacing:.3px;margin-bottom:6px}
.tagline{font-size:14px;color:#555;margin-bottom:12px}
.contact{font-size:13px;color:#666;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.contact a{color:${color}}
.section{margin-bottom:24px}
.section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${color};margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid ${color}}
.exp-header{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.exp-role{font-weight:700;font-size:14px}
.exp-sub{font-size:13px;color:#555;margin-bottom:4px}
.exp-dates{font-size:13px;color:#888;font-style:italic}
.bullet{font-size:13.5px;color:#333;padding-left:20px;text-indent:-12px;margin:3px 0;line-height:1.6}
.bullet::before{content:'·  ';color:${color};font-weight:700}
.pub-title{font-style:italic;color:${color}}
.skills-inline{font-size:13px;color:#444}
.edu-row{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:8px}
.ach-bullet{font-size:13.5px;color:#333;padding-left:20px;text-indent:-12px;margin:3px 0}
.ach-bullet::before{content:'» ';color:${color}}
@media print{body{padding:20px}}
`) + `
<body>
<div class="header">
  <div class="name">${p.name || 'Your Name'}</div>
  <div class="tagline">${p.tagline || ''}</div>
  <div class="contact">
    ${[p.email, p.phone, p.linkedin, p.github, p.website].filter(Boolean).map(v => `<span>${v}</span>`).join('')}
  </div>
</div>

${p.about ? `<div class="section"><div class="section-title">Research Statement</div><p style="font-size:14px;color:#333;line-height:1.75">${p.about}</p></div>` : ''}

${(p.education || []).length ? `<div class="section"><div class="section-title">Education</div>
${(p.education || []).map(e => `<div class="edu-row">
  <div><div class="exp-role">${e.degree}</div><div class="exp-sub">${e.institution}${e.gpa ? `, GPA: ${e.gpa}` : ''}</div></div>
  <div class="exp-dates">${e.dates || ''}</div>
</div>`).join('')}</div>` : ''}

${(p.experience || []).length ? `<div class="section"><div class="section-title">Research & Professional Experience</div>
${(p.experience || []).map(e => `<div style="margin-bottom:16px">
  <div class="exp-header">
    <div><span class="exp-role">${e.role}</span>, <span class="exp-sub">${e.company}${e.location ? `, ${e.location}` : ''}</span></div>
    <div class="exp-dates">${e.dates || ''}</div>
  </div>
  ${(e.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
</div>`).join('')}</div>` : ''}

${(p.projects || []).length ? `<div class="section"><div class="section-title">Projects & Publications</div>
${(p.projects || []).map(pr => `<div style="margin-bottom:14px">
  <div class="exp-role"><span class="pub-title">${pr.name}</span>${pr.tech ? ` <span style="font-size:12px;color:#888">[${pr.tech}]</span>` : ''}</div>
  ${(pr.bullets || []).map(b => `<div class="bullet">${b}</div>`).join('')}
</div>`).join('')}</div>` : ''}

${skills.length ? `<div class="section"><div class="section-title">Technical Skills</div><div class="skills-inline">${skills.join(' &nbsp;·&nbsp; ')}</div></div>` : ''}

${(p.achievements || []).length ? `<div class="section"><div class="section-title">Honors & Awards</div>${(p.achievements || []).map(a => `<div class="ach-bullet">${a}</div>`).join('')}</div>` : ''}

${(p.certifications || []).length ? `<div class="section"><div class="section-title">Certifications</div>${(p.certifications || []).map(c => `<div class="ach-bullet">${c}</div>`).join('')}</div>` : ''}
</body></html>`;
}

module.exports = { renderTemplate };
