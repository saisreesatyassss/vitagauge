import React from 'react';
import { ScreenPath } from '../types.ts';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface HeaderProps {
  currentScreen: ScreenPath;
  onNavigate: (path: ScreenPath) => void;
  totalCalories: number;
  totalWater: number;
  targetCalories: number;
  chimeEnabled: boolean;
  onToggleChime: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  totalCalories,
  totalWater,
  targetCalories,
  chimeEnabled,
  onToggleChime,
}) => {
  const targetMetPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));

  const handleNavClick = (e: React.MouseEvent, path: ScreenPath) => {
    e.preventDefault();
    if (chimeEnabled) playMechanicalClick();
    onNavigate(path);
  };

  const handleChimeClick = () => {
    onToggleChime();
    if (!chimeEnabled) {
      playBrassChime();
    } else {
      playMechanicalClick();
    }
  };

  return (
    <header className="fixed top-3 md:top-6 lg:top-8 left-3 md:left-6 lg:left-8 right-3 md:right-6 lg:right-8 max-w-7xl mx-auto z-40 bg-surface-container border-b border-outline-variant/80 shadow-[0_8px_16px_rgba(39,24,20,0.12)] rounded-t-xl">
      <div className="h-20 px-4 md:px-6 flex items-center justify-between gap-2 md:gap-4">
        {/* Brand Logo & MK-IV Tag */}
        <div 
          className="flex items-center gap-3 shrink-0 cursor-pointer"
          onClick={(e) => handleNavClick(e, 'daily-log')}
        >
          <div className="relative p-1 rounded-full bg-gradient-to-b from-surface-variant to-outline-variant shadow-[0_2px_5px_rgba(39,24,20,0.25),inset_0_1px_1px_rgba(255,255,255,0.8)]">
            <img
              alt="VitaGauge Skeuomorphic Brand Logo"
              className="h-8 w-auto object-contain drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UrRDDljB7dSt7fbQ_wEwn02ySpL8Ayxb1njBAbiskyOYOtcmcP50x1pMKSC--d9ukOaLyXB_KBaBPAbwtF51ErFlNy78iWtZA-COtCo18bqRhOAMRJVuXcj-xZYRHt-La_WnkFeWApQyP1j_WveHIZVLOgHyWrBUjIXWk68ih8nq97PJCnqesqvknLw1wdmvXBFghdFtN_VcicCEgnTdVoandeMKHgTgZq7t1pUwT_NY7a6baLRa8WCCE"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm text-primary tracking-wide drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">
                VitaGauge
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-surface-variant text-on-surface-variant uppercase border border-outline-variant/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                MK-IV
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium tracking-tight">
              Artisan Nutrition &amp; Hydration Tracker
            </span>
          </div>
        </div>

        {/* Navigation Bar (Skeuomorphic Tabs) */}
        <nav className="hidden xl:flex items-center gap-2 p-1.5 bg-surface-container-high rounded-xl border border-outline-variant/60 shadow-[inset_0_2px_4px_rgba(39,24,20,0.12)]">
          <a
            aria-current={currentScreen === 'daily-log' ? 'page' : undefined}
            data-path="daily-log"
            href="#daily-log"
            onClick={(e) => handleNavClick(e, 'daily-log')}
            className={`px-4 py-2 rounded-lg border border-outline-variant/50 transition-all duration-150 flex items-center justify-center font-title-md text-title-md ${
              currentScreen === 'daily-log'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] translate-y-0.5'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_2px_4px_rgba(39,24,20,0.15),0_1px_0_rgba(255,255,255,0.8)]'
            }`}
          >
            Daily Log
          </a>
          <a
            aria-current={currentScreen === 'ai-food-scanner' ? 'page' : undefined}
            data-path="ai-food-scanner"
            href="#ai-food-scanner"
            onClick={(e) => handleNavClick(e, 'ai-food-scanner')}
            className={`px-4 py-2 rounded-lg border border-outline-variant/50 transition-all duration-150 flex items-center justify-center font-title-md text-title-md ${
              currentScreen === 'ai-food-scanner'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] translate-y-0.5'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_2px_4px_rgba(39,24,20,0.15),0_1px_0_rgba(255,255,255,0.8)]'
            }`}
          >
            AI Food Scanner
          </a>
          <a
            aria-current={currentScreen === 'weekly-summary' ? 'page' : undefined}
            data-path="weekly-summary"
            href="#weekly-summary"
            onClick={(e) => handleNavClick(e, 'weekly-summary')}
            className={`px-4 py-2 rounded-lg border border-outline-variant/50 transition-all duration-150 flex items-center justify-center font-title-md text-title-md ${
              currentScreen === 'weekly-summary'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] translate-y-0.5'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_2px_4px_rgba(39,24,20,0.15),0_1px_0_rgba(255,255,255,0.8)]'
            }`}
          >
            Weekly Summary
          </a>
          <a
            aria-current={currentScreen === 'hydration-tracker' ? 'page' : undefined}
            data-path="hydration-tracker"
            href="#hydration-tracker"
            onClick={(e) => handleNavClick(e, 'hydration-tracker')}
            className={`px-4 py-2 rounded-lg border border-outline-variant/50 transition-all duration-150 flex items-center justify-center font-title-md text-title-md ${
              currentScreen === 'hydration-tracker'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] translate-y-0.5'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_2px_4px_rgba(39,24,20,0.15),0_1px_0_rgba(255,255,255,0.8)]'
            }`}
          >
            Hydration Tracker
          </a>
          <a
            aria-current={currentScreen === 'gemini-chat' ? 'page' : undefined}
            data-path="gemini-chat"
            href="#gemini-chat"
            onClick={(e) => handleNavClick(e, 'gemini-chat')}
            className={`px-4 py-2 rounded-lg border border-outline-variant/50 transition-all duration-150 flex items-center justify-center font-title-md text-title-md gap-1.5 ${
              currentScreen === 'gemini-chat'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] translate-y-0.5'
                : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_2px_4px_rgba(39,24,20,0.15),0_1px_0_rgba(255,255,255,0.8)]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Horologist AI</span>
          </a>
        </nav>

        {/* Right Station Metrics & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Telemetry Capsule */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/70 shadow-[inset_0_1px_3px_rgba(39,24,20,0.2)]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">{totalCalories.toLocaleString()}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">kcal</span>
            </div>
            <div className="w-px h-4 bg-outline-variant"></div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">water_drop</span>
              <span className="font-label-md text-label-md font-bold text-on-surface">{totalWater.toLocaleString()}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">ml</span>
            </div>
          </div>

          {/* Chime Rocker Toggle */}
          <div 
            className="flex items-center gap-2 px-2 py-1 rounded-full bg-surface-container-highest border border-outline-variant/60 shadow-[inset_0_1px_2px_rgba(39,24,20,0.2)] cursor-pointer select-none"
            onClick={handleChimeClick}
            title={chimeEnabled ? 'Tactile brass chime active' : 'Chime muted'}
          >
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold pl-1">
              Chime
            </span>
            <div
              className={`w-8 h-4 rounded-full p-0.5 flex items-center transition-colors shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] ${
                chimeEnabled ? 'bg-secondary justify-end' : 'bg-outline/50 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.4)] transition-transform"></div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-label-lg text-label-lg font-bold text-on-surface">Elena Rostova</span>
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                Target Met {targetMetPercent}%
              </span>
            </div>
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-surface-tint to-surface-variant shadow-[0_2px_4px_rgba(39,24,20,0.25),inset_0_1px_1px_rgba(255,255,255,0.7)]">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant/40"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD297nZ4exlM0nxBTrJOZYIfMjF1etVzFkERnhwUi_VttEsxXYEra9Pgkwyu1ssGVZmR06NAPv-0j-8mEjnXcy9ak-cC8UTKNyzZv453ZrZxSpaTX-857LDZt1SEAfHN4k1FtavKKHMnbErYhuFeE3PzPPR0F5NnfWKzrs25ROCnAk5c7IFRq700q1hWpu_krVAMopIo1XS4U01zwMCqbW7iI_-anIHPehZ8vy0v0iV-9y-annUNNuTxA"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="flex xl:hidden overflow-x-auto px-4 py-2 border-t border-outline-variant/40 gap-2 bg-surface-container-high/60">
        <button
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, 'daily-log')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
            currentScreen === 'daily-log'
              ? 'bg-primary-container text-on-primary-container shadow-inner'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Daily Log
        </button>
        <button
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, 'ai-food-scanner')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
            currentScreen === 'ai-food-scanner'
              ? 'bg-primary-container text-on-primary-container shadow-inner'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          AI Food Scanner
        </button>
        <button
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, 'weekly-summary')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
            currentScreen === 'weekly-summary'
              ? 'bg-primary-container text-on-primary-container shadow-inner'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Weekly Summary
        </button>
        <button
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, 'hydration-tracker')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 ${
            currentScreen === 'hydration-tracker'
              ? 'bg-primary-container text-on-primary-container shadow-inner'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          Hydration Tracker
        </button>
        <button
          onClick={(e) => handleNavClick(e as unknown as React.MouseEvent, 'gemini-chat')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 ${
            currentScreen === 'gemini-chat'
              ? 'bg-primary-container text-on-primary-container shadow-inner'
              : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">psychology</span>
          <span>Horologist AI</span>
        </button>
      </div>
    </header>
  );
};
