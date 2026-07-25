import React, { useMemo } from 'react';

function formatRawValue(feature, value) {
  if (feature === 'Sex') return value === 1 ? 'Male' : 'Female';
  if (feature === 'Chest Pain Type') {
    const cpMap = ['Typical Angina', 'Atypical Angina', 'Non-anginal', 'Asymptomatic'];
    return cpMap[value] || value;
  }
  if (feature === 'Fasting Blood Sugar') return value === 1 ? '> 120 mg/dL' : '≤ 120 mg/dL';
  if (feature === 'Resting ECG') {
    const ecgMap = ['Normal', 'ST-T Abnormality', 'LV Hypertrophy'];
    return ecgMap[value] || value;
  }
  if (feature === 'Exercise Induced Angina') return value === 1 ? 'Yes' : 'No';
  if (feature === 'ST Slope') {
    const slopeMap = ['Upsloping', 'Flat', 'Downsloping'];
    return slopeMap[value] || value;
  }
  if (feature === 'Thalassemia') {
    const thalMap = { 1: 'Normal', 2: 'Fixed Defect', 3: 'Reversible Defect' };
    return thalMap[value] || value;
  }
  if (feature === 'Resting Blood Pressure') return `${value} mmHg`;
  if (feature === 'Cholesterol') return `${value} mg/dL`;
  if (feature === 'Max Heart Rate') return `${value} bpm`;
  if (feature === 'ST Depression') return `${value} mm`;
  return value;
}

export default function FactorBreakdown({ topFactors = [] }) {
  // Find maximum absolute contribution to scale widths proportionally
  const maxContribution = useMemo(() => {
    if (topFactors.length === 0) return 1;
    return Math.max(...topFactors.map(f => Math.abs(f.contribution))) || 1;
  }, [topFactors]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 w-full">
      <div className="border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm text-left">
          Key Risk Driver Breakdown
        </h3>
        <p className="text-2xs text-slate-400 dark:text-slate-500 mt-0.5 text-left">
          Impact of your top 4 metrics on the prediction result
        </p>
      </div>

      <div className="space-y-4">
        {topFactors.map((factor, index) => {
          const isRiskIncreaser = factor.contribution > 0;
          const absVal = Math.abs(factor.contribution);
          const percentWidth = Math.min(100, Math.round((absVal / maxContribution) * 100));

          return (
            <div key={index} className="flex flex-col gap-1 text-left">
              {/* Feature label and current value */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {factor.feature}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded text-3xs border border-slate-100/50 dark:border-slate-800">
                  {formatRawValue(factor.feature, factor.raw_value)}
                </span>
              </div>

              {/* Bar visualization */}
              <div className="relative flex items-center h-5 w-full bg-slate-50 dark:bg-slate-850 rounded-lg overflow-hidden border border-slate-100/50 dark:border-slate-800">
                {/* Colored fill bar */}
                <div
                  style={{ width: `${percentWidth}%` }}
                  className={`h-full transition-all duration-500 ease-out rounded-r-sm ${
                    isRiskIncreaser
                      ? 'bg-gradient-to-r from-red-400 to-red-500'
                      : 'bg-gradient-to-r from-green-400 to-green-500'
                  }`}
                />
                
                {/* Small indicator pill inside bar container */}
                <span className={`absolute right-2.5 text-3xs font-extrabold tracking-wider uppercase ${
                  isRiskIncreaser ? 'text-red-500' : 'text-green-600 dark:text-green-400'
                }`}>
                  {isRiskIncreaser ? '↑ Increases Risk' : '↓ Reduces Risk'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
