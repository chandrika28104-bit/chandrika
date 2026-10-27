import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with key present:', Boolean(apiKey));

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const models = [
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
];

async function test() {
  for (const model of models) {
    try {
      console.log(`Trying ${model}...`);
      const res = await ai.models.generateContent({
        model,
        contents: 'Say hi in 1 word',
      });
      console.log(`✓ ${model} SUCCESS:`, res.text?.trim());
      break;
    } catch (err: any) {
      console.log(`✗ ${model} FAILED:`, err?.message || err);
    }
  }
}

test();
