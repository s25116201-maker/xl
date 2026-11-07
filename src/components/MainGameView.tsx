/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameView, PlayerStats, Quest, Building, InventoryItem } from '../types';
import { ASSETS } from '../data/gameData';
import { WolfCompanion } from './WolfCompanion';
import { sound } from '../utils/audio';
import { Users, Hammer, Backpack, Award, Compass, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';

interface Props {
  stats: PlayerStats;
  quests: Quest[];
  buildings: Building[];
  inventory: InventoryItem[];
  onNavigate: (view: GameView) => void;
  onPetWolf: (x: number, y: number) => void;
  onGiftItem: (item: InventoryItem) => void;
  onResetGame: () => void;
}

export const MainGameView: React.FC<Props> = ({
  stats,
  quests,
  buildings,
  inventory,
  onNavigate,
  onPetWolf,
  onGiftItem,
  onResetGame,
}) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [npcBubble, setNpcBubble] = useState<string>('點擊場景裡的居民可以和他們交談喔！');

  const unlockedCount = buildings.filter((b) => b.unlocked).length;
  const completedQuestsCount = quests.filter((q) => q.completed).length;

  const handleNpcClick = (npcName: string, quote: string) => {
    sound.playPop();
    setNpcBubble(`【${npcName}】：${quote}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Three Zone Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Zone: Little Wolf Companion Character & Dialogue (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <WolfCompanion
            onPetWolf={onPetWolf}
            wolfInteractionsCount={stats.wolfInteractionsCount}
            unlockedBuildingsCount={unlockedCount}
            inventory={inventory}
            onGiftItem={onGiftItem}
          />

          {/* Quick Town Stats Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>小鎮繁榮統計</span>
              <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                進度 {Math.floor((unlockedCount / buildings.length) * 100)}%
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200/60">
                <span className="text-stone-500 block text-[10px]">累計獲得功德</span>
                <span className="font-bold font-mono text-amber-900 text-sm">✨ {stats.totalMeritEarned}</span>
              </div>
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200/60">
                <span className="text-stone-500 block text-[10px]">累計獲得幸運</span>
                <span className="font-bold font-mono text-emerald-900 text-sm">🍀 {stats.totalLuckyEarned}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>已解鎖設施：{unlockedCount} / {buildings.length}</span>
              <span>完成委託：{completedQuestsCount} / {quests.length}</span>
            </div>
          </div>
        </div>

        {/* Center Zone: Active Town Scene & NPC Residents (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Interactive Illustrated Town Landscape Canvas Card */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-200 shadow-md bg-[#F4EFEA]">
            
            {/* Background Panorama */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[300px] overflow-hidden select-none">
              <img
                src={ASSETS.townBg}
                alt="童話小鎮中心"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter saturate-105"
              />

              {/* Scrim for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent pointer-events-none" />

              {/* NPC Resident 1: Rabbit Gardener (Clickable) */}
              <div className="absolute left-[18%] bottom-[22%] z-20">
                <button
                  onClick={() =>
                    handleNpcClick(
                      '兔兔園丁',
                      '「小狼小狼！我的胡蘿蔔又長得特別甜呢，隨時歡迎你來菜園玩！」'
                    )
                  }
                  className="group relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-300 bg-white shadow-md group-hover:scale-110 transition-transform">
                    <img
                      src={ASSETS.npcRabbit}
                      alt="兔兔園丁"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-1 bg-white/95 text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                    🐰 兔兔
                  </span>
                </button>
              </div>

              {/* NPC Resident 2: Bear Baker (Clickable) */}
              <div className="absolute left-[54%] bottom-[28%] z-20">
                <button
                  onClick={() =>
                    handleNpcClick(
                      '熊熊主廚',
                      '「剛出爐的蜂蜜小麵包熱氣騰騰！肚子餓的話儘管過來坐坐！」'
                    )
                  }
                  className="group relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-300 bg-white shadow-md group-hover:scale-110 transition-transform">
                    <img
                      src={ASSETS.npcBear}
                      alt="熊熊主廚"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-1 bg-white/95 text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs border border-amber-200">
                    🐻 熊熊
                  </span>
                </button>
              </div>

              {/* NPC Resident 3: Bird Postman (Clickable) */}
              <div className="absolute right-[22%] top-[34%] z-20">
                <button
                  onClick={() =>
                    handleNpcClick(
                      '鳥鳥信使',
                      '「啾啾！微風捎來了遠方森林的問候，大家都很喜歡這個溫馨的小鎮喔！」'
                    )
                  }
                  className="group relative flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-sky-300 bg-white shadow-md group-hover:scale-110 transition-transform">
                    <img
                      src={ASSETS.npcBird}
                      alt="鳥鳥信使"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-1 bg-white/95 text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs border border-sky-200">
                    🐦 鳥鳥
                  </span>
                </button>
              </div>

              {/* Bottom Dialogue Floating Banner */}
              <div className="absolute bottom-3 inset-x-4 bg-white/95 backdrop-blur-xs rounded-xl p-3 border border-stone-200/90 shadow-sm flex items-center justify-between text-xs sm:text-sm text-stone-700 font-medium">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{npcBubble}</span>
                </div>
                <button
                  onClick={() => onNavigate('QUESTS')}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0 ml-2 shadow-2xs"
                >
                  查看任務
                </button>
              </div>

            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <button
              onClick={() => {
                sound.playClick();
                onNavigate('QUESTS');
              }}
              className="p-3.5 bg-white hover:bg-amber-50/60 rounded-2xl border border-stone-200 hover:border-amber-300 shadow-2xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">📜</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                  {quests.filter((q) => !q.completed).length} 件待辦
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">居民委託任務</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">幫助夥伴解決困難</p>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('TOWN');
              }}
              className="p-3.5 bg-white hover:bg-amber-50/60 rounded-2xl border border-stone-200 hover:border-amber-300 shadow-2xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🏡</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-900 rounded-md">
                  {unlockedCount} 座已建
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">小鎮建設地圖</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">建造房屋與奇蹟噴泉</p>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('INVENTORY');
              }}
              className="p-3.5 bg-white hover:bg-amber-50/60 rounded-2xl border border-stone-200 hover:border-amber-300 shadow-2xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎒</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                  {inventory.length} 樣道具
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">冒險背包</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">查看物品與給狼送禮</p>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onNavigate('ACHIEVEMENTS');
              }}
              className="p-3.5 bg-white hover:bg-amber-50/60 rounded-2xl border border-stone-200 hover:border-amber-300 shadow-2xs transition-all text-left flex flex-col justify-between group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl group-hover:scale-110 transition-transform">🏆</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                  榮譽榜
                </span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-stone-900">善意成就</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">解鎖成就領取額外獎勵</p>
              </div>
            </button>

          </div>

          {/* Reset Save Data & Settings Footer */}
          <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
            <span>遊戲進度已隨時即時自動保存</span>
            <button
              onClick={() => setShowResetModal(true)}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="清除本地進度重開新局"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置遊戲進度</span>
            </button>
          </div>

        </div>

      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-sm w-full rounded-2xl border border-stone-200 p-5 shadow-xl animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-base text-stone-900 mb-2">確定要重置小鎮進度嗎？</h3>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              這將會清除您目前獲得的所有功德值、幸運值、已解鎖的建築物與背包道具，讓小鎮回到最初的荒原狀態重新開始冒險。
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowResetModal(false);
                  onResetGame();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                確認重置
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
