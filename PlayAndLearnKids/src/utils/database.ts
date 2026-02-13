// Local database structure using AsyncStorage for offline progress storage
// All data is persisted locally on device - no server required

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  APP_STATE: '@play_and_learn_kids_state',
  PLAY_SESSIONS: '@play_and_learn_kids_sessions',
  DAILY_STATS: '@play_and_learn_kids_daily',
  FIRST_LAUNCH: '@play_and_learn_kids_first_launch',
} as const;

// Database schema documentation
// ==========================================
// APP_STATE: Main application state (managed by AppContext)
// {
//   soundEnabled: boolean,
//   musicEnabled: boolean,
//   progress: {
//     [moduleId]: {
//       completed: number,
//       total: number,
//       timeSpent: number (seconds),
//       lastPlayed: ISO date string | null,
//     }
//   },
//   rewards: {
//     stars: number,
//     coins: number,
//     unlockedStickers: string[],
//     unlockedCharacters: string[],
//   },
//   parentSettings: {
//     dailyPlayLimit: number (minutes),
//     lockedModules: string[],
//     isPremium: boolean,
//   },
//   todayPlayTime: number (minutes),
//   isParentMode: boolean,
// }
//
// PLAY_SESSIONS: Array of play sessions for analytics
// [
//   {
//     id: string,
//     startTime: ISO date string,
//     endTime: ISO date string,
//     module: string,
//     duration: number (seconds),
//     score: number,
//   }
// ]
//
// DAILY_STATS: Daily aggregated statistics
// {
//   [YYYY-MM-DD]: {
//     totalTime: number (minutes),
//     modulesPlayed: string[],
//     starsEarned: number,
//     coinsEarned: number,
//   }
// }
// ==========================================

export interface PlaySession {
  id: string;
  startTime: string;
  endTime: string;
  module: string;
  duration: number;
  score: number;
}

export interface DailyStats {
  totalTime: number;
  modulesPlayed: string[];
  starsEarned: number;
  coinsEarned: number;
}

// Save a completed play session
export async function savePlaySession(session: PlaySession): Promise<void> {
  try {
    const existing = await AsyncStorage.getItem(KEYS.PLAY_SESSIONS);
    const sessions: PlaySession[] = existing ? JSON.parse(existing) : [];
    sessions.push(session);
    // Keep only last 100 sessions to manage storage
    const trimmed = sessions.slice(-100);
    await AsyncStorage.setItem(KEYS.PLAY_SESSIONS, JSON.stringify(trimmed));
  } catch {
    // Silently fail
  }
}

// Get all play sessions
export async function getPlaySessions(): Promise<PlaySession[]> {
  try {
    const data = await AsyncStorage.getItem(KEYS.PLAY_SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Update daily stats
export async function updateDailyStats(
  module: string,
  timeMinutes: number,
  stars: number,
  coins: number,
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const existing = await AsyncStorage.getItem(KEYS.DAILY_STATS);
    const allStats: Record<string, DailyStats> = existing ? JSON.parse(existing) : {};

    const todayStats = allStats[today] || {
      totalTime: 0,
      modulesPlayed: [],
      starsEarned: 0,
      coinsEarned: 0,
    };

    todayStats.totalTime += timeMinutes;
    if (!todayStats.modulesPlayed.includes(module)) {
      todayStats.modulesPlayed.push(module);
    }
    todayStats.starsEarned += stars;
    todayStats.coinsEarned += coins;

    allStats[today] = todayStats;
    await AsyncStorage.setItem(KEYS.DAILY_STATS, JSON.stringify(allStats));
  } catch {
    // Silently fail
  }
}

// Get daily stats for a specific date
export async function getDailyStats(date?: string): Promise<DailyStats | null> {
  try {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const existing = await AsyncStorage.getItem(KEYS.DAILY_STATS);
    const allStats: Record<string, DailyStats> = existing ? JSON.parse(existing) : {};
    return allStats[targetDate] || null;
  } catch {
    return null;
  }
}

// Check if this is the first app launch
export async function isFirstLaunch(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
    if (value === null) {
      await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, 'false');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Clear all stored data (for parent reset)
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      KEYS.APP_STATE,
      KEYS.PLAY_SESSIONS,
      KEYS.DAILY_STATS,
    ]);
  } catch {
    // Silently fail
  }
}

// Get storage size estimate
export async function getStorageInfo(): Promise<{ keys: number; estimatedSize: string }> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter((k) => k.startsWith('@play_and_learn'));
    return {
      keys: appKeys.length,
      estimatedSize: `~${appKeys.length * 2}KB`,
    };
  } catch {
    return { keys: 0, estimatedSize: '0KB' };
  }
}
