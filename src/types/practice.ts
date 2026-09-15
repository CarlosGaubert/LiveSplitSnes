export interface AttemptRecord {
  id: string;
  timeMs: number;
  success: boolean;
  timestamp: string;
}

export interface PracticeSegment {
  id: string;
  name: string;
  gameId: string;
  category: string;
  targetTimeMs: number;
  savestateSlot: number;
  attemptsCount: number;
  successCount: number;
  bestTimeMs: number | null;
  notes: string;
  visualCues: string[];
  recentAttempts: AttemptRecord[];
}
