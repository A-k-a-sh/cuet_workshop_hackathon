import React from 'react';

export default function Disclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-xs max-w-4xl mx-auto my-6 text-left">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-amber-500 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
            Medical Disclaimer
          </h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            This tool is intended for educational and demonstration purposes only. It uses a simplified Logistic Regression model with 79.51% accuracy trained on the Cleveland Heart Disease Dataset. It does NOT provide medical advice, diagnosis, or treatment. Consult a qualified physician or healthcare professional for clinical decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
