import React from 'react';
import { ScreenPath } from '../types.ts';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface ChatFabProps {
  currentScreen: ScreenPath;
  onOpenChat: () => void;
}

export const ChatFab: React.FC<ChatFabProps> = ({ currentScreen, onOpenChat }) => {
  if (currentScreen === 'gemini-chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <button
        onClick={() => {
          playMechanicalClick();
          playBrassChime();
          onOpenChat();
        }}
        title="Consult Gemini Horologist AI"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#8a6508] text-white shadow-[0_10px_25px_rgba(39,24,20,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#fae092]/60"
      >
        {/* Pulsing Core */}
        <div className="relative w-8 h-8 rounded-full bg-[#271814] flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-[#fae092] text-[20px]">psychology</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_#376847] animate-pulse"></span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-label-sm text-[10px] uppercase font-bold text-[#fae092] leading-none tracking-wider">
            Gemini Core
          </span>
          <span className="font-title-md text-sm font-bold text-white drop-shadow-sm leading-tight">
            Consult Horologist
          </span>
        </div>
      </button>
    </div>
  );
};
