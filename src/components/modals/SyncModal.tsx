import React, { useState, useEffect } from 'react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Menginisiasi koneksi ke server Dapodikdasmen...');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFinished(true);
          return 100;
        }
        const next = prev + 15;
        if (next < 30) {
          setCurrentStepText('Validasi integritas data master lokal...');
        } else if (next < 60) {
          setCurrentStepText('Mengirim payload delta data GTK & Peserta Didik...');
        } else if (next < 85) {
          setCurrentStepText('Sinkronisasi rombel & pemetaan JTM kurikulum...');
        } else {
          setCurrentStepText('Menerima acknowledgment tanda terima server pusat...');
        }
        return next > 100 ? 100 : next;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl border border-surface-container p-space-lg flex flex-col gap-space-md">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary-container text-on-primary">
            <span className={`material-symbols-outlined text-2xl ${!isFinished ? 'animate-spin' : ''}`}>
              sync
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-primary">
              {isFinished ? 'Sinkronisasi Selesai!' : 'Proses Sinkronisasi Dapodik'}
            </h3>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Server Dapodikdasmen Kemdikbudristek
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 py-2">
          <div className="flex justify-between items-center text-label-sm font-label-sm">
            <span className="text-on-surface-variant truncate max-w-[280px]">
              {isFinished ? 'Semua data sinkron berhasil dikirim' : currentStepText}
            </span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isFinished ? 'bg-emerald-600' : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Status card */}
        <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container text-body-sm font-body-sm space-y-1">
          <div className="flex justify-between text-label-sm">
            <span>Status Koneksi:</span>
            <span className="font-semibold text-emerald-700">Online (Latency 32ms)</span>
          </div>
          <div className="flex justify-between text-label-sm">
            <span>Data GTK:</span>
            <span className="font-semibold text-on-surface">74 Records Terkirim</span>
          </div>
          <div className="flex justify-between text-label-sm">
            <span>Data Siswa:</span>
            <span className="font-semibold text-on-surface">1.080 Records Valid</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          {isFinished ? (
            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-headline-sm text-body-sm hover:bg-primary transition-all"
            >
              Tutup &amp; Muat Ulang Status
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

