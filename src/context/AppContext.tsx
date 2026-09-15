import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { GameProfile, SplitItem, TimerStatus } from '../types/splits';
import { PracticeSegment, AttemptRecord } from '../types/practice';
import { VisualTheme, Hotkeys, AutosplitterConfig } from '../types/settings';
import {
  DEFAULT_GAMES,
  DEFAULT_PRACTICE_SEGMENTS,
  DEFAULT_THEME,
  DEFAULT_HOTKEYS,
  DEFAULT_AUTOSPLITTER_CONFIG,
} from '../services/defaultData';
import { snesAutoSplitter, EmulatorStatus } from '../services/snesAutoSplitter';

export type AppMode = 'speedrun' | 'practice';

interface AppContextType {
  // Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Games & Profiles
  games: GameProfile[];
  activeGame: GameProfile;
  setActiveGameId: (id: string) => void;
  updateSplits: (splits: SplitItem[]) => void;
  addGameProfile: (game: GameProfile) => void;

  // Speedrun Timer State
  timerStatus: TimerStatus;
  elapsedMs: number;
  currentSplitIndex: number;
  startTimer: () => void;
  splitTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  undoSplit: () => void;
  skipSplit: () => void;

  // Practice Mode State
  practiceSegments: PracticeSegment[];
  activePractice: PracticeSegment | null;
  setActivePracticeId: (id: string) => void;
  practiceStatus: 'idle' | 'running' | 'finished';
  practiceElapsedMs: number;
  startPracticeTimer: () => void;
  stopPracticeTimer: (success: boolean) => void;
  quickResetPractice: () => void;
  loadPracticeSavestate: () => void;
  updatePracticeNotes: (notes: string, cues: string[]) => void;
  addPracticeSegment: (seg: Omit<PracticeSegment, 'id' | 'attemptsCount' | 'successCount' | 'recentAttempts' | 'bestTimeMs'>) => void;

  // Visual Theme & UI Settings
  theme: VisualTheme;
  updateTheme: (newTheme: Partial<VisualTheme>) => void;
  hotkeys: Hotkeys;
  updateHotkeys: (newHotkeys: Partial<Hotkeys>) => void;
  autosplitterConfig: AutosplitterConfig;
  updateAutosplitterConfig: (newConfig: Partial<AutosplitterConfig>) => void;

  // Emulator Status
  emulatorStatus: EmulatorStatus;
  emulatorStatusMessage: string;

  // Modals & Window Controls
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  settingsTab: 'background' | 'theme' | 'splits' | 'autosplitter' | 'practice';
  setSettingsTab: (tab: 'background' | 'theme' | 'splits' | 'autosplitter' | 'practice') => void;
  toggleAlwaysOnTop: () => void;
  minimizeWindow: () => void;
  closeWindow: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  GAMES: 'livesplit_snes_games_v1',
  ACTIVE_GAME_ID: 'livesplit_snes_active_game_v1',
  PRACTICE: 'livesplit_snes_practice_v1',
  THEME: 'livesplit_snes_theme_v1',
  HOTKEYS: 'livesplit_snes_hotkeys_v1',
  AUTOSPLITTER: 'livesplit_snes_autosplitter_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mode state
  const [mode, setMode] = useState<AppMode>('speedrun');

  // Persistence helpers
  const [games, setGames] = useState<GameProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      return saved ? JSON.parse(saved) : DEFAULT_GAMES;
    } catch {
      return DEFAULT_GAMES;
    }
  });

  const [activeGameId, setActiveGameIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME_ID) || DEFAULT_GAMES[0].id;
    } catch {
      return DEFAULT_GAMES[0].id;
    }
  });

  const activeGame = games.find((g) => g.id === activeGameId) || games[0];

  const [practiceSegments, setPracticeSegments] = useState<PracticeSegment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRACTICE);
      return saved ? JSON.parse(saved) : DEFAULT_PRACTICE_SEGMENTS;
    } catch {
      return DEFAULT_PRACTICE_SEGMENTS;
    }
  });

  const [activePracticeId, setActivePracticeId] = useState<string>(
    DEFAULT_PRACTICE_SEGMENTS[0]?.id || ''
  );

  const activePractice = practiceSegments.find((p) => p.id === activePracticeId) || practiceSegments[0] || null;

  // Settings & Theme
  const [theme, setThemeState] = useState<VisualTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const [hotkeys, setHotkeysState] = useState<Hotkeys>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HOTKEYS);
      return saved ? { ...DEFAULT_HOTKEYS, ...JSON.parse(saved) } : DEFAULT_HOTKEYS;
    } catch {
      return DEFAULT_HOTKEYS;
    }
  });

  const [autosplitterConfig, setAutosplitterConfigState] = useState<AutosplitterConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTOSPLITTER);
      return saved ? { ...DEFAULT_AUTOSPLITTER_CONFIG, ...JSON.parse(saved) } : DEFAULT_AUTOSPLITTER_CONFIG;
    } catch {
      return DEFAULT_AUTOSPLITTER_CONFIG;
    }
  });

  // Emulator Status
  const [emulatorStatus, setEmulatorStatus] = useState<EmulatorStatus>('disconnected');
  const [emulatorStatusMessage, setEmulatorStatusMessage] = useState<string>('Desconectado');

  // Window & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'background' | 'theme' | 'splits' | 'autosplitter' | 'practice'>('background');

  // Speedrun Timer State
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [currentSplitIndex, setCurrentSplitIndex] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Practice Timer State
  const [practiceStatus, setPracticeStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [practiceElapsedMs, setPracticeElapsedMs] = useState(0);
  const practiceStartTimeRef = useRef<number | null>(null);
  const practiceAnimFrameRef = useRef<number | null>(null);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME_ID, activeGameId);
  }, [activeGameId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRACTICE, JSON.stringify(practiceSegments));
  }, [practiceSegments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOTKEYS, JSON.stringify(hotkeys));
  }, [hotkeys]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTOSPLITTER, JSON.stringify(autosplitterConfig));
  }, [autosplitterConfig]);

  // Connect to auto-splitter
  useEffect(() => {
    snesAutoSplitter.init(autosplitterConfig);
    const unsubscribe = snesAutoSplitter.subscribe((event) => {
      if (event.type === 'status') {
        setEmulatorStatus(event.status);
        setEmulatorStatusMessage(event.message);
      } else if (event.type === 'start') {
        if (timerStatus === 'idle') {
          startTimer();
        }
      } else if (event.type === 'split') {
        if (timerStatus === 'running') {
          splitTimer();
        }
      } else if (event.type === 'reset') {
        resetTimer();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [autosplitterConfig, timerStatus]);

  // Speedrun Timer Animation Loop
  const updateTimerTick = useCallback(() => {
    if (timerStatus === 'running' && startTimeRef.current !== null) {
      const now = performance.now();
      const currentElapsed = pausedTimeRef.current + (now - startTimeRef.current);
      setElapsedMs(currentElapsed);
      animFrameRef.current = requestAnimationFrame(updateTimerTick);
    }
  }, [timerStatus]);

  useEffect(() => {
    if (timerStatus === 'running') {
      animFrameRef.current = requestAnimationFrame(updateTimerTick);
    } else if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [timerStatus, updateTimerTick]);

  // Speedrun Timer Controls
  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;
    setElapsedMs(0);
    setCurrentSplitIndex(0);
    setTimerStatus('running');

    // Increment attempts
    setGames((prev) =>
      prev.map((g) => (g.id === activeGame.id ? { ...g, attempts: g.attempts + 1 } : g))
    );

    // Reset current run splits
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== activeGame.id) return g;
        return {
          ...g,
          splits: g.splits.map((s) => ({ ...s, currentSplitTime: null, isGold: false })),
        };
      })
    );
  }, [activeGame.id]);

  const splitTimer = useCallback(() => {
    if (timerStatus !== 'running') return;

    const currentSplits = activeGame.splits;
    const splitIdx = currentSplitIndex;

    if (splitIdx >= currentSplits.length) return;

    const currentSplit = currentSplits[splitIdx];
    const prevSplitTime = splitIdx > 0 ? (currentSplits[splitIdx - 1].currentSplitTime || 0) : 0;
    const segmentDuration = elapsedMs - prevSplitTime;

    const isGold = currentSplit.bestSegment === null || segmentDuration < currentSplit.bestSegment;

    if (isGold) {
      // Golden split sparkle sound / small confetti
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#fbbf24', '#f59e0b', '#d97706'],
      });
    }

    const updatedSplits = currentSplits.map((s, idx) => {
      if (idx === splitIdx) {
        return {
          ...s,
          currentSplitTime: elapsedMs,
          bestSegment: isGold ? segmentDuration : s.bestSegment,
          isGold,
        };
      }
      return s;
    });

    const isFinalSplit = splitIdx === currentSplits.length - 1;

    if (isFinalSplit) {
      // Run finished!
      setTimerStatus('ended');
      const isNewPb = currentSplit.pbTime === null || elapsedMs < currentSplit.pbTime;
      if (isNewPb) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#eab308', '#38bdf8', '#a855f7'],
        });
      }

      setGames((prev) =>
        prev.map((g) => {
          if (g.id !== activeGame.id) return g;
          return {
            ...g,
            completedRuns: g.completedRuns + 1,
            splits: isNewPb
              ? updatedSplits.map((s) => ({
                  ...s,
                  pbTime: s.currentSplitTime ?? s.pbTime,
                }))
              : updatedSplits,
          };
        })
      );
    } else {
      setCurrentSplitIndex((prev) => prev + 1);
      setGames((prev) =>
        prev.map((g) => (g.id === activeGame.id ? { ...g, splits: updatedSplits } : g))
      );
    }
  }, [timerStatus, activeGame, currentSplitIndex, elapsedMs]);

  const pauseTimer = useCallback(() => {
    if (timerStatus === 'running' && startTimeRef.current !== null) {
      pausedTimeRef.current += performance.now() - startTimeRef.current;
      setTimerStatus('paused');
    }
  }, [timerStatus]);

  const resumeTimer = useCallback(() => {
    if (timerStatus === 'paused') {
      startTimeRef.current = performance.now();
      setTimerStatus('running');
    }
  }, [timerStatus]);

  const resetTimer = useCallback(() => {
    setTimerStatus('idle');
    setElapsedMs(0);
    setCurrentSplitIndex(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    // Clear current split times
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== activeGame.id) return g;
        return {
          ...g,
          splits: g.splits.map((s) => ({ ...s, currentSplitTime: null, isGold: false })),
        };
      })
    );
  }, [activeGame.id]);

  const undoSplit = useCallback(() => {
    if (currentSplitIndex === 0) return;
    const targetIdx = currentSplitIndex - 1;
    setCurrentSplitIndex(targetIdx);
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== activeGame.id) return g;
        return {
          ...g,
          splits: g.splits.map((s, idx) => (idx === targetIdx ? { ...s, currentSplitTime: null, isGold: false } : s)),
        };
      })
    );
  }, [currentSplitIndex, activeGame.id]);

  const skipSplit = useCallback(() => {
    if (currentSplitIndex < activeGame.splits.length - 1) {
      setCurrentSplitIndex((prev) => prev + 1);
    }
  }, [currentSplitIndex, activeGame.splits.length]);

  // Practice Timer Tick
  const updatePracticeTick = useCallback(() => {
    if (practiceStatus === 'running' && practiceStartTimeRef.current !== null) {
      const now = performance.now();
      setPracticeElapsedMs(now - practiceStartTimeRef.current);
      practiceAnimFrameRef.current = requestAnimationFrame(updatePracticeTick);
    }
  }, [practiceStatus]);

  useEffect(() => {
    if (practiceStatus === 'running') {
      practiceAnimFrameRef.current = requestAnimationFrame(updatePracticeTick);
    } else if (practiceAnimFrameRef.current) {
      cancelAnimationFrame(practiceAnimFrameRef.current);
    }
    return () => {
      if (practiceAnimFrameRef.current) cancelAnimationFrame(practiceAnimFrameRef.current);
    };
  }, [practiceStatus, updatePracticeTick]);

  // Practice Mode Actions
  const startPracticeTimer = useCallback(() => {
    practiceStartTimeRef.current = performance.now();
    setPracticeElapsedMs(0);
    setPracticeStatus('running');
  }, []);

  const stopPracticeTimer = useCallback(
    (success: boolean) => {
      if (practiceStatus !== 'running' || !activePractice) return;
      const finalTime = practiceElapsedMs;
      setPracticeStatus('finished');

      const isNewBest = success && (activePractice.bestTimeMs === null || finalTime < activePractice.bestTimeMs);

      if (isNewBest) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#38bdf8', '#fbbf24', '#22c55e'],
        });
      }

      const newAttempt: AttemptRecord = {
        id: Math.random().toString(36).substring(7),
        timeMs: finalTime,
        success,
        timestamp: 'Ahora mismo',
      };

      setPracticeSegments((prev) =>
        prev.map((seg) => {
          if (seg.id !== activePractice.id) return seg;
          return {
            ...seg,
            attemptsCount: seg.attemptsCount + 1,
            successCount: success ? seg.successCount + 1 : seg.successCount,
            bestTimeMs: isNewBest ? finalTime : seg.bestTimeMs,
            recentAttempts: [newAttempt, ...seg.recentAttempts].slice(0, 20),
          };
        })
      );
    },
    [practiceStatus, activePractice, practiceElapsedMs]
  );

  const quickResetPractice = useCallback(() => {
    setPracticeStatus('idle');
    setPracticeElapsedMs(0);
    practiceStartTimeRef.current = null;
    if (activePractice) {
      snesAutoSplitter.triggerSavestate(activePractice.savestateSlot, 'load');
    }
  }, [activePractice]);

  const loadPracticeSavestate = useCallback(() => {
    if (activePractice) {
      snesAutoSplitter.triggerSavestate(activePractice.savestateSlot, 'load');
    }
  }, [activePractice]);

  const updatePracticeNotes = useCallback(
    (notes: string, cues: string[]) => {
      if (!activePractice) return;
      setPracticeSegments((prev) =>
        prev.map((seg) => (seg.id === activePractice.id ? { ...seg, notes, visualCues: cues } : seg))
      );
    },
    [activePractice]
  );

  const addPracticeSegment = useCallback(
    (seg: Omit<PracticeSegment, 'id' | 'attemptsCount' | 'successCount' | 'recentAttempts' | 'bestTimeMs'>) => {
      const newSeg: PracticeSegment = {
        ...seg,
        id: 'p-' + Date.now().toString(36),
        attemptsCount: 0,
        successCount: 0,
        bestTimeMs: null,
        recentAttempts: [],
      };
      setPracticeSegments((prev) => [...prev, newSeg]);
      setActivePracticeId(newSeg.id);
    },
    []
  );

  // Keyboard Global Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === hotkeys.startSplit) {
        e.preventDefault();
        if (mode === 'speedrun') {
          if (timerStatus === 'idle') startTimer();
          else if (timerStatus === 'running') splitTimer();
          else if (timerStatus === 'paused') resumeTimer();
        } else {
          if (practiceStatus === 'idle') startPracticeTimer();
          else if (practiceStatus === 'running') stopPracticeTimer(true);
        }
      } else if (e.code === hotkeys.reset) {
        e.preventDefault();
        if (mode === 'speedrun') resetTimer();
        else quickResetPractice();
      } else if (e.code === hotkeys.pause && mode === 'speedrun') {
        e.preventDefault();
        if (timerStatus === 'running') pauseTimer();
        else if (timerStatus === 'paused') resumeTimer();
      } else if (e.code === hotkeys.undo && mode === 'speedrun') {
        e.preventDefault();
        undoSplit();
      } else if (e.code === hotkeys.practiceQuickReset && mode === 'practice') {
        e.preventDefault();
        quickResetPractice();
      } else if (e.code === hotkeys.practiceMarkSuccess && mode === 'practice') {
        e.preventDefault();
        if (practiceStatus === 'running') stopPracticeTimer(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    hotkeys,
    mode,
    timerStatus,
    practiceStatus,
    startTimer,
    splitTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    undoSplit,
    startPracticeTimer,
    stopPracticeTimer,
    quickResetPractice,
  ]);

  // Theme & Profile Updaters
  const updateTheme = (newTheme: Partial<VisualTheme>) => {
    setThemeState((prev) => ({ ...prev, ...newTheme }));
  };

  const updateHotkeys = (newHotkeys: Partial<Hotkeys>) => {
    setHotkeysState((prev) => ({ ...prev, ...newHotkeys }));
  };

  const updateAutosplitterConfig = (newConfig: Partial<AutosplitterConfig>) => {
    setAutosplitterConfigState((prev) => ({ ...prev, ...newConfig }));
  };

  const updateSplits = (splits: SplitItem[]) => {
    setGames((prev) =>
      prev.map((g) => (g.id === activeGame.id ? { ...g, splits } : g))
    );
  };

  const addGameProfile = (game: GameProfile) => {
    setGames((prev) => [...prev, game]);
    setActiveGameIdState(game.id);
  };

  const setActiveGameId = (id: string) => {
    setActiveGameIdState(id);
    resetTimer();
  };

  // Tauri Window Helpers
  const toggleAlwaysOnTop = async () => {
    const newVal = !theme.windowAlwaysOnTop;
    updateTheme({ windowAlwaysOnTop: newVal });
    try {
      if (window && (window as any).__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('toggle_always_on_top', { enabled: newVal });
      }
    } catch (e) {
      console.warn('Could not toggle always-on-top in browser mode:', e);
    }
  };

  const minimizeWindow = async () => {
    try {
      if (window && (window as any).__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('minimize_window');
      }
    } catch (e) {
      console.warn('Cannot minimize window in browser mode:', e);
    }
  };

  const closeWindow = async () => {
    try {
      if (window && (window as any).__TAURI_INTERNALS__) {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('close_window');
      }
    } catch (e) {
      console.warn('Cannot close window in browser mode:', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        mode,
        setMode,
        games,
        activeGame,
        setActiveGameId,
        updateSplits,
        addGameProfile,

        timerStatus,
        elapsedMs,
        currentSplitIndex,
        startTimer,
        splitTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        undoSplit,
        skipSplit,

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

        theme,
        updateTheme,
        hotkeys,
        updateHotkeys,
        autosplitterConfig,
        updateAutosplitterConfig,

        emulatorStatus,
        emulatorStatusMessage,

        isSettingsOpen,
        setIsSettingsOpen,
        settingsTab,
        setSettingsTab,
        toggleAlwaysOnTop,
        minimizeWindow,
        closeWindow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
