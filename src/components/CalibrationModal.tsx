import React, { useState } from 'react';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCalories: number;
  targetWater: number;
  onSave: (targetCalories: number, targetWater: number) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  targetCalories,
  targetWater,
  onSave,
}) => {
  const [cals, setCals] = useState(targetCalories);
  const [water, setWater] = useState(targetWater);
  const [selectedProfile, setSelectedProfile] = useState<'pure-spring' | 'mineral' | 'isotonic'>('pure-spring');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playMechanicalClick();
    playBrassChime();
    onSave(cals, water);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container-low p-6 md:p-8 shadow-[0_20px_50px_rgba(39,24,20,0.5),0_0_0_1px_rgba(255,255,255,0.7)] border border-outline-variant/80 overflow-hidden">
        {/* Brass Screws */}
        <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
        <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
        <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
        <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-md">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-widest">
                Apparatus Calibration Deck
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Re-Calibrate Daily Baselines</h3>
            </div>
          </div>
          <button
            onClick={() => {
              playMechanicalClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Caloric Chamber Target */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide">
                Caloric Energy Target
              </label>
              <span className="font-title-md text-title-md font-bold text-primary font-mono">{cals} kcal</span>
            </div>
            <input
              type="range"
              min="1200"
              max="3500"
              step="50"
              value={cals}
              onChange={(e) => setCals(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-on-surface-variant font-mono">
              <span>1,200 kcal</span>
              <span>Baseline: 2,100 kcal</span>
              <span>3,500 kcal</span>
            </div>
          </div>

          {/* Hydration Reservoir Target */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wide">
                Volumetric Fluid Quota
              </label>
              <span className="font-title-md text-title-md font-bold text-tertiary font-mono">{water} ml</span>
            </div>
            <input
              type="range"
              min="1500"
              max="4000"
              step="100"
              value={water}
              onChange={(e) => setWater(Number(e.target.value))}
              className="w-full accent-tertiary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-on-surface-variant font-mono">
              <span>1,500 ml</span>
              <span>Optimal: 3,200 ml</span>
              <span>4,000 ml</span>
            </div>
          </div>

          {/* Calibration Profile Selection */}
          <div className="space-y-2">
            <label className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Fluid Solute Profile
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pure-spring', label: 'Pure Spring', desc: 'Neutral pH' },
                { id: 'mineral', label: 'Alkaline Mineral', desc: '+Mg / Ca' },
                { id: 'isotonic', label: 'Isotonic Recovery', desc: '+Electrolytes' },
              ].map((prof) => (
                <button
                  type="button"
                  key={prof.id}
                  onClick={() => {
                    playMechanicalClick();
                    setSelectedProfile(prof.id as typeof selectedProfile);
                  }}
                  className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                    selectedProfile === prof.id
                      ? 'bg-secondary text-on-secondary shadow-md'
                      : 'bg-surface-container-high text-on-surface shadow-sm'
                  }`}
                >
                  <div className="font-label-sm font-bold">{prof.label}</div>
                  <div className="text-[10px] opacity-80">{prof.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-outline-variant/40 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                playMechanicalClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md font-bold shadow-[0_3px_8px_rgba(113,68,54,0.35)] active:translate-y-0.5 transition-all cursor-pointer"
            >
              Commit Calibration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
