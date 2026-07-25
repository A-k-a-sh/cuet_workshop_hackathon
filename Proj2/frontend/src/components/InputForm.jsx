import React, { useState } from 'react';

export default function InputForm({ values, onChange }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field, val) => {
    onChange(field, val);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 w-full text-left">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-50 dark:border-slate-800 pb-3 mb-4">
        Patient Health Metrics
      </h3>

      {/* Primary Metrics (Sliders) */}
      <div className="space-y-5">
        {/* Age Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
            <label htmlFor="age-slider">Age</label>
            <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-2xs">
              {values.age} years
            </span>
          </div>
          <input
            id="age-slider"
            type="range"
            min="20"
            max="100"
            value={values.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-4xs text-slate-400 font-bold uppercase tracking-wider px-0.5">
            <span>20</span>
            <span>60</span>
            <span>100</span>
          </div>
        </div>

        {/* Resting Blood Pressure Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
            <label htmlFor="trestbps-slider">Resting Blood Pressure</label>
            <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-2xs">
              {values.trestbps} mmHg
            </span>
          </div>
          <input
            id="trestbps-slider"
            type="range"
            min="80"
            max="200"
            value={values.trestbps}
            onChange={(e) => handleInputChange('trestbps', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-4xs text-slate-400 font-bold uppercase tracking-wider px-0.5">
            <span>80</span>
            <span>140</span>
            <span>200</span>
          </div>
        </div>

        {/* Cholesterol Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
            <label htmlFor="chol-slider">Cholesterol</label>
            <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-2xs">
              {values.chol} mg/dL
            </span>
          </div>
          <input
            id="chol-slider"
            type="range"
            min="100"
            max="600"
            value={values.chol}
            onChange={(e) => handleInputChange('chol', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-4xs text-slate-400 font-bold uppercase tracking-wider px-0.5">
            <span>100</span>
            <span>350</span>
            <span>600</span>
          </div>
        </div>

        {/* Max Heart Rate Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
            <label htmlFor="thalach-slider">Max Heart Rate</label>
            <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-2xs">
              {values.thalach} bpm
            </span>
          </div>
          <input
            id="thalach-slider"
            type="range"
            min="60"
            max="220"
            value={values.thalach}
            onChange={(e) => handleInputChange('thalach', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-4xs text-slate-400 font-bold uppercase tracking-wider px-0.5">
            <span>60</span>
            <span>140</span>
            <span>220</span>
          </div>
        </div>
      </div>

      {/* Collapsible Advanced Section */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-500 hover:text-indigo-500 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <span>Advanced Diagnostics</span>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {/* Sex Select Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Sex</span>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleInputChange('sex', 0)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.sex === 0
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('sex', 1)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.sex === 1
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

            {/* Fasting Blood Sugar Select Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Fasting Blood Sugar &gt; 120</span>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleInputChange('fbs', 0)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.fbs === 0
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  ≤ 120 mg/dL
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('fbs', 1)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.fbs === 1
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  &gt; 120 mg/dL
                </button>
              </div>
            </div>

            {/* Chest Pain Type Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="cp-select" className="text-xs font-semibold text-slate-600 dark:text-slate-350">Chest Pain Type</label>
              <select
                id="cp-select"
                value={values.cp}
                onChange={(e) => handleInputChange('cp', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value={0}>Typical Angina</option>
                <option value={1}>Atypical Angina</option>
                <option value={2}>Non-anginal Pain</option>
                <option value={3}>Asymptomatic</option>
              </select>
            </div>

            {/* Resting ECG Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="restecg-select" className="text-xs font-semibold text-slate-600 dark:text-slate-350">Resting ECG</label>
              <select
                id="restecg-select"
                value={values.restecg}
                onChange={(e) => handleInputChange('restecg', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value={0}>Normal</option>
                <option value={1}>ST-T Wave Abnormality</option>
                <option value={2}>LV Hypertrophy</option>
              </select>
            </div>

            {/* Exercise-induced Angina Select Button */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">Exercise-induced Angina</span>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-100/50 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleInputChange('exang', 0)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.exang === 0
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('exang', 1)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    values.exang === 1
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  Yes
                </button>
              </div>
            </div>

            {/* ST Depression Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-350">
                <label htmlFor="oldpeak-slider">ST Depression</label>
                <span className="text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-2xs">
                  {values.oldpeak.toFixed(1)} mm
                </span>
              </div>
              <input
                id="oldpeak-slider"
                type="range"
                min="0"
                max="6.2"
                step="0.1"
                value={values.oldpeak}
                onChange={(e) => handleInputChange('oldpeak', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-4xs text-slate-400 font-bold uppercase tracking-wider px-0.5">
                <span>0.0</span>
                <span>3.1</span>
                <span>6.2</span>
              </div>
            </div>

            {/* ST Slope Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="slope-select" className="text-xs font-semibold text-slate-600 dark:text-slate-350">Slope of ST Segment</label>
              <select
                id="slope-select"
                value={values.slope}
                onChange={(e) => handleInputChange('slope', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value={0}>Upsloping</option>
                <option value={1}>Flat</option>
                <option value={2}>Downsloping</option>
              </select>
            </div>

            {/* Major Vessels Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="ca-select" className="text-xs font-semibold text-slate-600 dark:text-slate-350">Major Vessels (Fluoroscopy)</label>
              <select
                id="ca-select"
                value={values.ca}
                onChange={(e) => handleInputChange('ca', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value={0}>0 Vessels</option>
                <option value={1}>1 Vessel</option>
                <option value={2}>2 Vessels</option>
                <option value={3}>3 Vessels</option>
              </select>
            </div>

            {/* Thalassemia Dropdown */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="thal-select" className="text-xs font-semibold text-slate-600 dark:text-slate-350">Thalassemia</label>
              <select
                id="thal-select"
                value={values.thal}
                onChange={(e) => handleInputChange('thal', parseInt(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value={1}>Normal</option>
                <option value={2}>Fixed Defect</option>
                <option value={3}>Reversible Defect</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
