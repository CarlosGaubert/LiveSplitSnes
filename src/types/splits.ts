export type TimerStatus = 'idle' | 'running' | 'paused' | 'ended';

export type ComparisonType = 'pb' | 'best_segments' | 'average';

export interface SplitItem {
  id: string;
  name: string;
  icon?: string;
  pbTime: number | null;        // Cumulative PB time at this split in milliseconds
  bestSegment: number | null;   // Best ever single segment time in milliseconds
  currentSplitTime: number | null; // Split time in current run
  isGold?: boolean;             // Was this segment the best ever?
  notes?: string;
}

export interface GameProfile {
  id: string;
  gameName: string;
  category: string;
  attempts: number;
  completedRuns: number;
  splits: SplitItem[];
}
