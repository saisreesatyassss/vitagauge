import React, { useState } from 'react';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface WeekOption {
  id: string;
  title: string;
  sub: string;
  avgCalories: number;
  totalWaterLiters: number;
  aiFidelity: number;
  weightDelta: string;
  memo: string;
  readinessScore: number;
}

const WEEKS_DATA: WeekOption[] = [
  {
    id: 'w40',
    title: 'Week 40 • Sep 30 – Oct 06',
    sub: 'Calibrated against 2,050 kcal baseline',
    avgCalories: 1910,
    totalWaterLiters: 18.2,
    aiFidelity: 78,
    weightDelta: '-0.6',
    memo: '“Early cycle calibration reflected strong lipid discipline with steady baseline hydration. Metabolic stability maintained through uniform carbohydrate intake.”',
    readinessScore: 92,
  },
  {
    id: 'w41',
    title: 'Week 41 • Oct 07 – Oct 13',
    sub: 'Calibrated against 2,050 kcal baseline',
    avgCalories: 1980,
    totalWaterLiters: 19.0,
    aiFidelity: 81,
    weightDelta: '-0.7',
    memo: '“Consistent midday fluid assimilation prevented late evening glycogen depletion. Micronutrient telemetry indicates exceptional zinc and iron equilibrium.”',
    readinessScore: 94,
  },
  {
    id: 'w42',
    title: 'Week 42 • Oct 14 – Oct 20',
    sub: 'Calibrated against 2,050 kcal baseline',
    avgCalories: 1940,
    totalWaterLiters: 19.5,
    aiFidelity: 85,
    weightDelta: '-0.8',
    memo: '“Hydration remained consistently elevated across all 7 days with zero mid-afternoon lapses. Neural pattern analysis detected a +22% protein intake on post-workout mornings, driving efficient muscular recovery while preserving a controlled caloric deficit without lethargy.”',
    readinessScore: 96,
  },
  {
    id: 'w43',
    title: 'Week 43 • Oct 21 – Oct 27',
    sub: 'Calibrated against 2,050 kcal baseline',
    avgCalories: 1925,
    totalWaterLiters: 20.1,
    aiFidelity: 89,
    weightDelta: '-0.9',
    memo: '“Superior fluid pacing during morning intervals. Fiber intake targets surpassed on 5 out of 7 days with optimal digestion latency metrics.”',
    readinessScore: 97,
  },
];

export const WeeklySummaryScreen: React.FC = () => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(2); // Week 42 default
  const [includeDetails, setIncludeDetails] = useState(true);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'done'>('idle');

  const currentWeek = WEEKS_DATA[currentWeekIndex];

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      playMechanicalClick();
      setCurrentWeekIndex((prev) => prev - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < WEEKS_DATA.length - 1) {
      playMechanicalClick();
      setCurrentWeekIndex((prev) => prev + 1);
    }
  };

  const handleExportCsv = () => {
    playMechanicalClick();
    setExportStatus('exporting');
    setTimeout(() => {
      // Generate actual downloadable CSV
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        'Day,Calories (kcal),Water (L),Protein (g),Carbs (g),Fats (g),AI Scan Verified\n' +
        'Monday,1820,2.4,138,190,62,YES\n' +
        'Tuesday,1990,2.8,144,210,65,YES\n' +
        'Wednesday,2040,3.1,152,215,64,YES\n' +
        'Thursday,1890,2.5,140,195,60,YES\n' +
        'Friday,1960,2.9,146,205,63,YES\n' +
        'Saturday,2180,3.0,158,230,72,YES\n' +
        'Sunday,1700,2.8,135,170,55,YES\n';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `VitaGauge_Chronicle_${currentWeek.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      playBrassChime();
      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 2200);
    }, 700);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* CLIPBOARD BASE PLATE (HEIRLOOM LEATHER + BRASS CORNERS) */}
        <div className="relative rounded-2xl p-4 sm:p-7 md:p-9 bg-gradient-to-b from-primary-container via-primary to-inverse-surface shadow-2xl overflow-hidden">
          {/* Stitched Perimeter Trim Overlay */}
          <div className="absolute inset-2 pointer-events-none rounded-xl border border-dashed border-outline-variant/30 opacity-70"></div>

          {/* Brass Corner Accents */}
          <div className="absolute top-2 left-2 w-7 h-7 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full rounded-tl-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60 shadow-inner"></div>
            </div>
          </div>
          <div className="absolute top-2 right-2 w-7 h-7 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full rounded-tr-lg bg-gradient-to-bl from-amber-200 via-amber-400 to-amber-700 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60 shadow-inner"></div>
            </div>
          </div>
          <div className="absolute bottom-2 left-2 w-7 h-7 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full rounded-bl-lg bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-700 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60 shadow-inner"></div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 w-7 h-7 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full rounded-br-lg bg-gradient-to-tl from-amber-200 via-amber-400 to-amber-700 shadow-md flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-900/60 shadow-inner"></div>
            </div>
          </div>

          {/* MAIN PARCHMENT DECK (Folio Insert) */}
          <div className="relative bg-surface rounded-xl p-5 sm:p-8 md:p-10 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-800/20 via-amber-600/30 to-amber-800/20 shadow-sm"></div>

            {/* FOLIO HEADER & ANALOG ROTARY WEEK SELECTOR */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high shadow-inner flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">auto_stories</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                      Folio Docket № 42-B
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-secondary text-on-secondary shadow-sm">
                      AUDIT VERIFIED
                    </span>
                  </div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">Weekly Balance Chronicle</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Precision biometric records &amp; fluid balance telemetry
                  </p>
                </div>
              </div>

              {/* Rotary Week Selector */}
              <div className="flex items-center gap-3 self-stretch sm:self-auto bg-surface-container-high px-4 py-2.5 rounded-xl shadow-inner">
                <button
                  aria-label="Previous Week"
                  onClick={handlePrevWeek}
                  disabled={currentWeekIndex === 0}
                  className={`w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface hover:text-primary shadow-md active:translate-y-0.5 active:shadow-inner flex items-center justify-center transition-all cursor-pointer ${
                    currentWeekIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <div className="flex items-center gap-3 px-3">
                  {/* Knurled Brass Rotary Dial Knob */}
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 shadow-md flex items-center justify-center p-0.5">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-700 via-amber-400 to-amber-100 flex items-center justify-center shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-surface-container-highest shadow-inner flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                      </div>
                      <div
                        className="absolute top-1 w-0.5 h-1.5 bg-primary-container rounded-full transition-transform"
                        style={{ transform: `rotate(${currentWeekIndex * 45}deg)` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-bold text-on-surface tracking-tight">
                      {currentWeek.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {currentWeek.sub}
                    </span>
                  </div>
                </div>
                <button
                  aria-label="Next Week"
                  onClick={handleNextWeek}
                  disabled={currentWeekIndex === WEEKS_DATA.length - 1}
                  className={`w-9 h-9 rounded-lg bg-surface-container-lowest text-on-surface hover:text-primary shadow-md active:translate-y-0.5 active:shadow-inner flex items-center justify-center transition-all cursor-pointer ${
                    currentWeekIndex === WEEKS_DATA.length - 1 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>

            {/* 4 EXECUTIVE METRIC PLAQUES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 my-6">
              {/* Plaque 1: Average Daily Intake */}
              <div className="relative rounded-xl p-4 bg-surface-container-low shadow-md overflow-hidden flex flex-col justify-between group">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                    Avg Daily Intake
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high shadow-inner">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#376847] animate-pulse"></span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">OPTIMAL</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display-lg text-display-lg text-primary tracking-tight font-headline-lg">
                      {currentWeek.avgCalories.toLocaleString()}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant">kcal/day</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>94% adherence target</span>
                  <span className="font-semibold text-secondary">-110 kcal net</span>
                </div>
              </div>

              {/* Plaque 2: Weekly Hydration Total */}
              <div className="relative rounded-xl p-4 bg-surface-container-low shadow-md overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                    Total Hydration
                  </span>
                  <div className="w-7 h-7 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-base">water_drop</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display-lg text-display-lg text-tertiary tracking-tight font-headline-lg">
                      {currentWeek.totalWaterLiters}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant">Liters</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-tertiary h-full rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>Surpassed goal by 8%</span>
                  <span className="font-semibold text-tertiary">2.78 L/day</span>
                </div>
              </div>

              {/* Plaque 3: AI Scan Fidelity */}
              <div className="relative rounded-xl p-4 bg-surface-container-low shadow-md overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                    AI Scan Fidelity
                  </span>
                  <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-base">photo_camera</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display-lg text-display-lg text-on-surface tracking-tight font-headline-lg">
                      {currentWeek.aiFidelity}%
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant">visual log</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-700"
                      style={{ width: `${currentWeek.aiFidelity}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>23 of 27 meals scanned</span>
                  <span className="font-semibold text-primary">High Accuracy</span>
                </div>
              </div>

              {/* Plaque 4: Weight & Caloric Deficit */}
              <div className="relative rounded-xl p-4 bg-surface-container-low shadow-md overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                    Body Delta Pace
                  </span>
                  <div className="w-7 h-7 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-base">scale</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display-lg text-display-lg text-secondary tracking-tight font-headline-lg">
                      {currentWeek.weightDelta}
                    </span>
                    <span className="font-title-md text-title-md text-on-surface-variant">lbs / wk</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className="bg-secondary h-full rounded-full transition-all duration-700" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                  <span>Estimated deficit 2,800 kcal</span>
                  <span className="font-semibold text-secondary">Controlled</span>
                </div>
              </div>
            </div>

            {/* MAIN DUAL-COLUMN INSTRUMENT CHART (SEISMOGRAPH) */}
            <div className="mt-8 rounded-2xl bg-surface-container p-5 sm:p-7 shadow-lg relative">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                      Galvanometric Seismograph Chart
                    </span>
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Dual-Tube Liquid Metric</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    Caloric &amp; Fluid Daily Dispersion
                  </h2>
                </div>

                {/* Legend Switches */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="w-3.5 h-3.5 rounded-sm bg-primary-container shadow-inner"></span>
                    <span className="font-label-md text-label-md text-on-surface">Calories (Amber Tube)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="w-3.5 h-3.5 rounded-sm bg-tertiary-container shadow-inner"></span>
                    <span className="font-label-md text-label-md text-on-surface">Water (Cyan Tube)</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg shadow-sm">
                    <span className="w-4 h-0.5 bg-outline"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Goal Reference</span>
                  </div>
                </div>
              </div>

              {/* Antique Graph Paper Canvas */}
              <div className="relative mt-4 pt-6 pb-2 px-2 sm:px-6 rounded-xl bg-surface-container-lowest shadow-inner overflow-x-auto">
                {/* Reference Target Lines */}
                <div className="absolute inset-x-4 top-[35%] h-px bg-outline/25 pointer-events-none flex items-center justify-end pr-2">
                  <span className="text-[10px] font-mono text-outline font-bold">2,050 kcal Limit Target</span>
                </div>
                <div className="absolute inset-x-4 top-[55%] h-px bg-tertiary/20 pointer-events-none flex items-center justify-end pr-2">
                  <span className="text-[10px] font-mono text-tertiary font-bold">3.0 L Hydration Goal</span>
                </div>

                {/* Chart Columns Container (Mon - Sun) */}
                <div className="min-w-[580px] grid grid-cols-7 gap-3 sm:gap-6 items-end h-72 pt-8 pb-4">
                  {/* MON */}
                  <div className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '82%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '70%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Mon</span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">1,820 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">2.4 L</div>
                    </div>
                  </div>

                  {/* TUE */}
                  <div className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '91%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '85%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Tue</span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">1,990 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">2.8 L</div>
                    </div>
                  </div>

                  {/* WED (PERFECT BADGE) */}
                  <div className="flex flex-col items-center h-full justify-end relative group">
                    <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-[9px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1 z-10">
                      <span className="material-symbols-outlined text-[11px]">grade</span> Perfect
                    </div>
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1 bg-secondary-container/20 rounded-xl p-1 shadow-inner">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-secondary to-secondary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '94%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '98%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-secondary">Wed</span>
                      <div className="font-label-sm text-label-sm font-bold text-secondary">2,040 kcal</div>
                      <div className="font-label-sm text-label-sm font-bold text-tertiary">3.1 L</div>
                    </div>
                  </div>

                  {/* THU */}
                  <div className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '86%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '75%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Thu</span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">1,890 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">2.5 L</div>
                    </div>
                  </div>

                  {/* FRI */}
                  <div className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '89%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '88%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Fri</span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">1,960 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">2.9 L</div>
                    </div>
                  </div>

                  {/* SAT (PEAK DAY) */}
                  <div className="flex flex-col items-center h-full justify-end relative group">
                    <div className="absolute -top-3 px-2 py-0.5 rounded-full bg-surface-tint text-on-primary font-label-sm text-[9px] uppercase font-bold tracking-wider shadow-sm flex items-center gap-1 z-10">
                      Peak Day
                    </div>
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1 bg-surface-variant/30 rounded-xl p-1 shadow-inner">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary-container to-inverse-primary rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '99%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '90%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Sat</span>
                      <div className="font-label-sm text-label-sm font-semibold text-primary">2,180 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">3.0 L</div>
                    </div>
                  </div>

                  {/* SUN */}
                  <div className="flex flex-col items-center h-full justify-end group">
                    <div className="flex items-end gap-1.5 sm:gap-2 h-52 w-full justify-center px-1">
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-primary to-primary-container rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '77%' }}></div>
                      </div>
                      <div className="w-4 sm:w-6 bg-surface-container-highest rounded-t-full h-full p-0.5 flex flex-col justify-end shadow-inner">
                        <div className="w-full bg-gradient-to-t from-tertiary to-tertiary-fixed-dim rounded-t-full shadow transition-all duration-500 group-hover:brightness-110" style={{ height: '82%' }}></div>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="font-label-md text-label-md font-bold text-on-surface">Sun</span>
                      <div className="font-label-sm text-label-sm text-on-surface-variant">1,700 kcal</div>
                      <div className="font-label-sm text-label-sm text-tertiary">2.8 L</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Footer Ribbon */}
              <div className="mt-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-on-surface-variant font-body-sm text-body-sm gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">verified</span>
                  <span>
                    <strong>Adherence Note:</strong> Wednesday exhibited the highest harmonic ratio between fluid distribution &amp; macro targets.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">Standard Deviation: ±145 kcal</span>
                </div>
              </div>
            </div>

            {/* LOWER BENTO SPLIT: COMPASS DIAL + AI PARCHMENT + RECIPE AUDIT */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* MACRONUTRIENT COMPASS ROSE DIAL (5 COLS) */}
              <div className="lg:col-span-5 rounded-2xl bg-surface-container-high p-5 sm:p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                      Apparatus № 8
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Macro Compass Rose</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-surface-container-lowest shadow-inner flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-lg">explore</span>
                  </div>
                </div>

                {/* Compass Dial Face */}
                <div className="my-6 relative flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-amber-600 via-amber-200 to-amber-700 p-2 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-surface-container-lowest shadow-inner relative flex items-center justify-center p-3">
                      {/* Circular Gauge SVG */}
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeWidth="10"></circle>
                        {/* Carbs 40% */}
                        <circle className="text-primary" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="95.5 238.7" strokeDashoffset="0" strokeWidth="10"></circle>
                        {/* Protein 30% */}
                        <circle className="text-secondary" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="71.6 238.7" strokeDashoffset="-95.5" strokeWidth="10"></circle>
                        {/* Fats 30% */}
                        <circle className="text-tertiary-container" cx="50" cy="50" fill="transparent" r="38" stroke="currentColor" strokeDasharray="71.6 238.7" strokeDashoffset="-167.1" strokeWidth="10"></circle>
                      </svg>

                      {/* Center Brass Rivet & Dial Pointer */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-600 shadow-md flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-inverse-surface shadow-inner"></div>
                        </div>
                        <span className="font-headline-sm text-headline-sm font-bold text-on-surface mt-1">100%</span>
                        <span className="font-label-sm text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">
                          Calibration
                        </span>
                      </div>

                      {/* Compass Cardinal Indicators */}
                      <span className="absolute top-2 font-mono text-[9px] font-bold text-outline">N • PRO</span>
                      <span className="absolute bottom-2 font-mono text-[9px] font-bold text-outline">S • FAT</span>
                      <span className="absolute right-2 font-mono text-[9px] font-bold text-outline">E • CHO</span>
                    </div>
                  </div>
                </div>

                {/* Macro Breakdown Details */}
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2 rounded-lg bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Carbs</span>
                    </div>
                    <div className="font-title-lg text-title-lg font-bold text-primary mt-0.5">40%</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">194 g/d</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Protein</span>
                    </div>
                    <div className="font-title-lg text-title-lg font-bold text-secondary mt-0.5">30%</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">145 g/d</span>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-lowest shadow-sm">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
                      <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Fats</span>
                    </div>
                    <div className="font-title-lg text-title-lg font-bold text-tertiary mt-0.5">30%</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">65 g/d</span>
                  </div>
                </div>
              </div>

              {/* NUTRITIONAL AI NOTES & STAMPED DISPATCH (7 COLS) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Attached Memo */}
                <div className="relative rounded-2xl bg-surface-container-low p-6 shadow-md overflow-hidden flex-1">
                  {/* Brass Clip Graphic at Top Center */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-gradient-to-b from-amber-400 via-amber-200 to-amber-600 rounded-b shadow-md flex items-center justify-center">
                    <div className="w-10 h-1 bg-amber-800/40 rounded-full"></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                      <span className="font-label-md text-label-md uppercase font-bold text-primary tracking-wider">
                        AI Nutritional Intelligence Dispatch
                      </span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant">Timestamp: Sun 23:59 GMT</span>
                  </div>

                  {/* Handwritten Script Box */}
                  <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest shadow-inner relative">
                    <div className="absolute top-2 right-2 opacity-15">
                      <span className="material-symbols-outlined text-6xl text-primary">draw</span>
                    </div>
                    <p className="font-headline-sm text-headline-sm italic text-on-surface leading-relaxed">
                      {currentWeek.memo}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/30 pt-2">
                      <span>Recommendation: Increase evening magnesium-rich whole grains on Fridays.</span>
                      <span className="font-bold text-secondary">
                        Readiness Score: {currentWeek.readinessScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Weekly Meal Audit Visual Snippets */}
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="rounded-xl overflow-hidden shadow-sm relative group bg-surface-container">
                      <img
                        className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmRe4Euzcm7bZ5ZJp_95lvuAFOTYVsRvxU_MnG25ZurzOveTA6X-4QTwGQAhVMWkvtHQ7Zq51Qle-8xOTT9IcpOARdPW9qAZaNyKRGE-8wcFg18ijlRcrrwA90DkGE4YDW2ZMIOkmRfJ4XpnRul8YEMn9hTT9IMRNIU917v8y1AsZThrTWVmGdsBUloSd_u9TenFXX-clqvfvIERibEQRXzTCm_iMm-550fX4MzszAvBy52vD5Mhj_9g"
                        alt="Avocado Poached Egg"
                      />
                      <div className="p-1.5 bg-surface-container-high text-center">
                        <div className="font-label-sm text-label-sm font-bold truncate text-on-surface">
                          Avocado Poached Egg
                        </div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant">420 kcal • Wed</div>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-sm relative group bg-surface-container">
                      <img
                        className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGuY3gSz7H3udM-_dRzPKv3FAeS2zGbMD86Coo8qGOgsyVN257i3d7hVKBauoIEzm_zX3Orq-a5pPB50qC9CK3QvB9mWQggxqsTg44toFsSDepKT9i-V1bbUQYmZ_XV6TZBDAnRPmD8pIy1o0zjFK1r2V2-6R6Yld94_784fJ-IMFLM3fOOVftfPhtwo--fCBG0OddrI-x3WFUaMJJOTHWgKpjps2w3YBJKNTKP6hE_tWXVOU5V0_2eA"
                        alt="Pan-Seared Salmon"
                      />
                      <div className="p-1.5 bg-surface-container-high text-center">
                        <div className="font-label-sm text-label-sm font-bold truncate text-on-surface">
                          Pan-Seared Salmon
                        </div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant">580 kcal • Thu</div>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden shadow-sm relative group bg-surface-container col-span-2 sm:col-span-1">
                      <img
                        className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAv9vU9mBAzuOY5aNQsJx1tpCJcEdHy8j9L0zeMpkyYAX9K_Tv-sWoQ3AIf8U4WWorLtKcNXmeY0r0wPC3DLExMGzzkjJ2KWk_biF19Yxe95Yy12x2RHX7cFS1kYr4srquHqJvhe1X7pBfXEDshHEye3aCK089Xb3Jcc91b_oXlit1BWjGORVDivKUfoBdCFnTgZEXn4C40RIfShkn2NrWC5oyPl6OgfzCVVxR4hftvQg6JbnRH7YS6IA"
                        alt="Berry Almond Bowl"
                      />
                      <div className="p-1.5 bg-surface-container-high text-center">
                        <div className="font-label-sm text-label-sm font-bold truncate text-on-surface">
                          Berry Almond Bowl
                        </div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant">310 kcal • Sat</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPORT & PHYSICAL SUMMARY PRINT CONTROL CONSOLE */}
                <div className="rounded-xl bg-surface-container-high p-4 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Brass Toggle Switch */}
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer" htmlFor="highResToggle">
                      <input
                        checked={includeDetails}
                        onChange={(e) => {
                          playMechanicalClick();
                          setIncludeDetails(e.target.checked);
                        }}
                        className="sr-only peer"
                        id="highResToggle"
                        type="checkbox"
                      />
                      <div className="w-12 h-6 bg-surface-container-highest rounded-full shadow-inner peer-checked:bg-secondary transition-colors duration-200 p-0.5">
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-br from-amber-100 via-amber-300 to-amber-600 shadow-md transform transition-transform duration-200 flex items-center justify-center ${
                            includeDetails ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></div>
                        </div>
                      </div>
                    </label>
                    <div className="flex flex-col">
                      <span className="font-label-md text-label-md font-bold text-on-surface">
                        Include Detailed Meal Logs
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Append micro-nutrient breakdown to export
                      </span>
                    </div>
                  </div>

                  {/* Physical Push Buttons */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={handleExportCsv}
                      disabled={exportStatus !== 'idle'}
                      className="px-4 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface hover:text-primary font-label-lg text-label-lg shadow-md active:translate-y-0.5 active:shadow-inner flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {exportStatus === 'idle' && (
                        <>
                          <span className="material-symbols-outlined text-lg">file_download</span>
                          <span>CSV Ledger</span>
                        </>
                      )}
                      {exportStatus === 'exporting' && (
                        <>
                          <span className="material-symbols-outlined text-lg animate-spin">refresh</span>
                          <span>Exporting...</span>
                        </>
                      )}
                      {exportStatus === 'done' && (
                        <>
                          <span className="material-symbols-outlined text-lg text-secondary">check</span>
                          <span>Ledger Saved!</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        playMechanicalClick();
                        window.print();
                      }}
                      className="px-5 py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg shadow-lg hover:bg-primary-container active:translate-y-0.5 active:shadow-inner flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-lg">print</span>
                      <span>Print Summary</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
