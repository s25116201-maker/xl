/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, Compass, KeyRound } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onCancel: () => void;
}

export const LetterPuzzleGame: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<'SELECT_TREE' | 'SOLVE_RUNE' | 'FOUND'>('SELECT_TREE');
  const [hintMessage, setHintMessage] = useState<string>(
    '鳥鳥說：風往生長著藍色風鈴草的方向吹去... 請選擇一棵古木深入調查！'
  );

  // Rune Lock State: 3 dials with symbols
  // Dial 1: Element [☀️, 🍃, 💧] -> target: 🍃 (Leaf)
  // Dial 2: Creature [🐟, 🪶, 🐾] -> target: 🪶 (Feather)
  // Dial 3: Direction [🧭, 🌟, 🌙] -> target: 🌟 (Star)
  const [dial1, setDial1] = useState(0);
  const [dial2, setDial2] = useState(0);
  const [dial3, setDial3] = useState(0);

  const dial1Symbols = ['☀️ 暖陽', '🍃 綠葉', '💧 晨露'];
  const dial2Symbols = ['🐟 游魚', '🪶 藍羽', '🐾 爪印'];
  const dial3Symbols = ['🧭 風向', '🌟 星辰', '🌙 彎月'];

  const handleSelectTree = (treeId: string) => {
    sound.playClick();
    if (treeId === 'tree_bellflower') {
      sound.playSparkle();
      setHintMessage('✨ 沒錯！這棵神木腳下盛開著三朵藍色風鈴草，樹洞上有一個古老的符文石匣！');
      setStep('SOLVE_RUNE');
    } else if (treeId === 'tree_moss') {
      setHintMessage('🌲 調查了青苔槐樹... 只發現了幾顆松鼠藏的橡實，風鈴草在東邊的空心神木那裡！');
    } else {
      setHintMessage('🪵 調查了岩壁枯松... 風很大，但完全沒有羽毛與藍花的蹤跡。');
    }
  };

  const handleRotateDial = (dialIndex: 1 | 2 | 3) => {
    sound.playPop();
    if (dialIndex === 1) setDial1((prev) => (prev + 1) % dial1Symbols.length);
    if (dialIndex === 2) setDial2((prev) => (prev + 1) % dial2Symbols.length);
    if (dialIndex === 3) setDial3((prev) => (prev + 1) % dial3Symbols.length);
  };

  const handleCheckRune = () => {
    // Correct target: dial1 = 1 (🍃), dial2 = 1 (🪶), dial3 = 1 (🌟)
    if (dial1 === 1 && dial2 === 1 && dial3 === 1) {
      sound.playReward();
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStep('FOUND');
      setHintMessage('🎉 喀嗒！樹洞石匣彈開了！閃爍著金色火漆印章的信件完好無損地躺在裡面！');
    } else {
      sound.playClick();
      setHintMessage('⚠️ 符文轉盤尚未完全對齊喔！請根據鳥鳥的線索：綠葉、藍羽與星辰之印！');
    }
  };

  const handleReset = () => {
    sound.playClick();
    setStep('SELECT_TREE');
    setDial1(0);
    setDial2(0);
    setDial3(0);
    setHintMessage('鳥鳥說：風往生長著藍色風鈴草的方向吹去... 請選擇一棵古木深入調查！');
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 bg-sky-50/90 border-b border-sky-200/80 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h3 className="font-bold text-stone-800 text-base">鳥鳥的解謎委託：找回失落的金色火漆信</h3>
          </div>
          <p className="text-xs text-stone-600 mt-0.5">
            解讀林間風向與符文密碼，解開古木樹洞匣子取回重要信件！
          </p>
        </div>
        <div className="px-3 py-1 bg-sky-200/70 border border-sky-300 rounded-lg text-sky-900 font-bold text-xs sm:text-sm">
          階段：{step === 'SELECT_TREE' ? '1. 追查林間古木' : step === 'SOLVE_RUNE' ? '2. 解鎖樹洞符文' : '3. 尋獲信件！'}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#F5F9FA] to-sky-50/50 min-h-[300px] flex flex-col justify-between">
        
        {/* Status Clue Box */}
        <div className="p-3 bg-white/95 rounded-xl border border-sky-200 shadow-2xs text-xs sm:text-sm text-stone-700 font-medium text-center mb-5">
          {hintMessage}
        </div>

        {/* Step 1: Select Tree */}
        {step === 'SELECT_TREE' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleSelectTree('tree_moss')}
              className="p-4 bg-white hover:bg-stone-50 rounded-2xl border-2 border-stone-200 hover:border-emerald-300 transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🌲</span>
              <span className="text-sm font-bold text-stone-800">溪畔青苔槐樹</span>
              <span className="text-xs text-stone-500 mt-1">樹幹長滿厚軟青苔，樹下有潺潺溪水</span>
            </button>

            <button
              onClick={() => handleSelectTree('tree_bellflower')}
              className="p-4 bg-white hover:bg-amber-50/40 rounded-2xl border-2 border-sky-200 hover:border-sky-400 transition-all text-center flex flex-col items-center group cursor-pointer ring-1 ring-sky-300/40"
            >
              <div className="relative">
                <span className="text-4xl mb-2 inline-block group-hover:scale-110 transition-transform">🌳</span>
                <span className="absolute -bottom-1 -right-2 text-xl">🔔🌸</span>
              </div>
              <span className="text-sm font-bold text-sky-950 mt-1">藍花星辰空心神木</span>
              <span className="text-xs text-sky-700 mt-1">根部長滿盛開的藍色風鈴草，有隱蔽的樹洞</span>
            </button>

            <button
              onClick={() => handleSelectTree('tree_cliff')}
              className="p-4 bg-white hover:bg-stone-50 rounded-2xl border-2 border-stone-200 hover:border-emerald-300 transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🪵</span>
              <span className="text-sm font-bold text-stone-800">崖邊乾燥枯松</span>
              <span className="text-xs text-stone-500 mt-1">長在高聳風口，樹枝常被疾風吹拂</span>
            </button>
          </div>
        )}

        {/* Step 2: Solve Rune Lock */}
        {step === 'SOLVE_RUNE' && (
          <div className="bg-white/90 p-5 rounded-2xl border border-stone-200 shadow-xs max-w-md mx-auto w-full">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                樹洞守護石匣 · 三重靈性轉盤
              </span>
              <p className="text-xs text-stone-500 mt-2">
                點擊各個符文轉盤進行輪轉，對齊「綠葉」、「藍羽」與「星辰」之印：
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* Dial 1 */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-stone-500 mb-1">第一輪：自然</span>
                <button
                  onClick={() => handleRotateDial(1)}
                  className="w-full py-3 px-2 bg-stone-100 hover:bg-amber-100/70 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-all text-center cursor-pointer active:scale-95 shadow-2xs"
                >
                  {dial1Symbols[dial1]}
                  <span className="block text-[10px] text-stone-400 font-normal mt-0.5">點擊轉動</span>
                </button>
              </div>

              {/* Dial 2 */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-stone-500 mb-1">第二輪：信使</span>
                <button
                  onClick={() => handleRotateDial(2)}
                  className="w-full py-3 px-2 bg-stone-100 hover:bg-sky-100/70 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-all text-center cursor-pointer active:scale-95 shadow-2xs"
                >
                  {dial2Symbols[dial2]}
                  <span className="block text-[10px] text-stone-400 font-normal mt-0.5">點擊轉動</span>
                </button>
              </div>

              {/* Dial 3 */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-semibold text-stone-500 mb-1">第三輪：指引</span>
                <button
                  onClick={() => handleRotateDial(3)}
                  className="w-full py-3 px-2 bg-stone-100 hover:bg-purple-100/70 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-all text-center cursor-pointer active:scale-95 shadow-2xs"
                >
                  {dial3Symbols[dial3]}
                  <span className="block text-[10px] text-stone-400 font-normal mt-0.5">點擊轉動</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleCheckRune}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              嘗試解開符文匣子！
            </button>
          </div>
        )}

        {/* Step 3: Letter Retrieved */}
        {step === 'FOUND' && (
          <div className="bg-white/95 p-6 rounded-2xl border-2 border-amber-300 shadow-sm max-w-sm mx-auto text-center animate-in zoom-in-95">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-3 animate-bounce">
              ✉️✨
            </div>
            <h4 className="font-bold text-base text-stone-800">成功尋回「金色火漆信件」！</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              火漆印章完好如初，鳥鳥郵差終於可以順利將這份來自遠方的問候送達小鎮居民手中了！
            </p>
          </div>
        )}

      </div>

      {/* Action Footer */}
      <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-xs font-semibold text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新調查
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
          >
            暫時離開
          </button>

          {step === 'FOUND' && (
            <button
              onClick={onComplete}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              將信件交還鳥鳥並領取獎勵！
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
