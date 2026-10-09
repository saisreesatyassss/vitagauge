/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenPath, MealItem } from './types.ts';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { DailyLogScreen } from './screens/DailyLogScreen.tsx';
import { AiFoodScannerScreen } from './screens/AiFoodScannerScreen.tsx';
import { HydrationTrackerScreen } from './screens/HydrationTrackerScreen.tsx';
import { WeeklySummaryScreen } from './screens/WeeklySummaryScreen.tsx';
import { GeminiChatScreen } from './screens/GeminiChatScreen.tsx';
import { CalibrationModal } from './components/CalibrationModal.tsx';
import { MealDetailModal } from './components/MealDetailModal.tsx';
import { ChatFab } from './components/ChatFab.tsx';
import { playMechanicalClick, playBrassChime } from './utils/audio.ts';

const INITIAL_MEALS: MealItem[] = [
  {
    id: 'meal-1',
    category: 'morning',
    categoryLabel: 'Morning Nourishment',
    time: '08:15 AM',
    title: 'Steel-Cut Oats & Almond Cream',
    description: 'Organic rolled oats, wild blueberries, raw honey drizzle.',
    calories: 420,
    protein: 18,
    carbs: 56,
    fats: 12,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVzwd2t3caN0jTnfwlv0ZlS6pCrnNtsmtuq0toZ_thY16UqlM9IaHWfhWMepHiQnDRfIO6zu5fmF0Y6uB4Z3HH0Y78vBLWrDrnmOz4to2zNIWSWlKk5on5JJVcCLB9cN7tgG9iZ_e7D5TH9wJAywoKddPnvixcxzu9MzLEoY5ErjBdXpRt3Mc0Hl0encgArEmMT_UkKnUQFEW2NzM0VyIuhoPyLBW_hg1JeyMDJGdXIKr4aPAr_gMfrg',
    imageAlt: 'Rustic stoneware bowl containing hot steel-cut oatmeal topped with fresh berries',
  },
  {
    id: 'meal-2',
    category: 'midday',
    categoryLabel: 'Midday Sustenance',
    time: '01:05 PM',
    title: 'Wild Salmon & Quinoa Pilaf',
    description: 'Pan-seared salmon, tri-color quinoa, charred greens.',
    calories: 680,
    protein: 46,
    carbs: 52,
    fats: 24,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvsIpGkp1VjTTYeTtc7jigxsLX5Wnra2MLuZkuNX2_mejbgCLRbSZ9-aOSE9zfhUVfOK97b3FbO50vaVHfz24wqLHC3N4kySe03bBI3lDV_JIe3MwOjiRBH3jc5O6Br5QfIA9eOphQ7_gJ0iJKLP5MegaQxSInK92cBqhpaeaNozT0xPJjw6AgUec_JOpahauZSwAkL6snPHrFhYGv0O_6dIo7CH5-AlzeTKRBV2o9KmkTN2Z8wzJLBQ',
    imageAlt: 'Artisanal glazed ceramic plate featuring a grilled Atlantic salmon fillet',
    isAiVerified: true,
  },
  {
    id: 'meal-3',
    category: 'snack',
    categoryLabel: 'Afternoon Refresh',
    time: '04:30 PM',
    title: 'Strained Greek Curd & Honey',
    description: 'Whole milk yogurt, wild thyme honey, crushed pecans.',
    calories: 180,
    protein: 15,
    carbs: 18,
    fats: 4,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1JpwrQ39KxBsqeu9z6nLyUTYCUfIS-8l4nDSRbAwS0FShlo2kt3tuRRaJQpbfpAQi84KRmUPlcIS5Z_qpOt1RMDJPU3eZc46ky-_ZxVQo3mrUYqmh0Vr6z6mF1I0wsg54gdeVT4Q324_uAubvbnVEPI2oU6ezmiekC27oCGJHSvi2_Z8BVoeUD8030LFYxLK8g4A5LKFRN-RC2XzZk7H7kn2_mgCGa8m61ZaTXazhwEPyzPSl9rWcUQ',
    imageAlt: 'Small rustic terracotta bowl filled with thick Greek yogurt drizzled with honey',
  },
  {
    id: 'meal-4',
    category: 'evening',
    categoryLabel: 'Pre-Dinner Fuel',
    time: '06:15 PM',
    title: 'Walnut & Fig Rustic Cluster',
    description: 'Fresh Mission figs, raw California walnuts, pinch of sea salt.',
    calories: 360,
    protein: 8,
    carbs: 32,
    fats: 22,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAv9vU9mBAzuOY5aNQsJx1tpCJcEdHy8j9L0zeMpkyYAX9K_Tv-sWoQ3AIf8U4WWorLtKcNXmeY0r0wPC3DLExMGzzkjJ2KWk_biF19Yxe95Yy12x2RHX7cFS1kYr4srquHqJvhe1X7pBfXEDshHEye3aCK089Xb3Jcc91b_oXlit1BWjGORVDivKUfoBdCFnTgZEXn4C40RIfShkn2NrWC5oyPl6OgfzCVVxR4hftvQg6JbnRH7YS6IA',
    imageAlt: 'Rustic bowl of wholesome nuts and dried fruits',
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenPath>('daily-log');
  const [meals, setMeals] = useState<MealItem[]>(INITIAL_MEALS);
  const [totalWater, setTotalWater] = useState<number>(2250);
  const [targetCalories, setTargetCalories] = useState<number>(2100);
  const [targetWater, setTargetWater] = useState<number>(3000);
  const [chimeEnabled, setChimeEnabled] = useState<boolean>(true);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState<boolean>(false);
  const [editingMeal, setEditingMeal] = useState<MealItem | null>(null);

  // Days list for date navigation
  const daysList = [
    'Tuesday • Oct 22',
    'Wednesday • Oct 23',
    'Thursday • Oct 24',
    'Friday • Oct 25',
    'Saturday • Oct 26',
  ];
  const [dayIndex, setDayIndex] = useState(2); // Thursday • Oct 24

  // Sum total calories from meals
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);

  const handleAddWater = (ml: number) => {
    setTotalWater((prev) => Math.min(4000, prev + ml));
  };

  const handleResetWater = () => {
    setTotalWater(0);
  };

  const handleAddMeal = (newMeal: Omit<MealItem, 'id'>) => {
    const mealWithId: MealItem = {
      ...newMeal,
      id: `meal-${Date.now()}`,
    };
    setMeals((prev) => [...prev, mealWithId]);
  };

  const handleUpdateMeal = (updated: MealItem) => {
    setMeals((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const handleChangeDay = (delta: number) => {
    const newIdx = Math.max(0, Math.min(daysList.length - 1, dayIndex + delta));
    setDayIndex(newIdx);
  };

  const handleExportCsv = () => {
    playMechanicalClick();
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Category,Time,Dish,Calories,Protein(g),Carbs(g),Fats(g),AI Verified\n' +
      meals
        .map(
          (m) =>
            `"${m.id}","${m.categoryLabel}","${m.time}","${m.title}",${m.calories},${m.protein},${m.carbs},${m.fats},${m.isAiVerified ? 'YES' : 'NO'}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VitaGauge_DailyLog_${daysList[dayIndex].replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playBrassChime();
  };

  return (
    <div className="bg-surface-container-highest text-on-surface min-h-screen p-3 md:p-6 lg:p-8 select-none">
      <div className="max-w-7xl mx-auto rounded-xl bg-surface-container-low shadow-[0_20px_50px_rgba(39,24,20,0.35),0_4px_12px_rgba(39,24,20,0.2)] border border-outline-variant/60 relative overflow-hidden flex flex-col">
        {/* Four Corner Screws / Brass Fasteners */}
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-surface-container-highest to-outline shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-outline/80 transform rotate-45"></div>
        </div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-surface-container-highest to-outline shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-outline/80 transform -rotate-45"></div>
        </div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-gradient-to-br from-surface-container-highest to-outline shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-outline/80 transform -rotate-12"></div>
        </div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-gradient-to-br from-surface-container-highest to-outline shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.4)] z-50 flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-outline/80 transform rotate-12"></div>
        </div>

        {/* Master Skeuomorphic Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(path) => setCurrentScreen(path)}
          totalCalories={totalCalories}
          totalWater={totalWater}
          targetCalories={targetCalories}
          chimeEnabled={chimeEnabled}
          onToggleChime={() => setChimeEnabled((prev) => !prev)}
        />

        {/* Main Viewport Content */}
        <main className="w-full pt-20 bg-surface min-h-[calc(100vh-8rem)]">
          {currentScreen === 'daily-log' && (
            <DailyLogScreen
              meals={meals}
              totalCalories={totalCalories}
              totalWater={totalWater}
              targetCalories={targetCalories}
              targetWater={targetWater}
              onAddWater={handleAddWater}
              onNavigate={(path) => setCurrentScreen(path)}
              onOpenCalibration={() => setCalibrationModalOpen(true)}
              onAddMeal={handleAddMeal}
              onEditMeal={(meal) => setEditingMeal(meal)}
              currentDay={daysList[dayIndex]}
              onChangeDay={handleChangeDay}
            />
          )}

          {currentScreen === 'ai-food-scanner' && (
            <AiFoodScannerScreen
              onLogMeal={(meal) => {
                handleAddMeal(meal);
                // After logging, navigate to daily log to view the new entry in the journal
                setCurrentScreen('daily-log');
              }}
            />
          )}

          {currentScreen === 'weekly-summary' && <WeeklySummaryScreen />}

          {currentScreen === 'hydration-tracker' && (
            <HydrationTrackerScreen
              currentWater={totalWater}
              targetWater={targetWater}
              onAddWater={handleAddWater}
              onResetWater={handleResetWater}
            />
          )}

          {currentScreen === 'gemini-chat' && (
            <GeminiChatScreen
              totalCalories={totalCalories}
              totalWater={totalWater}
              targetCalories={targetCalories}
              targetWater={targetWater}
              onAddMeal={(meal) => {
                handleAddMeal(meal);
                // Also trigger pleasant chime
                playBrassChime();
              }}
            />
          )}
        </main>

        {/* Master Footer */}
        <Footer
          onOpenCalibration={() => setCalibrationModalOpen(true)}
          onExportCsv={handleExportCsv}
        />
      </div>

      {/* Floating Gemini Chatbot Access Medallion */}
      <ChatFab
        currentScreen={currentScreen}
        onOpenChat={() => setCurrentScreen('gemini-chat')}
      />

      {/* Calibration Modal */}
      <CalibrationModal
        isOpen={calibrationModalOpen}
        onClose={() => setCalibrationModalOpen(false)}
        targetCalories={targetCalories}
        targetWater={targetWater}
        onSave={(cals, water) => {
          setTargetCalories(cals);
          setTargetWater(water);
        }}
      />

      {/* Meal Detail & Refine Modal */}
      <MealDetailModal
        meal={editingMeal}
        isOpen={Boolean(editingMeal)}
        onClose={() => setEditingMeal(null)}
        onSave={handleUpdateMeal}
        onDelete={handleDeleteMeal}
      />
    </div>
  );
}
