import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Download, Upload, Gamepad } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SplitItem } from '../../types/splits';
import { formatTime, parseTimeToMs } from '../../utils/timeFormat';

export const SplitsEditorTab: React.FC = () => {
  const { games, activeGame, setActiveGameId, updateSplits, addGameProfile } = useApp();

  const [newSplitName, setNewSplitName] = useState('');
  const [newSplitTime, setNewSplitTime] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameCategory, setNewGameCategory] = useState('');

  const handleUpdateSplitName = (id: string, name: string) => {
    const updated = activeGame.splits.map((s) => (s.id === id ? { ...s, name } : s));
    updateSplits(updated);
  };

  const handleUpdateSplitPb = (id: string, timeStr: string) => {
    const ms = parseTimeToMs(timeStr);
    const updated = activeGame.splits.map((s) => (s.id === id ? { ...s, pbTime: ms } : s));
    updateSplits(updated);
  };

  const handleMoveSplit = (index: number, direction: 'up' | 'down') => {
    const splits = [...activeGame.splits];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= splits.length) return;

    const [moved] = splits.splice(index, 1);
    splits.splice(targetIdx, 0, moved);
    updateSplits(splits);
  };

  const handleDeleteSplit = (id: string) => {
    if (activeGame.splits.length <= 1) return;
    const updated = activeGame.splits.filter((s) => s.id !== id);
    updateSplits(updated);
  };

  const handleAddSplit = () => {
    if (!newSplitName.trim()) return;
    const pbMs = parseTimeToMs(newSplitTime);
    const newSplit: SplitItem = {
      id: 'split-' + Date.now().toString(36),
      name: newSplitName.trim(),
      pbTime: pbMs,
      bestSegment: null,
      currentSplitTime: null,
    };
    updateSplits([...activeGame.splits, newSplit]);
    setNewSplitName('');
    setNewSplitTime('');
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle.trim()) return;
    const newGame = {
      id: 'game-' + Date.now().toString(36),
      gameName: newGameTitle.trim(),
      category: newGameCategory.trim() || 'Any%',
      attempts: 0,
      completedRuns: 0,
      splits: [
        { id: '1', name: 'Segmento 1', pbTime: 60000, bestSegment: 60000, currentSplitTime: null },
        { id: '2', name: 'Final', pbTime: 120000, bestSegment: 60000, currentSplitTime: null },
      ],
    };
    addGameProfile(newGame);
    setNewGameTitle('');
    setNewGameCategory('');
    setIsCreatingGame(false);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeGame, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeGame.gameName.replace(/\s+/g, '_')}_splits.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.gameName && Array.isArray(parsed.splits)) {
            addGameProfile({
              ...parsed,
              id: 'imported-' + Date.now().toString(36),
            });
          }
        } catch {
          alert('Archivo JSON de splits no válido');
        }
      };
    }
  };

  return (
    <div className="flex flex-col gap-3 font-sans text-xs">
      {/* Game Selector */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-white/60 text-[11px] block mb-1">Juego y Categoría:</label>
          <select
            value={activeGame.id}
            onChange={(e) => setActiveGameId(e.target.value)}
            className="w-full bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                {g.gameName} ({g.category})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsCreatingGame(!isCreatingGame)}
          className="self-end py-1.5 px-2.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1"
        >
          <Gamepad size={13} />
          <span>Nuevo Juego</span>
        </button>
      </div>

      {isCreatingGame && (
        <form onSubmit={handleCreateGame} className="p-2.5 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-2">
          <div className="text-[11px] font-bold text-white">Nuevo Juego de SNES:</div>
          <input
            type="text"
            placeholder="Título del juego (ej. Mega Man X)"
            value={newGameTitle}
            onChange={(e) => setNewGameTitle(e.target.value)}
            className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white"
            autoFocus
          />
          <input
            type="text"
            placeholder="Categoría (ej. 100%, Any%)"
            value={newGameCategory}
            onChange={(e) => setNewGameCategory(e.target.value)}
            className="bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsCreatingGame(false)}
              className="px-2 py-1 bg-white/10 rounded text-[11px] text-white/70"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 rounded text-[11px] text-white font-bold"
            >
              Crear
            </button>
          </div>
        </form>
      )}

      {/* Splits Table Editor */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-white/70 font-semibold">Editar Segmentos / Splits:</label>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              title="Exportar splits en formato JSON"
              className="text-white/50 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <Download size={12} />
              <span>Exportar</span>
            </button>
            <label className="text-white/50 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer">
              <Upload size={12} />
              <span>Importar</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto border border-white/10 rounded-lg divide-y divide-white/5 bg-black/40">
          {activeGame.splits.map((split, idx) => (
            <div key={split.id} className="p-1.5 flex items-center gap-2 hover:bg-white/5 font-mono">
              <span className="text-[10px] text-white/30 w-4 text-center">{idx + 1}</span>

              {/* Name */}
              <input
                type="text"
                value={split.name}
                onChange={(e) => handleUpdateSplitName(split.id, e.target.value)}
                className="flex-1 bg-transparent border-b border-transparent focus:border-indigo-400 px-1 py-0.5 text-xs text-white font-sans focus:outline-none"
              />

              {/* PB Time */}
              <input
                type="text"
                defaultValue={formatTime(split.pbTime, { fallback: '-' })}
                onBlur={(e) => handleUpdateSplitPb(split.id, e.target.value)}
                placeholder="00:00.00"
                className="w-20 bg-black/50 border border-white/10 rounded px-1.5 py-0.5 text-xs text-right text-white/90 focus:outline-none focus:border-indigo-400"
                title="Tiempo acumulado PB"
              />

              {/* Order buttons */}
              <button
                onClick={() => handleMoveSplit(idx, 'up')}
                disabled={idx === 0}
                className="p-1 text-white/40 hover:text-white disabled:opacity-20"
              >
                <ArrowUp size={11} />
              </button>
              <button
                onClick={() => handleMoveSplit(idx, 'down')}
                disabled={idx === activeGame.splits.length - 1}
                className="p-1 text-white/40 hover:text-white disabled:opacity-20"
              >
                <ArrowDown size={11} />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDeleteSplit(split.id)}
                className="p-1 text-white/30 hover:text-rose-400 transition"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Split Form */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/5 border border-white/10 rounded-lg">
        <input
          type="text"
          placeholder="Nombre del nuevo split..."
          value={newSplitName}
          onChange={(e) => setNewSplitName(e.target.value)}
          className="flex-1 bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white font-sans focus:outline-none focus:border-indigo-400"
          onKeyDown={(e) => e.key === 'Enter' && handleAddSplit()}
        />
        <input
          type="text"
          placeholder="Tiempo PB (ej. 1:20.00)"
          value={newSplitTime}
          onChange={(e) => setNewSplitTime(e.target.value)}
          className="w-24 bg-black/60 border border-white/15 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none focus:border-indigo-400 text-right"
          onKeyDown={(e) => e.key === 'Enter' && handleAddSplit()}
        />
        <button
          onClick={handleAddSplit}
          className="p-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};
