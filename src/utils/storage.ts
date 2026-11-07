/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerStats, Quest, Building, Achievement, InventoryItem } from '../types';
import { INITIAL_QUESTS, INITIAL_BUILDINGS, INITIAL_ACHIEVEMENTS, INITIAL_ITEMS } from '../data/gameData';

const STORAGE_KEY = 'little_wolf_lucky_town_save_v1';

export interface GameSaveState {
  stats: PlayerStats;
  quests: Quest[];
  buildings: Building[];
  achievements: Achievement[];
  inventory: InventoryItem[];
  soundEnabled: boolean;
  lastDailyWishDate: string | null;
}

const DEFAULT_STATE: GameSaveState = {
  stats: {
    merit: 0,
    lucky: 0,
    totalMeritEarned: 0,
    totalLuckyEarned: 0,
    questsCompletedCount: 0,
    buildingsUnlockedCount: 0,
    wolfInteractionsCount: 0,
    wishesMadeCount: 0,
  },
  quests: INITIAL_QUESTS,
  buildings: INITIAL_BUILDINGS,
  achievements: INITIAL_ACHIEVEMENTS,
  inventory: INITIAL_ITEMS,
  soundEnabled: true,
  lastDailyWishDate: null,
};

export function loadGame(): GameSaveState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);

    // Merge and ensure schema integrity in case new quests/buildings were added
    const quests = INITIAL_QUESTS.map(initQ => {
      const found = parsed.quests?.find((q: Quest) => q.id === initQ.id);
      return found ? { ...initQ, ...found } : initQ;
    });

    const buildings = INITIAL_BUILDINGS.map(initB => {
      const found = parsed.buildings?.find((b: Building) => b.id === initB.id);
      return found ? { ...initB, ...found } : initB;
    });

    const achievements = INITIAL_ACHIEVEMENTS.map(initA => {
      const found = parsed.achievements?.find((a: Achievement) => a.id === initA.id);
      return found ? { ...initA, ...found } : initA;
    });

    return {
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
      quests,
      buildings,
      achievements,
      inventory: parsed.inventory || INITIAL_ITEMS,
      soundEnabled: parsed.soundEnabled ?? true,
      lastDailyWishDate: parsed.lastDailyWishDate ?? null,
    };
  } catch (e) {
    console.error('Failed to load save state from localStorage:', e);
    return DEFAULT_STATE;
  }
}

export function saveGame(state: GameSaveState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function clearGameSave(): GameSaveState {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
