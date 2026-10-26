import React, { useState } from 'react';
import { PROMPT_PERSONAS, FEW_SHOT_GUIDE, PromptPersona } from '../data/promptFramework';
import {
  Code2,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  Terminal,
} from 'lucide-react';

interface PromptLabProps {
  currentPersona: string;
  customPrompt: string;
  onSelectPersona: (personaId: string) => void;
  onUpdateCustomPrompt: (prompt: string) => void;
  onSwitchToAnalyzer: () => void;
}

export const PromptLab: React.FC<PromptLabProps> = ({
  currentPersona,
  customPrompt,
  onSelectPersona,
  onUpdateCustomPrompt,
  onSwitchToAnalyzer,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'framework' | 'personas' | 'fewshot' | 'editor'>('framework');

  const selectedPersonaObj = PROMPT_PERSONAS.find((p) => p.id === currentPersona) || PROMPT_PERSONAS[0];

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToDefault = () => {
    onUpdateCustomPrompt(selectedPersonaObj.systemPrompt);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Prompt Engineering Mastery
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            The AI Brain: Prompt Engineering Framework
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            LLMs are generalists. Prompt engineering transforms them into specialized, high-accuracy recruiting engines. Master the 4 core pillars: <strong>ROLE</strong>, <strong>TASK</strong>, <strong>FORMAT</strong>, and <strong>RULES</strong>.
          </p>

          <div className="flex items-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => setActiveTab('framework')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'framework'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              1. Four Pillars Framework
            </button>
            <button
              onClick={() => setActiveTab('personas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'personas'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              2. Domain Personas
            </button>
            <button
              onClick={() => setActiveTab('fewshot')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'fewshot'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              3. Few-Shot & Bad vs Good
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              4. Live Prompt Editor
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: The 4 Pillars */}
      {activeTab === 'framework' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900">ROLE (Persona & Identity)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tells the LLM who it is and anchors its perspective. A generic persona produces generic advice. A specific persona (e.g. "Silicon Valley Engineering Hiring Manager with 12 years exp") produces rigorous, high-signal critique.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
              "You are an executive talent partner who has screened 10,000+ candidates for Fortune 500 tech teams..."
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900">TASK (Clear Objective)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Defines the exact mission and scope. Distinguishes between loose suggestions and rigorous gap analysis between two text blocks (Resume vs Job Description).
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
              "Your task: Rigorously analyze the candidate resume against the job description. Identify exact keyword overlap and qualification gaps."
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900">OUTPUT FORMAT (Structured JSON)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Forces deterministic output without conversational chatter or markdown fences. Powers interactive meters, badges, and export pipelines in software applications.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
              `responseMimeType: "application/json", responseSchema: &#123; ats_score, summary, missing_keywords: [...] &#125;`
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900">RULES & CONSTRAINTS (Guardrails)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Prevents sycophancy, flattering hallucinations, or vague fluff. Sets ground rules like "Be specific, use numbers, penalize missing tech stack keywords."
            </p>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
              "- Be realistic: do NOT award scores &gt;90 without exact stack match.<br />- Use Google XYZ formula for all bullet improvements."
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Domain Personas */}
      {activeTab === 'personas' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Click any persona to apply it directly to your Copilot Analyzer:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROMPT_PERSONAS.map((persona) => {
              const isSelected = currentPersona === persona.id;
              return (
                <div
                  key={persona.id}
                  onClick={() => {
                    onSelectPersona(persona.id);
                    onUpdateCustomPrompt(persona.systemPrompt);
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/20 shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {persona.name}
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                            ACTIVE
                          </span>
                        )}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-400">
                        {persona.idealFor}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">
                      {persona.tagline}
                    </p>
                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-700 font-mono line-clamp-3">
                      {persona.systemPrompt}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Ideal for: <strong>{persona.idealFor}</strong>
                    </span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        isSelected
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? 'Applied' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Few-Shot Guide */}
      {activeTab === 'fewshot' && (
        <div className="space-y-5">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
            <strong>What is Few-Shot Prompting?</strong> In AI engineering, "zero-shot" means asking the model to do a task with only instructions. "Few-shot" means providing concrete input-output examples in the prompt to teach the model the exact style, calibration, and output structure you expect.
          </div>

          <div className="space-y-4">
            {FEW_SHOT_GUIDE.map((guide, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900">
                  Case #{idx + 1}: {guide.title}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bad */}
                  <div className="p-4 rounded-xl bg-red-50/50 border border-red-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-wider">
                      <span>❌ Bad / Naive Prompt</span>
                    </div>
                    <p className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-red-200">
                      {guide.badPrompt}
                    </p>
                    <div className="text-[11px] text-red-900">
                      <strong>Result:</strong> {guide.badOutputSnippet}
                    </div>
                  </div>

                  {/* Good */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      <span>✓ Engineered Prompt</span>
                    </div>
                    <p className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-emerald-200">
                      {guide.goodPrompt}
                    </p>
                    <div className="text-[11px] text-emerald-900">
                      <strong>Result:</strong> {guide.goodOutputSnippet}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  💡 <strong>Why it matters:</strong> {guide.whyItMatters}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Live Editor */}
      {activeTab === 'editor' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-500" />
                Live System Prompt Editor
              </h3>
              <p className="text-xs text-slate-500">
                Directly tune the instructions sent to Gemini when evaluating resumes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
              <button
                onClick={() => handleCopyPrompt(customPrompt || selectedPersonaObj.systemPrompt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Prompt'}</span>
              </button>
            </div>
          </div>

          <textarea
            value={customPrompt || selectedPersonaObj.systemPrompt}
            onChange={(e) => onUpdateCustomPrompt(e.target.value)}
            rows={10}
            className="w-full font-mono text-xs p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
            placeholder="Write your custom system prompt here..."
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Characters: {(customPrompt || selectedPersonaObj.systemPrompt).length} · Model: Gemini 3.8 Flash
            </span>
            <button
              onClick={onSwitchToAnalyzer}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-sm"
            >
              <span>Test Prompt in Analyzer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
