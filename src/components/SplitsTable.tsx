import React, { useRef, useEffect } from 'react';
import { Award, ChevronRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime, formatDelta } from '../utils/timeFormat';

export const SplitsTable: React.FC = () => {
  const { activeGame, currentSplitIndex, timerStatus } = useApp();
  const activeRowRef = useRef<HTMLTableRowElement>(null);

  // Auto-scroll to active split
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentSplitIndex]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden font-mono text-xs select-none">
      <table className="w-full border-collapse">
        <tbody>
          {activeGame.splits.map((split, index) => {
            const isPassed = index < currentSplitIndex || (index === currentSplitIndex && timerStatus === 'ended');
            const isActive = index === currentSplitIndex && timerStatus !== 'idle' && timerStatus !== 'ended';

            // Delta calculation for passed split
            let deltaMs: number | null = null;
            if (isPassed && split.currentSplitTime !== null && split.pbTime !== null) {
              deltaMs = split.currentSplitTime - split.pbTime;
            }

            const isGold = split.isGold;
            const isAhead = deltaMs !== null && deltaMs < 0;

            return (
              <tr
                key={split.id}
                ref={isActive ? activeRowRef : null}
                className={`border-b border-white/5 transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-inner'
                    : isPassed
                    ? 'text-white/80 hover:bg-white/5'
                    : 'text-white/40 hover:bg-white/5'
                }`}
              >
                {/* Status Indicator & Name */}
                <td className="py-1.5 px-3 flex items-center gap-1.5 truncate max-w-[170px]">
                  {isActive ? (
                    <ChevronRight size={13} className="text-amber-400 animate-pulse flex-shrink-0" />
                  ) : isPassed ? (
                    <Check size={12} className="text-emerald-400 flex-shrink-0" />
                  ) : (
                    <span className="w-3 text-center text-[10px] text-white/30 flex-shrink-0">
                      {index + 1}
                    </span>
                  )}
                  <span className="truncate" title={split.notes || split.name}>
                    {split.name}
                  </span>
                </td>

                {/* Delta Column */}
                <td className="py-1.5 px-2 text-right whitespace-nowrap">
                  {isPassed && deltaMs !== null ? (
                    <span
                      className={`inline-flex items-center gap-0.5 font-bold ${
                        isGold
                          ? 'text-amber-400'
                          : isAhead
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {isGold && <Award size={10} className="inline text-amber-400" />}
                      {formatDelta(deltaMs)}
                    </span>
                  ) : (
                    <span className="text-white/20">-</span>
                  )}
                </td>

                {/* Time Column (Current time if passed, or Target PB if upcoming) */}
                <td className="py-1.5 px-3 text-right whitespace-nowrap font-medium">
                  {isPassed && split.currentSplitTime !== null ? (
                    <span className="text-white">
                      {formatTime(split.currentSplitTime)}
                    </span>
                  ) : (
                    <span className="text-white/40">
                      {formatTime(split.pbTime, { fallback: '-' })}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
