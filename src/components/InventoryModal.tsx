/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { sound } from '../utils/audio';
import { Gift, Sparkles, Filter, Info, Package } from 'lucide-react';

interface Props {
  inventory: InventoryItem[];
  onGiftItem: (item: InventoryItem) => void;
}

export const InventoryModal: React.FC<Props> = ({ inventory, onGiftItem }) => {
  const [filter, setFilter] = useState<'all' | 'food' | 'quest' | 'special' | 'treasure'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredItems = inventory.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const handleInspect = (item: InventoryItem) => {
    sound.playClick();
    setSelectedItem(item);
  };

  const handleGift = (item: InventoryItem) => {
    sound.playReward();
    onGiftItem(item);
    if (item.count <= 1) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎒</span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">冒險背包與收藏道具</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            收集在任務委託與森林探索中獲得的道具，也可以隨時送給小狼夥伴品嚐與收藏！
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-white border border-stone-200 rounded-xl shadow-2xs text-xs font-medium">
          <button
            onClick={() => {
              sound.playClick();
              setFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-amber-500 text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('food');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'food' ? 'bg-amber-500 text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            美食料理
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('quest');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'quest' ? 'bg-amber-500 text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            任務信物
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilter('special');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === 'special' ? 'bg-amber-500 text-white font-bold shadow-2xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            幸運象徵
          </button>
        </div>
      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-stone-500">
          <Package className="w-12 h-12 mx-auto text-stone-300 mb-2" />
          <p className="font-bold text-stone-700">這個分類目前沒有道具喔！</p>
          <p className="text-xs text-stone-400 mt-1">去完成居民任務或在小鎮中探索來獲得道具吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleInspect(item)}
              className={`bg-white rounded-2xl border p-4 text-center flex flex-col items-center justify-between transition-all duration-200 cursor-pointer group hover:shadow-md ${
                selectedItem?.id === item.id ? 'border-amber-400 ring-2 ring-amber-300 scale-102' : 'border-stone-200 hover:border-amber-300'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[11px] text-stone-400 mb-1">
                <span>
                  {item.rarity === 3 ? '⭐⭐⭐' : item.rarity === 2 ? '⭐⭐' : '⭐'}
                </span>
                <span className="font-bold text-stone-700">x{item.count}</span>
              </div>

              <div className="text-4xl my-2 group-hover:scale-115 transition-transform filter drop-shadow-xs">
                {item.icon}
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-stone-800 line-clamp-1">{item.name}</h4>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.description}</p>

              <span className="mt-3 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                點擊檢視
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Inspect Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-sm w-full rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-100/70 border border-amber-300 flex items-center justify-center text-3xl shadow-xs">
                  {selectedItem.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">{selectedItem.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>
                      {selectedItem.rarity === 3 ? '稀有珍品' : selectedItem.rarity === 2 ? '精選良品' : '普通日常'}
                    </span>
                    <span>·</span>
                    <span>持有數量：x{selectedItem.count}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">道具介紹：</span>
                {selectedItem.description}
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 italic leading-relaxed">
                {selectedItem.flavorText}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                收起
              </button>

              {selectedItem.canGiftToWolf && (
                <button
                  onClick={() => handleGift(selectedItem)}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-amber-100" />
                  <span>贈送給小狼夥伴！</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
