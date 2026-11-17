import React, { useState, useEffect } from 'react';

interface CountdownBannerProps {
  onCheckResidu: () => void;
}

export const CountdownBanner: React.FC<CountdownBannerProps> = ({ onCheckResidu }) => {
  // Live seconds ticker for authentic modern feel
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 59));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#06241b] via-[#0a382a] to-[#041a13] text-white p-5 sm:p-6 shadow-md mb-6 border border-emerald-900/50">
      {/* Decorative ambient background glows */}
      <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/10 pointer-events-none blur-3xl" />
      <div className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-teal-500/10 pointer-events-none blur-2xl" />

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        {/* Left: Alarm Icon & Countdown Details */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-md shrink-0 flex items-center justify-center text-emerald-300 border border-white/15 shadow-inner">
            <span className="material-symbols-outlined text-3xl sm:text-4xl">timer</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10.5px] uppercase tracking-wider font-extrabold shadow-xs">
                Penting • Cut-Off Nasional
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-100/90">
                Tenggat Sinkronisasi Dapodik &amp; BOS Semester Ganjil 2026/2027
              </span>
            </div>

            {/* Modern Digital Clock Dials */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5 font-mono">
                <div className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">14</span>
                  <span className="text-[10px] text-emerald-300/80 block uppercase font-sans font-bold -mt-0.5">Hari</span>
                </div>
                <span className="text-lg font-bold text-emerald-400/60">:</span>
                <div className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">06</span>
                  <span className="text-[10px] text-emerald-300/80 block uppercase font-sans font-bold -mt-0.5">Jam</span>
                </div>
                <span className="text-lg font-bold text-emerald-400/60">:</span>
                <div className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-tight">22</span>
                  <span className="text-[10px] text-emerald-300/80 block uppercase font-sans font-bold -mt-0.5">Menit</span>
                </div>
                <span className="text-lg font-bold text-emerald-400/60">:</span>
                <div className="px-2.5 py-1 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 text-center min-w-[42px]">
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tight">
                    {String(seconds).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block uppercase font-sans font-bold -mt-0.5">Detik</span>
                </div>
              </div>
              <span className="text-xs text-emerald-200/70 hidden sm:inline ml-2">
                Batas akhir verifikasi kelayakan dana BOSP
              </span>
            </div>
          </div>
        </div>

        {/* Right: Validation progress & Residu button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 xl:min-w-[420px]">
          <div className="flex-1 bg-black/25 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-emerald-100/80 font-medium">Kelengkapan Validasi Data</span>
              <span className="text-emerald-300 font-black text-sm">88% Valid</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500 shadow-sm shadow-emerald-400/50"
                style={{ width: '88%' }}
              />
            </div>
          </div>

          <button
            onClick={onCheckResidu}
            className="shrink-0 flex items-center justify-center gap-2 h-12 px-5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all group"
            type="button"
          >
            <span className="material-symbols-outlined text-rose-600 text-lg group-hover:animate-pulse">
              error
            </span>
            <span>Cek 12 Residu Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};