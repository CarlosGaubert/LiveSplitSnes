import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/timeFormat';

export const FooterStats: React.FC = () => {
  const { activeGame, currentSplitIndex, elapsedMs, timerStatus } = useApp();

  // Sum of Best Segments calculation
  const sumOfBest = activeGame.splits.reduce((acc, split) => {
    return split.bestSegment ? acc + split.bestSegment : acc;
  }, 0);

  // Best Possible Time calculation
  // (Elapsed time + best segments of all remaining splits)
  let bestPossibleTime: number | null = null;
  if (timerStatus !== 'idle') {
    const remainingBest = activeGame.splits
      .slice(currentSplitIndex)
      .reduce((acc, split) => acc + (split.bestSegment || 0), 0);
    bestPossibleTime = elapsedMs + remainingBest;
  }

  // Previous split segment duration
  let prevSegmentTime: number | null = null;
  if (currentSplitIndex > 0) {
    const prevSplit = activeGame.splits[currentSplitIndex - 1];
    const prevPrevTime =
      currentSplitIndex > 1
        ? activeGame.splits[currentSplitIndex - 2].currentSplitTime || 0
        : 0;
    if (prevSplit?.currentSplitTime) {
      prevSegmentTime = prevSplit.currentSplitTime - prevPrevTime;
    }
  }

  return (
    <div className="px-3 py-1.5 bg-black/40 border-t border-white/10 font-mono text-[11px] select-none">
      <div className="flex justify-between items-center text-white/50 mb-0.5">
        <span>Mejor Segmento Prev:</span>
        <span className="text-white/80 font-medium">
          {formatTime(prevSegmentTime, { fallback: '-' })}
        </span>
      </div>

      <div className="flex justify-between items-center text-white/50 mb-0.5">
        <span>Mejor Tiempo Posible:</span>
        <span className="text-emerald-400/90 font-medium">
          {formatTime(bestPossibleTime, { fallback: '-' })}
        </span>
      </div>

      <div className="flex justify-between items-center text-white/50">
        <span>Suma de Mejores (SoB):</span>
        <span className="text-amber-400/90 font-semibold">
          {formatTime(sumOfBest > 0 ? sumOfBest : null, { fallback: '-' })}
        </span>
      </div>
    </div>
  );
};
