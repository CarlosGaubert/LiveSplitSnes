import React from 'react';
import { Play, Pause, RotateCcw, Undo2, SkipForward } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Controls: React.FC = () => {
  const {
    timerStatus,
    startTimer,
    splitTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    undoSplit,
    skipSplit,
  } = useApp();

  return (
    <div className="flex items-center justify-between gap-1 p-2 bg-black/60 border-t border-white/10 backdrop-blur-md select-none">
      {/* Undo */}
      <button
        onClick={undoSplit}
        title="Deshacer split (Backspace)"
        className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition flex flex-col items-center text-[9px]"
      >
        <Undo2 size={14} />
      </button>

      {/* Skip */}
      <button
        onClick={skipSplit}
        title="Omitir split"
        className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition flex flex-col items-center text-[9px]"
      >
        <SkipForward size={14} />
      </button>

      {/* Primary Action: Start / Split / Resume */}
      {timerStatus === 'idle' ? (
        <button
          onClick={startTimer}
          className="flex-1 py-1.5 px-3 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Play size={13} fill="currentColor" />
          <span>Iniciar (Espacio)</span>
        </button>
      ) : timerStatus === 'running' ? (
        <button
          onClick={splitTimer}
          className="flex-1 py-1.5 px-3 rounded-md bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <span>Split (Espacio)</span>
        </button>
      ) : timerStatus === 'paused' ? (
        <button
          onClick={resumeTimer}
          className="flex-1 py-1.5 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Play size={13} fill="currentColor" />
          <span>Reanudar</span>
        </button>
      ) : (
        <button
          onClick={resetTimer}
          className="flex-1 py-1.5 px-3 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
        >
          <RotateCcw size={13} />
          <span>Nueva Carrera</span>
        </button>
      )}

      {/* Pause (if running) */}
      {timerStatus === 'running' && (
        <button
          onClick={pauseTimer}
          title="Pausar (P)"
          className="p-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition flex flex-col items-center"
        >
          <Pause size={14} />
        </button>
      )}

      {/* Reset */}
      <button
        onClick={resetTimer}
        title="Reiniciar carrera (R)"
        className="p-1.5 rounded-md bg-white/5 hover:bg-rose-500/20 text-white/60 hover:text-rose-300 transition flex flex-col items-center"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
};
