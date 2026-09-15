export type FontFamilyType = 'digital' | 'pixel' | 'retro' | 'sans';
export type BackgroundType = 'color' | 'image' | 'chroma';

export interface VisualTheme {
  fontFamily: FontFamilyType;
  bgType: BackgroundType;
  bgColor: string;          // Hex or rgba
  bgImage: string;          // URL or data URI
  bgOpacity: number;        // 0.0 - 1.0
  backdropBlur: number;     // 0 - 20 px
  aheadColor: string;       // Default green
  behindColor: string;      // Default red
  goldColor: string;        // Default gold
  textColor: string;        // Main text
  chromaColor: string;      // Color for Chroma key (e.g., #00ff00 or #ff00ff)
  windowAlwaysOnTop: boolean;
  windowTransparent: boolean;
}

export interface Hotkeys {
  startSplit: string;
  reset: string;
  pause: string;
  undo: string;
  practiceQuickReset: string;
  practiceMarkSuccess: string;
}

export interface AutosplitterConfig {
  enabled: boolean;
  emulatorType: 'qusb2snes' | 'retroarch' | 'mock';
  serverUrl: string; // e.g. ws://localhost:8080 or ws://127.0.0.1:23074
  autoStart: boolean;
  autoReset: boolean;
  pollIntervalMs: number;
}
