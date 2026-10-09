import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for the VitaGauge Horologist & Nutritionist Assistant
const SYSTEM_INSTRUCTION = `You are the VitaGauge Horologist & Master Nutritionist, an artisan biometric intelligence assistant embedded within the VitaGauge MK-IV analog health console.
Your tone is articulate, warm, grounded, and scientific, evoking the elegance of fine clockwork horology, brass instruments, and artisanal holistic nutrition.
You assist the user (Elena Rostova or the current user) with:
1. Analyzing meals, estimating calories and macros (Protein, Carbs, Fats, Fiber, Sodium).
2. Advising on hydration pacing, cellular hydration, and electrolyte balance based on physical exertion.
3. Suggesting meal ideas that fit within remaining caloric allocations.
4. Parsing foods they describe and providing an explicit meal breakdown with estimated values.

When the user describes food they ate or want to log, always provide:
- Dish name
- Estimated Total Calories (kcal)
- Macronutrients: Protein (g), Carbs (g), Fats (g)
- Short commentary on nutritional merit

Keep formatting clean with clear paragraphs or concise bullet points. Avoid markdown headers larger than ###. Be helpful, concise, and encourage mindful wellness.`;

// API route for multi-turn Gemini chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, modelTier = 'general', currentContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Select model based on user selection / complexity tier
    // gemini-3.1-pro-preview: complex tasks
    // gemini-3.5-flash: general tasks
    // gemini-3.1-flash-lite: fast tasks
    let modelName = 'gemini-3.5-flash';
    if (modelTier === 'complex') {
      modelName = 'gemini-3.1-pro-preview';
    } else if (modelTier === 'fast') {
      modelName = 'gemini-3.1-flash-lite';
    }

    // Map conversation history to Gemini contents structure
    const contents = messages.map((msg: { role: 'user' | 'assistant' | 'model'; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Append context if provided (e.g. current calories and water)
    let dynamicSystemInstruction = SYSTEM_INSTRUCTION;
    if (currentContext) {
      dynamicSystemInstruction += `\n\nCURRENT TELEMETRY SNAPSHOT:
- Logged Calories Today: ${currentContext.totalCalories || 0} kcal (Target: ${currentContext.targetCalories || 2100} kcal)
- Water Intake: ${currentContext.totalWater || 0} ml (Target: ${currentContext.targetWater || 3000} ml)
- Deficit/Surplus: ${(currentContext.targetCalories || 2100) - (currentContext.totalCalories || 0)} kcal remaining`;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I apologize, the mechanical dials did not produce a clear reading. Please try again.';

    res.json({
      text: replyText,
      modelUsed: modelName,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || 'Error communicating with Gemini intelligence core.',
    });
  }
});

// Mount Vite middleware in development or serve static in production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VitaGauge MK-IV server running on port ${PORT}`);
});
