import React from 'react';
import { DEADLINES } from '../../data/mockData';

interface DeadlineListCardProps {
  onViewAllCalendar?: () => void;
}

export const DeadlineListCard: React.FC<DeadlineListCardProps> = ({ onViewAllCalendar }) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container/80 flex flex-col gap-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">
            <span className="material-symbols-outlined text-xl">event_upcoming</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-primary tracking-tight">
              Tenggat &amp; Agenda Krusial
            </h3>
            <p className="text-xs text-on-surface-variant">
              Jadwal Cut-Off &amp; Verifikasi Sistem Kedinasan
            </p>
          </div>
        </div>
        <button
          onClick={onViewAllCalendar}
          className="text-xs font-bold text-primary hover:text-primary-container px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container/80 hover:bg-surface-container transition-all cursor-pointer"
          type="button"
        >
          Semua Kalender
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {DEADLINES.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-surface-container-low/60 dark:bg-slate-800/40 flex items-start gap-3.5 border border-surface-container/60 dark:border-slate-800 hover:bg-surface-container-low dark:hover:bg-slate-800/70 hover:border-surface-container dark:hover:border-slate-700 transition-all"
          >
            {/* Date Box */}
            <div className={`px-2.5 py-1.5 rounded-xl text-center min-w-[56px] shadow-2xs border shrink-0 ${
              item.isUrgent 
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/60' 
                : 'bg-surface-container-lowest dark:bg-slate-800 text-primary dark:text-sky-300 border-surface-container dark:border-slate-700'
            }`}>
              <span className={`text-[10px] uppercase font-black block tracking-wider ${
                item.isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-on-surface-variant dark:text-slate-400'
              }`}>
                {item.month}
              </span>
              <span className="text-xl font-black tracking-tight leading-none">
                {item.day}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-on-surface dark:text-slate-100 truncate">
                  {item.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold shrink-0 border ${
                    item.isUrgent
                      ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/70'
                      : 'bg-surface-container dark:bg-slate-800 text-primary dark:text-sky-300 border-surface-container-high dark:border-slate-700'
                  }`}
                >
                  {item.countdownTag}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
