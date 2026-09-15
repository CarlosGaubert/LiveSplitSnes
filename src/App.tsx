import React from 'react';
import { useApp, AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MainTimer } from './components/MainTimer';
import { SplitsTable } from './components/SplitsTable';
import { FooterStats } from './components/FooterStats';
import { Controls } from './components/Controls';
import { PracticeView } from './components/practice/PracticeView';
import { SettingsModal } from './components/settings/SettingsModal';

const MainLayout: React.FC = () => {
  const { mode, theme } = useApp();

  // Dynamic background style logic
  const getContainerStyle = (): React.CSSProperties => {
    if (theme.bgType === 'chroma') {
      return {
        backgroundColor: theme.chromaColor,
      };
    }
    return {
      backgroundColor: theme.bgColor,
    };
  };

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden text-white font-sans transition-all duration-300"
      style={getContainerStyle()}
    >
      {/* Background Image Layer (when active) */}
      {theme.bgType === 'image' && theme.bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300 -z-10"
          style={{
            backgroundImage: `url(${theme.bgImage})`,
            opacity: theme.bgOpacity,
          }}
        />
      )}

      {/* Backdrop blur overlay */}
      {theme.bgType !== 'chroma' && theme.backdropBlur > 0 && (
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            backdropFilter: `blur(${theme.backdropBlur}px)`,
            backgroundColor: `rgba(0, 0, 0, ${1 - theme.bgOpacity})`,
          }}
        />
      )}

      {/* Header */}
      <Header />

      {/* Main Content Body */}
      {mode === 'speedrun' ? (
        <main className="flex-1 flex flex-col overflow-hidden">
          <MainTimer />
          <SplitsTable />
          <FooterStats />
          <Controls />
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
          <PracticeView />
        </main>
      )}

      {/* Settings Dialog */}
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
