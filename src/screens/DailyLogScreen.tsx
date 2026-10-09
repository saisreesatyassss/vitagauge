import React, { useState } from 'react';
import { MealItem, ScreenPath } from '../types.ts';
import { playMechanicalClick, playBrassChime, playWaterDrop } from '../utils/audio.ts';

interface DailyLogScreenProps {
  meals: MealItem[];
  totalCalories: number;
  totalWater: number;
  targetCalories: number;
  targetWater: number;
  onAddWater: (ml: number) => void;
  onNavigate: (path: ScreenPath) => void;
  onOpenCalibration: () => void;
  onAddMeal: (meal: Omit<MealItem, 'id'>) => void;
  onEditMeal: (meal: MealItem) => void;
  currentDay: string;
  onChangeDay: (delta: number) => void;
}

export const DailyLogScreen: React.FC<DailyLogScreenProps> = ({
  meals,
  totalCalories,
  totalWater,
  targetCalories,
  targetWater,
  onAddWater,
  onNavigate,
  onOpenCalibration,
  onAddMeal,
  onEditMeal,
  currentDay,
  onChangeDay,
}) => {
  const [quickDishName, setQuickDishName] = useState('');
  const [quickDishCalories, setQuickDishCalories] = useState('360');

  // Calculate Macros from current meals
  const totalProtein = meals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = meals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFats = meals.reduce((acc, m) => acc + m.fats, 0);

  // Targets
  const targetProtein = 140;
  const targetCarbs = 220;
  const targetFats = 65;

  const proteinPct = Math.min(100, Math.round((totalProtein / targetProtein) * 100));
  const carbsPct = Math.min(100, Math.round((totalCarbs / targetCarbs) * 100));
  const fatsPct = Math.min(100, Math.round((totalFats / targetFats) * 100));

  // Needle angle for Calories Dial: 240 deg sweep from -120 to +120
  // Max scale is 2500 kcal.
  // When calories = 0 -> -120 deg
  // When calories = 2500 -> +120 deg
  const maxCalorieScale = 2500;
  const needleAngle = Math.min(125, Math.max(-125, -120 + (totalCalories / maxCalorieScale) * 240));

  // Odometer string formatted with spaced digits
  const odometerStr = totalCalories.toString().padStart(4, '0').split('').join(' ');

  // Water level percentage
  const waterPct = Math.min(100, Math.max(8, Math.round((totalWater / targetWater) * 100)));
  const flOz = (totalWater * 0.033814).toFixed(1);

  // Remaining calories
  const remainingCalories = Math.max(0, targetCalories - totalCalories);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickDishName.trim()) return;
    playMechanicalClick();
    playBrassChime();
    const cals = parseInt(quickDishCalories, 10) || 350;
    onAddMeal({
      category: 'evening',
      categoryLabel: 'Evening Course • Dispatch',
      time: '07:30 PM',
      title: quickDishName.trim(),
      description: 'Handcrafted mechanical entry recorded to journal ledger.',
      calories: cals,
      protein: Math.round(cals * 0.07),
      carbs: Math.round(cals * 0.1),
      fats: Math.round(cals * 0.03),
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGuY3gSz7H3udM-_dRzPKv3FAeS2zGbMD86Coo8qGOgsyVN257i3d7hVKBauoIEzm_zX3Orq-a5pPB50qC9CK3QvB9mWQggxqsTg44toFsSDepKT9i-V1bbUQYmZ_XV6TZBDAnRPmD8pIy1o0zjFK1r2V2-6R6Yld94_784fJ-IMFLM3fOOVftfPhtwo--fCBG0OddrI-x3WFUaMJJOTHWgKpjps2w3YBJKNTKP6hE_tWXVOU5V0_2eA',
      imageAlt: quickDishName,
    });
    setQuickDishName('');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Mechanical Chronometer Header Strip */}
      <div className="w-full bg-surface-container-high px-4 py-3 shadow-[inset_0_2px_4px_rgba(39,24,20,0.18),0_2px_6px_rgba(39,24,20,0.08)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Vintage Day Wheel Rotator */}
          <div className="flex items-center bg-surface-container-highest px-3 py-1.5 rounded shadow-[inset_0_1px_3px_rgba(39,24,20,0.35)]">
            <button
              onClick={() => {
                playMechanicalClick();
                onChangeDay(-1);
              }}
              title="Previous Day"
              className="hover:text-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">chevron_left</span>
            </button>
            <span className="font-label-md text-label-md text-on-surface font-bold tracking-wider mx-1 uppercase">
              {currentDay}
            </span>
            <button
              onClick={() => {
                playMechanicalClick();
                onChangeDay(1);
              }}
              title="Next Day"
              className="hover:text-primary active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">chevron_right</span>
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-container/50 shadow-[inset_0_1px_2px_rgba(39,24,20,0.2)]">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#376847]"></span>
            <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-widest">
              Gauges In Sync
            </span>
          </div>
        </div>

        {/* Quick Mechanical Control Studs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playMechanicalClick();
              onOpenCalibration();
            }}
            className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-md text-label-md flex items-center gap-1.5 shadow-[0_3px_6px_rgba(39,24,20,0.2),inset_0_1px_0_rgba(255,255,255,0.7)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(39,24,20,0.4)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-surface-tint">tune</span>
            <span>Re-Calibrate Daily Goal</span>
          </button>
          <button
            onClick={() => {
              playMechanicalClick();
              window.print();
            }}
            className="px-3 py-1.5 rounded bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1.5 shadow-[0_3px_8px_rgba(113,68,54,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Print Dispatch</span>
          </button>
        </div>
      </div>

      <div className="w-full p-4 md:p-6 lg:p-8 space-y-8">
        {/* HERO DECK: Brass Pressure Gauge (Calories) & Scientific Fluid Column (Water) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: The Master Caloric Dynamo (7 Columns) */}
          <div className="lg:col-span-7 rounded-xl bg-surface-container p-6 shadow-[0_10px_25px_rgba(39,24,20,0.18),inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden flex flex-col justify-between">
            {/* Engraved Plate Rivets */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>

            {/* Header Plaque */}
            <div className="flex items-center justify-between pb-3">
              <div>
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-widest">
                  Instrument No. 402-C
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Caloric Chamber Pressure</h2>
              </div>
              <div className="px-2.5 py-1 rounded bg-surface-container-high shadow-[inset_0_1px_3px_rgba(39,24,20,0.3)]">
                <span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-wider">
                  Burn: {totalCalories.toLocaleString()} / {targetCalories.toLocaleString()} kcal
                </span>
              </div>
            </div>

            {/* Master Speedometer Dial */}
            <div className="flex flex-col items-center justify-center my-4 relative">
              {/* Outer Brass Flange Housing */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br from-[#d4af37] via-[#b8860b] to-[#8a6508] p-3 shadow-[0_12px_24px_rgba(39,24,20,0.35),inset_0_2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center">
                {/* Sunken Cream Beveled Dial Plate */}
                <div className="w-full h-full rounded-full bg-surface-container-lowest shadow-[inset_0_6px_14px_rgba(39,24,20,0.45),0_1px_1px_rgba(255,255,255,0.9)] relative flex items-center justify-center overflow-hidden">
                  {/* Caloric Gauge Dial SVG with accurately positioned ticks, tracks, and numbers */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 280">
                    {/* Outer decorative perimeter ring */}
                    <circle cx="140" cy="140" r="122" fill="none" stroke="#d6c2bd" strokeWidth="1.5" strokeDasharray="2 4" strokeOpacity="0.7"></circle>
                    <circle cx="140" cy="140" r="118" fill="none" stroke="#84746f" strokeWidth="0.75" strokeOpacity="0.5"></circle>

                    {/* Base arc track (240 degree sweep from 150deg to 390deg) */}
                    <path d="M 65.05 204.95 A 95 95 0 1 1 214.95 204.95" fill="none" stroke="#fadcd5" strokeWidth="8" strokeLinecap="round"></path>
                    {/* Progress arc track filled up to calibrated calories */}
                    <path
                      d="M 65.05 204.95 A 95 95 0 0 1 189.65 59.04"
                      fill="none"
                      stroke="#376847"
                      strokeWidth="8"
                      strokeLinecap="round"
                      style={{
                        strokeDasharray: 400,
                        strokeDashoffset: 400 - (400 * Math.min(1, totalCalories / maxCalorieScale)),
                        transition: 'stroke-dashoffset 1s ease-out',
                      }}
                    ></path>

                    {/* Major & minor tick marks */}
                    <line x1="58.74" y1="208.59" x2="70.76" y2="201.65" stroke="#514440" strokeWidth="2.5" strokeLinecap="round"></line>
                    <line x1="43.68" y1="151.19" x2="53.62" y2="150.15" stroke="#84746f" strokeWidth="1.5"></line>
                    <line x1="47.45" y1="107.05" x2="58.86" y2="110.76" stroke="#514440" strokeWidth="2.5" strokeLinecap="round"></line>
                    <line x1="68.27" y1="68.27" x2="76.76" y2="76.76" stroke="#84746f" strokeWidth="1.5"></line>
                    <line x1="101.42" y1="41.44" x2="106.63" y2="52.81" stroke="#714436" strokeWidth="2.5" strokeLinecap="round"></line>
                    <line x1="140" y1="32" x2="140" y2="44" stroke="#84746f" strokeWidth="1.5"></line>
                    <line x1="178.58" y1="41.44" x2="173.37" y2="52.81" stroke="#714436" strokeWidth="2.5" strokeLinecap="round"></line>
                    <line x1="211.73" y1="68.27" x2="203.24" y2="76.76" stroke="#84746f" strokeWidth="1.5"></line>
                    <line x1="232.55" y1="107.05" x2="221.14" y2="110.76" stroke="#376847" strokeWidth="2.5" strokeLinecap="round"></line>
                    <line x1="236.32" y1="151.19" x2="226.38" y2="150.15" stroke="#84746f" strokeWidth="1.5"></line>
                    <line x1="221.26" y1="208.59" x2="209.24" y2="201.65" stroke="#514440" strokeWidth="2.5" strokeLinecap="round"></line>

                    {/* Calibrated Numeral Labels */}
                    <text x="72" y="226" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#514440" textAnchor="middle">0</text>
                    <text x="42" y="116" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#514440" textAnchor="middle">500</text>
                    <text x="94" y="46" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#714436" textAnchor="middle">1000</text>
                    <text x="186" y="46" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#714436" textAnchor="middle">1500</text>
                    <text x="238" y="116" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#376847" textAnchor="middle">2000</text>
                    <text x="208" y="226" fontFamily="Work Sans, sans-serif" fontSize="11" fontWeight="700" fill="#514440" textAnchor="middle">2500</text>

                    {/* Dial branding */}
                    <text x="140" y="98" fontFamily="Playfair Display, serif" fontSize="9" fontWeight="600" letterSpacing="1.5" fill="#84746f" textAnchor="middle">CALORIC DYNAMO</text>
                    <text x="140" y="110" fontFamily="Work Sans, sans-serif" fontSize="7.5" fontWeight="500" letterSpacing="1" fill="#84746f" textAnchor="middle">SCALE × 1 KCAL</text>
                  </svg>

                  {/* Needle Cast Shadow & Physical Indicator positioned dynamically */}
                  <div
                    className="absolute w-full h-full pointer-events-none flex items-center justify-center transition-transform duration-700 ease-out"
                    style={{ transform: `rotate(${needleAngle}deg)` }}
                  >
                    <div className="w-1.5 h-20 bg-gradient-to-t from-primary via-primary-container to-error rounded-t -translate-y-8 shadow-[2px_4px_6px_rgba(0,0,0,0.4)]"></div>
                  </div>

                  {/* Central Brass Center-Cap Pivot */}
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#fae092] via-[#b8860b] to-[#5a4205] shadow-[0_3px_7px_rgba(39,24,20,0.6),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-container-highest shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"></div>
                  </div>

                  {/* Analog Rolling Odometer Drum */}
                  <div className="absolute bottom-3.5 flex items-center bg-[#1e1310] px-3 py-1 rounded shadow-[inset_0_3px_5px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.7)] border border-outline/50 z-10">
                    <div className="font-mono text-title-md font-bold text-[#fae092] tracking-widest leading-none drop-shadow-[0_0_5px_rgba(247,184,165,0.6)]">
                      {odometerStr}
                    </div>
                    <span className="ml-1.5 text-[8px] font-bold text-[#fae092] uppercase tracking-wider">KCAL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Macro Breakout Mini-Gauges Triad */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-outline-variant/40">
              {/* Protein Mini-Pod */}
              <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-lg shadow-[inset_0_2px_4px_rgba(39,24,20,0.06),0_2px_5px_rgba(39,24,20,0.06)]">
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold">Protein</span>
                <div className="relative w-16 h-16 flex items-center justify-center my-1.5">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-surface-variant" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
                    <circle
                      className="text-primary transition-all duration-700"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="14"
                      stroke="currentColor"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * proteinPct) / 100}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  <span className="absolute font-label-md text-label-md font-bold text-on-surface">{proteinPct}%</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {totalProtein}g <span className="text-outline font-normal">/ {targetProtein}g</span>
                </div>
              </div>

              {/* Carbs Mini-Pod */}
              <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-lg shadow-[inset_0_2px_4px_rgba(39,24,20,0.06),0_2px_5px_rgba(39,24,20,0.06)]">
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold">Carbohydrates</span>
                <div className="relative w-16 h-16 flex items-center justify-center my-1.5">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-surface-variant" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
                    <circle
                      className="text-secondary transition-all duration-700"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="14"
                      stroke="currentColor"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * carbsPct) / 100}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  <span className="absolute font-label-md text-label-md font-bold text-on-surface">{carbsPct}%</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {totalCarbs}g <span className="text-outline font-normal">/ {targetCarbs}g</span>
                </div>
              </div>

              {/* Fats Mini-Pod */}
              <div className="flex flex-col items-center bg-surface-container-lowest p-3 rounded-lg shadow-[inset_0_2px_4px_rgba(39,24,20,0.06),0_2px_5px_rgba(39,24,20,0.06)]">
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold">Healthy Lipids</span>
                <div className="relative w-16 h-16 flex items-center justify-center my-1.5">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle className="text-surface-variant" cx="18" cy="18" fill="none" r="14" stroke="currentColor" strokeWidth="3"></circle>
                    <circle
                      className="text-tertiary transition-all duration-700"
                      cx="18"
                      cy="18"
                      fill="none"
                      r="14"
                      stroke="currentColor"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * fatsPct) / 100}
                      strokeLinecap="round"
                      strokeWidth="3"
                    ></circle>
                  </svg>
                  <span className="absolute font-label-md text-label-md font-bold text-on-surface">{fatsPct}%</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {totalFats}g <span className="text-outline font-normal">/ {targetFats}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Tactile Glass Hydration Cylinder (5 Columns) */}
          <div className="lg:col-span-5 rounded-xl bg-surface-container p-6 shadow-[0_10px_25px_rgba(39,24,20,0.18),inset_0_1px_2px_rgba(255,255,255,0.8)] flex flex-col justify-between relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-2">
              <div>
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-widest">
                  Graduated Cylinder 200
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Hydration Reservoir</h2>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-label-md text-label-md font-bold">
                <span className="material-symbols-outlined text-[18px]">water_full</span>
                <span>{waterPct}% Full</span>
              </div>
            </div>

            {/* The Skeuomorphic Vial Body */}
            <div className="flex items-center justify-center py-4 gap-6">
              {/* Liquid Column Well */}
              <div className="relative w-28 h-64 rounded-2xl bg-surface-container-highest p-2 shadow-[inset_0_5px_12px_rgba(39,24,20,0.5),0_2px_5px_rgba(255,255,255,0.8)] flex items-end justify-center">
                {/* Etched Measurement Hash Lines */}
                <div className="absolute left-2.5 top-5 bottom-5 w-3 flex flex-col justify-between items-start pointer-events-none z-20">
                  <span className="w-2.5 h-0.5 bg-outline/70"></span>
                  <span className="w-1.5 h-0.5 bg-outline/50"></span>
                  <span className="w-2.5 h-0.5 bg-outline/70"></span>
                  <span className="w-1.5 h-0.5 bg-outline/50"></span>
                  <span className="w-2.5 h-0.5 bg-outline/70"></span>
                  <span className="w-1.5 h-0.5 bg-outline/50"></span>
                  <span className="w-2.5 h-0.5 bg-outline/70"></span>
                </div>
                <div className="absolute right-2.5 top-5 bottom-5 w-4 flex flex-col justify-between items-end pointer-events-none z-20 text-[8px] font-bold text-outline">
                  <span>3.0L</span>
                  <span>2.5L</span>
                  <span>2.0L</span>
                  <span>1.5L</span>
                  <span>1.0L</span>
                  <span>0.5L</span>
                  <span>0.0L</span>
                </div>
                {/* Glass Reflection Bevel */}
                <div className="absolute left-3 top-2 bottom-2 w-2 rounded-full bg-gradient-to-r from-white/70 to-transparent pointer-events-none z-30"></div>

                {/* Rising Cyan Water Mass */}
                <div
                  className="relative w-full rounded-b-xl bg-gradient-to-t from-tertiary-container via-tertiary to-tertiary-fixed-dim shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),0_0_15px_rgba(0,109,163,0.3)] transition-all duration-700 flex flex-col justify-between overflow-hidden"
                  style={{ height: `${waterPct}%` }}
                >
                  {/* Meniscus Liquid Cap */}
                  <div className="w-full h-3 bg-tertiary-fixed/60 rounded-full shadow-[0_2px_4px_rgba(255,255,255,0.8)] shrink-0"></div>
                  {/* Ambient Bubbles */}
                  <div className="relative w-full h-full">
                    <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
                    <div className="absolute bottom-12 right-5 w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"></div>
                    <div className="absolute bottom-20 left-7 w-1 h-1 rounded-full bg-white/60"></div>
                  </div>
                </div>
              </div>

              {/* Physical Liquid Telemetry Readout */}
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-lg bg-surface-container-lowest shadow-[inset_0_1px_3px_rgba(39,24,20,0.1),0_2px_4px_rgba(39,24,20,0.06)]">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Registered</span>
                  <div className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
                    {totalWater.toLocaleString()} <span className="text-title-md font-normal text-surface-tint">ml</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">Target: {targetWater.toLocaleString()} ml</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-lowest shadow-[inset_0_1px_3px_rgba(39,24,20,0.1),0_2px_4px_rgba(39,24,20,0.06)]">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">Imperial Spec</span>
                  <div className="font-title-lg text-title-lg text-on-surface font-semibold">
                    {flOz} <span className="text-body-sm text-outline">fl oz</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tactile Quick-Add Fluid Push-Buttons */}
            <div className="space-y-2">
              <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-wider">
                Tactile Dispenser Valves
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {/* +250ml Glass */}
                <button
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-high text-on-surface shadow-[0_4px_0_#84746f,0_5px_8px_rgba(39,24,20,0.25)] active:translate-y-1 active:shadow-[0_1px_0_#84746f,inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
                  onClick={() => {
                    playWaterDrop();
                    onAddWater(250);
                  }}
                >
                  <span className="material-symbols-outlined text-tertiary text-[20px]">local_cafe</span>
                  <span className="font-label-md text-label-md font-bold mt-1">+250 ml</span>
                  <span className="text-[9px] text-on-surface-variant">Glass</span>
                </button>
                {/* +500ml Canteen */}
                <button
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-high text-on-surface shadow-[0_4px_0_#84746f,0_5px_8px_rgba(39,24,20,0.25)] active:translate-y-1 active:shadow-[0_1px_0_#84746f,inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
                  onClick={() => {
                    playWaterDrop();
                    onAddWater(500);
                  }}
                >
                  <span className="material-symbols-outlined text-tertiary text-[20px]">water_bottle</span>
                  <span className="font-label-md text-label-md font-bold mt-1">+500 ml</span>
                  <span className="text-[9px] text-on-surface-variant">Canteen</span>
                </button>
                {/* +750ml Flask */}
                <button
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-surface-container-high text-on-surface shadow-[0_4px_0_#84746f,0_5px_8px_rgba(39,24,20,0.25)] active:translate-y-1 active:shadow-[0_1px_0_#84746f,inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
                  onClick={() => {
                    playWaterDrop();
                    onAddWater(750);
                  }}
                >
                  <span className="material-symbols-outlined text-tertiary text-[20px]">sports_bar</span>
                  <span className="font-label-md text-label-md font-bold mt-1">+750 ml</span>
                  <span className="text-[9px] text-on-surface-variant">Flask</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PROMINENT AI CAMERA QUICK-SNAP BANNER */}
        <div className="relative w-full rounded-xl bg-gradient-to-r from-primary via-primary-container to-surface-tint p-5 md:p-6 shadow-[0_8px_20px_rgba(113,68,54,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] text-on-primary flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden">
          {/* Stitched Perimeter Illusion */}
          <div className="absolute inset-1.5 border border-dashed border-on-primary-container/40 rounded-lg pointer-events-none"></div>
          <div className="flex items-center gap-4 z-10">
            <div className="w-14 h-14 rounded-full bg-surface-container-lowest p-1 shadow-[0_4px_8px_rgba(0,0,0,0.3)] flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-surface-container to-surface-variant flex items-center justify-center shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)]">
                <span className="material-symbols-outlined text-primary text-[28px]">photo_camera</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#fae092] text-on-primary-fixed font-label-sm text-label-sm uppercase font-bold tracking-wider shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
                  Optical Intelligence
                </span>
                <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">
                  v2.4 Neural Mesh
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-primary mt-0.5">Instant Plate Optical Scanner</h3>
              <p className="font-body-md text-body-md text-on-primary-container max-w-xl">
                Take an intentional snapshot of your dish. Our mechanical image classifier computes macros and caloric density in seconds.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playMechanicalClick();
              onNavigate('ai-food-scanner');
            }}
            className="z-10 px-5 py-3 rounded-lg bg-surface-container-lowest text-primary font-title-md text-title-md font-bold shadow-[0_6px_14px_rgba(39,24,20,0.35),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-surface active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary">center_focus_strong</span>
            <span>Snap Meal Dish</span>
          </button>
        </div>

        {/* MAIN JOURNAL FOOD DIARY (Hand-Bound Parchment Folio Design) */}
        <div className="w-full rounded-xl bg-surface-container p-6 shadow-[0_12px_30px_rgba(39,24,20,0.2),inset_0_1px_2px_rgba(255,255,255,0.7)] space-y-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-primary-container/80 flex items-center justify-center text-on-primary shadow-[inset_0_1px_2px_rgba(255,255,255,0.5),0_2px_4px_rgba(39,24,20,0.3)]">
                <span className="material-symbols-outlined text-[22px]">menu_book</span>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-widest">
                  Docket Volume III
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Daily Culinary Journal</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase tracking-wider">
                Entries Logged: {meals.length} Courses
              </span>
            </div>
          </div>

          {/* Meal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-lg bg-surface-container-lowest p-5 shadow-[0_3px_8px_rgba(39,24,20,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] flex flex-col justify-between relative overflow-hidden group"
              >
                {/* AI Verified Ribbon if present */}
                {meal.isAiVerified && (
                  <div className="absolute -right-9 top-4 bg-secondary text-on-secondary px-8 py-0.5 text-[9px] font-bold uppercase tracking-wider transform rotate-45 shadow-[0_2px_4px_rgba(0,0,0,0.3)] flex items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[10px]">verified</span>
                    <span>AI Verified</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 pr-2">
                  <div className="flex gap-3.5">
                    <img
                      className="w-20 h-20 rounded-lg object-cover shadow-[0_2px_5px_rgba(39,24,20,0.2)] shrink-0"
                      src={meal.imageUrl}
                      alt={meal.imageAlt || meal.title}
                    />
                    <div>
                      <span className="font-label-sm text-label-sm text-surface-tint uppercase font-bold tracking-wider">
                        {meal.categoryLabel} • {meal.time}
                      </span>
                      <h4 className="font-title-lg text-title-lg text-on-surface font-bold">{meal.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{meal.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 bg-surface-container-low px-2.5 py-1 rounded shadow-[inset_0_1px_2px_rgba(39,24,20,0.15)]">
                    <span className="font-title-lg text-title-lg font-bold text-primary">{meal.calories}</span>
                    <span className="text-[10px] block text-on-surface-variant font-bold uppercase">kcal</span>
                  </div>
                </div>

                {/* Macro Pills & Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      P: {meal.protein}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      C: {meal.carbs}g
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold">
                      F: {meal.fats}g
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playMechanicalClick();
                      onEditMeal(meal);
                    }}
                    className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-[0_1px_2px_rgba(39,24,20,0.15)] active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {meal.isAiVerified ? 'tune' : 'edit'}
                    </span>
                    <span>{meal.isAiVerified ? 'Optical Log' : 'Refine'}</span>
                  </button>
                </div>
              </div>
            ))}

            {/* DINNER SLOT (PENDING ALLOCATION) */}
            <div className="rounded-lg bg-surface-container-low p-5 shadow-[inset_0_2px_4px_rgba(39,24,20,0.12)] flex flex-col justify-between border border-dashed border-outline-variant/80">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3.5 items-center">
                  <div className="w-20 h-20 rounded-lg bg-surface-container-high flex items-center justify-center shadow-[inset_0_2px_4px_rgba(39,24,20,0.15)] shrink-0">
                    <span className="material-symbols-outlined text-outline text-[32px]">dinner_dining</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline uppercase font-bold tracking-wider">
                      Evening Course • Awaiting Dispatch
                    </span>
                    <h4 className="font-title-lg text-title-lg text-on-surface font-bold">Evening Entrée Reservation</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      {remainingCalories} kcal remaining within configured daily energy ceiling.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 bg-surface-container-lowest px-2.5 py-1 rounded shadow-[0_1px_3px_rgba(39,24,20,0.15)]">
                  <span className="font-title-lg text-title-lg font-bold text-secondary">{remainingCalories}</span>
                  <span className="text-[10px] block text-on-surface-variant font-bold uppercase">avail</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/30">
                <span className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Recommend: High protein with leafy greens
                </span>
                <button
                  onClick={() => {
                    playMechanicalClick();
                    onNavigate('ai-food-scanner');
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-[0_3px_6px_rgba(113,68,54,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] active:translate-y-0.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Log Dinner Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Text / Barcode Entry Tray */}
          <form
            onSubmit={handleQuickAdd}
            className="w-full bg-surface-container-lowest rounded-lg p-3.5 shadow-[inset_0_2px_4px_rgba(39,24,20,0.08)] flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <span className="material-symbols-outlined text-outline">search</span>
              <input
                className="bg-transparent text-on-surface placeholder:text-outline/70 font-body-md text-body-md focus:outline-none w-full"
                placeholder="Type dish name, ingredient, or barcode serial number..."
                type="text"
                value={quickDishName}
                onChange={(e) => setQuickDishName(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-20 px-2 py-1 rounded bg-surface-container-low text-on-surface text-xs font-mono border border-outline-variant/60 focus:outline-none"
                placeholder="kcal"
                value={quickDishCalories}
                onChange={(e) => setQuickDishCalories(e.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  playMechanicalClick();
                  onNavigate('ai-food-scanner');
                }}
                className="px-3 py-1.5 rounded bg-surface-container-high text-on-surface font-label-md text-label-md font-bold flex items-center gap-1.5 shadow-[0_2px_4px_rgba(39,24,20,0.15)] active:translate-y-0.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">barcode_scanner</span>
                <span>Scan Barcode</span>
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded bg-surface-tint text-on-primary font-label-md text-label-md font-bold shadow-[0_2px_5px_rgba(131,82,68,0.35)] active:translate-y-0.5 transition-all cursor-pointer"
              >
                Enter Record
              </button>
            </div>
          </form>
        </div>

        {/* WALNUT PLAQUE: MILESTONES & DISCIPLINE STREAK PANEL */}
        <div className="w-full rounded-xl bg-gradient-to-b from-[#3a2722] via-[#2f1f1b] to-[#251815] p-6 shadow-[0_12px_28px_rgba(39,24,20,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] text-inverse-on-surface relative overflow-hidden">
          {/* Plaque Brass Fasteners */}
          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.7)] flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-[#5a4205]"></div>
          </div>
          <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.7)] flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-[#5a4205]"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="font-label-sm text-label-sm text-[#fae092] uppercase font-bold tracking-widest">
                Master Horologist Merit Registry
              </span>
              <h3 className="font-headline-sm text-headline-sm text-inverse-on-surface">Habit Discipline &amp; Physical Honors</h3>
              <p className="font-body-sm text-body-sm text-outline-variant max-w-md">
                Consistent mechanical entries produce reliable kinetic wellness feedback.
              </p>
            </div>

            {/* Stamped Brass Medallions */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Medal 1: 14-Day Streak */}
              <div className="flex items-center gap-3 bg-[#44302a] px-4 py-2.5 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.3)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffe082] via-[#b8860b] to-[#795548] p-1 shadow-[0_3px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-[#3e2c28] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <span className="font-headline-sm text-headline-sm text-[#ffe082] font-bold">14</span>
                  </div>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-[#ffe082] uppercase font-bold tracking-wider block">
                    Consecutive Run
                  </span>
                  <span className="font-title-md text-title-md text-inverse-on-surface font-semibold">14-Day Streak</span>
                </div>
              </div>

              {/* Medal 2: Hydration Target */}
              <div className="flex items-center gap-3 bg-[#44302a] px-4 py-2.5 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.3)]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#90cdff] via-[#006da3] to-[#002b44] p-1 shadow-[0_3px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-[#1e2d36] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                    <span className="material-symbols-outlined text-[#90cdff] text-[20px]">water_drop</span>
                  </div>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-[#90cdff] uppercase font-bold tracking-wider block">
                    Fluid Equilibrium
                  </span>
                  <span className="font-title-md text-title-md text-inverse-on-surface font-semibold">Optimal Hydration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
