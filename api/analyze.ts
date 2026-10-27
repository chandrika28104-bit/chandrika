import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { resume, jobDesc } = req.body || {};

    if (!resume || !jobDesc) {
      return res.status(400).json({ error: 'Both resume and job description are required.' });
    }

    if (typeof resume !== 'string' || typeof jobDesc !== 'string') {
      return res.status(400).json({ error: 'Resume and job description must be text.' });
    }

    if (resume.trim().length < 30 || jobDesc.trim().length < 30) {
      return res.status(400).json({
        error: 'Please provide complete details (at least 30 characters each for resume and job description).',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'GEMINI_API_KEY environment variable is not configured. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

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

    const prompt = `TARGET JOB DESCRIPTION:
${jobDesc}

---
CANDIDATE RESUME:
${resume}

---
Perform a complete ATS and qualification analysis now. Return strict JSON.`;

    const schemaConfig = {
      systemInstruction,
      responseMimeType: 'application/json',
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

    // Resilient fallback across Google's supported models if one encounters temporary 503 high demand
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: schemaConfig,
        });
        if (response?.text) break;
      } catch (err: any) {
        console.warn(`Model ${model} encountered an issue, trying next model:`, err?.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All models were unavailable. Please try again in a few moments.');
    }

    const text = response.text || '';
    const data = JSON.parse(text);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze resume with Gemini AI. Please try again.',
    });
  }
}
