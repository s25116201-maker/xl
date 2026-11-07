/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, Flame } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

interface Ingredient {
  id: string;
  name: string;
  icon: string;
  isCorrect: boolean;
  desc: string;
}

const ALL_INGREDIENTS: Ingredient[] = [
  { id: 'flour', name: '特級小麥麵粉', icon: '🌾', isCorrect: true, desc: '麵包蓬鬆柔軟的黃金基底' },
  { id: 'honey', name: '森林金合歡蜂蜜', icon: '🍯', isCorrect: true, desc: '帶有花香的純天然甜味' },
  { id: 'milk', name: '香濃純鮮奶', icon: '🥛', isCorrect: true, desc: '讓麵團更加滑順奶香濃郁' },
  { id: 'yeast', name: '天然活性酵母', icon: '🫧', isCorrect: true, desc: '發酵出完美氣孔的魔法原料' },
  { id: 'chili', name: '火辣紅辣椒', icon: '🌶️', isCorrect: false, desc: '太辣了！熊熊的客人會噴火' },
  { id: 'salt', name: '海水粗鹽塊', icon: '🧂', isCorrect: false, desc: '太鹹了，會破壞蜂蜜甜味' },
  { id: 'twig', name: '乾枯小樹枝', icon: '🪵', isCorrect: false, desc: '這不能吃呀！是柴火原料' },
  { id: 'pinecone', name: '乾燥老松果', icon: '🌰', isCorrect: false, desc: '硬邦邦的，會咬斷松鼠的牙齒' },
];

export const BakeryMatchGame: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    '檢視秘方食譜，挑出4種烘焙所需的天然原料加入攪拌盆！'
  );
  const [isBaking, setIsBaking] = useState(false);
  const [isBaked, setIsBaked] = useState(false);

  const correctTargetIds = ['flour', 'honey', 'milk', 'yeast'];

  const handleToggle = (item: Ingredient) => {
    if (isBaking || isBaked) return;

    if (selectedIds.includes(item.id)) {
      sound.playClick();
      setSelectedIds(selectedIds.filter((id) => id !== item.id));
      setStatusMessage(`已將【${item.name}】移出攪拌盆。`);
    } else {
      if (selectedIds.length >= 4) {
        setStatusMessage('攪拌盆已經滿了喔！請先移除一樣原料。');
        return;
      }

      if (!item.isCorrect) {
        sound.playPop();
        setStatusMessage(`⚠️ 哎呀！${item.name}可不能加進甜麵包裡喔（${item.desc}）！`);
        return;
      }

      sound.playPop();
      const next = [...selectedIds, item.id];
      setSelectedIds(next);
      setStatusMessage(`✨ 成功加入【${item.name}】！（${item.desc}）`);
    }
  };

  const handleStartBaking = () => {
    // Check if exactly the 4 correct ingredients are selected
    const allCorrect = correctTargetIds.every((id) => selectedIds.includes(id)) && selectedIds.length === 4;
    if (!allCorrect) {
      setStatusMessage('配方好像還不夠齊全喔！需要小麥、蜂蜜、鮮奶與天然酵母！');
      return;
    }

    sound.playBuildingUnlock();
    setIsBaking(true);
    setStatusMessage('🔥 麵團揉合發酵中... 送入烤箱烘烤！');

    setTimeout(() => {
      setIsBaking(false);
      setIsBaked(true);
      sound.playReward();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStatusMessage('🎉 叮！金黃璀璨的「特製幸運蜂蜜麵包」熱騰騰出爐啦！');
    }, 1800);
  };

  const handleReset = () => {
    sound.playClick();
    setSelectedIds([]);
    setIsBaking(false);
    setIsBaked(false);
    setStatusMessage('已重新整理原料架，請重新挑選食材！');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍞</span>
            <h3 className="font-bold text-stone-800 text-base">熊熊的烘焙委託：配對幸運蜂蜜麵包食材</h3>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            食譜需求：小麥麵粉、森林金合歡蜂蜜、純鮮奶、天然酵母。
          </p>
        </div>
        <div className="px-3 py-1 bg-amber-200/70 border border-amber-300 rounded-lg text-amber-900 font-bold text-sm">
          已加入：<span className="font-mono text-base">{selectedIds.length}</span> / 4
        </div>
      </div>

      {/* Main Interactive Kitchen Area */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#FDFBF7] to-amber-50/40">
        
        {/* Mixing Bowl & Oven Visual Centerpiece */}
        <div className="mb-6 p-4 bg-white/90 rounded-2xl border-2 border-dashed border-amber-300 flex flex-col sm:flex-row items-center justify-around gap-4 shadow-xs">
          
          {/* Mixing Bowl Area */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-500 mb-1">主廚大攪拌盆</span>
            <div className={`w-32 h-32 rounded-full border-4 border-amber-200 bg-amber-100/50 flex flex-col items-center justify-center relative shadow-inner transition-transform ${isBaking ? 'animate-spin' : ''}`}>
              {selectedIds.length === 0 ? (
                <span className="text-xs text-stone-400 font-medium text-center px-2">點選下方原料放入攪拌盆</span>
              ) : (
                <div className="flex flex-wrap justify-center gap-1.5 p-2">
                  {selectedIds.map((id) => {
                    const item = ALL_INGREDIENTS.find((i) => i.id === id);
                    return (
                      <span key={id} className="text-2xl animate-bounce" title={item?.name}>
                        {item?.icon}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Oven / Bread Result Area */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-stone-500 mb-1">小鎮石砌柴燒烤爐</span>
            <div className={`w-36 h-32 rounded-2xl border-4 ${isBaking ? 'border-orange-500 bg-orange-100 shadow-orange-300 shadow-md animate-pulse' : 'border-stone-300 bg-stone-100'} flex flex-col items-center justify-center p-2 text-center transition-all`}>
              {isBaked ? (
                <div className="animate-in zoom-in-75 duration-300 flex flex-col items-center">
                  <span className="text-4xl animate-bounce">🥐✨</span>
                  <span className="text-xs font-bold text-amber-900 mt-1">黃金香脆麵包！</span>
                </div>
              ) : isBaking ? (
                <div className="flex flex-col items-center text-orange-600">
                  <Flame className="w-8 h-8 animate-bounce text-orange-500" />
                  <span className="text-xs font-bold mt-1">烘烤中 180°C...</span>
                </div>
              ) : (
                <div className="text-stone-400 text-xs">
                  <span className="text-3xl block opacity-60">🥖</span>
                  <span>等待材料揉合</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Banner */}
        <div className="mb-4 p-3 bg-amber-100/70 border border-amber-300/80 rounded-xl text-xs sm:text-sm text-stone-800 font-medium text-center">
          {statusMessage}
        </div>

        {/* Ingredients Shelf Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_INGREDIENTS.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleToggle(item)}
                disabled={isBaking || isBaked}
                className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col items-center text-center group ${
                  isSelected
                    ? 'bg-amber-200/80 border-amber-400 shadow-xs scale-102 ring-2 ring-amber-300'
                    : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                }`}
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="text-xs font-bold text-stone-800">{item.name}</span>
                <span className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{item.desc}</span>
                <span className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors">
                  {isSelected ? '✓ 已放入' : '+ 放入盆中'}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Action Footer */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置配方
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            暫時離開
          </button>

          {!isBaked ? (
            <button
              onClick={handleStartBaking}
              disabled={selectedIds.length !== 4 || isBaking}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                selectedIds.length === 4 && !isBaking
                  ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isBaking ? '正在烘烤中...' : '開始揉捏烘焙！'}
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              領取美味麵包與委託獎勵！
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
