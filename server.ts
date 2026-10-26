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

    const systemInstruction = `${selectedPersona}

Your task: Conduct a rigorous, data-driven analysis of the provided resume against the target job description.

Strict Output Requirements:
1. Return ONLY a valid JSON object matching the requested schema.
2. Be specific, realistic, and quantitative. Never give fluffy or generic feedback.
3. Compare actual keywords from the job description with the resume text.
4. Provide a balanced, calibrated ATS match score (0-100) reflecting real-world recruitment realities.`;

    const promptText = `TARGET JOB DESCRIPTION:
${jobDesc}

---
CANDIDATE RESUME:
${resume}

---
Please provide your evaluation now.`;

    const response = await ai.models.generateContent({
      model: model || 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ats_score: {
              type: Type.NUMBER,
              description: 'Calibrated ATS match score from 0 to 100',
            },
            summary: {
              type: Type.STRING,
              description: '2-3 sentence executive assessment with specific observations',
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 standout strengths found in the resume matching the role',
            },
            missing_keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '5-8 high-priority hard skills or tools in the job description that are absent or under-emphasized in the resume',
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 concrete, actionable bullet edits or structural fixes',
            },
            category_scores: {
              type: Type.OBJECT,
              properties: {
                keywords_match: { type: Type.NUMBER, description: 'Score 0-100' },
                experience_alignment: { type: Type.NUMBER, description: 'Score 0-100' },
                formatting_clarity: { type: Type.NUMBER, description: 'Score 0-100' },
                hard_skills: { type: Type.NUMBER, description: 'Score 0-100' },
                soft_skills: { type: Type.NUMBER, description: 'Score 0-100' },
              },
              required: ['keywords_match', 'experience_alignment', 'formatting_clarity', 'hard_skills', 'soft_skills'],
            },
            seniority_estimate: {
              type: Type.OBJECT,
              properties: {
                candidate_level: { type: Type.STRING, description: 'e.g. Mid-Level (3-4 yrs)' },
                role_level: { type: Type.STRING, description: 'e.g. Senior (5+ yrs)' },
                alignment: { type: Type.STRING, description: 'e.g. Minor reach, strong fit, overqualified' },
              },
              required: ['candidate_level', 'role_level', 'alignment'],
            },
            salary_estimate: {
              type: Type.OBJECT,
              properties: {
                range: { type: Type.STRING, description: 'Estimated US/Global market compensation range, e.g. $130,000 - $160,000' },
                notes: { type: Type.STRING, description: 'Brief benchmark rationale based on skills/title' },
              },
              required: ['range', 'notes'],
            },
            interview_prep_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3 targeted questions the interviewer will probe based on gaps',
            },
            cover_letter_hook: {
              type: Type.STRING,
              description: 'A punchy, tailored 2-sentence opening hook for their cover letter',
            },
          },
          required: [
            'ats_score',
            'summary',
            'strengths',
            'missing_keywords',
            'improvements',
            'category_scores',
            'seniority_estimate',
            'salary_estimate',
            'interview_prep_questions',
            'cover_letter_hook',
          ],
        },
      },
    });

    const text = response.text || '';
    const parsedData = JSON.parse(text);

    res.json({
      success: true,
      data: parsedData,
      modelUsed: model || 'gemini-3.8-flash',
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to analyze resume with Gemini.',
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
