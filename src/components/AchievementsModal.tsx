/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Achievement } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Sparkles, Gift } from 'lucide-react';

interface Props {
  achievements: Achievement[];
  onClaimReward: (achId: string) => void;
}

export const AchievementsModal: React.FC<Props> = ({ achievements, onClaimReward }) => {
  const handleClaim = (ach: Achievement) => {
    sound.playReward();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClaimReward(ach.id);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">善意與榮譽成就</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            記錄你與小狼一同走過的每一個溫暖足跡。達成條件即可領取額外功德與幸運獎勵！
          </p>
        </div>

        <div className="px-3.5 py-1.5 bg-white border border-stone-200 rounded-xl shadow-2xs text-xs font-bold text-stone-700 shrink-0">
          總成就達成：<span className="font-mono text-amber-800 text-sm">{unlockedCount}</span> / {achievements.length}
        </div>
      </div>

      {/* Achievements Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const progressPercent = Math.min(100, Math.floor((ach.current / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 ${
                ach.rewardClaimed
                  ? 'border-emerald-200/80 bg-emerald-50/15'
                  : ach.unlocked
                  ? 'border-amber-400 bg-amber-50/30 shadow-md ring-2 ring-amber-200'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-2xl shadow-2xs">
                      {ach.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-stone-900">{ach.title}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{ach.description}</p>
                    </div>
                  </div>

                  {ach.rewardClaimed && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      已領取
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1 font-medium">
                    <span>達成進度</span>
                    <span className="font-mono tabular-nums">
                      {Math.min(ach.target, ach.current)} / {ach.target} ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200/60">
                    <div
                      className={`h-full transition-all duration-500 ${
                        ach.unlocked ? 'bg-amber-500' : 'bg-amber-300'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Reward Preview */}
                <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
                  <span className="text-stone-400">達成榮譽獎勵：</span>
                  <span className="px-2 py-0.5 bg-amber-100/80 text-amber-900 rounded font-bold text-xs">
                    ✨ +{ach.bonusMerit} 功德
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-100/80 text-emerald-900 rounded font-bold text-xs">
                    🍀 +{ach.bonusLucky} 幸運
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
                {ach.unlocked && !ach.rewardClaimed ? (
                  <button
                    onClick={() => handleClaim(ach)}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Gift className="w-3.5 h-3.5 text-amber-100" />
                    <span>領取成就獎勵！</span>
                  </button>
                ) : (
                  <span className="text-xs text-stone-400 font-medium">
                    {ach.rewardClaimed ? '榮譽已記入小鎮豐碑' : '努力達成中...'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
