import React from 'react';
import { 
  Pin, 
  Settings, 
  Minus, 
  X, 
  Swords, 
  Timer, 
  Gamepad2,
  GripHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    activeGame,
    theme,
    toggleAlwaysOnTop,
    minimizeWindow,
    closeWindow,
    setIsSettingsOpen,
    emulatorStatus,
    emulatorStatusMessage,
  } = useApp();

  const handleStartDrag = async (e: React.MouseEvent) => {
    // Only drag with left click and ignore button or interactive clicks
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('a')) {
      return;
    }

    try {
      if (window && (window as any).__TAURI_INTERNALS__) {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().startDragging();
      }
    } catch {
      // Running inside web browser
    }
  };

  return (
    <header 
      data-tauri-drag-region
      onMouseDown={handleStartDrag}
      className="flex flex-col border-b border-white/10 bg-black/40 backdrop-blur-md px-3 pt-1 pb-2 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Visual drag grip handle bar */}
      <div 
        data-tauri-drag-region 
        className="w-full flex items-center justify-center py-0.5 mb-1 text-white/25 hover:text-white/60 transition cursor-grab active:cursor-grabbing"
        title="Arrastra para mover la ventana"
      >
        <GripHorizontal size={18} />
      </div>

      {/* Top row: Window controls & Emulator status */}
      <div className="flex items-center justify-between text-xs mb-1">
        {/* Emulator status badge */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          title={emulatorStatusMessage}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10 text-[11px] cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              emulatorStatus === 'connected'
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : emulatorStatus === 'simulated'
                ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                : emulatorStatus === 'connecting'
                ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                : 'bg-rose-500'
            }`}
          />
          <span className="font-mono text-white/70">
            {emulatorStatus === 'connected'
              ? 'SNES Live'
              : emulatorStatus === 'simulated'
              ? 'SNES Sim'
              : emulatorStatus === 'connecting'
              ? 'Conectando...'
              : 'Sin Emulador'}
          </span>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Always on top pin */}
          <button
            onClick={toggleAlwaysOnTop}
            title={theme.windowAlwaysOnTop ? 'Desanclar ventana' : 'Fijar siempre visible'}
            className={`p-1 rounded hover:bg-white/15 transition cursor-pointer ${
              theme.windowAlwaysOnTop ? 'text-amber-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <Pin size={13} className={theme.windowAlwaysOnTop ? 'rotate-45' : ''} />
          </button>

          {/* Settings */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Ajustes de Splits, Fondos y Auto-splitter"
            className="p-1 rounded text-white/60 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <Settings size={13} />
          </button>

          {/* Minimize */}
          <button
            onClick={minimizeWindow}
            title="Minimizar"
            className="p-1 rounded text-white/60 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <Minus size={13} />
          </button>

          {/* Close */}
          <button
            onClick={closeWindow}
            title="Cerrar"
            className="p-1 rounded text-white/60 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Middle row: Game Title & Attempts */}
      <div className="flex items-center justify-between mt-0.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <Gamepad2 size={16} className="text-indigo-400 flex-shrink-0" />
          <div className="truncate">
            <h1 className="font-bold text-sm leading-tight text-white truncate tracking-wide">
              {activeGame.gameName}
            </h1>
            <p className="text-[11px] text-white/50 leading-none truncate">
              {activeGame.category}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0 font-mono text-[11px] text-white/60">
          <span className="text-white/40">Intento: </span>
          <span className="font-bold text-white/90">#{activeGame.attempts}</span>
        </div>
      </div>

      {/* Bottom row: Mode Tabs (Speedrun vs Practice) */}
      <div className="mt-2 grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs">
        <button
          onClick={() => setMode('speedrun')}
          className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-medium transition cursor-pointer ${
            mode === 'speedrun'
              ? 'bg-gradient-to-r from-emerald-600/80 to-teal-600/80 text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Timer size={13} />
          <span>LiveSplit</span>
        </button>

        <button
          onClick={() => setMode('practice')}
          className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-md font-medium transition cursor-pointer ${
            mode === 'practice'
              ? 'bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white shadow-sm'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Swords size={13} />
          <span>Entrenamiento</span>
        </button>
      </div>
    </header>
  );
};
