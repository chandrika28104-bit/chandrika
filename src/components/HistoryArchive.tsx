import React, { useState } from 'react';
import { HistoryItem } from '../types/career';
import {
  History,
  Trash2,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface HistoryArchiveProps {
  history: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryArchive: React.FC<HistoryArchiveProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const toggleCompare = (id: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const compareA = history.find((h) => h.id === selectedForComparison[0]);
  const compareB = history.find((h) => h.id === selectedForComparison[1]);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-orange-100 text-orange-600">
              <History className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">
              Evaluation & Iteration History
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Persisted in localStorage. Track score improvements across prompt revisions and different test resumes.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Comparison Drawer if 2 items selected */}
      {compareA && compareB && (
        <div className="p-6 bg-gradient-to-r from-orange-50/60 to-amber-50/40 rounded-2xl border border-orange-200 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              Side-by-Side Prompt Iteration Comparison
            </h4>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-xs font-medium text-orange-700 hover:underline"
            >
              Reset comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Run A */}
            <div className="bg-white p-4 rounded-xl border border-orange-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Run A: {compareA.candidateName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {compareA.atsScore}% ATS
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Persona: <strong>{compareA.personaUsed}</strong> · {compareA.timestamp}
              </div>
              <p className="text-xs text-slate-700 line-clamp-3 italic">
                "{compareA.analysis.summary}"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-amber-700">
                  {compareA.analysis.missing_keywords?.length || 0} missing keywords
                </span>
                <button
                  onClick={() => onSelectHistoryItem(compareA)}
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Load full output →
                </button>
              </div>
            </div>

            {/* Run B */}
            <div className="bg-white p-4 rounded-xl border border-orange-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Run B: {compareB.candidateName}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  {compareB.atsScore}% ATS
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Persona: <strong>{compareB.personaUsed}</strong> · {compareB.timestamp}
              </div>
              <p className="text-xs text-slate-700 line-clamp-3 italic">
                "{compareB.analysis.summary}"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-amber-700">
                  {compareB.analysis.missing_keywords?.length || 0} missing keywords
                </span>
                <button
                  onClick={() => onSelectHistoryItem(compareB)}
                  className="font-semibold text-orange-600 hover:underline"
                >
                  Load full output →
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-orange-200/60">
            📊 <strong>Delta Insight:</strong> Difference of{' '}
            <strong className="text-orange-700">
              {Math.abs(compareA.atsScore - compareB.atsScore)} points
            </strong>{' '}
            between evaluations. Notice how switching between personas (e.g. Enterprise ATS Coach vs Silicon Valley Tech Recruiter) shifts the severity of technical keyword scoring!
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs">
          <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">No evaluations yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Run an analysis using the 5 preloaded sample resumes or upload your own PDF to start building your test history.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 font-semibold px-1">
            Select any 2 runs to compare side-by-side ({selectedForComparison.length}/2 selected)
          </div>

          {history.map((item) => {
            const isCompared = selectedForComparison.includes(item.id);
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompared
                    ? 'border-orange-500 ring-2 ring-orange-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">
                      {item.candidateName}
                    </span>
                    <span className="text-xs text-slate-500">
                      → {item.targetRole}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        item.atsScore >= 80
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.atsScore >= 65
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {item.atsScore}/100 ATS
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    <span>·</span>
                    <span>Persona: <strong>{item.personaUsed}</strong></span>
                    <span>·</span>
                    <span>Keywords gap: {item.analysis.missing_keywords?.length || 0} terms</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-1 italic">
                    "{item.analysis.summary}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleCompare(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      isCompared
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isCompared ? 'Comparing' : 'Compare'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectHistoryItem(item)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
