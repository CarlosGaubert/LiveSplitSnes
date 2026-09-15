import React from 'react';
import { Image, Eye, Sparkles, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PRESET_BACKGROUNDS = [
  {
    name: 'Oscuro Minimal',
    url: '',
    type: 'color' as const,
    color: '#0a0d14',
  },
  {
    name: 'Cyberpunk Grid',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    color: '#090d16',
  },
  {
    name: 'Retro Arcade Neon',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    color: '#090d16',
  },
  {
    name: 'Super Metroid Vibes',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    type: 'image' as const,
    color: '#080512',
  },
  {
    name: 'Chroma Verde (OBS)',
    url: '',
    type: 'chroma' as const,
    color: '#00ff00',
  },
  {
    name: 'Chroma Magenta (OBS)',
    url: '',
    type: 'chroma' as const,
    color: '#ff00ff',
  },
];

export const BackgroundTab: React.FC = () => {
  const { theme, updateTheme } = useApp();

  return (
    <div className="flex flex-col gap-4 font-sans text-xs">
      {/* Presets Grid */}
      <div>
        <label className="text-white/70 font-semibold mb-2 block flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-400" />
          <span>Fondos Predefinidos:</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_BACKGROUNDS.map((preset) => {
            const isSelected =
              preset.type === theme.bgType &&
              (preset.type === 'image' ? preset.url === theme.bgImage : preset.color === (preset.type === 'chroma' ? theme.chromaColor : theme.bgColor));

            return (
              <button
                key={preset.name}
                onClick={() => {
                  if (preset.type === 'chroma') {
                    updateTheme({
                      bgType: 'chroma',
                      chromaColor: preset.color,
                      bgOpacity: 1.0,
                    });
                  } else if (preset.type === 'image') {
                    updateTheme({
                      bgType: 'image',
                      bgImage: preset.url,
                      bgColor: preset.color,
                    });
                  } else {
                    updateTheme({
                      bgType: 'color',
                      bgColor: preset.color,
                      bgImage: '',
                    });
                  }
                }}
                className={`p-2 rounded-lg border text-left transition relative overflow-hidden flex flex-col justify-between h-16 ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                {preset.url ? (
                  <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center -z-10"
                    style={{ backgroundImage: `url(${preset.url})` }}
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-40 -z-10"
                    style={{ backgroundColor: preset.color }}
                  />
                )}
                <span className="font-semibold text-[11px] text-white leading-tight">
                  {preset.name}
                </span>
                {isSelected && (
                  <span className="self-end bg-indigo-500 rounded-full p-0.5 text-white">
                    <Check size={10} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Image URL */}
      <div>
        <label className="text-white/70 font-semibold mb-1.5 block flex items-center gap-1.5">
          <Image size={13} className="text-sky-400" />
          <span>Imagen de Fondo Personalizada (URL):</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://ejemplo.com/fondo-snes.jpg"
            value={theme.bgImage}
            onChange={(e) =>
              updateTheme({
                bgImage: e.target.value,
                bgType: e.target.value ? 'image' : 'color',
              })
            }
            className="flex-1 bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 font-mono"
          />
          {theme.bgImage && (
            <button
              onClick={() => updateTheme({ bgImage: '', bgType: 'color' })}
              className="px-2 py-1 bg-white/10 hover:bg-white/15 rounded-lg text-white/70 text-[11px]"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      {/* Opacity Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-white/70 font-semibold flex items-center gap-1.5">
            <Eye size={13} className="text-emerald-400" />
            <span>Opacidad del Fondo:</span>
          </label>
          <span className="font-mono text-white/90">
            {Math.round(theme.bgOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={theme.bgOpacity}
          onChange={(e) => updateTheme({ bgOpacity: parseFloat(e.target.value) })}
          className="w-full accent-indigo-500 cursor-pointer"
        />
        <span className="text-[10px] text-white/40 block mt-0.5">
          Un valor bajo hace que el fondo sea translúcido sobre tu escritorio o emulador.
        </span>
      </div>

      {/* Backdrop Blur Slider */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-white/70 font-semibold">Desenfoque (Backdrop Blur):</label>
          <span className="font-mono text-white/90">{theme.backdropBlur}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={theme.backdropBlur}
          onChange={(e) => updateTheme({ backdropBlur: parseInt(e.target.value, 10) })}
          className="w-full accent-indigo-500 cursor-pointer"
        />
        <span className="text-[10px] text-white/40 block mt-0.5">
          Efecto vidrio/acrílico esmerilado.
        </span>
      </div>

      {/* Chroma Key Mode Explanation */}
      {theme.bgType === 'chroma' && (
        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-200">
          <strong>Modo Chroma Key Activo:</strong> Perfecto para capturar esta ventana en OBS Studio o Streamlabs y aplicar un filtro "Filtro de Color / Croma" para eliminar el fondo verde/magenta en transmisiones en vivo.
        </div>
      )}
    </div>
  );
};
