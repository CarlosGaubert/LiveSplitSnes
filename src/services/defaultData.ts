import { GameProfile } from '../types/splits';
import { PracticeSegment } from '../types/practice';
import { VisualTheme, AutosplitterConfig, Hotkeys } from '../types/settings';

export const DEFAULT_GAMES: GameProfile[] = [
  {
    id: 'smw-11exit',
    gameName: 'Super Mario World',
    category: '11 Exit (Any%)',
    attempts: 42,
    completedRuns: 8,
    splits: [
      { id: '1', name: "Yoshi's Island 1", pbTime: 42100, bestSegment: 41200, currentSplitTime: null, notes: "Sprint right, jump over first Rex" },
      { id: '2', name: "Yoshi's Island 2", pbTime: 95400, bestSegment: 52000, currentSplitTime: null, notes: "Grab Yoshi, eat berries if needed" },
      { id: '3', name: 'Yellow Switch', pbTime: 135200, bestSegment: 39800, currentSplitTime: null, notes: "Stomp big block" },
      { id: '4', name: "Yoshi's Island 3", pbTime: 178700, bestSegment: 43500, currentSplitTime: null, notes: "Fast platform jumps" },
      { id: '5', name: "Yoshi's Island 4", pbTime: 219100, bestSegment: 40400, currentSplitTime: null, notes: "Water skip with Yoshi" },
      { id: '6', name: "Iggy's Castle", pbTime: 285300, bestSegment: 66200, currentSplitTime: null, notes: "Boss quick kill: push off teeter-totter" },
      { id: '7', name: 'Donut Plains 1 (Key)', pbTime: 340000, bestSegment: 54700, currentSplitTime: null, notes: "Fly to secret exit or spin jump" },
      { id: '8', name: 'Donut Secret 1', pbTime: 410000, bestSegment: 70000, currentSplitTime: null, notes: "Water level - grab P-Switch key" },
      { id: '9', name: 'Donut Secret House', pbTime: 465000, bestSegment: 55000, currentSplitTime: null, notes: "Ghost house secret exit" },
      { id: '10', name: 'Star World 1-4', pbTime: 570000, bestSegment: 105000, currentSplitTime: null, notes: "Blue Yoshi flight through Star World" },
      { id: '11', name: "Bowser's Castle", pbTime: 655200, bestSegment: 85200, currentSplitTime: null, notes: "Door 2 & Door 7, 2-cycle Mechakoopas" },
    ],
  },
  {
    id: 'sm-any',
    gameName: 'Super Metroid',
    category: 'Any%',
    attempts: 27,
    completedRuns: 3,
    splits: [
      { id: 'sm1', name: 'Ceres Escape', pbTime: 130000, bestSegment: 128000, currentSplitTime: null },
      { id: 'sm2', name: 'Bomb Torizo', pbTime: 345000, bestSegment: 210000, currentSplitTime: null },
      { id: 'sm3', name: 'Kraid', pbTime: 860000, bestSegment: 505000, currentSplitTime: null },
      { id: 'sm4', name: 'Phantoon', pbTime: 1450000, bestSegment: 590000, currentSplitTime: null },
      { id: 'sm5', name: 'Draygon', pbTime: 2020000, bestSegment: 570000, currentSplitTime: null },
      { id: 'sm6', name: 'Ridley', pbTime: 2475000, bestSegment: 455000, currentSplitTime: null },
      { id: 'sm7', name: 'Mother Brain', pbTime: 2930000, bestSegment: 455000, currentSplitTime: null },
      { id: 'sm8', name: 'Gunship Escape', pbTime: 3012000, bestSegment: 82000, currentSplitTime: null },
    ],
  },
  {
    id: 'alttp-nmg',
    gameName: 'The Legend of Zelda: ALttP',
    category: 'Any% No Major Glitches',
    attempts: 18,
    completedRuns: 1,
    splits: [
      { id: 'z1', name: 'Escape / Sanctuary', pbTime: 520000, bestSegment: 510000, currentSplitTime: null },
      { id: 'z2', name: 'Eastern Palace', pbTime: 1105000, bestSegment: 585000, currentSplitTime: null },
      { id: 'z3', name: 'Desert Palace', pbTime: 1730000, bestSegment: 625000, currentSplitTime: null },
      { id: 'z4', name: 'Tower of Hera', pbTime: 2350000, bestSegment: 620000, currentSplitTime: null },
      { id: 'z5', name: 'Master Sword & Agahnim 1', pbTime: 2850000, bestSegment: 500000, currentSplitTime: null },
      { id: 'z6', name: 'Ganon Defeated', pbTime: 5140000, bestSegment: 2290000, currentSplitTime: null },
    ],
  },
];

export const DEFAULT_PRACTICE_SEGMENTS: PracticeSegment[] = [
  {
    id: 'p-smw-bowser',
    name: "Bowser Fight (Mechakoopas)",
    gameId: 'smw-11exit',
    category: '11 Exit',
    targetTimeMs: 48000,
    savestateSlot: 1,
    attemptsCount: 24,
    successCount: 19,
    bestTimeMs: 44200,
    notes: 'Esperar a que Bowser baje al centro antes de lanzar el 2do Mechakoopa para acertar en ciclo rápido.',
    visualCues: [
      'Alinear la sombra de Mario 2 baldosas a la izquierda de Bowser',
      'Lanzar Mechakoopa justo cuando Bowser llega a la cúspide de su balanceo',
      'Fase 3: Cuidado con las llamas que rebotan en la derecha',
    ],
    recentAttempts: [
      { id: 'a1', timeMs: 44800, success: true, timestamp: 'Hace 10 min' },
      { id: 'a2', timeMs: 45200, success: true, timestamp: 'Hace 8 min' },
      { id: 'a3', timeMs: 0, success: false, timestamp: 'Hace 5 min' },
      { id: 'a4', timeMs: 44200, success: true, timestamp: 'Hace 2 min' },
    ],
  },
  {
    id: 'p-smw-keygrab',
    name: 'Donut Secret 1 - Quick Key Grab',
    gameId: 'smw-11exit',
    category: '11 Exit',
    targetTimeMs: 18500,
    savestateSlot: 2,
    attemptsCount: 15,
    successCount: 12,
    bestTimeMs: 17800,
    notes: 'Nadar en línea recta manteniendo presionado B para deslizarse entre los peces sin perder aceleración.',
    visualCues: [
      'Entrar al tubo en diagonal',
      'Activar el P-Switch en el frame de aterrizaje',
    ],
    recentAttempts: [
      { id: 'a5', timeMs: 18100, success: true, timestamp: 'Ayer' },
      { id: 'a6', timeMs: 17800, success: true, timestamp: 'Ayer' },
    ],
  },
  {
    id: 'p-sm-mockball',
    name: 'Super Metroid - Mockball Early Supers',
    gameId: 'sm-any',
    category: 'Any%',
    targetTimeMs: 11200,
    savestateSlot: 3,
    attemptsCount: 40,
    successCount: 31,
    bestTimeMs: 9800,
    notes: 'Entrar rodando sin perder la inercia de carrera para cruzar antes de que caiga el portón.',
    visualCues: [
      'Correr a máxima velocidad hasta la puerta',
      'Soltar Dash, presionar Salto y luego Abajo-Adelante inmediatamente antes de tocar el suelo',
    ],
    recentAttempts: [
      { id: 'a7', timeMs: 10100, success: true, timestamp: 'Hoy' },
      { id: 'a8', timeMs: 9800, success: true, timestamp: 'Hoy' },
    ],
  },
];

export const DEFAULT_THEME: VisualTheme = {
  fontFamily: 'digital',
  bgType: 'color',
  bgColor: '#090d16',
  bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
  bgOpacity: 0.85,
  backdropBlur: 8,
  aheadColor: '#22c55e',      // Bright emerald green
  behindColor: '#ef4444',     // Crimson red
  goldColor: '#eab308',       // Bright Gold
  textColor: '#f8fafc',       // Slate 50
  chromaColor: '#00ff00',     // Classic Green Screen
  windowAlwaysOnTop: true,
  windowTransparent: true,
};

export const DEFAULT_HOTKEYS: Hotkeys = {
  startSplit: 'Space',
  reset: 'KeyR',
  pause: 'KeyP',
  undo: 'Backspace',
  practiceQuickReset: 'KeyL',
  practiceMarkSuccess: 'KeyK',
};

export const DEFAULT_AUTOSPLITTER_CONFIG: AutosplitterConfig = {
  enabled: true,
  emulatorType: 'qusb2snes',
  serverUrl: 'ws://localhost:8080',
  autoStart: true,
  autoReset: true,
  pollIntervalMs: 50,
};
