/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ASSETS } from '../data/gameData';
import { sound } from '../utils/audio';
import { Compass, Play, BookOpen, Sparkles, Heart, Hammer } from 'lucide-react';
import { GameView } from '../types';

interface Props {
  onStartAdventure: () => void;
  onOpenCharacterIntro: () => void;
  onOpenHowToPlay: () => void;
  onOpenTown: () => void;
}

export const HomeView: React.FC<Props> = ({
  onStartAdventure,
  onOpenCharacterIntro,
  onOpenHowToPlay,
  onOpenTown,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-8 px-4 overflow-hidden">
      
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src={ASSETS.townBg}
          alt="小鎮景致"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter blur-[2px]"
        />
      </div>

      {/* Floating Whimsical Particle Badges */}
      <div className="absolute top-10 left-8 md:left-24 text-2xl animate-bounce pointer-events-none opacity-75">
        ☁️
      </div>
      <div className="absolute top-20 right-10 md:right-32 text-2xl animate-pulse pointer-events-none opacity-75">
        🌸
      </div>
      <div className="absolute bottom-16 left-12 md:left-36 text-2xl animate-bounce pointer-events-none opacity-75">
        🍀
      </div>
      <div className="absolute bottom-24 right-16 md:right-40 text-2xl animate-pulse pointer-events-none opacity-75">
        ✨
      </div>

      {/* Centerpiece Container */}
      <div className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center">
        
        {/* Little Wolf Avatar Showcase */}
        <div className="relative mb-4 group cursor-pointer" onClick={() => sound.playWolfVoice()}>
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-4 border-amber-300/90 bg-amber-50 shadow-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300">
            <img
              src={ASSETS.wolfMascot}
              alt="小狼主角"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="absolute -bottom-2 inset-x-0 flex justify-center">
            <span className="bg-amber-500 text-white font-extrabold text-xs px-3.5 py-1 rounded-full shadow-md border-2 border-white flex items-center gap-1">
              <span>🐺</span>
              <span>原創夥伴 · 小狼</span>
            </span>
          </div>
        </div>

        {/* Title Lockup */}
        <div className="mt-2 mb-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 drop-shadow-xs">
            《小狼的幸運小鎮》
          </h1>
          <p className="mt-2.5 text-sm sm:text-base font-medium text-amber-900/90 max-w-lg mx-auto leading-relaxed">
            「每一次善意，都能為世界帶來一點改變。」
          </p>
          <p className="text-xs text-stone-500 mt-1">
            療癒系原創 IP 冒險與小鎮經營 · 與小狼一同溫暖森林每一個角落
          </p>
        </div>

        {/* Action Buttons Hub */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          
          {/* Start Adventure Primary CTA */}
          <button
            onClick={() => {
              sound.playSparkle();
              onStartAdventure();
            }}
            className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-300/50"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>開始冒險</span>
          </button>

          {/* Character Intro */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCharacterIntro();
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 border-2 border-stone-200 hover:border-amber-300 font-bold text-sm rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>角色介紹</span>
          </button>

          {/* How to Play */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHowToPlay();
            }}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-stone-50 active:scale-95 text-stone-800 border-2 border-stone-200 hover:border-amber-300 font-bold text-sm rounded-2xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>遊戲玩法說明</span>
          </button>

        </div>

        {/* Secondary Quick Access Strip */}
        <div className="mt-8 pt-5 border-t border-stone-200/80 w-full max-w-md flex items-center justify-center gap-6 text-xs text-stone-500 font-medium">
          <button
            onClick={() => {
              sound.playClick();
              onOpenTown();
            }}
            className="hover:text-amber-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-600" />
            <span>參觀小鎮地圖</span>
          </button>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>進度已由 LocalStorage 即時存檔</span>
          </span>
        </div>

      </div>
    </div>
  );
};
