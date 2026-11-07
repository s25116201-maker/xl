/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

interface CarrotSpot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  found: boolean;
  name: string;
}

const INITIAL_CARROTS: CarrotSpot[] = [
  { id: 1, x: 22, y: 72, found: false, name: '向日葵花叢邊緣' },
  { id: 2, x: 44, y: 58, found: false, name: '溪邊青苔大石縫隙' },
  { id: 3, x: 68, y: 78, found: false, name: '木輪推車後方' },
  { id: 4, x: 82, y: 48, found: false, name: '古老空心樹樁根部' },
  { id: 5, x: 34, y: 38, found: false, name: '蒲公英草丘旁' },
];

export const CarrotHuntGame: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [carrots, setCarrots] = useState<CarrotSpot[]>(INITIAL_CARROTS);
  const [lastFoundMsg, setLastFoundMsg] = useState<string>('仔細觀察草地與樹叢，點擊發現的胡蘿蔔！');
  const [isFinished, setIsFinished] = useState(false);

  const foundCount = carrots.filter((c) => c.found).length;

  const handleCarrotClick = (id: number) => {
    const target = carrots.find((c) => c.id === id);
    if (!target || target.found) return;

    sound.playPop();
    const updated = carrots.map((c) => (c.id === id ? { ...c, found: true } : c));
    setCarrots(updated);
    setLastFoundMsg(`🎉 成功在【${target.name}】發現了一根鮮脆胡蘿蔔！`);

    const newCount = updated.filter((c) => c.found).length;
    if (newCount === carrots.length) {
      sound.playReward();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCarrots(INITIAL_CARROTS.map((c) => ({ ...c, found: false })));
    setIsFinished(false);
    setLastFoundMsg('重新開始搜尋！觀察看看草地深處...');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 bg-amber-50/80 border-b border-amber-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🥕</span>
            <h3 className="font-bold text-stone-800 text-base">兔兔的尋寶委託：找回 5 根散落的胡蘿蔔</h3>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            點擊場景中藏在草叢、花圃、樹樁附近的胡蘿蔔把它們收進籃子裡！
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-amber-200/70 border border-amber-300 rounded-lg text-amber-900 font-bold text-sm">
            已找到：<span className="font-mono text-base">{foundCount}</span> / 5
          </div>
        </div>
      </div>

      {/* Main Interactive Meadow Area */}
      <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-100 via-amber-50/50 to-emerald-100/80 overflow-hidden select-none border-b border-stone-200">
        
        {/* Whimsical Forest Meadow Artwork Backdrops */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
            {/* Distant Hills */}
            <path d="M0,180 Q200,110 400,160 T800,130 L800,400 L0,400 Z" fill="#D1E7DD" />
            <path d="M0,230 Q250,170 500,220 T800,190 L800,400 L0,400 Z" fill="#C3E6CB" />
            <path d="M0,280 Q300,230 600,280 T800,250 L800,400 L0,400 Z" fill="#B1DFBB" />
          </svg>
        </div>

        {/* Decorative Scenery Objects */}
        {/* Tree Left */}
        <div className="absolute left-6 top-10 pointer-events-none opacity-85">
          <div className="w-20 h-28 bg-emerald-700/80 rounded-full blur-[0.5px] relative">
            <div className="absolute -bottom-10 left-8 w-4 h-14 bg-amber-900 rounded-sm" />
          </div>
        </div>

        {/* Big Hollow Stump */}
        <div className="absolute right-12 top-32 pointer-events-none">
          <div className="w-28 h-20 bg-stone-700/80 rounded-xl relative border-t-8 border-stone-600">
            <div className="absolute inset-x-4 top-2 h-6 bg-stone-900/60 rounded-full" />
            <div className="absolute -bottom-2 -left-3 text-2xl">🍄</div>
          </div>
        </div>

        {/* Garden Fence */}
        <div className="absolute left-20 bottom-16 flex gap-3 pointer-events-none opacity-70">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3 h-16 bg-amber-200 border border-amber-300 rounded-t-md shadow-2xs" />
          ))}
        </div>

        {/* Mossy River Rock */}
        <div className="absolute left-1/3 top-44 pointer-events-none">
          <div className="w-24 h-14 bg-stone-500 rounded-2xl border-b-4 border-stone-700 relative">
            <div className="absolute top-1 left-3 w-8 h-4 bg-emerald-600/60 rounded-full" />
          </div>
        </div>

        {/* Wildflowers and Daisies scattered */}
        <div className="absolute left-14 bottom-24 text-lg pointer-events-none">🌼</div>
        <div className="absolute left-1/2 bottom-12 text-lg pointer-events-none">🌸</div>
        <div className="absolute right-1/4 bottom-20 text-lg pointer-events-none">🌷</div>
        <div className="absolute right-10 bottom-8 text-xl pointer-events-none">🌻</div>

        {/* Interactive Carrots */}
        {carrots.map((c) => {
          if (c.found) {
            return (
              <div
                key={c.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-emerald-600"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-xs shadow-xs">
                  ✓
                </div>
              </div>
            );
          }

          return (
            <button
              key={c.id}
              onClick={() => handleCarrotClick(c.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 hover:scale-125 active:scale-95 transition-all duration-200 cursor-pointer group"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
              title="點擊採集鮮脆胡蘿蔔！"
            >
              {/* Carrot sprite with animated leafy tops */}
              <div className="relative">
                <span className="text-3xl sm:text-4xl filter drop-shadow-md group-hover:rotate-12 transition-transform inline-block">
                  🥕
                </span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping opacity-80" />
              </div>
            </button>
          );
        })}

        {/* Message Overlay Bar */}
        <div className="absolute bottom-3 inset-x-4 bg-white/90 backdrop-blur-xs rounded-xl p-2.5 border border-stone-200/90 text-stone-700 text-xs sm:text-sm text-center font-medium shadow-sm">
          {lastFoundMsg}
        </div>
      </div>

      {/* Completion Modal / Action Bar */}
      <div className="p-4 bg-stone-50 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重置搜尋
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            暫時離開
          </button>

          <button
            onClick={onComplete}
            disabled={!isFinished}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              isFinished
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-stone-300 text-stone-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isFinished ? '找齊了！完成委託領取獎勵！' : `還差 ${5 - foundCount} 根胡蘿蔔`}
          </button>
        </div>
      </div>
    </div>
  );
};
