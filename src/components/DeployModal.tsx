import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Github,
  Rocket,
  Shield,
  Copy,
  Check,
  FileCode,
  Download,
  Terminal,
  CheckCircle2,
} from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  studentName: string;
}

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  brandName,
  studentName,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const vercelEnvSnippet = `GEMINI_API_KEY=AIzaSy...your_gemini_key_here`;

  const vercelApiFunctionSnippet = `// api/analyze.ts - Vercel Serverless Function
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { resume, jobDesc, persona } = req.body;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: \`JOB:\\n\${jobDesc}\\n\\nRESUME:\\n\${resume}\`,
    config: {
      responseMimeType: 'application/json',
      systemInstruction: 'You are an expert career coach and ATS specialist. Return JSON with ats_score, summary, missing_keywords, improvements.'
    }
  });

  return res.status(200).json({ success: true, data: JSON.parse(response.text || '{}') });
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-xs">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Deploy to Vercel & GitHub (Steps 8 & 9 Guide)
              </h3>
              <p className="text-xs text-slate-500">
                Turn your AI Career Copilot into a live URL to submit for full points & bonus +10 XP!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Step 8 Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                8
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Step 8: Deploy on Vercel (Free & Permanent)
              </h4>
            </div>

            <ol className="list-decimal pl-5 space-y-2 text-slate-600 leading-relaxed">
              <li>
                Go to <strong className="text-slate-800">github.com</strong> → Click <strong className="text-slate-800">"New repository"</strong>.
              </li>
              <li>
                Name: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-orange-600">ai-career-copilot-{studentName.toLowerCase().replace(/\s+/g, '-') || 'portfolio'}</code>
              </li>
              <li>
                Push your codebase to GitHub (via git CLI or file upload).
              </li>
              <li>
                Go to <strong className="text-slate-800">vercel.com</strong> → Click <strong className="text-slate-800">"Add New Project"</strong> → Select your GitHub repo.
              </li>
              <li>
                Click <strong className="text-slate-800">Deploy</strong>! In ~45 seconds you get a live link like <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-emerald-700">https://ai-career-copilot.vercel.app</code>.
              </li>
            </ol>
          </div>

          {/* Step 9 Security */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Step 9: Hide Your API Key (Security Best Practice)</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              Never commit your Gemini API key into client-side code on GitHub. Use Vercel's Environment Variables dashboard:
            </p>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-white font-mono text-[11px]">
              <span>Name: <strong>GEMINI_API_KEY</strong></span>
              <button
                onClick={() => handleCopy('env', 'GEMINI_API_KEY')}
                className="inline-flex items-center gap-1 text-[10px] text-orange-400 hover:text-orange-300"
              >
                {copiedKey === 'env' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Var Name</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-900">
              In Vercel: <strong>Project Settings → Environment Variables</strong> → Add <code>GEMINI_API_KEY</code> with your Google AI Studio key!
            </p>
          </div>

          {/* Serverless Route Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-bold text-slate-800 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-500" />
                Vercel Serverless Function Template (/api/analyze.ts)
              </h5>
              <button
                onClick={() => handleCopy('snippet', vercelApiFunctionSnippet)}
                className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-semibold"
              >
                {copiedKey === 'snippet' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'snippet' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
              {vercelApiFunctionSnippet}
            </pre>
          </div>

          {/* Checklist */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Final Submission Checklist
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-950 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                <span>Live Vercel URL working</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                <span>Public GitHub Repo uploaded</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                <span>Custom Brand & Student Name</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-0" />
                <span>Bonus Features: PDF + History (+10 XP)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Current Project: <strong>{brandName}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-xs"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};
