import React from 'react';
import { Type, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FontFamilyType } from '../../types/settings';

export const ThemeTab: React.FC = () => {
  const { theme, updateTheme } = useApp();

  const FONT_OPTIONS: { label: string; value: FontFamilyType; preview: string; className: string }[] = [
    { label: 'Digital 7-Segment', value: 'digital', preview: '12:34.56', className: 'font-digital text-base' },
    { label: 'Pixel 8-Bit', value: 'pixel', preview: '12:34', className: 'font-pixel text-xs' },
    { label: 'Retro CRT', value: 'retro', preview: '12:34.56', className: 'font-retro text-lg' },
    { label: 'Clean Sans', value: 'sans', preview: '12:34.56', className: 'font-sans font-bold text-sm' },
  ];

  return (
    <div className="flex flex-col gap-4 font-sans text-xs">
      {/* Typography Selector */}
      <div>
        <label className="text-white/70 font-semibold mb-2 block flex items-center gap-1.5">
          <Type size={13} className="text-indigo-400" />
          <span>Tipografía del Cronómetro:</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => {
            const isSelected = theme.fontFamily === font.value;
            return (
              <button
                key={font.value}
                onClick={() => updateTheme({ fontFamily: font.value })}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-950/40 ring-1 ring-indigo-400'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="text-[11px] text-white/60 mb-1">{font.label}</span>
                <span className={`text-white font-bold ${font.className}`}>
                  {font.preview}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors Customization */}
      <div>
        <label className="text-white/70 font-semibold mb-2 block flex items-center gap-1.5">
          <Palette size={13} className="text-pink-400" />
          <span>Colores de Carrera y Comparativas:</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Ahead Color */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/80 block font-medium">Tiempo Adelantado (-)</span>
              <span className="text-[10px] text-emerald-400 font-mono">-01.25 seg</span>
            </div>
            <input
              type="color"
              value={theme.aheadColor}
              onChange={(e) => updateTheme({ aheadColor: e.target.value })}
              className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
            />
          </div>

          {/* Behind Color */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/80 block font-medium">Tiempo Retrasado (+)</span>
              <span className="text-[10px] text-rose-400 font-mono">+02.40 seg</span>
            </div>
            <input
              type="color"
              value={theme.behindColor}
              onChange={(e) => updateTheme({ behindColor: e.target.value })}
              className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
            />
          </div>

          {/* Gold Split Color */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/80 block font-medium">Mejor Segmento (Oro)</span>
              <span className="text-[10px] text-amber-400 font-mono">★ Gold Split</span>
            </div>
            <input
              type="color"
              value={theme.goldColor}
              onChange={(e) => updateTheme({ goldColor: e.target.value })}
              className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
            />
          </div>

          {/* Text Color */}
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-white/80 block font-medium">Texto Principal</span>
              <span className="text-[10px] text-white/60 font-mono">12:34.56</span>
            </div>
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => updateTheme({ textColor: e.target.value })}
              className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
