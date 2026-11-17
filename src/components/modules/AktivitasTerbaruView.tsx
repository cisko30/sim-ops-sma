import React, { useState } from 'react';
import { ACTIVITIES } from '../../data/mockData';
import { ActivityLog } from '../../types';

interface AktivitasTerbaruViewProps {
  onShowToast?: (msg: string) => void;
  onNavigateToJurnal?: () => void;
  activities?: ActivityLog[];
}

export const AktivitasTerbaruView: React.FC<AktivitasTerbaruViewProps> = ({
  onNavigateToJurnal,
  activities = ACTIVITIES
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = activities.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-space-lg">
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-primary">Log Audit &amp; Aktivitas Terbaru Operator</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Rekam jejak operasional sistem SIM-OPS SMA NU Kaplongan secara kronologis
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToJurnal && (
            <button
              type="button"
              onClick={onNavigateToJurnal}
              className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container shadow-xs flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">edit_note</span>
              <span>Input Jurnal Harian</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
        <div className="relative max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas operasional..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low text-xs border border-surface-container focus:outline-none"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-surface-container-low border border-surface-container/60 hover:border-primary/30 transition-all flex items-start gap-3.5"
            >
              <span className={`w-3 h-3 rounded-full ${act.dotColor} mt-1 shrink-0`}></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-xs text-primary">{act.title}</h4>
                  <span className="text-[11px] text-outline font-medium shrink-0">{act.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
