/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ASSETS } from '../data/gameData';
import { sound } from '../utils/audio';
import { Sparkles, Heart, Compass, Smile, Laugh, Coffee, Sun } from 'lucide-react';

export const CharacterIntroView: React.FC = () => {
  const [activeMood, setActiveMood] = useState<'happy' | 'curious' | 'helpful' | 'sleepy' | 'touched'>('happy');
  const [customQuote, setCustomQuote] = useState<string>(
    '嗷嗚！我是小狼！最喜歡和溫暖善良的你一起探索這片世界了！'
  );
  const [bounce, setBounce] = useState(false);

  const moodData = {
    happy: {
      label: '😊 開心快樂',
      quote: '「嗷嗚～看見你我就忍不住想搖尾巴！今天又是美好的一天！」',
      desc: '小狼最常露出的笑容，對一切新奇事物都充滿期待。',
    },
    curious: {
      label: '🧐 好奇探索',
      quote: '「哇！那邊草叢在動耶！是新朋友還是神秘的幸運四葉草呢？我們過去看看好不好？」',
      desc: '豎起靈敏的小耳朵，對世界上每一個未知的角落都充滿探索熱情。',
    },
    helpful: {
      label: '🤝 熱心相助',
      quote: '「只要有人遇到困難，小狼一定第一個衝過去幫忙！因為善意是有魔法的！」',
      desc: '即使是小小的忙碌，小狼也樂此不疲，相信每一次付出都能讓大家更幸福。',
    },
    sleepy: {
      label: '💤 安穩打瞌睡',
      quote: '「呼嚕嚕...小木屋的壁爐好暖和喔...在你的身邊睡著，做夢都會笑呢...」',
      desc: '累了的時候，會捲成毛茸茸的一球，把鼻子藏在溫暖的琥珀圍巾裡。',
    },
    touched: {
      label: '💖 感恩與感動',
      quote: '「謝謝你一直陪著我把這座小鎮建得這麼美麗！能遇見你，是我最幸運的事！」',
      desc: '珍惜與玩家共度的每分每秒，將友情化作最深厚的守護力量。',
    },
  };

  const handleSelectMood = (key: keyof typeof moodData) => {
    sound.playWolfVoice();
    setActiveMood(key);
    setCustomQuote(moodData[key].quote);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐺</span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">認識原創 IP 主角 · 小狼</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            一隻生活在童話森林裡、深信善意能帶來奇蹟的溫暖小狼。
          </p>
        </div>
        <span className="text-xs text-amber-900 font-bold bg-amber-200/70 px-3 py-1 rounded-xl border border-amber-300">
          角色設定與互動展示
        </span>
      </div>

      {/* Main Wolf Showcase Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Interactive Wolf Avatar */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div
            onClick={() => handleSelectMood(activeMood)}
            className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-200/90 shadow-md cursor-pointer transition-transform duration-300 ${
              bounce ? 'scale-105 rotate-2' : 'hover:scale-102'
            }`}
            title="點擊小狼發出可愛聲音！"
          >
            <img
              src={ASSETS.wolfMascot}
              alt="原創角色小狼"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-stone-700 shadow-2xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              點擊互動
            </div>
          </div>

          {/* Wolf Dynamic Dialogue Box */}
          <div className="mt-4 w-full bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-center shadow-2xs">
            <span className="text-xs font-bold text-amber-900 block mb-1">小狼的心聲：</span>
            <p className="text-stone-800 text-xs sm:text-sm font-medium leading-relaxed italic">
              {customQuote}
            </p>
          </div>
        </div>

        {/* Right Column: Character Lore & Interactive Mood Switcher */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-extrabold text-stone-900">小狼（Little Wolf）</h3>
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-full">
                主角 / 冒險夥伴
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              性格：善良 · 熱心 · 好奇 · 喜歡幫助別人
            </p>
          </div>

          {/* Bio Story Text */}
          <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed bg-[#FDFBF7] p-4 rounded-2xl border border-stone-200">
            <p>
              小狼是一隻生長在寧靜童話森林邊緣的灰色小狼。與童話傳說中兇猛的野狼不同，小狼天生擁有毛茸茸的溫暖銀灰毛皮，脖子上總是繫著一條象徵豐收的溫暖琥珀針織圍巾。
            </p>
            <p>
              他最喜歡手挽著小藤籃在林間漫步，每當看見遇到困難的動物夥伴，無論是掉了胡蘿蔔的兔兔、缺了食材的熊熊，或是丟了信封的鳥鳥，小狼總是第一個跑上前熱心伸出援手。
            </p>
            <p className="font-semibold text-amber-900">
              他的信條是：「每一次善意，都能為世界帶來一點改變。」在玩家的陪伴下，小狼將逐步將荒蕪的大地建設為充滿歡笑與幸福的幸運小鎮！
            </p>
          </div>

          {/* Interactive Mood Selector */}
          <div>
            <span className="text-xs font-bold text-stone-600 block mb-2">
              試試看小狼在不同情境下的表情與心聲：
            </span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(moodData) as Array<keyof typeof moodData>).map((key) => {
                const item = moodData[key];
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectMood(key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeMood === key
                        ? 'bg-amber-500 text-white shadow-xs scale-105'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* NPC Residents Lore Showcase */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <span>🏘️</span>
          <span>小鎮居民圖鑑</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* NPC 1: Rabbit */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 shrink-0">
                <img
                  src={ASSETS.npcRabbit}
                  alt="兔兔園丁"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">兔兔園丁</h4>
                <span className="text-[11px] text-stone-500">勤勞的花草與蔬菜守護者</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed bg-[#FDFBF7] p-2.5 rounded-xl border border-stone-100 mb-3">
              穿著牛仔吊帶褲的元氣小兔子。每天清晨在菜園採收最甜脆的胡蘿蔔，夢想是讓小鎮開滿彩蝶飛舞的花朵。
            </p>
            <div className="text-[11px] text-amber-800 font-semibold">
              喜好：甜脆胡蘿蔔、向日葵花瓣
            </div>
          </div>

          {/* NPC 2: Bear */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 shrink-0">
                <img
                  src={ASSETS.npcBear}
                  alt="熊熊麵包師"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">熊熊主廚</h4>
                <span className="text-[11px] text-stone-500">暖心柴燒烘焙坊主人</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed bg-[#FDFBF7] p-2.5 rounded-xl border border-stone-100 mb-3">
              戴著白高廚師帽的大棕熊，個性憨厚老實。擅長用森林野蜜烘烤外酥內軟的蜂蜜長棍與可頌。
            </p>
            <div className="text-[11px] text-amber-800 font-semibold">
              喜好：金合歡蜂蜜、純濃鮮乳
            </div>
          </div>

          {/* NPC 3: Bird */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 shrink-0">
                <img
                  src={ASSETS.npcBird}
                  alt="鳥鳥郵差"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">鳥鳥郵差</h4>
                <span className="text-[11px] text-stone-500">穿梭林間的藍羽信使</span>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed bg-[#FDFBF7] p-2.5 rounded-xl border border-stone-100 mb-3">
              戴著深藍郵差便帽的靈巧藍知更鳥。每天為遠方的旅人與森林居民傳遞蓋有金印的溫暖信件。
            </p>
            <div className="text-[11px] text-amber-800 font-semibold">
              喜好：清晨微風、藍色風鈴草
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
