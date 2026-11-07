/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ASSETS, WOLF_DIALOGUES } from '../data/gameData';
import { WolfMood, InventoryItem } from '../types';
import { sound } from '../utils/audio';
import { Heart, Sparkles, Gift, MessageCircleHeart } from 'lucide-react';

interface WolfCompanionProps {
  onPetWolf: (x: number, y: number) => void;
  wolfInteractionsCount: number;
  unlockedBuildingsCount: number;
  inventory: InventoryItem[];
  onGiftItem: (item: InventoryItem) => void;
  compact?: boolean;
}

export const WolfCompanion: React.FC<WolfCompanionProps> = ({
  onPetWolf,
  wolfInteractionsCount,
  unlockedBuildingsCount,
  inventory,
  onGiftItem,
  compact = false,
}) => {
  const [mood, setMood] = useState<WolfMood>('happy');
  const [currentSpeech, setCurrentSpeech] = useState<string>(
    '嗷嗚！今天又是充滿善意與奇蹟的一天呢！我們一起加油！'
  );
  const [isWobbling, setIsWobbling] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  // Determine stage speech
  const getStageHint = () => {
    if (unlockedBuildingsCount === 0) {
      return WOLF_DIALOGUES.stageBarren[Math.floor(Math.random() * WOLF_DIALOGUES.stageBarren.length)];
    } else if (unlockedBuildingsCount < 4) {
      return WOLF_DIALOGUES.stageMedium[Math.floor(Math.random() * WOLF_DIALOGUES.stageMedium.length)];
    } else {
      return WOLF_DIALOGUES.stageProsperous[Math.floor(Math.random() * WOLF_DIALOGUES.stageProsperous.length)];
    }
  };

  const handlePet = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    sound.playWolfVoice();
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 500);

    // Random petted dialogue
    const randomSpeech = WOLF_DIALOGUES.petted[Math.floor(Math.random() * WOLF_DIALOGUES.petted.length)];
    setCurrentSpeech(randomSpeech);
    setMood('touched');

    // Spawn floating heart
    const newHeart = { id: Date.now(), x: clickX - rect.left, y: clickY - rect.top };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1000);

    onPetWolf(clickX, clickY);
  };

  const handleGift = (item: InventoryItem) => {
    sound.playReward();
    setShowGiftModal(false);

    if (item.id.includes('carrot')) {
      setCurrentSpeech(WOLF_DIALOGUES.giftCarrot[0]);
      setMood('excited');
    } else if (item.id.includes('bread')) {
      setCurrentSpeech(WOLF_DIALOGUES.giftBread[0]);
      setMood('excited');
    } else if (item.id.includes('clover')) {
      setCurrentSpeech(WOLF_DIALOGUES.giftClover[0]);
      setMood('happy');
    } else {
      setCurrentSpeech('嗷嗚！謝謝你送我這麼珍貴的禮物！小狼心裡暖洋洋的！');
      setMood('touched');
    }

    onGiftItem(item);
  };

  const giftableItems = inventory.filter((item) => item.canGiftToWolf && item.count > 0);

  return (
    <div className={`relative bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4 shadow-sm flex flex-col items-center ${compact ? 'max-w-xs' : 'w-full'}`}>
      
      {/* Little Wolf Header Badge */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-stone-800">夥伴 · 小狼</span>
          <span className="text-xs text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full font-medium">
            Lv.{Math.min(10, Math.floor(wolfInteractionsCount / 3) + 1)} 默契
          </span>
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {mood === 'happy' ? '😊 開心' : mood === 'touched' ? '🥰 被摸摸' : mood === 'excited' ? '✨ 超興奮' : '🐺 守護中'}
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="relative w-full mb-3 bg-white/95 rounded-xl p-3 border border-amber-200/90 shadow-2xs text-stone-800 text-xs sm:text-sm leading-relaxed min-h-[58px] flex items-center">
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        <p className="w-full text-center font-medium text-stone-700">
          {currentSpeech}
        </p>
      </div>

      {/* Interactive Mascot Area */}
      <div 
        onClick={handlePet}
        className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-b from-amber-50 to-amber-100/60 border-2 border-amber-200/80 shadow-md transition-all duration-300 hover:shadow-lg ${
          isWobbling ? 'scale-105 rotate-3' : 'hover:scale-102'
        }`}
        title="點擊小狼可以摸摸小狼、聽小狼講話喔！"
      >
        <img
          src={ASSETS.wolfMascot}
          alt="原創角色小狼"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Floating Heart Particles */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-red-500 text-xl animate-ping"
            style={{ left: `${h.x}px`, top: `${h.y}px` }}
          >
            💖
          </div>
        ))}

        {/* Pet Hint Overlay on Hover */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
          <span className="bg-white/90 text-stone-800 font-bold text-xs px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            點擊摸摸小狼
          </span>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="w-full mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            sound.playWolfVoice();
            setCurrentSpeech(getStageHint());
          }}
          className="w-full py-2 px-2.5 bg-white border border-stone-200 rounded-xl text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:border-amber-300 transition-all flex items-center justify-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
        >
          <MessageCircleHeart className="w-3.5 h-3.5 text-amber-600" />
          <span>小狼的鼓勵</span>
        </button>

        <button
          onClick={() => {
            sound.playPop();
            setShowGiftModal(true);
          }}
          className="w-full py-2 px-2.5 bg-amber-500 hover:bg-amber-600 border border-amber-600/30 rounded-xl text-white text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer"
        >
          <Gift className="w-3.5 h-3.5 text-amber-100" />
          <span>給小狼送禮</span>
        </button>
      </div>

      {/* Gift Selection Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-sm w-full rounded-2xl border border-stone-200 p-5 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
              <h3 className="font-bold text-base text-stone-800 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-600" />
                送給小狼的禮物
              </h3>
              <button
                onClick={() => setShowGiftModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              挑選背包中的美食或幸運物送給小狼，小狼會很開心地回應你喔！
            </p>

            {giftableItems.length === 0 ? (
              <div className="py-6 text-center text-stone-500 text-xs bg-white/60 rounded-xl border border-dashed border-stone-200">
                <p>背包裡目前沒有可以送給小狼的物品喔！</p>
                <p className="mt-1 text-stone-400">完成兔兔或熊熊的委託即可獲得甜脆胡蘿蔔與暖心麵包！</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {giftableItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200 hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-bold text-xs text-stone-800 flex items-center gap-1.5">
                          {item.name}
                          <span className="text-[10px] text-stone-400 font-normal">x{item.count}</span>
                        </div>
                        <p className="text-[11px] text-stone-500 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGift(item)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      贈送
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowGiftModal(false)}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
