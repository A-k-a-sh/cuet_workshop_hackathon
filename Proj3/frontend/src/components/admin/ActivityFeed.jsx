import React, { useMemo } from 'react';
import { useStore } from '../../store/store';

const ICON_MAP = {
  login: '🔑',
  logout: '🚪',
  cart: '🛒',
  order: '🛍️',
  product_add: '➕',
  product_edit: '✏️',
  product_remove: '🗑️',
  suspend: '🚫',
  reinstate: '🤝',
  admin_remove_listing: '❌'
};

const slideInAnimation = `
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-activity-slide {
  animation: slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`;

export default function ActivityFeed() {
  const { state } = useStore();

  const enrichedFeed = useMemo(() => {
    return state.activity.map(act => {
      const timeStr = new Date(act.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      return {
        ...act,
        timeStr,
        icon: ICON_MAP[act.type] || '⚡'
      };
    });
  }, [state.activity]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-left w-full h-full min-h-[400px]">
      <style dangerouslySetInnerHTML={{ __html: slideInAnimation }} />
      
      <div className="border-b border-slate-50 dark:border-slate-800 pb-3">
        <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">
          Platform Activity Live Monitor
        </h3>
        <p className="text-3xs text-slate-400 dark:text-slate-500 mt-0.5">
          Real-time logs of system operations, checkout activities, and moderation alerts
        </p>
      </div>

      {/* Feed list */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1 flex-1">
        {enrichedFeed.map((act) => (
          <div
            key={act.id}
            className="animate-activity-slide flex items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-855/40 border border-slate-100/50 dark:border-slate-850 rounded-xl hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Type Icon */}
              <span className="text-xl h-9 w-9 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 shadow-2xs rounded-lg flex items-center justify-center shrink-0">
                {act.icon}
              </span>
              
              {/* Action Log Message */}
              <p className="text-xs text-slate-750 dark:text-slate-300 font-semibold truncate max-w-sm sm:max-w-md">
                {act.message}
              </p>
            </div>

            {/* Time Stamp */}
            <span className="text-4xs font-mono font-bold text-slate-400 shrink-0 select-none bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-750">
              {act.timeStr}
            </span>
          </div>
        ))}

        {enrichedFeed.length === 0 && (
          <div className="py-16 text-center text-slate-400 w-full my-auto">
            <p className="text-xs font-semibold">No platform activity registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
