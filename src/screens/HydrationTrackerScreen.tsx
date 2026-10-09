import React, { useState } from 'react';
import { playMechanicalClick, playWaterDrop, playBrassChime } from '../utils/audio.ts';

interface HydrationTrackerScreenProps {
  currentWater: number;
  targetWater: number;
  onAddWater: (ml: number) => void;
  onResetWater: () => void;
}

export const HydrationTrackerScreen: React.FC<HydrationTrackerScreenProps> = ({
  currentWater,
  targetWater,
  onAddWater,
  onResetWater,
}) => {
  const [dispensedToast, setDispensedToast] = useState<string | null>(null);
  const [spigotRotated, setSpigotRotated] = useState(false);
  const maxTankCapacity = 4000;

  const heightPercent = Math.min(100, Math.max(8, (currentWater / maxTankCapacity) * 100));
  const percentOfTarget = Math.round((currentWater / targetWater) * 100);
  const remainingMl = Math.max(0, targetWater - currentWater);
  const flOz = (currentWater * 0.033814).toFixed(1);

  const handleDispense = (ml: number, vesselName: string) => {
    playWaterDrop();
    onAddWater(ml);

    // Spigot physical rotation animation
    setSpigotRotated(true);
    setTimeout(() => setSpigotRotated(false), 400);

    // Toast alert
    setDispensedToast(`+${ml} ml Dispensed (${vesselName})`);
    setTimeout(() => {
      setDispensedToast(null);
    }, 2000);
  };

  const handleTare = () => {
    playMechanicalClick();
    onResetWater();
    playBrassChime();
    setDispensedToast('Scale Tared to 0 ml');
    setTimeout(() => setDispensedToast(null), 2000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Station Control Bar */}
      <div className="w-full px-6 py-4 bg-surface-container flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(39,24,20,0.3)]">
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline-sm text-headline-sm text-on-surface">Hydration Apothecary Well</span>
              <span className="px-2 py-0.5 rounded-full text-label-sm font-label-sm uppercase bg-secondary/15 text-secondary font-bold">
                Calibration: Pure Spring
              </span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Hydro-pneumatic volumetric chamber • Dispenser Array No. 04
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-high shadow-[inset_0_2px_4px_rgba(39,24,20,0.15)]">
            <span className="material-symbols-outlined text-tertiary text-[18px]">thermostat</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">Chamber Temp: 11.2°C</span>
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_#376847]"></span>
          </div>
          <button
            onClick={handleTare}
            id="reset-day-btn"
            className="px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-variant text-on-surface font-label-md text-label-md transition-all shadow-[0_2px_4px_rgba(39,24,20,0.15)] active:translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Tare Scale</span>
          </button>
        </div>
      </div>

      {/* Main Hydration Console Grid */}
      <div className="w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Apothecary Dispenser Tank (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-surface-container-low p-6 rounded-xl shadow-xl relative overflow-hidden flex flex-col items-center">
            {/* Leather backplate brass rivets */}
            <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
            <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
            <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>
            <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-surface-variant to-outline shadow-inner"></div>

            {/* Dispenser Header Plate */}
            <div className="w-full flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm tracking-wider uppercase text-on-surface-variant font-bold">
                  Vessel Serial
                </span>
                <span className="font-label-md text-label-md font-bold text-primary">VG-HYD-4000</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-tertiary/10 text-tertiary">
                <span className="material-symbols-outlined text-[14px]">opacity</span>
                <span className="font-label-sm text-label-sm font-bold tracking-wider" id="intake-percentage-pill">
                  {percentOfTarget}% OF TARGET
                </span>
              </div>
            </div>

            {/* Brass Apothecary Vessel Dome & Glass Cylinder */}
            <div className="relative w-72 md:w-80 flex flex-col items-center my-2">
              {/* Top Heavy Brass Cap & Valves */}
              <div className="w-56 h-8 rounded-t-2xl bg-gradient-to-b from-surface-variant via-outline-variant to-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] relative z-20 flex items-center justify-center">
                <div className="w-20 h-3 rounded-full bg-gradient-to-r from-outline to-surface-variant shadow-inner"></div>
                <div className="absolute -top-3 w-10 h-4 rounded-t-lg bg-gradient-to-b from-surface-variant to-outline-variant shadow-md"></div>
              </div>
              <div className="w-64 h-3 bg-gradient-to-r from-primary-container via-surface-variant to-primary-container shadow-sm z-20"></div>

              {/* Glass Cylinder Body */}
              <div className="relative w-64 md:w-72 h-[420px] rounded-b-3xl bg-gradient-to-r from-surface-container-high/40 via-surface-container-lowest/20 to-surface-container-high/40 shadow-[inset_2px_0_8px_rgba(255,255,255,0.8),inset_-2px_0_8px_rgba(39,24,20,0.25),0_15px_30px_rgba(39,24,20,0.25)] overflow-hidden flex items-end">
                {/* Etched Measurement Ticks */}
                <div className="absolute top-0 bottom-0 left-4 w-12 z-20 flex flex-col justify-between py-6 pointer-events-none select-none">
                  <div className="flex items-center gap-1.5 text-on-surface-variant/80">
                    <span className="w-4 h-0.5 bg-outline/70"></span>
                    <span className="font-label-sm text-[10px] font-bold">4000</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-2.5 h-0.5 bg-outline/50"></span>
                    <span className="font-label-sm text-[9px]">3500</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-tertiary font-bold">
                    <span className="w-5 h-1 bg-tertiary"></span>
                    <span className="font-label-sm text-[10px]">3200★</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-2.5 h-0.5 bg-outline/50"></span>
                    <span className="font-label-sm text-[9px]">2800</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/80">
                    <span className="w-4 h-0.5 bg-outline/70"></span>
                    <span className="font-label-sm text-[10px]">2400</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-2.5 h-0.5 bg-outline/50"></span>
                    <span className="font-label-sm text-[9px]">2000</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-3.5 h-0.5 bg-outline/60"></span>
                    <span className="font-label-sm text-[9px]">1600</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-2.5 h-0.5 bg-outline/50"></span>
                    <span className="font-label-sm text-[9px]">1200</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-3.5 h-0.5 bg-outline/60"></span>
                    <span className="font-label-sm text-[9px]">800</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/70">
                    <span className="w-2.5 h-0.5 bg-outline/50"></span>
                    <span className="font-label-sm text-[9px]">400</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant/80">
                    <span className="w-4 h-0.5 bg-outline/70"></span>
                    <span className="font-label-sm text-[10px]">0 ml</span>
                  </div>
                </div>

                {/* Vertical Glass Specular Highlights */}
                <div className="absolute inset-y-0 left-2 w-3 bg-gradient-to-r from-surface-container-lowest/80 to-transparent pointer-events-none z-30"></div>
                <div className="absolute inset-y-0 right-4 w-5 bg-gradient-to-l from-surface-container-lowest/60 to-transparent pointer-events-none z-30"></div>

                {/* Condensation Droplets */}
                <div className="absolute inset-0 pointer-events-none z-25 opacity-70">
                  <span className="absolute top-16 right-10 w-2 h-2.5 rounded-full bg-surface-container-lowest/80 shadow-[0_1px_2px_rgba(0,0,0,0.2)]"></span>
                  <span className="absolute top-24 right-8 w-1.5 h-2 rounded-full bg-surface-container-lowest/70 shadow-sm"></span>
                  <span className="absolute top-36 left-16 w-2 h-3 rounded-full bg-surface-container-lowest/90 shadow-sm"></span>
                  <span className="absolute top-44 left-20 w-1 h-1 rounded-full bg-surface-container-lowest/60"></span>
                  <span className="absolute top-64 right-14 w-2.5 h-3 rounded-full bg-surface-container-lowest/80 shadow-sm"></span>
                  <span className="absolute top-72 right-20 w-1.5 h-2 rounded-full bg-surface-container-lowest/70"></span>
                  <span className="absolute bottom-20 left-24 w-2 h-2.5 rounded-full bg-surface-container-lowest/80"></span>
                  <span className="absolute bottom-12 right-12 w-1.5 h-1.5 rounded-full bg-surface-container-lowest/60"></span>
                </div>

                {/* Liquid Column Container */}
                <div
                  className="w-full relative transition-all duration-700 ease-out z-10 flex flex-col justify-start"
                  id="liquid-column"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Meniscus Curve & Surface Shimmer */}
                  <div className="relative w-full h-8 -mt-4 overflow-hidden">
                    <div className="w-full h-8 rounded-[50%] bg-gradient-to-r from-tertiary-fixed via-tertiary-fixed-dim to-tertiary shadow-[0_3px_8px_rgba(0,109,163,0.4),inset_0_1px_3px_rgba(255,255,255,0.9)] opacity-95"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3/4 h-2 rounded-full bg-surface-container-lowest/50 blur-[1px] animate-pulse"></div>
                    </div>
                  </div>

                  {/* Main Liquid Body */}
                  <div className="w-full flex-1 bg-gradient-to-b from-tertiary via-tertiary-container to-primary-container/90 relative overflow-hidden shadow-[inset_0_10px_20px_rgba(0,84,127,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-r from-tertiary/40 via-transparent to-tertiary/60 pointer-events-none"></div>

                    {/* Bubbles */}
                    <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-surface-container-lowest/60 shadow-[0_0_4px_#d4e9ff] animate-bounce"></div>
                    <div className="absolute bottom-16 left-24 w-1.5 h-1.5 rounded-full bg-surface-container-lowest/50 animate-bounce"></div>
                    <div className="absolute bottom-28 right-16 w-2.5 h-2.5 rounded-full bg-surface-container-lowest/70 animate-bounce"></div>
                    <div className="absolute bottom-10 right-28 w-1 h-1 rounded-full bg-surface-container-lowest/40 animate-bounce"></div>

                    {/* Ambient Light Caustic SVG */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none"
                      preserveAspectRatio="none"
                      viewBox="0 0 200 400"
                    >
                      <path
                        className="text-surface-container-lowest"
                        d="M10,0 C60,80 30,150 70,230 C110,310 90,360 120,400 L180,400 C150,340 170,290 140,210 C110,130 140,70 110,0 Z"
                        fill="currentColor"
                      ></path>
                    </svg>

                    {/* Reading Watermark */}
                    <div className="absolute top-10 right-6 text-right select-none pointer-events-none">
                      <span
                        className="font-headline-lg text-headline-lg font-bold text-surface-container-lowest drop-shadow-[0_2px_4px_rgba(0,30,49,0.8)]"
                        id="dispenser-current-readout"
                      >
                        {currentWater.toLocaleString()}
                      </span>
                      <span className="font-label-md text-label-md text-on-tertiary-container block drop-shadow-sm font-semibold">
                        MILLILITERS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-inverse-surface/40 to-transparent pointer-events-none z-15"></div>
              </div>

              {/* Bottom Brass Spigot Base */}
              <div className="w-72 h-9 rounded-b-2xl bg-gradient-to-b from-primary-container via-surface-variant to-primary shadow-[0_12px_24px_rgba(39,24,20,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] relative z-20 flex items-center justify-between px-6">
                <span className="w-3 h-3 rounded-full bg-outline shadow-inner"></span>
                <div className="relative flex items-center gap-2">
                  <div className="w-7 h-4 rounded bg-gradient-to-b from-surface-variant to-primary-container shadow-md border-t border-surface-container-lowest/50"></div>
                  <div
                    id="spigot-lever"
                    onClick={() => handleDispense(250, 'Spigot Pour')}
                    className={`w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-surface-variant flex items-center justify-center cursor-pointer shadow-[0_3px_6px_rgba(39,24,20,0.5),inset_0_1px_2px_rgba(255,255,255,0.8)] transition-transform duration-300 ${
                      spigotRotated ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    <div className="w-5 h-1.5 rounded-full bg-inverse-surface/80"></div>
                  </div>
                </div>
                <span className="w-3 h-3 rounded-full bg-outline shadow-inner"></span>
              </div>

              {/* Pour Toast */}
              {dispensedToast && (
                <div className="absolute -bottom-6 px-4 py-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md shadow-lg flex items-center gap-1.5 z-40 transition-all animate-bounce">
                  <span className="material-symbols-outlined text-[16px]">water_drop</span>
                  <span>{dispensedToast}</span>
                </div>
              )}
            </div>

            {/* Metric Readout Plate below Vessel */}
            <div className="w-full mt-8 p-4 rounded-lg bg-surface-container-high shadow-[inset_0_2px_4px_rgba(39,24,20,0.12)] flex items-center justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant block">
                  Target Quota
                </span>
                <span className="font-title-lg text-title-lg font-bold text-on-surface">
                  {targetWater.toLocaleString()}{' '}
                  <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">ml/day</span>
                </span>
              </div>
              <div className="h-8 w-px bg-outline-variant"></div>
              <div>
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant block">
                  Chamber Deficit
                </span>
                <span className="font-title-lg text-title-lg font-bold text-primary">
                  {remainingMl.toLocaleString()}{' '}
                  <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">ml remaining</span>
                </span>
              </div>
              <div className="h-8 w-px bg-outline-variant"></div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant block">
                  Pace Status
                </span>
                <span className="font-label-md text-label-md font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Optimal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Control Station, Hourly Dial, Metrics, Streak (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Tactile Drinking Vessel Dispenser Buttons */}
          <div className="w-full p-5 bg-surface-container-low rounded-xl shadow-lg relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">local_drink</span>
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  Tactile Vessel Dispenser Station
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Select vessel to log volume
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Vessel 1: Espresso Cup (100 ml) */}
              <button
                onClick={() => handleDispense(100, 'Espresso Cup')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">coffee</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Espresso Cup</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+100 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Demitasse / Sip</span>
              </button>

              {/* Vessel 2: Water Glass (250 ml) */}
              <button
                onClick={() => handleDispense(250, 'Water Glass')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">glass_cup</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Water Glass</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+250 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Standard Tumbler</span>
              </button>

              {/* Vessel 3: Coffee Mug (350 ml) */}
              <button
                onClick={() => handleDispense(350, 'Coffee Mug')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary-container shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">qr_code_2</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Coffee Mug</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+350 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Ceramic Cup</span>
              </button>

              {/* Vessel 4: Sports Bottle (500 ml) */}
              <button
                onClick={() => handleDispense(500, 'Sports Bottle')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">sports_bar</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Sports Bottle</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+500 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Isotonic Flask</span>
              </button>

              {/* Vessel 5: Large Canteen (750 ml) */}
              <button
                onClick={() => handleDispense(750, 'Large Canteen')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">water_bottle</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Large Canteen</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+750 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Field Flask</span>
              </button>

              {/* Vessel 6: Hydro Jug (1,000 ml) */}
              <button
                onClick={() => handleDispense(1000, 'Hydro Jug')}
                className="group relative p-3 rounded-xl bg-gradient-to-b from-surface-container-lowest to-surface-container border-b-2 border-primary-container shadow-[0_4px_8px_rgba(39,24,20,0.18),0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-md active:translate-y-1 active:border-b-0 active:shadow-[inset_0_2px_5px_rgba(39,24,20,0.3)] transition-all flex flex-col items-center justify-between min-h-[110px] text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary-container shadow-inner group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">water_full</span>
                </div>
                <div className="mt-2">
                  <span className="font-label-md text-label-md font-bold text-on-surface block">Hydro Jug</span>
                  <span className="font-label-sm text-label-sm font-bold text-tertiary">+1,000 ml</span>
                </div>
                <span className="text-[10px] font-body-sm text-on-surface-variant">Daily Tank</span>
              </button>
            </div>
          </div>

          {/* 2. Mid Row: Brass Schedule Dial & Electrolyte Meters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Hourly Hydration Schedule Dial */}
            <div className="md:col-span-6 bg-surface-container-low p-5 rounded-xl shadow-lg flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface">Hourly Cadence Dial</span>
                </div>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-secondary/15 text-secondary font-bold">
                  4 / 6 MET
                </span>
              </div>

              {/* Circular Skeuomorphic Clock Dial */}
              <div className="relative w-56 h-56 rounded-full bg-gradient-to-tr from-surface-container to-surface-container-lowest p-2 shadow-[0_8px_20px_rgba(39,24,20,0.25),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-surface-variant via-outline-variant to-primary-container opacity-40 pointer-events-none"></div>

                <div className="relative w-48 h-48 rounded-full bg-surface-container-low shadow-[inset_0_3px_6px_rgba(39,24,20,0.3)] flex items-center justify-center">
                  {/* Center Pivot Nut */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-surface-variant to-primary-container shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.8)] z-30 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-inner"></div>
                  </div>

                  {/* Mechanical Gold Clock Needle pointing to 3:30 PM (~110 deg) */}
                  <div className="absolute w-1 h-20 bg-gradient-to-t from-primary to-surface-tint rounded-full origin-bottom bottom-24 shadow-[2px_2px_4px_rgba(39,24,20,0.4)] z-20 transform rotate-[110deg]"></div>

                  {/* Checkpoints */}
                  <div className="absolute top-6 left-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-tertiary shadow-[0_0_8px_#00547f,inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>
                    <span className="font-label-sm text-[9px] text-on-surface-variant font-bold mt-0.5">08:00</span>
                  </div>
                  <div className="absolute top-6 right-10 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-tertiary shadow-[0_0_8px_#00547f,inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>
                    <span className="font-label-sm text-[9px] text-on-surface-variant font-bold mt-0.5">10:30</span>
                  </div>
                  <div className="absolute top-20 right-3 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-tertiary shadow-[0_0_8px_#00547f,inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>
                    <span className="font-label-sm text-[9px] text-on-surface-variant font-bold mt-0.5">13:00</span>
                  </div>
                  <div className="absolute bottom-6 right-8 flex flex-col items-center animate-pulse">
                    <div className="w-4 h-4 rounded-full bg-secondary shadow-[0_0_10px_#376847,inset_0_1px_2px_rgba(255,255,255,0.9)]"></div>
                    <span className="font-label-sm text-[9px] text-secondary font-bold mt-0.5">15:30★</span>
                  </div>
                  <div className="absolute bottom-3 left-20 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-surface-container-highest shadow-inner"></div>
                    <span className="font-label-sm text-[9px] text-on-surface-variant font-semibold mt-0.5">18:00</span>
                  </div>
                  <div className="absolute top-20 left-3 flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-surface-container-highest shadow-inner"></div>
                    <span className="font-label-sm text-[9px] text-on-surface-variant font-semibold mt-0.5">20:30</span>
                  </div>
                </div>
              </div>

              <div className="w-full mt-3 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                <span>
                  Next Interval: <strong className="text-on-surface font-semibold">6:00 PM (350 ml)</strong>
                </span>
                <span className="flex items-center gap-1 text-tertiary font-label-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">alarm</span> Reminder Chime Set
                </span>
              </div>
            </div>

            {/* Electrolyte & Cellular Matrix */}
            <div className="md:col-span-6 bg-surface-container-low p-5 rounded-xl shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">science</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface">
                    Electrolyte &amp; Cellular Matrix
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Lab Assay v2</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Volumetric assimilation rate calibrated to physical exertion and ambient humidity.
              </p>

              <div className="space-y-4">
                {/* Tube 1: Overall Water Balance */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">
                      System Water Balance
                    </span>
                    <span className="font-label-md text-label-md font-bold text-tertiary">
                      {percentOfTarget}% ({(currentWater / 1000).toFixed(1)}L)
                    </span>
                  </div>
                  <div className="relative w-full h-5 rounded-full bg-surface-container-high p-1 shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] overflow-hidden">
                    <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none z-20 opacity-40">
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                    </div>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-tertiary-container to-tertiary shadow-[0_1px_3px_rgba(0,109,163,0.4)] relative flex items-center justify-end transition-all duration-500"
                      style={{ width: `${Math.min(100, percentOfTarget)}%` }}
                    >
                      <div className="w-2 h-2 rounded-full bg-surface-container-lowest shadow-sm mr-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Tube 2: Electrolyte Solute */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">
                      Electrolyte Solute (Na⁺ / K⁺ / Mg²⁺)
                    </span>
                    <span className="font-label-md text-label-md font-bold text-secondary">88% Optimal</span>
                  </div>
                  <div className="relative w-full h-5 rounded-full bg-surface-container-high p-1 shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] overflow-hidden">
                    <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none z-20 opacity-40">
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                    </div>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-secondary-container to-secondary shadow-[0_1px_3px_rgba(55,104,71,0.4)] relative flex items-center justify-end"
                      style={{ width: '88%' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-surface-container-lowest shadow-sm mr-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Tube 3: Cellular Hydration Index */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase">
                      Cellular Hydration Index
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary">68% Saturating</span>
                  </div>
                  <div className="relative w-full h-5 rounded-full bg-surface-container-high p-1 shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] overflow-hidden">
                    <div className="absolute inset-0 flex justify-between px-3 items-center pointer-events-none z-20 opacity-40">
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                      <span className="w-px h-2 bg-on-surface"></span>
                    </div>
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-surface-variant to-primary-container shadow-[0_1px_3px_rgba(113,68,54,0.4)] relative flex items-center justify-end"
                      style={{ width: '68%' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-surface-container-lowest shadow-sm mr-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-2.5 rounded-lg bg-surface-container flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[18px]">neurology</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant leading-snug">
                  Cognitive focus coefficient increased +14% due to continuous fluid buffering since 08:00.
                </span>
              </div>
            </div>
          </div>

          {/* 3. 7-Day Hydration Streak Log (Brass Coin Tokens) */}
          <div className="w-full bg-surface-container-low p-5 rounded-xl shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
                <span className="font-title-md text-title-md font-bold text-on-surface">
                  7-Day Hydration Streak Folio
                </span>
              </div>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary px-2.5 py-0.5 rounded-full bg-secondary/15">
                Current Run: 6 Days Strong
              </span>
            </div>

            {/* Brass Coin Tokens Row */}
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {[
                { day: 'Mon', vol: '3.4L' },
                { day: 'Tue', vol: '3.2L' },
                { day: 'Wed', vol: '3.5L' },
                { day: 'Thu', vol: '3.3L' },
                { day: 'Fri', vol: '3.6L' },
                { day: 'Sat', vol: '3.2L' },
              ].map((token) => (
                <div key={token.day} className="flex flex-col items-center">
                  <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-surface-variant via-outline-variant to-primary-container p-0.5 shadow-[0_4px_8px_rgba(39,24,20,0.3),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center transform hover:scale-105 transition-transform cursor-pointer">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-surface-variant to-outline-variant flex items-center justify-center shadow-inner">
                      <span className="material-symbols-outlined text-[20px] text-primary">water_drop</span>
                    </div>
                  </div>
                  <span className="font-label-sm text-[11px] font-bold text-on-surface mt-1.5">{token.day}</span>
                  <span className="font-body-sm text-[10px] text-secondary font-semibold">{token.vol}</span>
                </div>
              ))}

              {/* Sunday (Today) */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 md:w-13 md:h-13 rounded-full bg-surface-container-high p-0.5 shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] flex items-center justify-center relative">
                  <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant opacity-60">
                      hourglass_top
                    </span>
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary border border-surface shadow-[0_0_5px_#376847]"></span>
                </div>
                <span className="font-label-sm text-[11px] font-bold text-primary mt-1.5">Today</span>
                <span className="font-body-sm text-[10px] text-on-surface-variant font-medium">
                  {(currentWater / 1000).toFixed(1)}L
                </span>
              </div>
            </div>

            <div className="w-full mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
              <span>
                Weekly Target Average: <strong className="text-on-surface font-semibold">3.37 L / Day</strong>
              </span>
              <span className="font-label-sm text-label-sm text-primary font-bold hover:underline cursor-pointer flex items-center gap-1">
                Historical Archive <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
