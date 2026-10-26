import React from 'react';
import { SAMPLE_CASES, SampleCase } from '../data/sampleResumes';
import { X, ArrowRight, UserCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCase: (sampleCase: SampleCase) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectCase,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-orange-100 text-orange-600">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Test with 5 Real Resumes (Assignment Step 6)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any pre-configured benchmark candidate to test ATS scoring, keyword detection, and prompt accuracy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of cases */}
        <div className="p-6 overflow-y-auto space-y-3">
          {SAMPLE_CASES.map((item, index) => (
            <div
              key={item.id}
              onClick={() => {
                onSelectCase(item);
                onClose();
              }}
              className="group p-4 rounded-xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer bg-white hover:bg-orange-50/20"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Test Case #{index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {item.level}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Expected ATS: {item.expectedScoreRange}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 mt-1">
                    Role: {item.role}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {item.description}
                  </p>

                  <div className="mt-2 text-xs text-amber-800 bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/60 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Evaluation Target: {item.keyMismatchNote}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 bg-orange-50 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm"
                >
                  <span>Load Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>You can also upload any PDF or paste custom text anytime.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
