import React from 'react';
import { Target, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { PracticeSegment } from '../../types/practice';

interface ConsistencyMeterProps {
  segment: PracticeSegment;
}

export const ConsistencyMeter: React.FC<ConsistencyMeterProps> = ({ segment }) => {
  const { attemptsCount, successCount, recentAttempts } = segment;

  const successRate =
    attemptsCount > 0 ? Math.round((successCount / attemptsCount) * 100) : 0;

  // Calculate current streak
  let currentStreak = 0;
  for (const attempt of recentAttempts) {
    if (attempt.success) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Color code depending on success rate
  const getRateColor = () => {
    if (successRate >= 80) return 'text-emerald-400';
    if (successRate >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBarColor = () => {
    if (successRate >= 80) return 'bg-emerald-500';
    if (successRate >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-3 bg-black/40 rounded-lg border border-white/10 select-none text-xs font-mono">
      {/* Rate & Streak Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Target size={14} className="text-purple-400" />
          <span className="text-white/60">Consistencia:</span>
          <span className={`font-bold text-sm ${getRateColor()}`}>
            {successRate}%
          </span>
          <span className="text-white/40 text-[10px]">
            ({successCount}/{attemptsCount})
          </span>
        </div>

        {currentStreak > 1 && (
          <div className="flex items-center gap-1 text-amber-400 font-bold text-[11px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            <Flame size={12} className="animate-bounce" />
            <span>Racha {currentStreak}x</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: `${successRate}%` }}
        />
      </div>

      {/* Recent attempts pills */}
      <div>
        <div className="text-[10px] text-white/40 mb-1">Últimos intentos:</div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {recentAttempts.length === 0 ? (
            <span className="text-[10px] text-white/30 italic">Sin intentos registrados</span>
          ) : (
            recentAttempts.slice(0, 12).map((attempt, idx) => (
              <div
                key={attempt.id || idx}
                title={`${attempt.success ? 'Logrado' : 'Fallado'} (${Math.round(attempt.timeMs / 100) / 10}s)`}
                className="transition transform hover:scale-125"
              >
                {attempt.success ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <XCircle size={13} className="text-rose-500" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
