import React, { useEffect, useRef, useState } from 'react';
import './PreviewStep.css';

const TEMPLATE_RENDERERS = {
  professional: renderProfessional,
  tech: renderTech,
  creative: renderCreative,
  academic: renderAcademic,
};

function getSkillsFlat(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || []),
    ...(skills.other || []),
  ];
}

export default function PreviewStep({ data, template, theme, onBack, onNext }) {
  const iframeRef = useRef(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const renderer = TEMPLATE_RENDERERS[template] || TEMPLATE_RENDERERS.professional;
    const html = renderer(data, theme.primaryColor, theme.fontFamily);
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      setTimeout(() => setRendered(true), 300);
    }
  }, [data, template, theme]);

  const skills = getSkillsFlat(data.skills);

  return (
    <div>
      <div className="preview-header card">
        <div className="preview-meta">
          <h2 className="card-title" style={{ margin: 0 }}>Portfolio preview</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {data.name} · {template.charAt(0).toUpperCase() + template.slice(1)} template
            &nbsp;·&nbsp; {(data.experience || []).length} exp
            &nbsp;·&nbsp; {(data.projects || []).length} projects
            &nbsp;·&nbsp; {skills.length} skills
          </p>
        </div>
      </div>

      <div className="preview-frame-wrap card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="preview-toolbar">
          <div className="preview-dots">
            <span /><span /><span />
          </div>
          <div className="preview-url">portfolio.html</div>
        </div>
        {!rendered && (
          <div className="preview-loading">
            <div className="spinner" />
            <span>Rendering your portfolio...</span>
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Portfolio Preview"
          className="preview-iframe"
          style={{ opacity: rendered ? 1 : 0 }}
          sandbox="allow-same-origin"
        />
      </div>

      <div className="row-between">
        <button className="btn" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext}>Get AI feedback →</button>
      </div>
    </div>
  );
}

function baseHead(title, css) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{-webkit-print-color-adjust:exact}a{text-decoration:none;color:inherit}${css}</style></head>`;
}

function renderProfessional(p, color = '#1a365d', font = 'Georgia, serif') {
  const skills = getSkillsFlat(p.skills);
  const accent = color + '18';
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};color:#222;background:#fff;max-width:860px;margin:0 auto;padding:48px 52px;font-size:14px}
.hdr{border-bottom:3px solid ${color};padding-bottom:22px;margin-bottom:28px}
.name{font-size:34px;font-weight:700;color:${color};letter-spacing:-.5px}
.tagline{font-size:14.5px;color:#555;margin-top:6px;max-width:580px}
.contact{display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:12.5px;color:#666}
.contact a{color:${color}}
.sec{margin-bottom:26px}
.sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:${color};border-bottom:1.5px solid ${color};padding-bottom:5px;margin-bottom:14px}
.row-jb{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:6px}
.role{font-size:14.5px;font-weight:700;color:#111}
.company{font-size:13.5px;color:${color};font-weight:600}
.dates{font-size:12px;color:#888;font-style:italic}
.bullet{font-size:13.5px;color:#333;padding:3px 0 3px 16px;border-left:2px solid #ddd;margin:4px 0;line-height:1.55}
.proj-tech{font-size:12px;color:${color};font-style:italic;margin:3px 0 6px}
.skills-wrap{display:flex;flex-wrap:wrap;gap:8px}
.skill{font-size:12px;padding:4px 12px;border-radius:4px;background:${accent};color:${color};border:1px solid ${color}30;font-weight:600}
.edu-row{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px}
.deg{font-size:14px;font-weight:700}.inst{font-size:13px;color:#555}
.ach{font-size:13.5px;padding:3px 0 3px 16px;border-left:2px solid ${color};margin:4px 0;color:#333}
.about{font-size:14px;color:#444;line-height:1.75}
`) + `<body>
<div class="hdr">
  <div class="name">${p.name || 'Your Name'}</div>
  <div class="tagline">${p.tagline || ''}</div>
  <div class="contact">
    ${[p.email, p.phone, p.linkedin && `<a href="${p.linkedin}">${p.linkedin}</a>`, p.github && `<a href="${p.github}">${p.github}</a>`, p.website && `<a href="${p.website}">${p.website}</a>`].filter(Boolean).join('<span style="color:#ccc">|</span>')}
  </div>
</div>
${p.about ? `<div class="sec"><div class="sec-title">About</div><p class="about">${p.about}</p></div>` : ''}
${(p.experience||[]).length ? `<div class="sec"><div class="sec-title">Experience</div>${(p.experience||[]).map(e=>`<div style="margin-bottom:18px"><div class="row-jb"><div><span class="role">${e.role}</span> &nbsp;·&nbsp; <span class="company">${e.company}</span>${e.location?`, ${e.location}`:''}</div><div class="dates">${e.dates||''}</div></div>${(e.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>` : ''}
${(p.projects||[]).length ? `<div class="sec"><div class="sec-title">Projects</div>${(p.projects||[]).map(pr=>`<div style="margin-bottom:16px"><div class="role">${pr.name}${pr.link?` — <a href="${pr.link}" style="color:${color};font-size:12px" target="_blank">${pr.link}</a>`:''}</div><div class="proj-tech">${pr.tech||''}</div>${(pr.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>` : ''}
${(p.education||[]).length ? `<div class="sec"><div class="sec-title">Education</div>${(p.education||[]).map(e=>`<div style="margin-bottom:12px"><div class="edu-row"><div><div class="deg">${e.degree}</div><div class="inst">${e.institution}</div></div><div style="text-align:right"><div class="dates">${e.dates||''}</div>${e.gpa?`<div style="font-size:12px;color:#888">GPA: ${e.gpa}</div>`:''}</div></div></div>`).join('')}</div>` : ''}
${skills.length ? `<div class="sec"><div class="sec-title">Skills</div><div class="skills-wrap">${skills.map(s=>`<span class="skill">${s}</span>`).join('')}</div></div>` : ''}
${(p.achievements||[]).length ? `<div class="sec"><div class="sec-title">Achievements</div>${(p.achievements||[]).map(a=>`<div class="ach">${a}</div>`).join('')}</div>` : ''}
${(p.certifications||[]).length ? `<div class="sec"><div class="sec-title">Certifications</div>${(p.certifications||[]).map(c=>`<div class="ach">${c}</div>`).join('')}</div>` : ''}
</body></html>`;
}

function renderTech(p, color = '#00b894', font = "'Courier New', monospace") {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#0f1117;color:#e0e0e0;display:flex;min-height:100vh}
.sidebar{width:240px;min-height:100vh;background:#1a1d27;padding:28px 18px;flex-shrink:0;border-right:1px solid #2a2d3a}
.main{flex:1;padding:32px 36px;background:#0f1117}
.av{width:56px;height:56px;border-radius:50%;background:${color}22;border:2px solid ${color};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:${color};margin-bottom:14px}
.sname{font-size:18px;font-weight:700;color:#fff;margin-bottom:4px}
.stag{font-size:12px;color:${color};margin-bottom:18px;line-height:1.5}
.slabel{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:${color};margin:16px 0 7px;font-weight:700}
.sval{font-size:12px;color:#aaa;margin-bottom:4px;word-break:break-all}
.sval a{color:${color}}
.sskill{font-family:'Courier New',monospace;font-size:12px;color:#ccc;padding:2px 0;display:block}
.sskill::before{content:'> ';color:${color}}
.sec-t{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:${color};margin-bottom:12px;padding-bottom:5px;border-bottom:1px solid ${color}40}
.sec{margin-bottom:28px}
.role{font-size:14px;font-weight:700;color:#fff}
.company{font-size:13px;color:${color};margin:2px 0 3px}
.dates{font-size:11px;color:#555;margin-bottom:7px}
.bullet{font-size:13px;color:#bbb;padding:3px 0 3px 12px;border-left:1px solid ${color}55;margin:4px 0;line-height:1.5}
.badges{display:flex;flex-wrap:wrap;gap:5px;margin:4px 0 8px}
.badge{font-size:11px;padding:2px 8px;background:${color}22;color:${color};border:1px solid ${color}44;border-radius:3px;font-family:'Courier New',monospace}
.about{font-size:13px;color:#bbb;line-height:1.75;margin-bottom:26px}
`) + `<body>
<div class="sidebar">
  <div class="av">${(p.name||'P').charAt(0).toUpperCase()}</div>
  <div class="sname">${p.name||'Your Name'}</div>
  <div class="stag">${p.tagline||''}</div>
  ${p.email?`<div class="slabel">Email</div><div class="sval">${p.email}</div>`:''}
  ${p.phone?`<div class="slabel">Phone</div><div class="sval">${p.phone}</div>`:''}
  ${p.linkedin?`<div class="slabel">LinkedIn</div><div class="sval"><a href="${p.linkedin}">${p.linkedin}</a></div>`:''}
  ${p.github?`<div class="slabel">GitHub</div><div class="sval"><a href="${p.github}">${p.github}</a></div>`:''}
  ${skills.length?`<div class="slabel">Skills</div>${skills.map(s=>`<span class="sskill">${s}</span>`).join('')}`:''}
</div>
<div class="main">
  ${p.about?`<p class="about">${p.about}</p>`:''}
  ${(p.experience||[]).length?`<div class="sec"><div class="sec-t">Experience</div>${(p.experience||[]).map(e=>`<div style="margin-bottom:18px"><div class="role">${e.role}</div><div class="company">${e.company}${e.location?` — ${e.location}`:''}</div><div class="dates">${e.dates||''}</div>${(e.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
  ${(p.projects||[]).length?`<div class="sec"><div class="sec-t">Projects</div>${(p.projects||[]).map(pr=>`<div style="margin-bottom:18px"><div class="role">${pr.name}${pr.link?` <a href="${pr.link}" style="font-size:11px;color:${color}" target="_blank">[link]</a>`:''}</div><div class="badges">${(pr.tech||'').split(',').map(t=>`<span class="badge">${t.trim()}</span>`).join('')}</div>${(pr.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
  ${(p.education||[]).length?`<div class="sec"><div class="sec-t">Education</div>${(p.education||[]).map(e=>`<div style="margin-bottom:12px"><div class="role">${e.degree}</div><div style="font-size:12px;color:#888">${e.institution}${e.gpa?` · GPA ${e.gpa}`:''} · ${e.dates||''}</div></div>`).join('')}</div>`:''}
  ${(p.achievements||[]).length?`<div class="sec"><div class="sec-t">Achievements</div>${(p.achievements||[]).map(a=>`<div class="bullet">${a}</div>`).join('')}</div>`:''}
</div>
</body></html>`;
}

function renderCreative(p, color = '#e84393', font = 'Inter, sans-serif') {
  const skills = getSkillsFlat(p.skills);
  const accent = color + '18';
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#f7f7f5;color:#111}
.hero{background:${color};color:#fff;padding:52px 56px 40px;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;right:-50px;top:-50px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.08)}
.hname{font-size:40px;font-weight:800;letter-spacing:-1px;margin-bottom:8px}
.htag{font-size:16px;opacity:.85;max-width:540px;line-height:1.55}
.hcontact{display:flex;flex-wrap:wrap;gap:14px;margin-top:18px;font-size:13px;opacity:.8}
.hcontact a{color:#fff}
.body{max-width:880px;margin:0 auto;padding:44px 56px}
.sec{margin-bottom:38px}
.sec-t{font-size:20px;font-weight:800;color:${color};margin-bottom:18px;padding-left:16px;border-left:4px solid ${color};border-radius:0 4px 4px 0}
.card{background:#fff;border-radius:10px;padding:18px 22px;margin-bottom:14px;border:1px solid #eee}
.row-jb{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.role{font-size:15px;font-weight:700;color:#111}
.company{font-size:13.5px;color:${color};font-weight:600;margin-top:2px}
.dates{font-size:12px;color:#999}
.bullet{font-size:13.5px;color:#444;padding:4px 0 4px 14px;border-left:3px solid ${color}40;margin:4px 0;line-height:1.55}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px}
.skill{background:${color};color:#fff;font-size:12px;font-weight:700;padding:8px;border-radius:22px;text-align:center}
.about{font-size:14.5px;color:#444;line-height:1.8;background:#fff;padding:22px;border-radius:10px;border-left:4px solid ${color}}
.proj-tech{font-size:12px;color:${color};font-style:italic;margin-bottom:8px;font-weight:600}
.edu-card{display:flex;justify-content:space-between;align-items:center;background:#fff;padding:14px 18px;border-radius:10px;margin-bottom:10px;border:1px solid #eee;flex-wrap:wrap;gap:6px}
.ach{background:${accent};border-left:4px solid ${color};padding:10px 16px;border-radius:0 8px 8px 0;margin-bottom:8px;font-size:13.5px;color:#333}
`) + `<body>
<div class="hero">
  <div class="hname">${p.name||'Your Name'}</div>
  <div class="htag">${p.tagline||''}</div>
  <div class="hcontact">
    ${[p.email, p.phone, p.linkedin&&`<a href="${p.linkedin}">LinkedIn</a>`, p.github&&`<a href="${p.github}">GitHub</a>`, p.website&&`<a href="${p.website}">${p.website}</a>`].filter(Boolean).join('<span style="opacity:.5">·</span>')}
  </div>
</div>
<div class="body">
  ${p.about?`<div class="sec"><div class="sec-t">About me</div><p class="about">${p.about}</p></div>`:''}
  ${(p.experience||[]).length?`<div class="sec"><div class="sec-t">Experience</div>${(p.experience||[]).map(e=>`<div class="card"><div class="row-jb"><div><div class="role">${e.role}</div><div class="company">${e.company}${e.location?` · ${e.location}`:''}</div></div><div class="dates">${e.dates||''}</div></div>${(e.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
  ${(p.projects||[]).length?`<div class="sec"><div class="sec-t">Projects</div>${(p.projects||[]).map(pr=>`<div class="card"><div class="role">${pr.name}${pr.link?` — <a href="${pr.link}" style="color:${color};font-size:12px">${pr.link}</a>`:''}</div><div class="proj-tech">${pr.tech||''}</div>${(pr.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
  ${skills.length?`<div class="sec"><div class="sec-t">Skills</div><div class="skills-grid">${skills.map(s=>`<div class="skill">${s}</div>`).join('')}</div></div>`:''}
  ${(p.education||[]).length?`<div class="sec"><div class="sec-t">Education</div>${(p.education||[]).map(e=>`<div class="edu-card"><div><div style="font-size:14px;font-weight:700">${e.degree}</div><div style="font-size:13px;color:#666">${e.institution}${e.gpa?` · GPA ${e.gpa}`:''}</div></div><div style="font-size:12px;color:#999">${e.dates||''}</div></div>`).join('')}</div>`:''}
  ${(p.achievements||[]).length?`<div class="sec"><div class="sec-t">Achievements</div>${(p.achievements||[]).map(a=>`<div class="ach">${a}</div>`).join('')}</div>`:''}
</div>
</body></html>`;
}

function renderAcademic(p, color = '#5c3317', font = 'Georgia, serif') {
  const skills = getSkillsFlat(p.skills);
  return baseHead(p.name || 'Portfolio', `
body{font-family:${font};background:#fff;color:#111;max-width:800px;margin:0 auto;padding:48px 52px;font-size:14px;line-height:1.65}
.hdr{text-align:center;padding-bottom:22px;margin-bottom:26px;border-bottom:2px solid ${color}}
.name{font-size:28px;font-weight:700;color:${color};margin-bottom:5px}
.tagline{font-size:14px;color:#555;margin-bottom:10px}
.contact{font-size:13px;color:#666;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.contact a{color:${color}}
.sec{margin-bottom:22px}
.sec-t{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.16em;color:${color};margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid ${color}}
.row-jb{display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;margin-bottom:4px}
.role{font-weight:700;font-size:14px}
.sub{font-size:13px;color:#555;margin-bottom:3px}
.dates{font-size:13px;color:#888;font-style:italic}
.bullet{font-size:13.5px;color:#333;padding-left:18px;text-indent:-10px;margin:3px 0;line-height:1.6}
.bullet::before{content:'·  ';color:${color};font-weight:700}
.skills-inline{font-size:13px;color:#444}
.ach{font-size:13.5px;color:#333;padding-left:18px;text-indent:-10px;margin:3px 0}
.ach::before{content:'» ';color:${color}}
`) + `<body>
<div class="hdr">
  <div class="name">${p.name||'Your Name'}</div>
  <div class="tagline">${p.tagline||''}</div>
  <div class="contact">${[p.email,p.phone,p.linkedin&&`<a href="${p.linkedin}">${p.linkedin}</a>`,p.github&&`<a href="${p.github}">${p.github}</a>`].filter(Boolean).join('<span style="color:#ccc">·</span>')}</div>
</div>
${p.about?`<div class="sec"><div class="sec-t">Research Statement</div><p style="font-size:14px;color:#333;line-height:1.75">${p.about}</p></div>`:''}
${(p.education||[]).length?`<div class="sec"><div class="sec-t">Education</div>${(p.education||[]).map(e=>`<div class="row-jb" style="margin-bottom:10px"><div><div class="role">${e.degree}</div><div class="sub">${e.institution}${e.gpa?`, GPA: ${e.gpa}`:''}</div></div><div class="dates">${e.dates||''}</div></div>`).join('')}</div>`:''}
${(p.experience||[]).length?`<div class="sec"><div class="sec-t">Research & Professional Experience</div>${(p.experience||[]).map(e=>`<div style="margin-bottom:14px"><div class="row-jb"><div><span class="role">${e.role}</span>, <span class="sub">${e.company}${e.location?`, ${e.location}`:''}</span></div><div class="dates">${e.dates||''}</div></div>${(e.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
${(p.projects||[]).length?`<div class="sec"><div class="sec-t">Projects & Publications</div>${(p.projects||[]).map(pr=>`<div style="margin-bottom:12px"><div class="role" style="font-style:italic">${pr.name}${pr.tech?` <span style="font-size:12px;color:#888;font-style:normal">[${pr.tech}]</span>`:''}</div>${(pr.bullets||[]).map(b=>`<div class="bullet">${b}</div>`).join('')}</div>`).join('')}</div>`:''}
${skills.length?`<div class="sec"><div class="sec-t">Technical Skills</div><div class="skills-inline">${skills.join(' &nbsp;·&nbsp; ')}</div></div>`:''}
${(p.achievements||[]).length?`<div class="sec"><div class="sec-t">Honors & Awards</div>${(p.achievements||[]).map(a=>`<div class="ach">${a}</div>`).join('')}</div>`:''}
${(p.certifications||[]).length?`<div class="sec"><div class="sec-t">Certifications</div>${(p.certifications||[]).map(c=>`<div class="ach">${c}</div>`).join('')}</div>`:''}
</body></html>`;
}
