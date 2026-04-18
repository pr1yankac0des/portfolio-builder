import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FeedbackStep.css';

const API = process.env.REACT_APP_API_URL || '';

const SCORE_META = {
  readability: { label: 'Readability', color: '#534AB7', desc: 'How clear and easy to read your content is' },
  impact:      { label: 'Impact',      color: '#0F6E56', desc: 'How achievement-focused and results-driven your bullets are' },
  completeness:{ label: 'Completeness',color: '#185FA5', desc: 'How many key sections are filled and detailed' },
  actionVerbs: { label: 'Action verbs',color: '#854F0B', desc: 'Strength and variety of verbs used in experience bullets' },
  overall:     { label: 'Overall score',color: '#993556', desc: 'Combined assessment of your portfolio quality' },
};

export default function FeedbackStep({ data, feedback, setFeedback, onBack, onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!feedback) fetchFeedback();
    else setTimeout(() => setAnimated(true), 100);
  }, []);

  const fetchFeedback = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/api/portfolio/feedback`, { portfolioData: data });
      setFeedback(res.data.data);
      setLoading(false);
      setTimeout(() => setAnimated(true), 100);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to generate feedback. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2 className="card-title">AI draft feedback</h2>
        <p className="card-sub">Your portfolio has been reviewed for readability, impact, and completeness.</p>

        {loading && (
          <div className="fb-loading">
            <div className="spinner" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Analysing your portfolio...</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Checking bullet strength, action verbs, metrics, and section completeness</div>
            </div>
          </div>
        )}

        {error && (
          <div>
            <div className="error-msg">{error}</div>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={fetchFeedback}>Try again</button>
          </div>
        )}

        {feedback && !loading && (
          <div>
            <div className="score-grid">
              {Object.entries(SCORE_META).map(([key, meta]) => {
                const val = feedback.scores?.[key] ?? 0;
                return (
                  <div key={key} className={`score-card ${key === 'overall' ? 'overall' : ''}`}>
                    <div className="score-label">{meta.label}</div>
                    <div className="score-number" style={{ color: meta.color }}>{Math.round(val)}</div>
                    <div className="score-bar-wrap">
                      <div className="score-bar-fill" style={{ width: animated ? val + '%' : '0%', background: meta.color }} />
                    </div>
                    <div className="score-desc">{meta.desc}</div>
                  </div>
                );
              })}
            </div>

            {(feedback.strengths || []).length > 0 && (
              <div className="fb-section">
                <div className="fb-section-title">
                  <span className="fb-icon good">✓</span>
                  Strengths
                </div>
                {(feedback.strengths || []).map((s, i) => (
                  <div key={i} className="fb-item good">{s}</div>
                ))}
              </div>
            )}

            {(feedback.suggestions || []).length > 0 && (
              <div className="fb-section">
                <div className="fb-section-title">
                  <span className="fb-icon improve">↑</span>
                  Suggested improvements
                </div>
                {(feedback.suggestions || []).map((s, i) => (
                  <div key={i} className="fb-item improve">{s}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="row-between">
        <button className="btn" onClick={onBack}>← Back</button>
        <div className="row">
          {feedback && <button className="btn" onClick={fetchFeedback}>Regenerate feedback</button>}
          <button className="btn btn-primary" onClick={onNext}>Export portfolio →</button>
        </div>
      </div>
    </div>
  );
}
