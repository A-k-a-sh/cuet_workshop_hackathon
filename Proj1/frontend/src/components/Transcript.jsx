import React, { useMemo } from 'react';

const FILLERS = ["um", "uh", "like", "you know", "so", "basically", "literally", "right", "okay", "well"];

export default function Transcript({ transcript = '', wpm = 0, duration = 0, wordCount = 0, fillerCounts = {} }) {
  // Determine pace color coding based on WPM
  const { paceLabel, paceColor } = useMemo(() => {
    if (wpm >= 120 && wpm <= 160) {
      return { paceLabel: 'Ideal Pace', paceColor: 'bg-green-500/20 text-green-400 border border-green-500/30' };
    } else if ((wpm >= 100 && wpm < 120) || (wpm > 160 && wpm <= 180)) {
      return { paceLabel: 'Moderate Pace', paceColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' };
    } else {
      return { paceLabel: wpm > 180 ? 'Too Fast' : 'Too Slow', paceColor: 'bg-red-500/20 text-red-400 border border-red-500/30' };
    }
  }, [wpm]);

  // Split transcript text by filler words using a capturing regex to preserve them
  const renderedText = useMemo(() => {
    if (!transcript) return '';

    // Create regex matching whole words of any filler item
    const pattern = new RegExp(`\\b(${FILLERS.map(f => f.replace(' ', '\\s')).join('|')})\\b`, 'gi');
    const parts = transcript.split(pattern);

    return parts.map((part, index) => {
      const lowerPart = part.toLowerCase().trim();
      const isFiller = FILLERS.includes(lowerPart);

      if (isFiller) {
        const count = fillerCounts[lowerPart] || 1;
        return (
          <span key={index} className="relative group inline-block mx-0.5 px-1 py-0.5 rounded bg-amber-500/25 border border-amber-500/40 text-amber-300 font-medium cursor-help transition-all hover:bg-amber-500/45">
            {part}
            {/* Tooltip */}
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block bg-slate-900 border border-slate-700 text-slate-100 text-3xs font-semibold px-2 py-1 rounded shadow-xl z-20 whitespace-nowrap leading-none pointer-events-none">
              Appeared {count} time{count > 1 ? 's' : ''}
            </span>
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  }, [transcript, fillerCounts]);

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-xl w-full text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/60 pb-4 mb-4 gap-3">
        <div>
          <h3 className="font-bold text-slate-200 text-sm">
            Speech Transcript
          </h3>
          <p className="text-3xs text-slate-500 mt-0.5">
            Hover over highlighted filler words to view frequency counts
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pace Badge */}
          <div className={`px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider ${paceColor}`}>
            {wpm} WPM · {paceLabel}
          </div>
          {/* Duration Badge */}
          <div className="bg-slate-700 text-slate-300 border border-slate-650 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider">
            {duration.toFixed(1)}s Duration
          </div>
          {/* Word Count Badge */}
          <div className="bg-slate-700 text-slate-300 border border-slate-650 px-2.5 py-1 rounded-full text-3xs font-bold uppercase tracking-wider">
            {wordCount} Words
          </div>
        </div>
      </div>

      {/* Transcript Text Box */}
      <div className="bg-slate-900 border border-slate-950 rounded-xl p-5 min-h-[140px] text-sm text-slate-300 leading-relaxed font-normal">
        {renderedText || <span className="text-slate-500 italic">No transcript available.</span>}
      </div>
    </div>
  );
}
