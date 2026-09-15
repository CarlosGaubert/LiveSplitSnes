import React from 'react';
import { X, Image, Palette, ListOrdered, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BackgroundTab } from './BackgroundTab';
import { ThemeTab } from './ThemeTab';
import { SplitsEditorTab } from './SplitsEditorTab';
import { AutosplitterTab } from './AutosplitterTab';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, settingsTab, setSettingsTab } = useApp();

  if (!isSettingsOpen) return null;

  const TABS = [
    { id: 'background' as const, label: 'Fondos', icon: Image },
    { id: 'theme' as const, label: 'Temas', icon: Palette },
    { id: 'splits' as const, label: 'Splits', icon: ListOrdered },
    { id: 'autosplitter' as const, label: 'Auto-Split', icon: Radio },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm max-h-[92vh] flex flex-col rounded-xl bg-slate-950/95 border border-white/20 shadow-2xl text-white overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
          <h2 className="font-bold text-xs tracking-wider uppercase text-white/90">
            Ajustes y Personalización
          </h2>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 text-xs font-medium">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = settingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSettingsTab(tab.id)}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
                  isActive
                    ? 'border-indigo-500 text-indigo-400 bg-indigo-950/20'
                    : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {settingsTab === 'background' && <BackgroundTab />}
          {settingsTab === 'theme' && <ThemeTab />}
          {settingsTab === 'splits' && <SplitsEditorTab />}
          {settingsTab === 'autosplitter' && <AutosplitterTab />}
        </div>

        {/* Modal Footer */}
        <div className="p-2.5 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold text-xs transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
