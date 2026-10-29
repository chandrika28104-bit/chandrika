import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON request payload.' });
      }
    }

    const { resume, jobDesc } = body || {};

    if (!resume || !jobDesc) {
      return res.status(400).json({ error: 'Both resume and job description are required.' });
    }

    if (typeof resume !== 'string' || typeof jobDesc !== 'string') {
      return res.status(400).json({ error: 'Resume and job description must be text.' });
    }

    if (resume.trim().length < 20 || jobDesc.trim().length < 20) {
      return res.status(400).json({
        error: 'Please provide at least 20 characters for both resume and job description.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL: GEMINI_API_KEY is not defined in process.env');
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is missing. Please add GEMINI_API_KEY in your Vercel Project Settings > Environment Variables.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemInstruction = `You are an expert ATS (Applicant Tracking System) recruiter and career intelligence analyst.
Analyze the provided candidate resume against the target job description thoroughly, concisely, and fast.

Return ONLY a valid JSON object matching this schema without any markdown formatting or backticks:
{
  "ats_score": number (calibrated score 0-100 reflecting genuine match),
  "summary": string (concise 2 sentences overview of alignment),
  "match_analysis": string (concise 2-3 sentences evaluation),
  "matching_skills": string[] (top 4-6 matching skills found in resume),
  "missing_keywords": string[] (top 4-6 crucial keywords missing in resume),
  "strengths": string[] (top 3 punchy strengths, under 15 words each),
  "weaknesses": string[] (top 2 punchy gaps, under 15 words each),
  "improvements": string[] (top 3 actionable improvements, under 15 words each)
}`;

    const prompt = `${systemInstruction}

TARGET JOB DESCRIPTION:
${jobDesc}

---
CANDIDATE RESUME:
${resume}

---
Perform a complete ATS and qualification analysis now. Return ONLY raw JSON without markdown formatting.`;

    // High-speed low-latency models: gemini-3.1-flash-lite delivers completions in ~1.5 seconds
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let textResult = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            maxOutputTokens: 850,
            temperature: 0.2,
          },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        if (text) {
          textResult = text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
      }
    }

    if (!textResult) {
      throw lastError || new Error('Google Gemini API temporarily unavailable. Please try again.');
    }

    // Clean any markdown code fences if present (e.g. ```json ... ```)
    let cleanedJson = textResult.trim();
    if (cleanedJson.startsWith('```json')) {
      cleanedJson = cleanedJson.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleanedJson.startsWith('```')) {
      cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    const data = JSON.parse(cleanedJson);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('API Error:', error);
    let msg = error?.message || 'Failed to analyze resume with Gemini AI.';
    try {
      const parsed = JSON.parse(msg);
      if (parsed?.error?.message) {
        msg = parsed.error.message;
      }
    } catch (_) {}

    return res.status(500).json({
      error: msg,
    });
  }
}
