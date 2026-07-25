import React, { useMemo } from 'react';

export default function RiskGauge({ riskPercent = 0 }) {
  // Determine risk category and colors
  const { category, colorClass, strokeColor } = useMemo(() => {
    if (riskPercent < 30) {
      return {
        category: 'Low Risk',
        colorClass: 'text-green-500 dark:text-green-400',
        strokeColor: '#22c55e'
      };
    } else if (riskPercent < 60) {
      return {
        category: 'Moderate Risk',
        colorClass: 'text-amber-500 dark:text-amber-400',
        strokeColor: '#eab308'
      };
    } else {
      return {
        category: 'High Risk',
        colorClass: 'text-red-500 dark:text-red-400',
        strokeColor: '#ef4444'
      };
    }
  }, [riskPercent]);

  // Calculate needle rotation: -90 deg (left, 0%) to +90 deg (right, 100%)
  const needleRotation = useMemo(() => {
    return (riskPercent / 100) * 180 - 90;
  }, [riskPercent]);

  const circumference = 2 * Math.PI * 80; // 502.65
  const semicircleLength = circumference / 2; // 251.3

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 w-full max-w-sm mx-auto h-full min-h-[380px]">
      <div className="flex items-center gap-1.5 self-start text-slate-500 dark:text-slate-400 font-medium text-sm w-full border-b border-slate-50 dark:border-slate-800 pb-3">
        <span>Cardiac Risk Analysis</span>
        <div className="relative group ml-auto cursor-pointer">
          <svg className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="absolute right-0 top-6 hidden group-hover:block bg-slate-800 dark:bg-slate-950 text-white text-xs rounded-lg p-3 w-64 shadow-xl z-10 font-normal leading-relaxed pointer-events-none">
            <p className="font-semibold border-b border-slate-700 pb-1 mb-1">Model Metadata</p>
            <p>Model: Logistic Regression</p>
            <p>Accuracy: 79.51%</p>
            <p>Trained on 1,025 patients</p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center mt-6 w-full h-[150px]">
        <svg viewBox="0 0 220 120" className="w-full max-w-[260px] overflow-visible">
          {/* Base Background Semicircle */}
          <path
            d="M 30,100 A 80,80 0 0,1 190,100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="12"
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />

          {/* Green Zone (0-30%) */}
          <circle
            cx="110"
            cy="100"
            r="80"
            fill="none"
            stroke="#22c55e"
            strokeWidth="12"
            strokeDasharray={`${semicircleLength * 0.3} ${circumference}`}
            strokeDashoffset="0"
            transform="rotate(-180 110 100)"
            strokeLinecap="round"
          />

          {/* Amber Zone (30-60%) */}
          <circle
            cx="110"
            cy="100"
            r="80"
            fill="none"
            stroke="#eab308"
            strokeWidth="12"
            strokeDasharray={`${semicircleLength * 0.3} ${circumference}`}
            strokeDashoffset={`-${semicircleLength * 0.3}`}
            transform="rotate(-180 110 100)"
          />

          {/* Red Zone (60-100%) */}
          <circle
            cx="110"
            cy="100"
            r="80"
            fill="none"
            stroke="#ef4444"
            strokeWidth="12"
            strokeDasharray={`${semicircleLength * 0.4} ${circumference}`}
            strokeDashoffset={`-${semicircleLength * 0.6}`}
            transform="rotate(-180 110 100)"
            strokeLinecap="round"
          />

          {/* Tick marks */}
          {/* 30% Threshold Tick */}
          <line
            x1="110"
            y1="20"
            x2="110"
            y2="10"
            stroke="white"
            strokeWidth="2.5"
            transform="rotate(-54 110 100)"
            className="dark:stroke-slate-900"
          />
          {/* 60% Threshold Tick */}
          <line
            x1="110"
            y1="20"
            x2="110"
            y2="10"
            stroke="white"
            strokeWidth="2.5"
            transform="rotate(18 110 100)"
            className="dark:stroke-slate-900"
          />

          {/* Needle Pin */}
          <circle cx="110" cy="100" r="7" fill={strokeColor} stroke="white" strokeWidth="2.5" className="dark:stroke-slate-900" />

          {/* Needle Line */}
          <line
            x1="110"
            y1="100"
            x2="110"
            y2="28"
            stroke={strokeColor}
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: '110px 100px',
              transition: 'transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1), stroke 500ms ease'
            }}
          />
        </svg>

        {/* Floating Percentage Display */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <span className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            {riskPercent}%
          </span>
          <span className={`text-sm font-bold uppercase tracking-wider ${colorClass} mt-1`}>
            {category}
          </span>
        </div>
      </div>

      {/* Accuracy Badge */}
      <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full text-2xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
        Model Accuracy: 79.51%
      </div>
    </div>
  );
}
