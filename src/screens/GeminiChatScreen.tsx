import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MealItem } from '../types.ts';
import { playMechanicalClick, playBrassChime } from '../utils/audio.ts';

interface GeminiChatScreenProps {
  totalCalories: number;
  totalWater: number;
  targetCalories: number;
  targetWater: number;
  onAddMeal: (meal: Omit<MealItem, 'id'>) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init',
    role: 'assistant',
    content: `Greetings, Elena. I am your **VitaGauge Horologist & Biometric AI**. 

Our calibrated instruments are currently synchronized with your journal:
- **Caloric Burn Recorded:** 1,640 / 2,100 kcal (~460 kcal remaining)
- **Hydration Level:** 2,250 / 3,000 ml (75% saturation)

How may I assist your physical equilibrium today? You may describe dishes you have consumed to have them analyzed and logged, or ask for guidance on hydration and macronutrient balancing.`,
    timestamp: '09:00 AM',
    modelUsed: 'gemini-3.5-flash',
  },
];

const SUGGESTIONS = [
  'What should I eat for dinner with 460 kcal remaining?',
  'Analyze 2 poached eggs, avocado, and sourdough toast',
  'How much water should I drink after a 45-minute brisk walk?',
  'Log a bowl of Greek yogurt with berries and honey (220 kcal)',
];

export const GeminiChatScreen: React.FC<GeminiChatScreenProps> = ({
  totalCalories,
  totalWater,
  targetCalories,
  targetWater,
  onAddMeal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelTier, setModelTier] = useState<'fast' | 'general' | 'complex'>('general');
  const [addedMealIds, setAddedMealIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Helper to extract meal info if mentioned in text
  const detectMealFromText = (text: string) => {
    const calMatch = text.match(/(\d{2,4})\s*(?:kcal|calories)/i);
    const proteinMatch = text.match(/(\d{1,3})\s*g\s*(?:protein|p)/i);
    const carbsMatch = text.match(/(\d{1,3})\s*g\s*(?:carbs|carbohydrates|c)/i);
    const fatsMatch = text.match(/(\d{1,3})\s*g\s*(?:fats|lipids|f)/i);

    if (calMatch) {
      const cals = parseInt(calMatch[1], 10);
      const protein = proteinMatch ? parseInt(proteinMatch[1], 10) : Math.round(cals * 0.08);
      const carbs = carbsMatch ? parseInt(carbsMatch[1], 10) : Math.round(cals * 0.1);
      const fats = fatsMatch ? parseInt(fatsMatch[1], 10) : Math.round(cals * 0.03);

      return {
        title: 'Analyzed Culinary Dish',
        calories: cals,
        protein,
        carbs,
        fats,
      };
    }
    return undefined;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    playMechanicalClick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          modelTier,
          currentContext: {
            totalCalories,
            totalWater,
            targetCalories,
            targetWater,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const detectedMeal = detectMealFromText(data.text);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        detectedMeal,
      };

      playBrassChime();
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Mechanical communication irregularity encountered: ${err.message || 'Check connection'}. Please re-engage the query lever.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'offline',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleInscribeMeal = (msgId: string, mealData: NonNullable<ChatMessage['detectedMeal']>) => {
    playMechanicalClick();
    playBrassChime();
    onAddMeal({
      category: 'evening',
      categoryLabel: 'Horologist AI Dispatch',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: mealData.title,
      description: 'Logged directly through Gemini Horologist conversation.',
      calories: mealData.calories,
      protein: mealData.protein,
      carbs: mealData.carbs,
      fats: mealData.fats,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGuY3gSz7H3udM-_dRzPKv3FAeS2zGbMD86Coo8qGOgsyVN257i3d7hVKBauoIEzm_zX3Orq-a5pPB50qC9CK3QvB9mWQggxqsTg44toFsSDepKT9i-V1bbUQYmZ_XV6TZBDAnRPmD8pIy1o0zjFK1r2V2-6R6Yld94_784fJ-IMFLM3fOOVftfPhtwo--fCBG0OddrI-x3WFUaMJJOTHWgKpjps2w3YBJKNTKP6hE_tWXVOU5V0_2eA',
      isAiVerified: true,
    });
    setAddedMealIds((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleClear = () => {
    playMechanicalClick();
    if (confirm('Clear the current conversation thread?')) {
      setMessages(INITIAL_MESSAGES);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* Station Plaque Header */}
      <div className="rounded-xl bg-surface-container p-5 shadow-[0_10px_25px_rgba(39,24,20,0.18),inset_0_1px_2px_rgba(255,255,255,0.8)] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brass corner screws */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-surface-variant shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_1px_rgba(0,0,0,0.4)]"></div>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary-container to-surface-tint flex items-center justify-center text-on-primary shadow-[0_4px_10px_rgba(39,24,20,0.3),inset_0_1px_2px_rgba(255,255,255,0.6)] shrink-0">
            <span className="material-symbols-outlined text-[26px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                Instrument № 108
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/15 text-secondary">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_6px_#376847]"></span>
                Gemini Core Online
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface">
              Precision Horologist &amp; Nutritionist AI
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Multi-turn biometric consulting • Calorie decomposition &amp; hydration advising
            </p>
          </div>
        </div>

        {/* Model Tier Selector Console */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-stretch md:self-auto">
          <div className="flex items-center p-1 bg-surface-container-high rounded-lg border border-outline-variant/60 shadow-[inset_0_1px_3px_rgba(39,24,20,0.15)]">
            <button
              onClick={() => {
                playMechanicalClick();
                setModelTier('fast');
              }}
              title="Fast Tasks • gemini-3.1-flash-lite"
              className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
                modelTier === 'fast'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              ⚡ Fast Lite
            </button>
            <button
              onClick={() => {
                playMechanicalClick();
                setModelTier('general');
              }}
              title="General Tasks • gemini-3.5-flash"
              className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
                modelTier === 'general'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              ⚖️ Standard 3.5
            </button>
            <button
              onClick={() => {
                playMechanicalClick();
                setModelTier('complex');
              }}
              title="Complex Reasoning • gemini-3.1-pro-preview"
              className={`px-3 py-1.5 rounded-md font-label-sm text-label-sm font-bold transition-all cursor-pointer ${
                modelTier === 'complex'
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              🔬 Deep Pro
            </button>
          </div>

          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-error text-xs font-bold border border-outline-variant/40 shadow-sm flex items-center gap-1 cursor-pointer"
            title="Clear Chat History"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Well */}
      <div className="rounded-xl bg-surface-container-low p-4 sm:p-6 shadow-[0_12px_30px_rgba(39,24,20,0.18),inset_0_1px_2px_rgba(255,255,255,0.7)] flex flex-col h-[520px] relative overflow-hidden">
        {/* Messages Scrollable Thread */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase">
                  {msg.role === 'user' ? 'Elena Rostova' : 'VitaGauge Horologist'}
                </span>
                <span className="font-body-sm text-[10px] text-outline font-mono">{msg.timestamp}</span>
                {msg.modelUsed && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-surface-container-highest text-primary">
                    {msg.modelUsed}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-xl shadow-md whitespace-pre-wrap leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-tr-xs shadow-[0_4px_12px_rgba(113,68,54,0.3)]'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/60 rounded-tl-xs shadow-[0_4px_12px_rgba(39,24,20,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]'
                }`}
              >
                <div className="font-body-md text-body-md">{msg.content}</div>

                {/* Detected Meal Quick Action Card */}
                {msg.detectedMeal && (
                  <div className="mt-3 pt-3 border-t border-outline-variant/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container-low p-3 rounded-lg shadow-inner">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-bold shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">restaurant</span>
                      </div>
                      <div>
                        <div className="font-label-md font-bold text-on-surface">
                          {msg.detectedMeal.calories} kcal • {msg.detectedMeal.title}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono">
                          P: {msg.detectedMeal.protein}g | C: {msg.detectedMeal.carbs}g | F: {msg.detectedMeal.fats}g
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInscribeMeal(msg.id, msg.detectedMeal!)}
                      disabled={addedMealIds[msg.id]}
                      className={`px-3 py-1.5 rounded-lg font-label-sm font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        addedMealIds[msg.id]
                          ? 'bg-secondary text-on-secondary opacity-80 cursor-default'
                          : 'bg-primary text-on-primary hover:bg-primary-container shadow-sm active:translate-y-0.5'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {addedMealIds[msg.id] ? 'check' : 'add_task'}
                      </span>
                      <span>{addedMealIds[msg.id] ? 'Inscribed to Diary!' : 'Inscribe to Daily Log'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="font-label-sm text-label-sm font-bold text-on-surface-variant uppercase">
                  VitaGauge Horologist
                </span>
                <span className="text-[10px] text-secondary font-mono animate-pulse">Calculating telemetry...</span>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/60 rounded-tl-xs shadow-md flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="font-body-sm text-body-sm text-on-surface-variant italic">
                  Engaging {modelTier === 'complex' ? 'gemini-3.1-pro' : modelTier === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'} neural gear train...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="pt-3 border-t border-outline-variant/40 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-surface-tint uppercase shrink-0">Inquire:</span>
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 rounded-full bg-surface-container-highest hover:bg-surface-variant text-on-surface text-xs font-medium whitespace-nowrap shadow-xs active:translate-y-0.5 transition-all cursor-pointer shrink-0 border border-outline-variant/40"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      {/* Input Console Dock */}
      <div className="rounded-xl bg-surface-container p-3 sm:p-4 shadow-[inset_0_2px_4px_rgba(39,24,20,0.15)] flex items-end gap-3">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Consult the horologist or describe a meal (e.g., '1 slice sourdough, 2 eggs, 1 cup whole milk')..."
          className="flex-1 bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded-lg p-3 border border-outline-variant/60 focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-outline"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={loading || !input.trim()}
          className={`px-5 py-3 rounded-lg font-title-md text-title-md font-bold flex items-center gap-2 transition-all cursor-pointer ${
            loading || !input.trim()
              ? 'bg-surface-container-high text-outline cursor-not-allowed'
              : 'bg-primary text-on-primary shadow-[0_4px_10px_rgba(113,68,54,0.35),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-primary-container active:translate-y-0.5'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">send</span>
          <span className="hidden sm:inline">Transmit</span>
        </button>
      </div>
    </div>
  );
};
