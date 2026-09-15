import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Check, 
  X, 
  Save, 
  Trophy, 
  Plus 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConsistencyMeter } from './ConsistencyMeter';
import { SegmentNotes } from './SegmentNotes';
import { formatTime } from '../../utils/timeFormat';

export const PracticeView: React.FC = () => {
  const {
    practiceSegments,
    activePractice,
    setActivePracticeId,
    practiceStatus,
    practiceElapsedMs,
    startPracticeTimer,
    stopPracticeTimer,
    quickResetPractice,
    loadPracticeSavestate,
    updatePracticeNotes,
    addPracticeSegment,
    activeGame,
  } = useApp();

  const [isCreatingSegment, setIsCreatingSegment] = useState(false);
  const [newSegName, setNewSegName] = useState('');
  const [newSegTarget, setNewSegTarget] = useState('20.00');
  const [newSegSlot, setNewSegSlot] = useState(1);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegName.trim()) return;

    const parts = newSegTarget.split('.');
    const sec = parseFloat(parts[0] || '0');
    const dec = parseFloat('0.' + (parts[1] || '0'));
    const targetMs = Math.round((sec + dec) * 1000);

    addPracticeSegment({
      name: newSegName.trim(),
      gameId: activeGame.id,
      category: activeGame.category,
      targetTimeMs: targetMs,
      savestateSlot: newSegSlot,
      notes: '',
      visualCues: [],
    });

    setNewSegName('');
    setIsCreatingSegment(false);
  };

  if (!activePractice) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-white/60 text-xs mb-3">No hay segmentos de práctica configurados.</p>
        <button
          onClick={() => setIsCreatingSegment(true)}
          className="px-3 py-1.5 bg-indigo-600 rounded text-xs text-white font-medium"
        >
          Crear Primer Segmento
        </button>
      </div>
    );
  }

  const formattedTime = formatTime(practiceElapsedMs, { decimalDigits: 2, alwaysShowMinutes: true });
  const [secPart, fracPart] = formattedTime.split('.');

  return (
    <div className="flex-1 overflow-y-auto flex flex-col p-3 gap-3 font-mono text-xs select-none">
      {/* Segment Selector & Creation Button */}
      <div className="flex items-center gap-1.5">
        <div className="relative flex-1">
          <select
            value={activePractice.id}
            onChange={(e) => setActivePracticeId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
          >
            {practiceSegments.map((seg) => (
              <option key={seg.id} value={seg.id} className="bg-slate-900 text-white">
                {seg.name} (Slot {seg.savestateSlot})
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
            ▼
          </div>
        </div>

        <button
          onClick={() => setIsCreatingSegment(!isCreatingSegment)}
          title="Crear nuevo segmento de entrenamiento"
          className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 border border-purple-500/30 transition flex-shrink-0"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* New Segment Form Modal/Drawer */}
      {isCreatingSegment && (
        <form
          onSubmit={handleCreate}
          className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-lg flex flex-col gap-2 animate-fadeIn"
        >
          <div className="text-[11px] font-bold text-purple-300">Nuevo Truco / Segmento:</div>
          <input
            type="text"
            placeholder="Nombre (ej. Mockball, Boss Kill)"
            value={newSegName}
            onChange={(e) => setNewSegName(e.target.value)}
            className="bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white font-sans focus:outline-none focus:border-purple-400"
            autoFocus
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-white/50 block">Tiempo Objetivo (seg):</label>
              <input
                type="text"
                value={newSegTarget}
                onChange={(e) => setNewSegTarget(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <div className="w-24">
              <label className="text-[10px] text-white/50 block">Savestate Slot:</label>
              <input
                type="number"
                min="0"
                max="9"
                value={newSegSlot}
                onChange={(e) => setNewSegSlot(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => setIsCreatingSegment(false)}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/15 text-white/70 text-[11px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px]"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      {/* Main Practice Stopwatch Card */}
      <div className="p-3 bg-gradient-to-b from-black/60 to-black/30 rounded-xl border border-white/15 backdrop-blur-md flex flex-col items-center justify-center relative shadow-lg">
        {/* Slot badge & Savestate button */}
        <div className="w-full flex items-center justify-between mb-2">
          <button
            onClick={loadPracticeSavestate}
            title="Cargar Savestate inmediatamente en el emulador"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold transition active:scale-95"
          >
            <Save size={12} />
            <span>Cargar Slot {activePractice.savestateSlot}</span>
          </button>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-white/40">Obj:</span>
            <span className="text-white font-bold">
              {formatTime(activePractice.targetTimeMs)}
            </span>
          </div>
        </div>

        {/* Stopwatch digits */}
        <div className="text-4xl font-bold font-digital tracking-tight text-white drop-shadow my-1 flex items-baseline">
          <span>{secPart}</span>
          <span className="text-xl text-white/60 ml-0.5">.{fracPart || '00'}</span>
        </div>

        {/* Best Practice Time Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-medium">
          <Trophy size={13} />
          <span>Mejor en práctica: </span>
          <strong className="text-amber-300">
            {formatTime(activePractice.bestTimeMs, { fallback: 'Sin récord' })}
          </strong>
        </div>

        {/* Practice Quick Action Buttons */}
        <div className="w-full grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-white/10">
          {practiceStatus === 'idle' ? (
            <button
              onClick={startPracticeTimer}
              className="col-span-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <Play size={14} fill="currentColor" />
              <span>Iniciar (Espacio)</span>
            </button>
          ) : practiceStatus === 'running' ? (
            <>
              <button
                onClick={() => stopPracticeTimer(true)}
                className="col-span-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition active:scale-95"
                title="Marcar intento como logrado"
              >
                <Check size={14} />
                <span>Éxito (K)</span>
              </button>
              <button
                onClick={() => stopPracticeTimer(false)}
                className="col-span-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition active:scale-95"
                title="Marcar intento como fallido"
              >
                <X size={14} />
                <span>Fallo</span>
              </button>
            </>
          ) : (
            <button
              onClick={startPracticeTimer}
              className="col-span-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <RotateCcw size={14} />
              <span>Reintentar</span>
            </button>
          )}

          {/* Quick Reset & Load Savestate */}
          <button
            onClick={quickResetPractice}
            title="Reiniciar y Cargar Savestate (L)"
            className="py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 font-semibold text-xs flex items-center justify-center gap-1 transition active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Reset (L)</span>
          </button>
        </div>
      </div>

      {/* Consistency & Streak Meter */}
      <ConsistencyMeter segment={activePractice} />

      {/* Segment Setup Notes & Visual Cues */}
      <SegmentNotes
        segment={activePractice}
        onUpdateNotes={updatePracticeNotes}
      />
    </div>
  );
};
