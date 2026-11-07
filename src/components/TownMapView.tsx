/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, PlayerStats, InventoryItem } from '../types';
import { ASSETS } from '../data/gameData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Hammer, Sparkles, Check, Lock, Coins, Eye, TreePine, MapPin } from 'lucide-react';

interface TownMapViewProps {
  buildings: Building[];
  stats: PlayerStats;
  onUnlockBuilding: (buildingId: string, costType: 'merit' | 'lucky', costAmount: number) => void;
  onWishAtFountain?: () => void;
  inventory: InventoryItem[];
}

export const TownMapView: React.FC<TownMapViewProps> = ({
  buildings,
  stats,
  onUnlockBuilding,
  onWishAtFountain,
  inventory,
}) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [mapMode, setMapMode] = useState<'visual' | 'cards'>('visual');
  const [fountainWishResult, setFountainWishResult] = useState<string | null>(null);

  const unlockedCount = buildings.filter((b) => b.unlocked).length;

  const handleSelectBuilding = (b: Building) => {
    sound.playClick();
    setSelectedBuilding(b);
    setFountainWishResult(null);
  };

  const handleUnlock = (b: Building) => {
    const hasEnough = b.costType === 'merit' ? stats.merit >= b.costAmount : stats.lucky >= b.costAmount;
    if (!hasEnough) return;

    sound.playBuildingUnlock();
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
    });

    onUnlockBuilding(b.id, b.costType, b.costAmount);
    setSelectedBuilding({ ...b, unlocked: true });
  };

  const handleTossCoin = () => {
    sound.playReward();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
    });
    setFountainWishResult('✨ 撲通！你在泉水中看見了小精靈的微笑，幸運值如微波般源源不絕湧現！');
    if (onWishAtFountain) onWishAtFountain();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner and Mode Switcher */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏡</span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">小鎮建設與繁榮度</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            將善意累積的功德值與幸運值投入這片土地，建造溫馨小木屋、麵包坊、花園與奇蹟噴泉！
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="bg-white/80 border border-stone-200 p-1 rounded-xl flex items-center gap-1 shadow-2xs">
            <button
              onClick={() => {
                sound.playClick();
                setMapMode('visual');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                mapMode === 'visual'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🗺️ 俯瞰小鎮地圖
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setMapMode('cards');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                mapMode === 'cards'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📋 建築列表清單
            </button>
          </div>
        </div>
      </div>

      {/* Visual Town Map View */}
      {mapMode === 'visual' && (
        <div className="relative w-full rounded-3xl overflow-hidden border-2 border-amber-200/90 shadow-lg bg-[#EAE2D7]">
          
          {/* Panoramic Fairytale Background Image */}
          <div className="relative w-full aspect-[16/9] min-h-[360px] max-h-[580px] overflow-hidden select-none">
            <img
              src={ASSETS.townBg}
              alt="小鎮全景地圖"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter saturate-105"
            />

            {/* Ambient Sunshine overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-amber-200/10 pointer-events-none" />

            {/* Building Interactive Markers pinned to coordinates */}
            {buildings.map((b) => {
              const hasEnough = b.costType === 'merit' ? stats.merit >= b.costAmount : stats.lucky >= b.costAmount;
              
              return (
                <div
                  key={b.id}
                  style={{ left: `${b.position.x}%`, top: `${b.position.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => handleSelectBuilding(b)}
                    className={`relative group p-1.5 sm:p-2 rounded-2xl transition-all duration-300 cursor-pointer shadow-md flex flex-col items-center active:scale-95 ${
                      b.unlocked
                        ? 'bg-white/95 border-2 border-emerald-400 hover:scale-110 hover:shadow-emerald-200 hover:shadow-lg'
                        : hasEnough
                        ? 'bg-amber-100/95 border-2 border-amber-400 hover:scale-110 animate-bounce'
                        : 'bg-stone-100/90 border border-stone-300 opacity-90 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl filter drop-shadow-sm">
                      {b.icon}
                    </span>

                    {/* Badge Tag */}
                    <div className="mt-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-xs flex items-center gap-1 bg-white/90 text-stone-800">
                      {b.unlocked ? (
                        <span className="text-emerald-700 flex items-center gap-0.5">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                          {b.name.split('（')[0]}
                        </span>
                      ) : (
                        <span className="text-amber-800 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5 text-amber-700" />
                          {b.costType === 'merit' ? `✨ ${b.costAmount}` : `🍀 ${b.costAmount}`}
                        </span>
                      )}
                    </div>

                    {/* Unlocked special smoke/sparkle element */}
                    {b.unlocked && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
                    )}
                  </button>
                </div>
              );
            })}

            {/* Little Wolf & Friends wandering on Town Map */}
            <div className="absolute left-[48%] top-[60%] transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-300 bg-white shadow-md animate-bounce">
                <img
                  src={ASSETS.wolfMascot}
                  alt="小狼在小鎮散步"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="bg-amber-500 text-white font-bold text-[9px] px-1.5 py-0.2 rounded-full shadow-xs block text-center mt-0.5">
                小狼
              </span>
            </div>

            {/* Map Legend Footer */}
            <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-xs text-stone-700 bg-white/90 backdrop-blur-xs p-2.5 rounded-xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-stone-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  目前繁榮度：
                </span>
                <span className="font-semibold text-emerald-700">
                  {unlockedCount} / {buildings.length} 座設施已落成
                </span>
              </div>
              <span className="text-stone-500 text-[11px] hidden sm:inline">
                點擊地圖上的建築圖標可進行解鎖或互動
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Cards View */}
      {mapMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buildings.map((b) => {
            const hasEnough = b.costType === 'merit' ? stats.merit >= b.costAmount : stats.lucky >= b.costAmount;

            return (
              <div
                key={b.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 ${
                  b.unlocked
                    ? 'border-emerald-200/90 shadow-2xs bg-emerald-50/10'
                    : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-2xs">
                      {b.icon}
                    </div>
                    {b.unlocked ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        已落成
                      </span>
                    ) : (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                        b.costType === 'merit'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {b.costType === 'merit' ? `✨ ${b.costAmount} 功德` : `🍀 ${b.costAmount} 幸運`}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">{b.name}</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="mt-3 p-2 bg-[#FDFBF7] rounded-xl border border-stone-200/80 text-[11px] text-stone-600">
                    <span className="font-bold text-amber-800">🌟 小鎮增益：</span>
                    {b.perk}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {b.unlocked ? '設施已正常運作中' : hasEnough ? '點數充足，可立即建設' : '點數不足'}
                  </span>

                  <button
                    onClick={() => handleSelectBuilding(b)}
                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    查看詳情
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Building Inspect & Unlock Modal */}
      {selectedBuilding && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">{selectedBuilding.icon}</span>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">{selectedBuilding.name}</h3>
                  <span className="text-xs text-stone-500">
                    {selectedBuilding.unlocked ? '✓ 小鎮繁榮地標' : '待建設預定地'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-3.5 rounded-xl border border-stone-200/80">
                {selectedBuilding.description}
              </p>

              <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-200 text-xs text-stone-800">
                <span className="font-bold text-amber-900 block mb-0.5">💖 設施為小鎮帶來的改變：</span>
                <p>{selectedBuilding.perk}</p>
              </div>

              {/* Special interactive action for unlocked buildings */}
              {selectedBuilding.unlocked ? (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <span className="text-emerald-800 font-bold text-xs sm:text-sm block mb-2">
                    建築物已成功落成！
                  </span>

                  {selectedBuilding.id === 'fountain' && (
                    <div className="space-y-2">
                      <button
                        onClick={handleTossCoin}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-emerald-200" />
                        <span>向奇蹟噴泉投幣祈願</span>
                      </button>
                      {fountainWishResult && (
                        <p className="text-xs text-emerald-900 font-medium animate-in fade-in">
                          {fountainWishResult}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedBuilding.id === 'bakery' && (
                    <p className="text-xs text-stone-600">
                      🥖 熊熊正在烤爐前忙碌著，空氣中瀰漫著濃濃的烤小麵包香氣！
                    </p>
                  )}

                  {selectedBuilding.id === 'garden' && (
                    <p className="text-xs text-stone-600">
                      🌸 兔兔每天清晨都在花圃澆花，幾隻小彩蝶圍繞在向日葵旁飛舞！
                    </p>
                  )}

                  {selectedBuilding.id === 'magic_forest' && (
                    <p className="text-xs text-stone-600">
                      ✨ 鳥鳥在此建立了高空觀景巢穴，林間飄動著治癒人心的微光花粉！
                    </p>
                  )}

                  {selectedBuilding.id === 'cabin_upgrade' && (
                    <p className="text-xs text-stone-600">
                      🏡 雙層小木屋點著溫暖的橙色油燈，小狼在壁爐前睡得呼嚕嚕！
                    </p>
                  )}

                  {selectedBuilding.id === 'plaza' && (
                    <p className="text-xs text-stone-600">
                      🎪 鵝卵石廣場成了大家聚會的地方，小鎮居民們在此相談甚歡！
                    </p>
                  )}
                </div>
              ) : (
                /* Cost & Balance Breakdown */
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">所需建設成本：</span>
                    <span className="font-bold text-amber-900">
                      {selectedBuilding.costType === 'merit'
                        ? `✨ ${selectedBuilding.costAmount} 功德值`
                        : `🍀 ${selectedBuilding.costAmount} 幸運值`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">目前持有數值：</span>
                    <span className="font-bold font-mono text-stone-800">
                      {selectedBuilding.costType === 'merit'
                        ? `✨ ${stats.merit} 功德值`
                        : `🍀 ${stats.lucky} 幸運值`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-stone-500">建設條件：</span>
                    <span className={
                      (selectedBuilding.costType === 'merit' ? stats.merit >= selectedBuilding.costAmount : stats.lucky >= selectedBuilding.costAmount)
                        ? 'text-emerald-600'
                        : 'text-amber-700'
                    }>
                      {(selectedBuilding.costType === 'merit' ? stats.merit >= selectedBuilding.costAmount : stats.lucky >= selectedBuilding.costAmount)
                        ? '✓ 符合條件'
                        : '點數不足，多幫助居民賺取！'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedBuilding(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                關閉
              </button>

              {!selectedBuilding.unlocked && (
                <button
                  onClick={() => handleUnlock(selectedBuilding)}
                  disabled={
                    selectedBuilding.costType === 'merit'
                      ? stats.merit < selectedBuilding.costAmount
                      : stats.lucky < selectedBuilding.costAmount
                  }
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                    (selectedBuilding.costType === 'merit' ? stats.merit >= selectedBuilding.costAmount : stats.lucky >= selectedBuilding.costAmount)
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Hammer className="w-4 h-4" />
                  <span>消耗點數解鎖建設！</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
