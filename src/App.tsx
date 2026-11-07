/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { GameView, PlayerStats, Quest, Building, Achievement, InventoryItem, QuestId, FloatingText } from './types';
import { loadGame, saveGame, clearGameSave } from './utils/storage';
import { sound } from './utils/audio';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MainGameView } from './components/MainGameView';
import { TownMapView } from './components/TownMapView';
import { QuestListView } from './components/QuestListView';
import { CharacterIntroView } from './components/CharacterIntroView';
import { InventoryModal } from './components/InventoryModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { FloatNumberEffect } from './components/FloatNumberEffect';

export default function App() {
  const [saveState, setSaveState] = useState(() => loadGame());
  const [currentView, setCurrentView] = useState<GameView>('HOME');
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Sync sound engine with save state
  useEffect(() => {
    sound.enabled = saveState.soundEnabled;
  }, [saveState.soundEnabled]);

  // Persist whenever saveState changes
  useEffect(() => {
    saveGame(saveState);
  }, [saveState]);

  // Helper to add floating notifications
  const addFloatingText = useCallback((text: string, type: 'merit' | 'lucky' | 'general', x?: number, y?: number) => {
    const defaultX = typeof window !== 'undefined' ? window.innerWidth / 2 : 300;
    const defaultY = typeof window !== 'undefined' ? window.innerHeight / 2 - 50 : 200;
    const newFt: FloatingText = {
      id: `${Date.now()}_${Math.random()}`,
      text,
      type,
      x: x ?? defaultX,
      y: y ?? defaultY,
    };
    setFloatingTexts((prev) => [...prev, newFt]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newFt.id));
    }, 1300);
  }, []);

  // Update achievements helper
  const checkAchievements = useCallback((stats: PlayerStats, buildings: Building[], quests: Quest[]) => {
    return (prevAchs: Achievement[]) => {
      return prevAchs.map((ach) => {
        let current = 0;
        if (ach.conditionType === 'quests') current = stats.questsCompletedCount;
        else if (ach.conditionType === 'merit') current = stats.totalMeritEarned;
        else if (ach.conditionType === 'lucky') current = stats.totalLuckyEarned;
        else if (ach.conditionType === 'buildings') current = stats.buildingsUnlockedCount;
        else if (ach.conditionType === 'wolf') current = stats.wolfInteractionsCount;

        const isNowUnlocked = current >= ach.target;
        return {
          ...ach,
          current,
          unlocked: isNowUnlocked,
        };
      });
    };
  }, []);

  // Handle quest completion
  const handleCompleteQuest = (questId: QuestId) => {
    setSaveState((prev) => {
      const targetQuest = prev.quests.find((q) => q.id === questId);
      if (!targetQuest || targetQuest.completed) return prev;

      const meritGain = targetQuest.meritReward;
      const luckyGain = targetQuest.luckyReward;

      const updatedQuests = prev.quests.map((q) => (q.id === questId ? { ...q, completed: true } : q));

      const updatedStats: PlayerStats = {
        ...prev.stats,
        merit: prev.stats.merit + meritGain,
        lucky: prev.stats.lucky + luckyGain,
        totalMeritEarned: prev.stats.totalMeritEarned + meritGain,
        totalLuckyEarned: prev.stats.totalLuckyEarned + luckyGain,
        questsCompletedCount: prev.stats.questsCompletedCount + 1,
      };

      // Add item reward if available
      let updatedInventory = [...prev.inventory];
      if (targetQuest.itemReward) {
        const existingIdx = updatedInventory.findIndex((i) => i.id === targetQuest.itemReward!.id);
        if (existingIdx >= 0) {
          updatedInventory[existingIdx] = {
            ...updatedInventory[existingIdx],
            count: updatedInventory[existingIdx].count + targetQuest.itemReward.count,
          };
        } else {
          updatedInventory.push(targetQuest.itemReward);
        }
      }

      const updatedAchievements = checkAchievements(updatedStats, prev.buildings, updatedQuests)(prev.achievements);

      addFloatingText(`✨ 功德值 +${meritGain}`, 'merit');
      setTimeout(() => {
        addFloatingText(`🍀 幸運值 +${luckyGain}`, 'lucky');
      }, 350);

      return {
        ...prev,
        stats: updatedStats,
        quests: updatedQuests,
        inventory: updatedInventory,
        achievements: updatedAchievements,
      };
    });
  };

  // Handle accept quest
  const handleAcceptQuest = (questId: QuestId) => {
    setSaveState((prev) => ({
      ...prev,
      quests: prev.quests.map((q) => (q.id === questId ? { ...q, accepted: true } : q)),
    }));
  };

  // Handle unlock building
  const handleUnlockBuilding = (buildingId: string, costType: 'merit' | 'lucky', costAmount: number) => {
    setSaveState((prev) => {
      const target = prev.buildings.find((b) => b.id === buildingId);
      if (!target || target.unlocked) return prev;

      const newMerit = costType === 'merit' ? prev.stats.merit - costAmount : prev.stats.merit;
      const newLucky = costType === 'lucky' ? prev.stats.lucky - costAmount : prev.stats.lucky;

      const updatedBuildings = prev.buildings.map((b) => (b.id === buildingId ? { ...b, unlocked: true } : b));

      const updatedStats: PlayerStats = {
        ...prev.stats,
        merit: newMerit,
        lucky: newLucky,
        buildingsUnlockedCount: prev.stats.buildingsUnlockedCount + 1,
      };

      const updatedAchievements = checkAchievements(updatedStats, updatedBuildings, prev.quests)(prev.achievements);

      addFloatingText(`🎉 成功落成【${target.name}】！`, 'general');

      return {
        ...prev,
        stats: updatedStats,
        buildings: updatedBuildings,
        achievements: updatedAchievements,
      };
    });
  };

  // Handle pet wolf
  const handlePetWolf = (x: number, y: number) => {
    setSaveState((prev) => {
      const updatedStats: PlayerStats = {
        ...prev.stats,
        wolfInteractionsCount: prev.stats.wolfInteractionsCount + 1,
      };
      const updatedAchievements = checkAchievements(updatedStats, prev.buildings, prev.quests)(prev.achievements);

      addFloatingText('❤️ 親密度上升！', 'general', x, y - 30);

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchievements,
      };
    });
  };

  // Handle gift item to wolf
  const handleGiftItem = (item: InventoryItem) => {
    setSaveState((prev) => {
      const itemIdx = prev.inventory.findIndex((i) => i.id === item.id);
      if (itemIdx < 0) return prev;

      const updatedInventory = [...prev.inventory];
      if (updatedInventory[itemIdx].count > 1) {
        updatedInventory[itemIdx] = {
          ...updatedInventory[itemIdx],
          count: updatedInventory[itemIdx].count - 1,
        };
      } else {
        updatedInventory.splice(itemIdx, 1);
      }

      // Wolf rewards blessing bonus
      const bonusLucky = 5;
      const bonusMerit = 5;
      const updatedStats: PlayerStats = {
        ...prev.stats,
        lucky: prev.stats.lucky + bonusLucky,
        merit: prev.stats.merit + bonusMerit,
        totalLuckyEarned: prev.stats.totalLuckyEarned + bonusLucky,
        totalMeritEarned: prev.stats.totalMeritEarned + bonusMerit,
        wolfInteractionsCount: prev.stats.wolfInteractionsCount + 1,
      };

      const updatedAchievements = checkAchievements(updatedStats, prev.buildings, prev.quests)(prev.achievements);

      addFloatingText('🐺 小狼開心地收下了！', 'general');
      setTimeout(() => {
        addFloatingText(`🍀 幸運祝福 +${bonusLucky}`, 'lucky');
      }, 400);

      return {
        ...prev,
        inventory: updatedInventory,
        stats: updatedStats,
        achievements: updatedAchievements,
      };
    });
  };

  // Handle wish at fountain
  const handleWishAtFountain = () => {
    setSaveState((prev) => {
      const luckyBonus = 15;
      const updatedStats: PlayerStats = {
        ...prev.stats,
        lucky: prev.stats.lucky + luckyBonus,
        totalLuckyEarned: prev.stats.totalLuckyEarned + luckyBonus,
        wishesMadeCount: prev.stats.wishesMadeCount + 1,
      };

      const updatedAchievements = checkAchievements(updatedStats, prev.buildings, prev.quests)(prev.achievements);

      addFloatingText(`🍀 噴泉奇蹟賜福 +${luckyBonus} 幸運值！`, 'lucky');

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchievements,
      };
    });
  };

  // Handle claim achievement reward
  const handleClaimReward = (achId: string) => {
    setSaveState((prev) => {
      const target = prev.achievements.find((a) => a.id === achId);
      if (!target || target.rewardClaimed) return prev;

      const meritGain = target.bonusMerit;
      const luckyGain = target.bonusLucky;

      const updatedAchs = prev.achievements.map((a) => (a.id === achId ? { ...a, rewardClaimed: true } : a));

      const updatedStats: PlayerStats = {
        ...prev.stats,
        merit: prev.stats.merit + meritGain,
        lucky: prev.stats.lucky + luckyGain,
        totalMeritEarned: prev.stats.totalMeritEarned + meritGain,
        totalLuckyEarned: prev.stats.totalLuckyEarned + luckyGain,
      };

      addFloatingText(`✨ 成就榮譽 +${meritGain} 功德`, 'merit');
      setTimeout(() => {
        addFloatingText(`🍀 成就榮譽 +${luckyGain} 幸運`, 'lucky');
      }, 350);

      return {
        ...prev,
        stats: updatedStats,
        achievements: updatedAchs,
      };
    });
  };

  // Sound toggle
  const handleToggleSound = () => {
    setSaveState((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  // Reset entire game progress
  const handleResetGame = () => {
    sound.playClick();
    const freshState = clearGameSave();
    setSaveState(freshState);
    setCurrentView('HOME');
    addFloatingText('小鎮進度已重置', 'general');
  };

  const unclaimedAchievementsCount = saveState.achievements.filter((a) => a.unlocked && !a.rewardClaimed).length;
  const availableQuestsCount = saveState.quests.filter((q) => !q.completed).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 font-sans">
      
      {/* Floating Animated Text Layer */}
      <FloatNumberEffect floatingTexts={floatingTexts} />

      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        stats={saveState.stats}
        soundEnabled={saveState.soundEnabled}
        onToggleSound={handleToggleSound}
        unclaimedAchievementsCount={unclaimedAchievementsCount}
        availableQuestsCount={availableQuestsCount}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        
        {currentView === 'HOME' && (
          <HomeView
            onStartAdventure={() => setCurrentView('MAIN')}
            onOpenCharacterIntro={() => setCurrentView('CHARACTER')}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenTown={() => setCurrentView('TOWN')}
          />
        )}

        {currentView === 'MAIN' && (
          <MainGameView
            stats={saveState.stats}
            quests={saveState.quests}
            buildings={saveState.buildings}
            inventory={saveState.inventory}
            onNavigate={setCurrentView}
            onPetWolf={handlePetWolf}
            onGiftItem={handleGiftItem}
            onResetGame={handleResetGame}
          />
        )}

        {currentView === 'TOWN' && (
          <TownMapView
            buildings={saveState.buildings}
            stats={saveState.stats}
            onUnlockBuilding={handleUnlockBuilding}
            onWishAtFountain={handleWishAtFountain}
            inventory={saveState.inventory}
          />
        )}

        {currentView === 'QUESTS' && (
          <QuestListView
            quests={saveState.quests}
            onCompleteQuest={handleCompleteQuest}
            onAcceptQuest={handleAcceptQuest}
          />
        )}

        {currentView === 'CHARACTER' && <CharacterIntroView />}

        {currentView === 'INVENTORY' && (
          <InventoryModal
            inventory={saveState.inventory}
            onGiftItem={handleGiftItem}
          />
        )}

        {currentView === 'ACHIEVEMENTS' && (
          <AchievementsModal
            achievements={saveState.achievements}
            onClaimReward={handleClaimReward}
          />
        )}

      </main>

      {/* How To Play Tutorial Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* Quiet Fairy-tale Footer */}
      <footer className="border-t border-stone-200/80 bg-[#FAF8F5] py-4 px-6 text-center text-xs text-stone-500">
        <p className="max-w-md mx-auto">
          《小狼的幸運小鎮》 · 原創 IP 療癒冒險遊戲 · 每一次善意，都能為世界帶來一點改變
        </p>
      </footer>

    </div>
  );
}
