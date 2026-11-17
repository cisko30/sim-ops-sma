import React, { useState } from 'react';
import { ACTIVITIES } from '../../data/mockData';

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  dotColor: string;
}

interface ActivityTimelineCardProps {
  activities?: ActivityItem[];
  onViewAll?: () => void;
}

export const ActivityTimelineCard: React.FC<ActivityTimelineCardProps> = ({
  activities = ACTIVITIES,
  onViewAll
}) => {
  const [expanded, setExpanded] = useState(false);

  const displayActivities = expanded ? activities : activities.slice(0, 4);

  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-xs border border-surface-container/80 flex flex-col gap-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
            <span className="material-symbols-outlined text-xl">history</span>
          </div>
          <div>
            <h3 className="font-bold text-base text-primary tracking-tight">
              Aktivitas Terkini Operator
            </h3>
            <p className="text-xs text-on-surface-variant">
              Log Audit &amp; Sinkronisasi Sistem Sekolah
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10.5px] font-bold text-emerald-800 dark:text-emerald-300">Live Feed</span>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container-high/80">
        {displayActivities.length === 0 ? (
          <div className="text-xs text-on-surface-variant py-2">
            Belum ada aktivitas tercatat di sistem.
          </div>
        ) : (
          displayActivities.map((act) => (
            <div key={act.id} className="relative flex flex-col gap-1">
              <span
                className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ${act.dotColor || 'bg-primary'} ring-4 ring-surface-container-lowest`}
              ></span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-xs text-on-surface">
                  {act.title}
                </span>
                <span className="text-[11px] font-medium text-on-surface-variant shrink-0">
                  {act.time}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-snug">
                {act.description}
              </p>
            </div>
          ))
        )}

        {activities.length > 4 && (
          <button
            type="button"
            onClick={() => {
              if (onViewAll) {
                onViewAll();
              } else {
                setExpanded(!expanded);
              }
            }}
            className="text-xs font-bold text-primary hover:text-primary-container flex items-center gap-1 pt-1"
          >
            <span>{expanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${activities.length} Aktivitas)`}</span>
            <span className="material-symbols-outlined text-sm">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
