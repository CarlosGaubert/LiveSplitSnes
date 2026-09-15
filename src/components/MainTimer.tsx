import React from 'react';
import { useApp } from '../context/AppContext';
import { formatTime, formatDelta } from '../utils/timeFormat';

export const MainTimer: React.FC = () => {
  const {
    elapsedMs,
    timerStatus,
    activeGame,
    currentSplitIndex,
    theme,
  } = useApp();

  const currentSplit = activeGame.splits[currentSplitIndex] || null;

  // Calculate current delta vs PB at this split
  let deltaMs: number | null = null;
  let isAhead = false;

  if (timerStatus !== 'idle' && currentSplit && currentSplit.pbTime !== null) {
    deltaMs = elapsedMs - currentSplit.pbTime;
    isAhead = deltaMs < 0;
  }

  // Parse time into main and fractional
  const formatted = formatTime(elapsedMs, { decimalDigits: 2, alwaysShowMinutes: true });
  const [mainTime, centiseconds] = formatted.split('.');

  // Get dynamic font family class
  const getFontClass = () => {
    switch (theme.fontFamily) {
      case 'pixel':
        return 'font-pixel tracking-wider text-2xl';
      case 'retro':
        return 'font-retro tracking-widest text-4xl';
      case 'sans':
        return 'font-sans font-bold tracking-tight text-3xl';
      case 'digital':
      default:
        return 'font-digital tracking-tight text-4xl';
    }
  };

  const getTimerColor = () => {
    if (timerStatus === 'idle') return 'text-white/80';
    if (timerStatus === 'paused') return 'text-amber-300';
    if (deltaMs === null) return 'text-white';
    return isAhead ? 'text-emerald-400' : 'text-rose-400';
  };

  return (
    <div className="flex flex-col items-end justify-center px-4 py-3 bg-black/40 border-b border-white/10 backdrop-blur-sm relative overflow-hidden select-none">
      {/* Subtle delta indicator tag */}
      {deltaMs !== null && timerStatus !== 'idle' && (
        <div
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded mb-1 transition-colors ${
            isAhead
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}
        >
          {formatDelta(deltaMs)}
        </div>
      )}

      {/* Main clock */}
      <div className={`flex items-baseline font-bold drop-shadow-md transition-colors ${getFontClass()} ${getTimerColor()}`}>
        <span>{mainTime}</span>
        <span className="text-xl opacity-75 font-mono ml-0.5">.{centiseconds || '00'}</span>
      </div>

      {/* Current target or active split name */}
      <div className="w-full flex justify-between items-center text-[11px] text-white/50 mt-1 font-mono">
        <span className="truncate max-w-[180px]">
          {timerStatus === 'idle'
            ? 'Listo para iniciar'
            : timerStatus === 'ended'
            ? '¡Run completada!'
            : currentSplit?.name || 'En curso'}
        </span>
        <span>
          Objetivo:{' '}
          <strong className="text-white/80">
            {formatTime(currentSplit?.pbTime, { fallback: '-' })}
          </strong>
        </span>
      </div>
    </div>
  );
};
