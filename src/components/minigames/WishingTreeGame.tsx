/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Droplets } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

export const WishingTreeGame: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [dropsCount, setDropsCount] = useState(0);
  const [isGrown, setIsGrown] = useState(false);

  const handleWater = () => {
    if (isGrown) return;
    sound.playPop();

    const next = dropsCount + 1;
    setDropsCount(next);

    if (next >= 4) {
      sound.playReward();
      setIsGrown(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-lg flex flex-col">
      <div className="p-4 bg-emerald-50/90 border-b border-emerald-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <h3 className="font-bold text-stone-800 text-base">小狼的祈願：澆灌希望小樹苗</h3>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            點擊愛心水滴，為剛破土而出的幸運神樹苗注入善意晨露！
          </p>
        </div>
        <div className="px-3 py-1 bg-emerald-200/70 border border-emerald-300 rounded-lg text-emerald-950 font-bold text-xs sm:text-sm">
          滋養進度：<span className="font-mono">{dropsCount}</span> / 4
        </div>
      </div>

      <div className="p-6 bg-gradient-to-b from-amber-50/30 to-emerald-50/50 flex flex-col items-center justify-center min-h-[280px]">
        
        {/* Tree Visual */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
          <div className="text-6xl transition-all duration-500 transform">
            {isGrown ? '🌳✨' : dropsCount >= 2 ? '🌿' : '🌱'}
          </div>
          {isGrown && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-2xl animate-ping absolute top-0 right-2">⭐</span>
              <span className="text-xl animate-ping absolute bottom-2 left-2">✨</span>
            </div>
          )}
        </div>

        <p className="text-xs sm:text-sm text-stone-700 font-medium text-center max-w-sm mb-6">
          {isGrown
            ? '嗷嗚！樹苗舒展成了茂密的幸運守護樹，還凝結出了晶瑩的朝露晨星！'
            : `輕觸下方水滴灌注善意，讓乾渴的小樹苗喝飽晨露（還需 ${4 - dropsCount} 次）`}
        </p>

        {!isGrown ? (
          <button
            onClick={handleWater}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Droplets className="w-5 h-5 text-emerald-100 animate-bounce" />
            <span>向小樹苗澆灌晨露露水</span>
          </button>
        ) : (
          <div className="text-emerald-700 font-bold text-sm bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300">
            ✓ 幸運樹苗充滿生機！
          </div>
        )}
      </div>

      <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
        >
          暫時離開
        </button>

        {isGrown && (
          <button
            onClick={onComplete}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
          >
            <CheckCircle2 className="w-4 h-4" />
            完成祈願並領取獎勵！
          </button>
        )}
      </div>
    </div>
  );
};
