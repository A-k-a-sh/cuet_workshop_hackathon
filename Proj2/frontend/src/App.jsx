import React, { useState, useMemo } from 'react';
import { predict } from './model/predict';
import InputForm from './components/InputForm';
import RiskGauge from './components/RiskGauge';
import FactorBreakdown from './components/FactorBreakdown';
import Disclaimer from './components/Disclaimer';

const INITIAL_VALUES = {
  age: 54,
  sex: 1,
  cp: 1,
  trestbps: 132,
  chol: 245,
  fbs: 0,
  restecg: 1,
  thalach: 149,
  exang: 0,
  oldpeak: 1.0,
  slope: 1,
  ca: 1,
  thal: 2
};

const ecgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="900" viewBox="0 0 1440 900" fill="none"><defs><radialGradient id="redGlow" cx="80%" cy="20%" r="55%" fx="80%" fy="20%"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.22"/><stop offset="100%" stop-color="#ef4444" stop-opacity="0"/></radialGradient><radialGradient id="greenGlow" cx="20%" cy="80%" r="60%" fx="20%" fy="80%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.2"/><stop offset="100%" stop-color="#10b981" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#redGlow)"/><rect width="1440" height="900" fill="url(#greenGlow)"/><path d="M 0,350 L 300,350 L 320,290 L 340,410 L 360,320 L 380,350 L 600,350 L 620,250 L 645,470 L 670,300 L 690,350 L 1100,350 L 1120,280 L 1140,420 L 1160,310 L 1180,350 L 1440,350" stroke="#f43f5e" stroke-width="2.5" stroke-opacity="0.35" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ECG_BACKGROUND = `data:image/svg+xml;base64,${window.btoa(ecgSvg)}`;

export default function App() {
  const [inputs, setInputs] = useState(INITIAL_VALUES);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const prediction = useMemo(() => {
    return predict(inputs);
  }, [inputs]);

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col relative overflow-hidden transition-all duration-300"
      style={{
        backgroundImage: `url("${ECG_BACKGROUND}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Subtle ECG diagnostic layout grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_60%,transparent_100%)] opacity-25 dark:opacity-35 pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-red-500 text-white p-2 rounded-xl shadow-md shadow-red-500/25">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white leading-none">
              CardioGuard AI
            </h1>
            <p className="text-3xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase mt-1">
              Coronary Heart Disease Predictor
            </p>
          </div>
        </div>

        {/* Quick actions/labels */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/40 px-3 py-1 rounded-full text-xs font-semibold text-green-600 dark:text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Real-time Inference Engine Active
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-6">
        <div className="text-left border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Clinical Health Risk Analyzer
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Adjust patient biometric indicators, cardiovascular measurements, and diagnostic test readouts below. The Logistic Regression model computes instantaneous risk estimations along with individual coefficient contribution profiles.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form (7/12 cols) */}
          <div className="lg:col-span-7">
            <InputForm values={inputs} onChange={handleInputChange} />
          </div>

          {/* Right Column: Visuals (5/12 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <RiskGauge riskPercent={prediction.risk_percent} />
            <FactorBreakdown topFactors={prediction.top_factors} />
          </div>
        </div>

        {/* Disclaimer Section */}
        <Disclaimer />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 text-center text-xs text-slate-400 dark:text-slate-600 bg-white/40 dark:bg-slate-900/40">
        <p>© 2026 CardioGuard AI Diagnostics. Powered by scikit-learn standard scaling and coefficients.</p>
      </footer>
    </div>
  );
}
