/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameView = 
  | 'HOME'
  | 'MAIN'
  | 'CHARACTER'
  | 'TOWN'
  | 'QUESTS'
  | 'INVENTORY'
  | 'ACHIEVEMENTS';

export interface PlayerStats {
  merit: number; // 功德值
  lucky: number; // 幸運值
  totalMeritEarned: number;
  totalLuckyEarned: number;
  questsCompletedCount: number;
  buildingsUnlockedCount: number;
  wolfInteractionsCount: number;
  wishesMadeCount: number;
}

export type WolfMood = 'happy' | 'curious' | 'helpful' | 'excited' | 'sleepy' | 'touched';

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  count: number;
  category: 'food' | 'quest' | 'special' | 'treasure';
  rarity: 1 | 2 | 3;
  description: string;
  flavorText: string;
  canGiftToWolf?: boolean;
}

export type QuestId = 'quest_carrot' | 'quest_bread' | 'quest_letter' | 'quest_wishing_tree';

export interface Quest {
  id: QuestId;
  npcId: string;
  npcName: string;
  npcTitle: string;
  npcAvatar: string;
  title: string;
  problem: string;
  solutionDesc: string;
  meritReward: number;
  luckyReward: number;
  itemReward?: InventoryItem;
  completed: boolean;
  accepted: boolean;
  introDialogues: string[];
  completeDialogues: string[];
}

export interface Building {
  id: string;
  name: string;
  description: string;
  costType: 'merit' | 'lucky';
  costAmount: number;
  unlocked: boolean;
  category: 'residence' | 'nature' | 'commerce' | 'landmark' | 'magic';
  icon: string;
  level: number;
  perk: string;
  position: { x: number; y: number }; // percentage coords on town map
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionType: 'quests' | 'merit' | 'lucky' | 'buildings' | 'wolf' | 'wishes';
  target: number;
  current: number;
  unlocked: boolean;
  rewardClaimed: boolean;
  bonusMerit: number;
  bonusLucky: number;
}

export interface FloatingText {
  id: string;
  text: string;
  type: 'merit' | 'lucky' | 'general';
  x: number;
  y: number;
}
