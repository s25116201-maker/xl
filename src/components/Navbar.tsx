/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameView, PlayerStats } from '../types';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Sparkles, Home, Backpack, Award, Compass, Hammer, Users } from 'lucide-react';

interface NavbarProps {
  currentView: GameView;
  onNavigate: (view: GameView) => void;
  stats: PlayerStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  unclaimedAchievementsCount: number;
  availableQuestsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  stats,
  soundEnabled,
  onToggleSound,
  unclaimedAchievementsCount,
  availableQuestsCount,
}) => {
  const handleNav = (view: GameView) => {
    sound.playClick();
    onNavigate(view);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('HOME')}
            className="flex items-center gap-2 group text-left cursor-pointer transition-transform active:scale-95"
            title="回到遊戲首頁"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-lg shadow-xs group-hover:rotate-12 transition-transform">
              🐺
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-stone-900 block leading-tight">
                小狼的幸運小鎮
              </span>
              <span className="text-[11px] text-stone-600 hidden sm:block leading-none">
                每一次善意，都能為世界帶來改變
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
          <button
            onClick={() => handleNav('MAIN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'MAIN'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-700" />
            <span>小鎮廣場</span>
          </button>

          <button
            onClick={() => handleNav('TOWN')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'TOWN'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Hammer className="w-4 h-4 text-amber-700" />
            <span>小鎮建設</span>
          </button>

          <button
            onClick={() => handleNav('QUESTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer relative ${
              currentView === 'QUESTS'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-700" />
            <span>居民任務</span>
            {availableQuestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => handleNav('CHARACTER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'CHARACTER'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <span className="text-sm">🐾</span>
            <span>認識小狼</span>
          </button>

          <button
            onClick={() => handleNav('INVENTORY')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'INVENTORY'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Backpack className="w-4 h-4 text-amber-700" />
            <span>冒險背包</span>
          </button>

          <button
            onClick={() => handleNav('ACHIEVEMENTS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer relative ${
              currentView === 'ACHIEVEMENTS'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>榮譽成就</span>
            {unclaimedAchievementsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unclaimedAchievementsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Points Meters & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Merit Meter */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/90 border border-amber-200/90 rounded-lg text-amber-950 font-bold text-xs sm:text-sm shadow-2xs"
            title="功德值：透過善意幫助居民獲得，用於建造房屋、商店與公共設施"
          >
            <span className="text-amber-600 font-medium text-xs hidden sm:inline">功德</span>
            <span className="text-amber-500">✨</span>
            <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-amber-900">
              {stats.merit}
            </span>
          </div>

          {/* Lucky Meter */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50/90 border border-emerald-200/90 rounded-lg text-emerald-950 font-bold text-xs sm:text-sm shadow-2xs"
            title="幸運值：在冒險中與小狼發現的奇遇，用於解鎖魔法秘境與奇蹟噴泉"
          >
            <span className="text-emerald-700 font-medium text-xs hidden sm:inline">幸運</span>
            <span className="text-emerald-500">🍀</span>
            <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-emerald-900">
              {stats.lucky}
            </span>
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playPop();
            }}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title={soundEnabled ? '音效已開啟（點擊靜音）' : '音效已靜音（點擊開啟）'}
            aria-label="切換音效"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-700" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {/* Return Home */}
          <button
            onClick={() => handleNav('HOME')}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer lg:hidden"
            title="回到首頁"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden border-t border-stone-200/60 bg-[#FAF8F5] px-2 py-1.5 flex items-center justify-around text-xs font-medium text-stone-600 overflow-x-auto">
        <button
          onClick={() => handleNav('MAIN')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer ${
            currentView === 'MAIN' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          廣場
        </button>
        <button
          onClick={() => handleNav('TOWN')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer ${
            currentView === 'TOWN' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          <Hammer className="w-3.5 h-3.5" />
          建設
        </button>
        <button
          onClick={() => handleNav('QUESTS')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer relative ${
            currentView === 'QUESTS' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          任務
          {availableQuestsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-0.5 right-0.5" />
          )}
        </button>
        <button
          onClick={() => handleNav('CHARACTER')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer ${
            currentView === 'CHARACTER' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          🐾 小狼
        </button>
        <button
          onClick={() => handleNav('INVENTORY')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer ${
            currentView === 'INVENTORY' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          <Backpack className="w-3.5 h-3.5" />
          背包
        </button>
        <button
          onClick={() => handleNav('ACHIEVEMENTS')}
          className={`px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap cursor-pointer relative ${
            currentView === 'ACHIEVEMENTS' ? 'bg-amber-100 text-amber-900 font-bold' : ''
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          成就
          {unclaimedAchievementsCount > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-0.5 right-0.5" />
          )}
        </button>
      </div>
    </header>
  );
};
