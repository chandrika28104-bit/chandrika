import React from 'react';

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 160 }) => {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let colorClass = '#ef4444'; // Red
  let badgeText = 'Needs Work';
  let badgeColor = 'text-red-700 bg-red-50 border-red-200';

  if (clampedScore >= 80) {
    colorClass = '#16a34a'; // Green
    badgeText = 'Strong Match';
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (clampedScore >= 65) {
    colorClass = '#f59e0b'; // Amber
    badgeText = 'Moderate Fit';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (clampedScore >= 50) {
    colorClass = '#ea580c'; // Orange
    badgeText = 'Fair Match';
    badgeColor = 'text-orange-700 bg-orange-50 border-orange-200';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-extrabold tracking-tight text-slate-900">
            {clampedScore}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            / 100 ATS
          </span>
        </div>
      </div>

      <div
        className={`mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColor}`}
      >
        {badgeText}
      </div>
    </div>
  );
};
