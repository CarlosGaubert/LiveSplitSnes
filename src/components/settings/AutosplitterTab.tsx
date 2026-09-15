import React from 'react';
import { 
  Radio, 
  Play, 
  FastForward, 
  RotateCcw, 
  HelpCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { snesAutoSplitter } from '../../services/snesAutoSplitter';

export const AutosplitterTab: React.FC = () => {
  const {
    autosplitterConfig,
    updateAutosplitterConfig,
    emulatorStatus,
    emulatorStatusMessage,
  } = useApp();

  const handleConnectToggle = () => {
    if (emulatorStatus === 'connected' || emulatorStatus === 'simulated') {
      snesAutoSplitter.disconnect();
    } else {
      snesAutoSplitter.connect();
    }
  };

  return (
    <div className="flex flex-col gap-4 font-sans text-xs">
      {/* Emulator Connection Box */}
      <div className="p-3 bg-black/40 rounded-lg border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-sky-400" />
            <span className="font-semibold text-white">Estado de Conexión:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                emulatorStatus === 'connected'
                  ? 'bg-emerald-400'
                  : emulatorStatus === 'simulated'
                  ? 'bg-amber-400'
                  : emulatorStatus === 'connecting'
                  ? 'bg-sky-400 animate-ping'
                  : 'bg-rose-500'
              }`}
            />
            <span
              className={
                emulatorStatus === 'connected'
                  ? 'text-emerald-400 font-bold'
                  : emulatorStatus === 'simulated'
                  ? 'text-amber-300 font-bold'
                  : 'text-white/60'
              }
            >
              {emulatorStatusMessage}
            </span>
          </div>
        </div>

        {/* Emulator Type Selector */}
        <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          <button
            onClick={() => {
              updateAutosplitterConfig({ emulatorType: 'qusb2snes', serverUrl: 'ws://localhost:8080' });
            }}
            className={`p-2 rounded border text-center transition ${
              autosplitterConfig.emulatorType === 'qusb2snes'
                ? 'border-sky-400 bg-sky-950/40 text-sky-200'
                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            QUsb2snes / Snes9x
          </button>

          <button
            onClick={() => {
              updateAutosplitterConfig({ emulatorType: 'retroarch', serverUrl: 'ws://127.0.0.1:55355' });
            }}
            className={`p-2 rounded border text-center transition ${
              autosplitterConfig.emulatorType === 'retroarch'
                ? 'border-sky-400 bg-sky-950/40 text-sky-200'
                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            RetroArch Web
          </button>

          <button
            onClick={() => {
              updateAutosplitterConfig({ emulatorType: 'mock' });
              snesAutoSplitter.setSimulatedMode(true);
            }}
            className={`p-2 rounded border text-center transition ${
              autosplitterConfig.emulatorType === 'mock'
                ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Simulador Mock
          </button>
        </div>

        {/* Server URL Input */}
        {autosplitterConfig.emulatorType !== 'mock' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={autosplitterConfig.serverUrl}
              onChange={(e) => updateAutosplitterConfig({ serverUrl: e.target.value })}
              placeholder="ws://localhost:8080"
              className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={handleConnectToggle}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition text-xs"
            >
              {emulatorStatus === 'connected' ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        )}
      </div>

      {/* Simulator Test Sandbox */}
      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg">
        <div className="font-semibold text-amber-300 text-xs mb-1 flex items-center gap-1.5">
          <Play size={12} />
          <span>Prueba Interactiva de Triggers (Auto-Split):</span>
        </div>
        <p className="text-[11px] text-white/60 mb-2.5">
          Puedes simular eventos de memoria RAM de SNES para comprobar cómo reacciona el temporizador automáticamente:
        </p>

        <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
          <button
            onClick={() => snesAutoSplitter.triggerSimulatedStart()}
            className="p-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/30 text-emerald-300 rounded font-semibold flex items-center justify-center gap-1 transition"
          >
            <Play size={11} fill="currentColor" />
            <span>RAM: Iniciar</span>
          </button>

          <button
            onClick={() => snesAutoSplitter.triggerSimulatedSplit()}
            className="p-1.5 bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/30 text-sky-300 rounded font-semibold flex items-center justify-center gap-1 transition"
          >
            <FastForward size={11} />
            <span>RAM: Split</span>
          </button>

          <button
            onClick={() => snesAutoSplitter.triggerSimulatedReset()}
            className="p-1.5 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/30 text-rose-300 rounded font-semibold flex items-center justify-center gap-1 transition"
          >
            <RotateCcw size={11} />
            <span>RAM: Reset</span>
          </button>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-[11px] text-white/70 flex flex-col gap-1.5">
        <div className="flex items-center gap-1 text-white font-semibold">
          <HelpCircle size={13} className="text-indigo-400" />
          <span>¿Cómo conectar tu emulador?</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-white/60">
          <li><strong>RetroArch:</strong> Activa el comando de red en <em>Ajustes &gt; Red &gt; Comandos de red</em> (puerto 55355).</li>
          <li><strong>Snes9x / BizHawk / SD2SNES:</strong> Inicia <em>QUsb2snes</em> en segundo plano en el puerto por defecto 8080.</li>
          <li><strong>Sin emulador por ahora:</strong> Activa el <em>Simulador Mock</em> arriba para entrenar y probar los splits con atajos de teclado.</li>
        </ul>
      </div>
    </div>
  );
};
