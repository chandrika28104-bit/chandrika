import React, { useState } from 'react';
import { Sparkles, Copy, Check, Wand2, RefreshCw } from 'lucide-react';

interface BulletRewriterProps {
  initialKeyword?: string;
  onClearInitialKeyword?: () => void;
}

export const BulletRewriter: React.FC<BulletRewriterProps> = ({
  initialKeyword = '',
}) => {
  const [bullet, setBullet] = useState('');
  const [keywords, setKeywords] = useState(initialKeyword);
  const [isLoading, setIsLoading] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialKeyword) {
      setKeywords(initialKeyword);
    }
  }, [initialKeyword]);

  const handleRewrite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bullet.trim()) {
      setError('Please paste a weak resume bullet point first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bullet.trim(),
          targetKeywords: keywords.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to rewrite bullet');
      }

      setVariations(data.variations || []);
    } catch (err: any) {
      setError(err?.message || 'Error communicating with AI rewriter');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const sampleBullets = [
    {
      bullet: 'Worked on backend APIs and fixed some database performance issues.',
      keywords: 'PostgreSQL, Node.js, query optimization, 45% latency reduction',
    },
    {
      bullet: 'Responsible for building React components for our marketing site.',
      keywords: 'Next.js, Tailwind CSS, Lighthouse score 98, Core Web Vitals',
    },
    {
      bullet: 'Participated in machine learning model development and evaluated accuracy.',
      keywords: 'PyTorch, Hugging Face, fine-tuning, 94.2% F1 score, Triton',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-orange-100 text-orange-600">
            <Wand2 className="w-4 h-4" />
          </span>
          <h3 className="text-base font-bold text-slate-900">
            Google XYZ Bullet Rewriter
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Transform passive or vague duties into high-impact metrics-driven bullets using Google's formula: <br />
          <strong className="text-slate-800">"Accomplished [X] as measured by [Y], by doing [Z]"</strong>
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            1. Paste Weak / Passive Resume Bullet
          </label>
          <textarea
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            rows={3}
            placeholder="e.g. Worked on the website checkout page and helped improve user conversion."
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            2. Target Keywords & Tech Stack to Weave In
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. React 19, Stripe Checkout API, 28% conversion lift, idempotency"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Try sample:</span>
          {sampleBullets.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setBullet(sample.bullet);
                setKeywords(sample.keywords);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
            >
              Preset #{idx + 1}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={() => handleRewrite()}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-orange-500 hover:bg-orange-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Engineering Impact Bullets...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Rewrite with Google XYZ Formula</span>
            </>
          )}
        </button>
      </div>

      {variations.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              3 High-Impact XYZ Variations
            </h4>
            <span className="text-xs text-emerald-600 font-semibold">
              Ready to paste into resume
            </span>
          </div>

          <div className="space-y-3">
            {variations.map((v, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-all flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-md bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-[10px] mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {v}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(v, index)}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
