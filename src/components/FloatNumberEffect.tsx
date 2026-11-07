/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FloatingText } from '../types';

interface Props {
  floatingTexts: FloatingText[];
}

export const FloatNumberEffect: React.FC<Props> = ({ floatingTexts }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className={`absolute font-bold text-lg px-3 py-1.5 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-bounce transition-all duration-1000 ${
            ft.type === 'merit'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : ft.type === 'lucky'
              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              : 'bg-white text-stone-900 border border-stone-200'
          }`}
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            animation: 'floatUp 1.2s ease-out forwards',
          }}
        >
          {ft.text}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.85);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -15px) scale(1.1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -45px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -70px) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
