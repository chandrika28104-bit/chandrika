import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

function extractCleanMessage(err: any): string {
  if (!err) return 'Failed to analyze resume with Gemini AI.';
  const msg = err.message || String(err);
  try {
    const parsed = JSON.parse(msg);
    if (parsed?.error?.message) {
      if (parsed.error.code === 503 || parsed.error.status === 'UNAVAILABLE') {
        return 'Google Gemini AI is currently experiencing high demand (503). Spikes are temporary — please wait 15–30 seconds and click Analyze Resume again.';
      }
      return parsed.error.message;
    }
  } catch (e) {
    // Ignore JSON parse error, use raw msg
  }
  return msg;
}

// Helper to instantiate client with either server secret or user-provided override
function getGenAIClient(customKey?: string) {
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_API_KEY_HERE') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hasServerKey = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
    process.env.GEMINI_API_KEY !== 'YOUR_API_KEY_HERE'
  );
  res.json({
    status: 'ok',
    hasApiKey: hasServerKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Resume analysis endpoint
app.post('/api/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      resume,
      jobDesc,
      persona = 'general',
      customSystemPrompt,
      apiKey: userApiKey,
      model = 'gemini-3.8-flash',
    } = req.body;

    if (!resume || !jobDesc) {
      res.status(400).json({ error: 'Both resume and job description are required.' });
      return;
    }

    const ai = getGenAIClient(userApiKey);
    if (!ai) {
      res.status(400).json({
        error:
          'GEMINI_API_KEY is not configured on the server. Please provide an API key in the app settings or .env file.',
        missingKey: true,
      });
      return;
    }

    // Role-specific personas based on the Prompt Engineering Framework
    const personas: Record<string, string> = {
      general:
        'You are an expert career coach and ATS (Applicant Tracking System) specialist with 10+ years of experience helping candidates pass enterprise screening at Fortune 500 companies.',
      tech:
        'You are a Silicon Valley Principal Tech Recruiter and Engineering Hiring Manager with 12+ years of experience evaluating software engineers, AI/ML practitioners, systems architects, and technical leaders.',
      fresh_grad:
        'You are a university recruitment lead and early-career talent advisor specializing in helping students and recent graduates showcase academic projects, internships, coursework, and high-potential trajectory.',
      career_changer:
        'You are a career transition strategist who specializes in translating non-traditional backgrounds, transferable skills, domain pivots, and self-taught capabilities into compelling enterprise qualification.',
      executive:
        'You are an executive talent partner and leadership consultant assessing candidates for Staff+, Director, VP, and C-suite roles focusing on strategic leverage, team scaling, P&L, and business impact.',
    };

    const selectedPersona = customSystemPrompt?.trim() || personas[persona] || personas.general;

    const systemInstruction = `You are an expert ATS (Applicant Tracking System) recruiter and career intelligence analyst.
Analyze the provided candidate resume against the target job description thoroughly and objectively.

Return ONLY a valid JSON object matching this schema:
{
  "ats_score": number (calibrated score 0-100 reflecting genuine match),
  "summary": string (2-3 sentences overview of candidate alignment with this specific role),
  "match_analysis": string (objective evaluation of candidate qualifications against job requirements),
  "matching_skills": string[] (skills and keywords found in both the resume and the job description),
  "missing_keywords": string[] (crucial keywords, tools, frameworks, or qualifications in job description missing or weak in resume),
  "strengths": string[] (3-5 specific strengths of this resume for this role),
  "weaknesses": string[] (2-4 notable gaps or weak areas in the resume for this role),
  "improvements": string[] (3-5 concrete, actionable suggestions to improve ATS score and interview chances)
}`;

    const promptText = `TARGET JOB DESCRIPTION:
${jobDesc}

---
CANDIDATE RESUME:
${resume}

---
Perform a complete ATS and qualification analysis now. Return strict JSON.`;

    const schemaConfig = {
      systemInstruction,
      responseMimeType: 'application/json',
      maxOutputTokens: 1200,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ats_score: { type: Type.NUMBER, description: 'ATS score between 0 and 100' },
          summary: { type: Type.STRING, description: 'Executive summary' },
          match_analysis: { type: Type.STRING, description: 'Detailed match analysis' },
          matching_skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Matching skills' },
          missing_keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Missing keywords' },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Resume strengths' },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Resume weaknesses' },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Actionable improvements' },
        },
        required: [
          'ats_score',
          'summary',
          'match_analysis',
          'matching_skills',
          'missing_keywords',
          'strengths',
          'weaknesses',
          'improvements',
        ],
      },
    };

    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', model || 'gemini-3.8-flash'];
    let response: any = null;
    let lastError: any = null;
    let usedModel = 'gemini-3.1-flash-lite';

    for (const m of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model: m,
          contents: promptText,
          config: schemaConfig,
        });
        if (response?.text) {
          usedModel = m;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${m} encountered high load, trying fallback:`, err?.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      const msg = extractCleanMessage(lastError);
      res.status(503).json({ error: msg });
      return;
    }

    const text = response.text || '';
    const parsedData = JSON.parse(text);

    res.json({
      success: true,
      data: parsedData,
      modelUsed: usedModel,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: extractCleanMessage(error),
    });
  }
});

// Bullet rewriter endpoint (Google XYZ format)
app.post('/api/rewrite-bullet', async (req: Request, res: Response): Promise<void> => {
  try {
    const { bullet, targetKeywords, apiKey: userApiKey } = req.body;
    if (!bullet) {
      res.status(400).json({ error: 'Bullet text is required' });
      return;
    }

    const ai = getGenAIClient(userApiKey);
    if (!ai) {
      res.status(400).json({ error: 'API key not configured' });
      return;
    }

    const prompt = `You are an elite resume editor. Rewrite this weak resume bullet into 3 high-impact variations using Google's XYZ formula ("Accomplished [X] as measured by [Y], by doing [Z]"). Incorporate these target keywords where appropriate: ${targetKeywords || 'relevant technical impact'}.

Original Bullet:
"${bullet}"

Return a JSON array of 3 strings: ["variation 1", "variation 2", "variation 3"].`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const variations = JSON.parse(response.text || '[]');
    res.json({ success: true, variations });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Failed to rewrite bullet' });
  }
});

// Chat assistant for follow-up questions
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages, context, apiKey: userApiKey } = req.body;
    const ai = getGenAIClient(userApiKey);
    if (!ai) {
      res.status(400).json({ error: 'API key not configured' });
      return;
    }

    const systemInstruction = `You are AI Career Copilot. You have already evaluated the user's resume against their target job.
Context of recent analysis:
${context ? JSON.stringify(context, null, 2) : 'No previous analysis loaded.'}

Answer the user's question with concise, direct, highly tactical career and resume advice. Keep answers under 150 words unless detailed code or bullet rewrites are requested.`;

    const userPrompt = messages && messages.length > 0
      ? messages[messages.length - 1].content
      : 'Help me improve my resume';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: { systemInstruction },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || 'Chat error' });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`AI Career Copilot server listening on port ${PORT}`);
  });
}

setupServer();
