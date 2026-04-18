import React from 'react';
import './StepBar.css';

export default function StepBar({ steps, current, goTo, done }) {
  return (
    <div className="stepbar" role="navigation" aria-label="Progress steps">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <button
            className={`step-item ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
            onClick={() => i < current && goTo(i)}
            disabled={i > current}
            aria-current={i === current ? 'step' : undefined}
          >
            <div className="step-circle">
              {i < current ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="step-label">{label}</span>
          </button>
          {i < steps.length - 1 && <div className={`step-connector ${i < current ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}
