// Global App Context - manages sound settings, rewards, progress, and parent controls

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface ModuleProgress {
  completed: number;
  total: number;
  timeSpent: number; // seconds
  lastPlayed: string | null;
}

export interface RewardData {
  stars: number;
  coins: number;
  unlockedStickers: string[];
  unlockedCharacters: string[];
}

export interface ParentSettings {
  dailyPlayLimit: number; // minutes, 0 = unlimited
  lockedModules: string[];
  isPremium: boolean;
}

export interface AppState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  progress: Record<string, ModuleProgress>;
  rewards: RewardData;
  parentSettings: ParentSettings;
  todayPlayTime: number; // minutes
  isParentMode: boolean;
}

const initialState: AppState = {
  soundEnabled: true,
  musicEnabled: true,
  progress: {
    alphabet: { completed: 0, total: 26, timeSpent: 0, lastPlayed: null },
    numbers: { completed: 0, total: 20, timeSpent: 0, lastPlayed: null },
    colors: { completed: 0, total: 10, timeSpent: 0, lastPlayed: null },
    shapes: { completed: 0, total: 8, timeSpent: 0, lastPlayed: null },
    animals: { completed: 0, total: 22, timeSpent: 0, lastPlayed: null },
    memory: { completed: 0, total: 10, timeSpent: 0, lastPlayed: null },
    puzzle: { completed: 0, total: 10, timeSpent: 0, lastPlayed: null },
    balloon: { completed: 0, total: 10, timeSpent: 0, lastPlayed: null },
    shapeSorter: { completed: 0, total: 10, timeSpent: 0, lastPlayed: null },
  },
  rewards: {
    stars: 0,
    coins: 0,
    unlockedStickers: [],
    unlockedCharacters: ['default'],
  },
  parentSettings: {
    dailyPlayLimit: 0,
    lockedModules: [],
    isPremium: false,
  },
  todayPlayTime: 0,
  isParentMode: false,
};

// Actions
type Action =
  | { type: 'TOGGLE_SOUND' }
  | { type: 'TOGGLE_MUSIC' }
  | { type: 'UPDATE_PROGRESS'; module: string; completed: number }
  | { type: 'ADD_TIME'; module: string; seconds: number }
  | { type: 'EARN_STARS'; amount: number }
  | { type: 'EARN_COINS'; amount: number }
  | { type: 'UNLOCK_STICKER'; sticker: string }
  | { type: 'UNLOCK_CHARACTER'; character: string }
  | { type: 'SET_DAILY_LIMIT'; minutes: number }
  | { type: 'TOGGLE_MODULE_LOCK'; module: string }
  | { type: 'SET_PREMIUM'; premium: boolean }
  | { type: 'ADD_PLAY_TIME'; minutes: number }
  | { type: 'RESET_DAILY_TIME' }
  | { type: 'ENTER_PARENT_MODE' }
  | { type: 'EXIT_PARENT_MODE' }
  | { type: 'LOAD_STATE'; state: AppState };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };
    case 'TOGGLE_MUSIC':
      return { ...state, musicEnabled: !state.musicEnabled };
    case 'UPDATE_PROGRESS': {
      const currentProgress = state.progress[action.module] || {
        completed: 0,
        total: 10,
        timeSpent: 0,
        lastPlayed: null,
      };
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.module]: {
            ...currentProgress,
            completed: Math.max(currentProgress.completed, action.completed),
            lastPlayed: new Date().toISOString(),
          },
        },
      };
    }
    case 'ADD_TIME': {
      const prog = state.progress[action.module] || {
        completed: 0,
        total: 10,
        timeSpent: 0,
        lastPlayed: null,
      };
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.module]: {
            ...prog,
            timeSpent: prog.timeSpent + action.seconds,
          },
        },
      };
    }
    case 'EARN_STARS':
      return {
        ...state,
        rewards: { ...state.rewards, stars: state.rewards.stars + action.amount },
      };
    case 'EARN_COINS':
      return {
        ...state,
        rewards: { ...state.rewards, coins: state.rewards.coins + action.amount },
      };
    case 'UNLOCK_STICKER':
      if (state.rewards.unlockedStickers.includes(action.sticker)) return state;
      return {
        ...state,
        rewards: {
          ...state.rewards,
          unlockedStickers: [...state.rewards.unlockedStickers, action.sticker],
        },
      };
    case 'UNLOCK_CHARACTER':
      if (state.rewards.unlockedCharacters.includes(action.character)) return state;
      return {
        ...state,
        rewards: {
          ...state.rewards,
          unlockedCharacters: [...state.rewards.unlockedCharacters, action.character],
        },
      };
    case 'SET_DAILY_LIMIT':
      return {
        ...state,
        parentSettings: { ...state.parentSettings, dailyPlayLimit: action.minutes },
      };
    case 'TOGGLE_MODULE_LOCK': {
      const locked = state.parentSettings.lockedModules;
      const isLocked = locked.includes(action.module);
      return {
        ...state,
        parentSettings: {
          ...state.parentSettings,
          lockedModules: isLocked
            ? locked.filter((m) => m !== action.module)
            : [...locked, action.module],
        },
      };
    }
    case 'SET_PREMIUM':
      return {
        ...state,
        parentSettings: { ...state.parentSettings, isPremium: action.premium },
      };
    case 'ADD_PLAY_TIME':
      return { ...state, todayPlayTime: state.todayPlayTime + action.minutes };
    case 'RESET_DAILY_TIME':
      return { ...state, todayPlayTime: 0 };
    case 'ENTER_PARENT_MODE':
      return { ...state, isParentMode: true };
    case 'EXIT_PARENT_MODE':
      return { ...state, isParentMode: false };
    case 'LOAD_STATE':
      return { ...action.state };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => {},
});

// Storage key
const STORAGE_KEY = '@play_and_learn_kids_state';

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          dispatch({ type: 'LOAD_STATE', state: { ...initialState, ...parsed } });
        }
      } catch {
        // Use default state on error
      }
    })();
  }, []);

  // Save state on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Silently fail on save error
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
