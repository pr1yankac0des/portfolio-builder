import React, { useState } from 'react';
import UploadStep from './components/UploadStep';
import TemplateStep from './components/TemplateStep';
import PreviewStep from './components/PreviewStep';
import FeedbackStep from './components/FeedbackStep';
import ExportStep from './components/ExportStep';
import StepBar from './components/StepBar';
import './styles/app.css';

const STEPS = ['Upload', 'Template', 'Preview', 'Feedback', 'Export'];

export default function App() {
  const [step, setStep] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [template, setTemplate] = useState('professional');
  const [theme, setTheme] = useState({ primaryColor: '#1a365d', fontFamily: 'Georgia, serif', accentColor: '#1a365d18' });
  const [feedback, setFeedback] = useState(null);

  const goTo = (n) => setStep(n);
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">P</span>
            <span className="logo-text">PortfolioAI</span>
          </div>
          <div className="header-sub">Resume → Portfolio in minutes</div>
        </div>
      </header>

      <main className="app-main">
        <StepBar steps={STEPS} current={step} goTo={goTo} done={parsedData ? step : -1} />

        <div className="step-content">
          {step === 0 && (
            <UploadStep
              onParsed={(data) => { setParsedData(data); next(); }}
            />
          )}
          {step === 1 && (
            <TemplateStep
              template={template}
              theme={theme}
              setTemplate={setTemplate}
              setTheme={setTheme}
              onBack={back}
              onNext={next}
            />
          )}
          {step === 2 && parsedData && (
            <PreviewStep
              data={parsedData}
              template={template}
              theme={theme}
              onBack={back}
              onNext={next}
            />
          )}
          {step === 3 && parsedData && (
            <FeedbackStep
              data={parsedData}
              feedback={feedback}
              setFeedback={setFeedback}
              onBack={back}
              onNext={next}
            />
          )}
          {step === 4 && parsedData && (
            <ExportStep
              data={parsedData}
              template={template}
              theme={theme}
              onBack={back}
            />
          )}
        </div>
      </main>
    </div>
  );
}
