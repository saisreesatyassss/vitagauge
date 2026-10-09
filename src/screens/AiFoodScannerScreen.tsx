import React, { useState, useRef } from 'react';
import { MealItem } from '../types.ts';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface AiFoodScannerScreenProps {
  onLogMeal: (meal: Omit<MealItem, 'id'>) => void;
}

interface ScanPreset {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  matchPercent: number;
  timeStr: string;
  imageUrl: string;
  pins: {
    name: string;
    detail: string;
    top: string;
    left: string;
    icon: string;
    color: string;
  }[];
}

const PRESETS: ScanPreset[] = [
  {
    id: 'avocado-eggs',
    name: 'Artisan Poached Eggs & Avocado Toast',
    calories: 445,
    protein: 16,
    carbs: 34,
    fats: 18,
    fiber: 7.2,
    sodium: 380,
    matchPercent: 98,
    timeStr: 'Today 08:42',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVIOv1z8GC8WSuWuZUlmWUb2YjmJrWOvjLlRwEGxB6rw6u9oLqFyaBMr3EgM65XGlU9nVFbOrkXueWq2ycEmiPT7s3hdZ9aV-6p84uKphT63sBOSTJWVGrqz89J6_CDDz3PPWB1KGuh4RMfUurx9U5vbXeWXsj6bAEG73K-NjLS0IDxJma9C3yTTZaDb923Srvoz-sJYAFQpHkig0m0HT4NsnpIeCUzVeWMmBzKf5x7kITbHBZ-HEvEw',
    pins: [
      {
        name: '2x Poached Farm Eggs',
        detail: '144 kcal • 12g Protein',
        top: '28%',
        left: '46%',
        icon: 'egg_alt',
        color: 'border-secondary',
      },
      {
        name: 'Artisan Sourdough Toast',
        detail: '160 kcal • 32g Carbs',
        top: '64%',
        left: '32%',
        icon: 'bakery_dining',
        color: 'border-primary',
      },
      {
        name: 'Fresh Hass Avocado 60g',
        detail: '96 kcal • 9g Good Fats',
        top: '62%',
        left: '72%',
        icon: 'nutrition',
        color: 'border-secondary',
      },
      {
        name: 'Microgreens & Olive Oil',
        detail: '45 kcal • Antioxidants',
        top: '22%',
        left: '70%',
        icon: 'eco',
        color: 'border-tertiary',
      },
    ],
  },
  {
    id: 'acai-bowl',
    name: 'Wild Acai Smoothie Bowl',
    calories: 360,
    protein: 9,
    carbs: 62,
    fats: 8,
    fiber: 9.4,
    sodium: 120,
    matchPercent: 99,
    timeStr: 'Yesterday 08:15',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvm5kBdKBFuiDSVwJgd_AN9sXDjnTjkREVHpnVkFvUPoaXdsBAUtEzelljFHoKrb2_CLOUsfsXME9sDBo7_I_n_YdixiD-9scwmNgadaCb1L5Ab5F_kxzliQoUG7F2LSG4kp_XRmI1BDfICjfkoECIj2ikD_AnfU7WbVLdGvTXo1UEX_E6Jv8nwGp_yfqEFPKj4lJdjQ1mEgtwLwrLyy2JnU-wXub9uRO91oLIhzC6zsN0LHw359RdEQ',
    pins: [
      {
        name: 'Pure Acai & Berry Base',
        detail: '190 kcal • Anthocyanins',
        top: '50%',
        left: '50%',
        icon: 'spa',
        color: 'border-primary',
      },
      {
        name: 'Organic Banana Slices',
        detail: '90 kcal • Potassium',
        top: '35%',
        left: '35%',
        icon: 'restaurant',
        color: 'border-secondary',
      },
      {
        name: 'Toasted Granola & Chia',
        detail: '80 kcal • Healthy Fats',
        top: '40%',
        left: '68%',
        icon: 'grain',
        color: 'border-tertiary',
      },
    ],
  },
  {
    id: 'salmon-asparagus',
    name: 'Atlantic Salmon & Asparagus',
    calories: 520,
    protein: 44,
    carbs: 14,
    fats: 32,
    fiber: 5.1,
    sodium: 460,
    matchPercent: 97,
    timeStr: 'Yesterday 19:30',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr4RCKyAIoZgv3icgikqLGfDElePhWzl12rlHBYPM8KAJGIwfH0yEINsps4yO97AbPgPGOh9xNvHzZlgXZtDARdy6VT0yzgqB3eRuXTf0ofTkUnn_Hod0ra51bhaO6Bon_1ys7TMKofC3Niq2frIcvKIw6sK3A3yGTKfNWMAtFXnFXASncH1ecutv1w38sZNWBwmQ5SdraKcpZR5Al7JzpYisdJcCfL7cSPKguLTgXEYVxev_M6WGj0A',
    pins: [
      {
        name: 'Wild Atlantic Salmon Fillet',
        detail: '360 kcal • Omega-3 & Protein',
        top: '40%',
        left: '52%',
        icon: 'set_meal',
        color: 'border-primary',
      },
      {
        name: 'Charred Asparagus Spears',
        detail: '60 kcal • Folate & Fiber',
        top: '68%',
        left: '55%',
        icon: 'psychiatry',
        color: 'border-secondary',
      },
      {
        name: 'Lemon Herb Emulsion',
        detail: '100 kcal • EVOO',
        top: '25%',
        left: '65%',
        icon: 'liquor',
        color: 'border-tertiary',
      },
    ],
  },
  {
    id: 'quinoa-bowl',
    name: 'Mediterranean Quinoa Nourish Bowl',
    calories: 485,
    protein: 21,
    carbs: 58,
    fats: 19,
    fiber: 11.2,
    sodium: 520,
    matchPercent: 95,
    timeStr: 'Oct 24 13:10',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqHWALeQaMsWX_Rd-FKbLE8k87dClLE8DQNsfbB_6qigwZrsGRs8O7CS8N44TxurXa4vWOC13DL7B2BsQFNDFTsBGOozbvez7Yq6Mwmu4p11ihLb5wp3zDLJ-BxsN1ON1EYgbIvoGfYLLz3P2i9qSv_55o5MG3aXdzpm9JSsbconPSpRgXZeRwktCGlP529qmKYisVO_OTiIxB89iIKcNcdDmmUonTeITrc7xKvRbNxdjYflz1LEDoPw',
    pins: [
      {
        name: 'Tricolor Fluffy Quinoa',
        detail: '220 kcal • Complex Carbs',
        top: '45%',
        left: '42%',
        icon: 'grain',
        color: 'border-primary',
      },
      {
        name: 'Kalamata Olives & Feta',
        detail: '145 kcal • Healthy Lipids',
        top: '55%',
        left: '65%',
        icon: 'lunch_dining',
        color: 'border-secondary',
      },
      {
        name: 'Cucumber & Heirloom Tom.',
        detail: '40 kcal • Hydration & Fiber',
        top: '30%',
        left: '60%',
        icon: 'eco',
        color: 'border-tertiary',
      },
    ],
  },
];

export const AiFoodScannerScreen: React.FC<AiFoodScannerScreenProps> = ({ onLogMeal }) => {
  const [currentPreset, setCurrentPreset] = useState<ScanPreset>(PRESETS[0]);
  const [portionFactor, setPortionFactor] = useState<number>(1.0);
  const [mealCategory, setMealCategory] = useState<'morning' | 'midday' | 'evening' | 'snack'>('morning');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [confirmStatus, setConfirmStatus] = useState<'idle' | 'logging' | 'done'>('idle');
  const [zoomLevel, setZoomLevel] = useState<number>(1.4);
  const [illumination, setIllumination] = useState<number>(90);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculatedCalories = Math.round(currentPreset.calories * portionFactor);
  const calculatedProtein = Math.round(currentPreset.protein * portionFactor);
  const calculatedCarbs = Math.round(currentPreset.carbs * portionFactor);
  const calculatedFats = Math.round(currentPreset.fats * portionFactor);
  const calculatedFiber = (currentPreset.fiber * portionFactor).toFixed(1);
  const calculatedSodium = Math.round(currentPreset.sodium * portionFactor);

  const handleRescan = () => {
    playMechanicalClick();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      playBrassChime();
    }, 1200);
  };

  const handleConfirmLog = () => {
    playMechanicalClick();
    setConfirmStatus('logging');
    setTimeout(() => {
      onLogMeal({
        category: mealCategory,
        categoryLabel:
          mealCategory === 'morning'
            ? 'Morning Nourishment'
            : mealCategory === 'midday'
            ? 'Midday Sustenance'
            : mealCategory === 'evening'
            ? 'Evening Course'
            : 'Afternoon Refresh',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: currentPreset.name,
        description: `Optical Spectrometry verified plate (${portionFactor}x portion).`,
        calories: calculatedCalories,
        protein: calculatedProtein,
        carbs: calculatedCarbs,
        fats: calculatedFats,
        sodiumMg: calculatedSodium,
        fiberG: parseFloat(calculatedFiber),
        imageUrl: currentPreset.imageUrl,
        imageAlt: currentPreset.name,
        isAiVerified: true,
      });
      playBrassChime();
      setConfirmStatus('done');
      setTimeout(() => {
        setConfirmStatus('idle');
      }, 2500);
    }, 850);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playMechanicalClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        // Construct new scanned preset with realistic optical metrics
        const newPreset: ScanPreset = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Custom Optical Plate',
          calories: 490,
          protein: 26,
          carbs: 48,
          fats: 20,
          fiber: 6.5,
          sodium: 410,
          matchPercent: 96,
          timeStr: 'Just now',
          imageUrl: dataUrl,
          pins: [
            {
              name: 'Detected Primary Dish',
              detail: 'Estimated 490 kcal • Whole Food',
              top: '45%',
              left: '50%',
              icon: 'restaurant',
              color: 'border-secondary',
            },
            {
              name: 'Spectral Volumetric Analysis',
              detail: 'Volumetric Confidence ±4%',
              top: '30%',
              left: '65%',
              icon: 'center_focus_strong',
              color: 'border-primary',
            },
          ],
        };
        setCurrentPreset(newPreset);
        handleRescan();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="px-4 py-6 md:px-8 lg:px-12 flex flex-col gap-10">
        {/* Top Station Header & Mode Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_#376847]"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                Optical Spectrometry Rig MK-IV • Calibrated
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              AI Food Scanner &amp; Optical Telemetry
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Direct physical lens projection with multi-spectrum macro decomposition. Align your plate within the optical aperture for real-time volumetric analysis.
            </p>
          </div>

          {/* Quick Stats Brass Meter Block */}
          <div className="flex items-center gap-4 bg-surface-container-high px-5 py-3 rounded-xl shadow-[inset_0_2px_4px_rgba(39,24,20,0.15),0_2px_4px_rgba(255,255,255,0.7)]">
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                Aperture Sensor
              </span>
              <span className="font-label-lg text-label-lg font-bold text-on-surface">50mm F/1.8 Macro</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/60"></div>
            <div className="flex flex-col text-right">
              <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                Processing Latency
              </span>
              <span className="font-label-lg text-label-lg font-bold text-secondary">184 ms</span>
            </div>
            <div className="w-px h-8 bg-outline-variant/60"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRescan}
                title="Recalibrate Sensor"
                className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary hover:text-on-surface shadow-[0_2px_5px_rgba(39,24,20,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo / File"
                className="w-10 h-10 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary hover:text-on-surface shadow-[0_2px_5px_rgba(39,24,20,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">photo_library</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>

        {/* Main Dual Console: Camera Terminal (Left) & Telemetry Receipt (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: Tactile Leather & Brass Camera Terminal (7 Columns) */}
          <div className="xl:col-span-7 flex flex-col gap-5 bg-surface-container-low p-5 md:p-7 rounded-xl shadow-[0_12px_32px_rgba(39,24,20,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] relative">
            {/* Corner Mechanical Screws */}
            <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-outline-variant shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1 h-0.5 bg-on-surface-variant"></div>
            </div>
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-outline-variant shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1 h-0.5 bg-on-surface-variant rotate-45"></div>
            </div>
            <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-outline-variant shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1 h-0.5 bg-on-surface-variant -rotate-45"></div>
            </div>
            <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-outline-variant shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
              <div className="w-1 h-0.5 bg-on-surface-variant rotate-90"></div>
            </div>

            {/* Camera Terminal Toolbar */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-error animate-pulse shadow-[0_0_8px_#ba1a1a]"></span>
                <span className="font-label-md text-label-md uppercase tracking-wider font-bold text-on-surface">
                  LIVE SPECTRAL FEED // SCAN ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                  GRID: RETICLE 4x4
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest font-label-sm text-label-sm text-primary font-bold shadow-[inset_0_1px_2px_rgba(39,24,20,0.2)]">
                  HDR PROJ
                </span>
              </div>
            </div>

            {/* Heavy Viewport Housing */}
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-inverse-surface shadow-[inset_0_4px_16px_rgba(0,0,0,0.8),0_2px_4px_rgba(255,255,255,0.7)] group">
              {/* Food Photo Canvas */}
              <img
                className="w-full h-full object-cover select-none transition-transform duration-500"
                style={{ transform: `scale(${zoomLevel > 1 ? 1 + (zoomLevel - 1) * 0.15 : 1})` }}
                src={currentPreset.imageUrl}
                alt={currentPreset.name}
              />

              {/* Laser Scanning Effect */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce"></div>
                  <div className="absolute inset-0 bg-cyan-500/10"></div>
                </div>
              )}

              {/* Lens Reflection Curvature & Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-inverse-surface/60 via-transparent to-surface-tint/20 pointer-events-none"></div>
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none"></div>
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent pointer-events-none blur-sm transform -rotate-12"></div>

              {/* Reticle & Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-white/60"></div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/50 backdrop-blur text-white font-label-sm text-label-sm uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                    <span>VOLUMETRIC RECONSTRUCTION</span>
                  </div>
                  <div className="w-8 h-8 border-t-2 border-r-2 border-white/60"></div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-8 h-8 border-b-2 border-l-2 border-white/60"></div>
                  <div className="font-body-sm text-body-sm text-white/80 font-mono tracking-widest bg-black/40 px-2 py-0.5 rounded">
                    F/2.8 • 1/120s • ISO 200 • 5200K
                  </div>
                  <div className="w-8 h-8 border-b-2 border-r-2 border-white/60"></div>
                </div>
              </div>

              {/* Central Crosshair Ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#b9efc5]"></div>
                </div>
              </div>

              {/* AI Pins with Telemetry Callouts */}
              {currentPreset.pins.map((pin, idx) => (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin z-20"
                  style={{ top: pin.top, left: pin.left }}
                  onClick={() => {
                    playMechanicalClick();
                  }}
                >
                  <div className="relative flex items-center">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-b from-primary-fixed to-primary-container p-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.8)] flex items-center justify-center transition-transform hover:scale-110">
                      <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_6px_#b6edc2]"></div>
                    </div>
                    <div className={`ml-2 bg-inverse-surface/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-xl text-left border-l-2 ${pin.color} flex flex-col whitespace-nowrap transition-transform group-hover/pin:scale-105`}>
                      <span className="font-label-sm text-label-sm font-bold text-inverse-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          {pin.icon}
                        </span>
                        {pin.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-surface-variant font-medium">
                        {pin.detail}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Knobs Deck */}
            <div className="bg-surface-container p-4 rounded-xl shadow-[inset_0_2px_4px_rgba(39,24,20,0.15)] flex flex-wrap items-center justify-between gap-4">
              {/* Zoom Dial */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => {
                  playMechanicalClick();
                  setZoomLevel((prev) => (prev >= 2 ? 1.0 : Number((prev + 0.3).toFixed(1))));
                }}
              >
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-surface-variant to-primary-container p-1 shadow-[0_4px_8px_rgba(39,24,20,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:rotate-12 transition-transform">
                  <div className="w-full h-full rounded-full bg-surface-container-high shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] flex items-center justify-center relative">
                    <div
                      className="w-1 h-3 bg-primary rounded-full absolute top-1 transition-transform"
                      style={{ transform: `rotate(${(zoomLevel - 1) * 90}deg)` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Optical Zoom</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{zoomLevel}x Volumetric</span>
                </div>
              </div>

              {/* Focus Dial */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => {
                  playMechanicalClick();
                  handleRescan();
                }}
              >
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-surface-variant to-primary-container p-1 shadow-[0_4px_8px_rgba(39,24,20,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)] -hover:rotate-12 transition-transform">
                  <div className="w-full h-full rounded-full bg-surface-container-high shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] flex items-center justify-center relative">
                    <div className="w-1 h-3 bg-secondary rounded-full absolute top-1"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Spectra Focus</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Phase Auto (98%)</span>
                </div>
              </div>

              {/* Exposure / ISO Dial */}
              <div
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => {
                  playMechanicalClick();
                  setIllumination((prev) => (prev >= 120 ? 60 : prev + 15));
                }}
              >
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-surface-variant to-primary-container p-1 shadow-[0_4px_8px_rgba(39,24,20,0.3),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:rotate-45 transition-transform">
                  <div className="w-full h-full rounded-full bg-surface-container-high shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] flex items-center justify-center relative">
                    <div className="w-1 h-3 bg-tertiary rounded-full absolute top-1"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface">Illumination</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Warm Tungsten {illumination}</span>
                </div>
              </div>

              {/* Rescan Trigger Button */}
              <button
                onClick={handleRescan}
                id="rescan-btn"
                className="px-5 py-2.5 rounded-lg bg-surface-container-lowest font-title-md text-title-md text-primary font-bold shadow-[0_3px_8px_rgba(39,24,20,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-surface-container-low active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-[18px] ${isScanning ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Rescan Plate</span>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Skeuomorphic Parchment Receipt & Telemetry (5 Columns) */}
          <div className="xl:col-span-5 flex flex-col relative">
            {/* Brass Binder Clip */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
              <div className="w-14 h-4 bg-gradient-to-r from-surface-tint via-primary-fixed to-surface-tint rounded-t-sm shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)]"></div>
              <div className="w-20 h-3 bg-gradient-to-b from-primary to-inverse-surface rounded-b-md shadow-md"></div>
              <div className="w-8 h-8 rounded-full border-2 border-primary-fixed/80 -mt-5 bg-transparent shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></div>
            </div>

            {/* Vintage Cotton Parchment Paper Ticket */}
            <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-[0_16px_36px_rgba(39,24,20,0.22),0_2px_6px_rgba(39,24,20,0.1)] pt-8 flex flex-col gap-6 relative">
              {/* Ticket Header */}
              <div className="flex flex-col text-center border-b border-dashed border-outline-variant/80 pb-4 gap-1">
                <div className="flex items-center justify-between text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
                  <span>INST: MK-IV-OPT</span>
                  <span>STATION 04</span>
                  <span>TIME: 08:42:15</span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary tracking-tight font-bold drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                  AI NUTRITION TELEMETRY
                </span>
                <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase font-semibold">
                  Optical Scan Analysis Batch #8492
                </span>
              </div>

              {/* Stamped Big Calorie Display */}
              <div className="flex items-center justify-between bg-surface-container-low p-4 rounded-xl shadow-[inset_0_2px_5px_rgba(39,24,20,0.12),0_1px_0_rgba(255,255,255,0.9)]">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                    Total Energetic Yield
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary font-medium">
                    Volumetric Confidence ±4%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    id="calorie-stamp"
                    className="font-display-lg text-display-lg font-extrabold text-primary tracking-tight drop-shadow-[0_1px_0_rgba(255,255,255,1)]"
                  >
                    {calculatedCalories}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant font-bold">kcal</span>
                </div>
              </div>

              {/* Analog Glass Tube Confidence Meter */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-label-md text-label-md font-bold text-on-surface uppercase tracking-wider">
                    Aperture Confidence
                  </span>
                  <span className="font-label-md text-label-md font-bold text-secondary">
                    {currentPreset.matchPercent}% OPTICAL MATCH
                  </span>
                </div>
                <div className="relative h-6 w-full rounded-full bg-surface-container-highest p-1 shadow-[inset_0_2px_5px_rgba(39,24,20,0.4),0_1px_2px_rgba(255,255,255,0.8)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-container transition-all duration-500 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_0_8px_#376847]"
                    style={{ width: `${currentPreset.matchPercent}%` }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none rounded-full"></div>
                </div>
              </div>

              {/* Macro Breakdown Meters */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between pb-1 border-b border-outline-variant/40">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant">
                    Macronutrient Profile
                  </span>
                  <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
                    Grams / Daily Target
                  </span>
                </div>
                {/* Protein */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-primary shadow-sm"></span>
                    <span className="font-title-md text-title-md font-semibold text-on-surface">Protein</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2.5 rounded-full bg-surface-container-high overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((calculatedProtein / 140) * 100))}%` }}
                      ></div>
                    </div>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface w-12 text-right">
                      {calculatedProtein}g
                    </span>
                  </div>
                </div>
                {/* Carbs */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-surface-tint shadow-sm"></span>
                    <span className="font-title-md text-title-md font-semibold text-on-surface">Carbohydrates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2.5 rounded-full bg-surface-container-high overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                      <div
                        className="h-full bg-surface-tint rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((calculatedCarbs / 220) * 100))}%` }}
                      ></div>
                    </div>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface w-12 text-right">
                      {calculatedCarbs}g
                    </span>
                  </div>
                </div>
                {/* Fats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-secondary shadow-sm"></span>
                    <span className="font-title-md text-title-md font-semibold text-on-surface">Healthy Fats</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2.5 rounded-full bg-surface-container-high overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.round((calculatedFats / 65) * 100))}%` }}
                      ></div>
                    </div>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface w-12 text-right">
                      {calculatedFats}g
                    </span>
                  </div>
                </div>

                {/* Dietary Fiber & Sodium Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between shadow-[inset_0_1px_2px_rgba(39,24,20,0.1)]">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      Dietary Fiber
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{calculatedFiber} g</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between shadow-[inset_0_1px_2px_rgba(39,24,20,0.1)]">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      Sodium
                    </span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{calculatedSodium} mg</span>
                  </div>
                </div>
              </div>

              {/* Tactile Rotary Portion Knob */}
              <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-outline-variant/80">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase font-bold text-on-surface tracking-wider">
                    Portion Scale Detent
                  </span>
                  <span className="font-label-lg text-label-lg font-bold text-primary">
                    {portionFactor === 1.0 ? '1.0x (Standard Serving)' : `${portionFactor}x (Scaled Portion)`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 bg-surface-container-high p-1.5 rounded-xl shadow-[inset_0_2px_4px_rgba(39,24,20,0.15)]">
                  {[0.5, 1.0, 1.5, 2.0].map((factor) => (
                    <button
                      key={factor}
                      onClick={() => {
                        playMechanicalClick();
                        setPortionFactor(factor);
                      }}
                      className={`py-1.5 rounded-lg font-label-md text-label-md font-bold transition-all cursor-pointer ${
                        portionFactor === factor
                          ? 'bg-primary-container text-on-primary-container shadow-[inset_0_2px_4px_rgba(39,24,20,0.3)]'
                          : 'text-on-surface-variant hover:text-on-surface bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                      }`}
                    >
                      {factor}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Category Assignment */}
              <div className="flex flex-col gap-2">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
                  Log Category Assignment
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { key: 'morning', label: 'Morning', icon: 'wb_sunny' },
                    { key: 'midday', label: 'Midday', icon: 'lunch_dining' },
                    { key: 'evening', label: 'Evening', icon: 'dark_mode' },
                    { key: 'snack', label: 'Snack', icon: 'cookie' },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        playMechanicalClick();
                        setMealCategory(cat.key as 'morning' | 'midday' | 'evening' | 'snack');
                      }}
                      className={`py-1.5 px-2 rounded-lg font-label-sm text-label-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        mealCategory === cat.key
                          ? 'bg-secondary text-on-secondary shadow-[0_2px_4px_rgba(39,24,20,0.2)]'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface shadow-[0_1px_2px_rgba(0,0,0,0.1)]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Tactile Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={handleConfirmLog}
                  disabled={confirmStatus !== 'idle'}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-b from-secondary to-[#285034] text-on-secondary font-title-lg text-title-lg font-bold shadow-[0_6px_16px_rgba(55,104,71,0.4),inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_0_#1e3d27] active:translate-y-1 active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                  {confirmStatus === 'idle' && (
                    <>
                      <span className="material-symbols-outlined text-[22px]">check_circle</span>
                      <span>Confirm &amp; Log to Diary</span>
                    </>
                  )}
                  {confirmStatus === 'logging' && (
                    <>
                      <span className="material-symbols-outlined text-[22px] animate-spin">progress_activity</span>
                      <span>Inscribing to Journal...</span>
                    </>
                  )}
                  {confirmStatus === 'done' && (
                    <>
                      <span className="material-symbols-outlined text-[22px]">verified</span>
                      <span>Entry Recorded in Diary!</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      playMechanicalClick();
                      const newDish = prompt('Refine dish title:', currentPreset.name);
                      if (newDish) {
                        setCurrentPreset((p) => ({ ...p, name: newDish }));
                      }
                    }}
                    className="py-2 px-3 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg font-semibold hover:bg-surface-container-high shadow-[0_2px_4px_rgba(39,24,20,0.15)] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit_note</span>
                    <span>Edit Items</span>
                  </button>
                  <button
                    onClick={() => {
                      playMechanicalClick();
                      setPortionFactor(1.0);
                      setCurrentPreset(PRESETS[0]);
                    }}
                    className="py-2 px-3 rounded-lg bg-surface-container text-error font-label-lg text-label-lg font-semibold hover:bg-error-container shadow-[0_2px_4px_rgba(39,24,20,0.15)] active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>Discard Scan</span>
                  </button>
                </div>
              </div>

              {/* Perforated Edge */}
              <div className="w-full flex justify-between items-center opacity-40 px-2">
                <span className="text-[10px] tracking-widest text-outline">
                  ----------------------------------------------------
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GALLERY: Recent AI Scans Strip (Polaroids) */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">history_toggle_off</span>
              <h2 className="font-title-lg text-title-lg text-on-surface font-bold">
                Recent Chronological Optical Scans
              </h2>
            </div>
            <span className="font-label-md text-label-md text-primary font-bold flex items-center gap-1 cursor-default">
              <span>Calibrated Plates ({PRESETS.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  playMechanicalClick();
                  setCurrentPreset(preset);
                  setPortionFactor(1.0);
                  handleRescan();
                }}
                className={`bg-surface-container-lowest p-3 rounded-lg shadow-[0_6px_14px_rgba(39,24,20,0.18),0_1px_3px_rgba(0,0,0,0.1)] flex flex-col gap-2.5 transform hover:-translate-y-1 transition-all cursor-pointer ${
                  currentPreset.id === preset.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="relative w-full aspect-square rounded bg-inverse-surface overflow-hidden">
                  <img className="w-full h-full object-cover" src={preset.imageUrl} alt={preset.name} />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white font-label-sm text-label-sm font-bold">
                    {preset.matchPercent}% MATCH
                  </span>
                </div>
                <div className="flex flex-col px-1 pb-1">
                  <span className="font-title-md text-title-md font-bold text-on-surface leading-tight truncate">
                    {preset.name}
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                      {preset.timeStr}
                    </span>
                    <span className="font-label-md text-label-md font-bold text-primary">
                      {preset.calories} kcal
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Mount New Aperture (Upload / Capture) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-surface-container-low p-4 rounded-lg shadow-[inset_0_2px_4px_rgba(39,24,20,0.12)] flex flex-col items-center justify-center text-center gap-3 border-2 border-dashed border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary shadow-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[26px]">add_a_photo</span>
              </div>
              <div className="flex flex-col">
                <span className="font-title-md text-title-md font-bold text-on-surface">Mount New Aperture</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Drop RAW or JPEG meal snapshot
                </span>
              </div>
              <span className="px-3 py-1 rounded bg-surface-container-highest font-label-sm text-label-sm font-bold text-primary">
                SELECT FILE
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
