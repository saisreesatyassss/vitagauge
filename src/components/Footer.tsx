import React from 'react';
import { playMechanicalClick } from '../utils/audio.ts';

interface FooterProps {
  onOpenCalibration: () => void;
  onExportCsv: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCalibration, onExportCsv }) => {
  return (
    <footer className="w-full bg-surface-container border-t border-outline-variant/60 py-6 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#376847]"></span>
        <span className="font-label-md text-label-md text-on-surface-variant font-medium">
          Mechanical Core v4.2 • Handcrafted Calibration Active
        </span>
      </div>
      <div className="font-body-sm text-body-sm text-on-surface-variant text-center">
        © 2024 VitaGauge Wellness Instrument Co. Preserving mindful vitality with analog integrity.
      </div>
      <div className="flex items-center gap-4 text-on-surface-variant font-label-md text-label-md">
        <button
          onClick={() => {
            playMechanicalClick();
            onOpenCalibration();
          }}
          className="hover:text-on-surface cursor-pointer underline-offset-2 hover:underline transition-colors"
        >
          Gauge Calibration
        </button>
        <span>•</span>
        <button
          onClick={() => {
            playMechanicalClick();
            onExportCsv();
          }}
          className="hover:text-on-surface cursor-pointer underline-offset-2 hover:underline transition-colors"
        >
          Export Journal (CSV)
        </button>
      </div>
    </footer>
  );
};
