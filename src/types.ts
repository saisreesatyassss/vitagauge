export type ScreenPath = 'daily-log' | 'ai-food-scanner' | 'weekly-summary' | 'hydration-tracker' | 'gemini-chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  detectedMeal?: {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface MealItem {
  id: string;
  category: 'morning' | 'midday' | 'evening' | 'snack';
  categoryLabel: string;
  time: string;
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  imageUrl: string;
  imageAlt?: string;
  isAiVerified?: boolean;
  sodiumMg?: number;
  fiberG?: number;
}

export interface DayRecord {
  dayName: string;
  dateStr: string;
  calories: number;
  waterMl: number;
  isPeak?: boolean;
  isPerfect?: boolean;
}

export interface WeekSummaryData {
  weekId: string;
  title: string;
  baselineCalories: number;
  avgDailyIntake: number;
  totalHydrationLiters: number;
  aiScanFidelityPercent: number;
  bodyDeltaLbs: number;
  days: DayRecord[];
  macroSplit: {
    carbsPercent: number;
    proteinPercent: number;
    fatsPercent: number;
    carbsGrams: number;
    proteinGrams: number;
    fatsGrams: number;
  };
  aiMemo: string;
  readinessScore: number;
}
