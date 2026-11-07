/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Heart, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] max-w-lg w-full rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className="font-bold text-stone-900 text-base">《小狼的幸運小鎮》玩法指南</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          <div className="p-3.5 bg-amber-100/70 rounded-xl border border-amber-200 text-amber-950 text-xs sm:text-sm font-semibold leading-relaxed">
            🌟 遊戲核心理念：「每一次善意，都能為世界帶來一點改變。」
          </div>

          {/* Section 1: Points */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
              <span>💎</span>
              <span>雙核心數值系統</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-800 block mb-1">✨ 功德值</span>
                <p className="text-stone-600 leading-relaxed">
                  幫助居民解決困難累積的點數。主要用於建設小木屋、麵包坊、小廣場等公共生活設施！
                </p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-800 block mb-1">🍀 幸運值</span>
                <p className="text-stone-600 leading-relaxed">
                  在解謎與探險中收穫的奇遇好運。可用於解鎖螢光魔法森林與向奇蹟噴泉投幣許願！
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Quests */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
              <span>📜</span>
              <span>森林居民的有趣任務</span>
            </h4>
            <ul className="text-xs text-stone-600 space-y-1.5 bg-white p-3 rounded-xl border border-stone-200">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>兔兔園丁：</strong>在草地林間找出被風吹散的 5 根鮮脆胡蘿蔔。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>熊熊麵包師：</strong>挑選出符合食譜的4種天然原料並揉捏烘焙蜂蜜麵包。</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>鳥鳥郵差：</strong>辨識林間風鈴草古木與對齊樹洞石匣上的三重風之符文。</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Little Wolf */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs sm:text-sm text-stone-800 flex items-center gap-1.5">
              <span>🐺</span>
              <span>與小狼夥伴的日常互動</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
              點擊畫面左側的小狼可以輕輕摸摸小狼的頭，小狼會發出可愛的叫聲並切換心情！你也可以開啟背包，將剛採收的胡蘿蔔或剛出爐的蜂蜜麵包送給小狼品嚐，小狼會給予溫暖的回應喔！
            </p>
          </div>

          {/* Section 4: Progress storage */}
          <div className="flex items-center gap-2 p-3 bg-stone-100 rounded-xl text-stone-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>遊戲進度會自動儲存在您的瀏覽器中，重新整理頁面數值與建築都不會遺失。</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            我知道了，開始遊玩！
          </button>
        </div>

      </div>
    </div>
  );
};
