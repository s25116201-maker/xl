/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Quest, QuestId } from '../types';
import { sound } from '../utils/audio';
import { CarrotHuntGame } from './minigames/CarrotHuntGame';
import { BakeryMatchGame } from './minigames/BakeryMatchGame';
import { LetterPuzzleGame } from './minigames/LetterPuzzleGame';
import { WishingTreeGame } from './minigames/WishingTreeGame';
import { MessageSquare, Sparkles, CheckCircle2, Play, ChevronRight, HelpCircle } from 'lucide-react';

interface QuestListViewProps {
  quests: Quest[];
  onCompleteQuest: (questId: QuestId) => void;
  onAcceptQuest: (questId: QuestId) => void;
}

export const QuestListView: React.FC<QuestListViewProps> = ({
  quests,
  onCompleteQuest,
  onAcceptQuest,
}) => {
  const [selectedQuestId, setSelectedQuestId] = useState<QuestId | null>(null);
  const [dialogueStep, setDialogueStep] = useState<number>(0);
  const [activeMiniGameQuestId, setActiveMiniGameQuestId] = useState<QuestId | null>(null);

  const selectedQuest = quests.find((q) => q.id === selectedQuestId);

  const handleOpenDialogue = (quest: Quest) => {
    sound.playClick();
    setSelectedQuestId(quest.id);
    setDialogueStep(0);
  };

  const handleStartGame = (questId: QuestId) => {
    sound.playClick();
    setSelectedQuestId(null);
    setActiveMiniGameQuestId(questId);
  };

  const handleFinishMiniGame = (questId: QuestId) => {
    setActiveMiniGameQuestId(null);
    onCompleteQuest(questId);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">居民求助與冒險委託</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            森林與小鎮裡的夥伴們遇到了各種小困難。與小狼一起伸出援手，累積功德與幸運吧！
          </p>
        </div>
        <div className="text-xs text-stone-500 font-medium bg-white/80 px-3 py-1.5 rounded-xl border border-stone-200 shrink-0">
          已完成委託：<span className="font-mono font-bold text-amber-800">{quests.filter((q) => q.completed).length}</span> / {quests.length}
        </div>
      </div>

      {/* Active Mini-Game Container */}
      {activeMiniGameQuestId && (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          {activeMiniGameQuestId === 'quest_carrot' && (
            <CarrotHuntGame
              onComplete={() => handleFinishMiniGame('quest_carrot')}
              onCancel={() => setActiveMiniGameQuestId(null)}
            />
          )}
          {activeMiniGameQuestId === 'quest_bread' && (
            <BakeryMatchGame
              onComplete={() => handleFinishMiniGame('quest_bread')}
              onCancel={() => setActiveMiniGameQuestId(null)}
            />
          )}
          {activeMiniGameQuestId === 'quest_letter' && (
            <LetterPuzzleGame
              onComplete={() => handleFinishMiniGame('quest_letter')}
              onCancel={() => setActiveMiniGameQuestId(null)}
            />
          )}
          {activeMiniGameQuestId === 'quest_wishing_tree' && (
            <WishingTreeGame
              onComplete={() => handleFinishMiniGame('quest_wishing_tree')}
              onCancel={() => setActiveMiniGameQuestId(null)}
            />
          )}
        </div>
      )}

      {/* Quest Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between ${
              quest.completed
                ? 'border-emerald-200/80 bg-emerald-50/20 shadow-2xs'
                : 'border-stone-200 hover:border-amber-300 hover:shadow-md'
            }`}
          >
            <div>
              {/* NPC Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-200 bg-amber-50 shrink-0 shadow-2xs">
                    <img
                      src={quest.npcAvatar}
                      alt={quest.npcName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-sm sm:text-base">{quest.npcName}</h3>
                      <span className="text-[11px] text-stone-500">{quest.npcTitle}</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-800 line-clamp-1">
                      {quest.title}
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div>
                  {quest.completed ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      已圓滿完成
                    </span>
                  ) : quest.accepted ? (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                      <Play className="w-3 h-3 text-amber-600" />
                      進行中
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                      待接取委託
                    </span>
                  )}
                </div>
              </div>

              {/* Problem Description */}
              <p className="text-xs text-stone-600 leading-relaxed bg-[#FDFBF7] p-3 rounded-xl border border-stone-200/70 mb-3">
                {quest.problem}
              </p>

              {/* Reward Chips */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-medium text-stone-700 mb-4">
                <span className="text-stone-400">委託報酬：</span>
                <span className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-md font-bold text-xs flex items-center gap-1">
                  ✨ +{quest.meritReward} 功德
                </span>
                <span className="px-2 py-0.5 bg-emerald-100/90 text-emerald-900 rounded-md font-bold text-xs flex items-center gap-1">
                  🍀 +{quest.luckyReward} 幸運
                </span>
                {quest.itemReward && (
                  <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md text-xs flex items-center gap-1">
                    <span>{quest.itemReward.icon}</span>
                    <span>{quest.itemReward.name} x{quest.itemReward.count}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenDialogue(quest)}
                className="px-3 py-1.5 bg-white border border-stone-300 hover:border-amber-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
                <span>{quest.completed ? '回顧對話' : '與居民交談'}</span>
              </button>

              {!quest.completed && (
                <button
                  onClick={() => handleStartGame(quest.id)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{quest.accepted ? '繼續挑戰' : '前往幫助'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* NPC Dialogue Interactive Modal */}
      {selectedQuest && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-lg w-full rounded-2xl border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-300 bg-white shadow-2xs">
                  <img
                    src={selectedQuest.npcAvatar}
                    alt={selectedQuest.npcName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{selectedQuest.npcName}</h3>
                  <span className="text-[11px] text-stone-500">{selectedQuest.npcTitle}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuestId(null)}
                className="text-stone-400 hover:text-stone-700 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Dialogue Body */}
            <div className="p-5 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-2xs text-stone-800 text-sm leading-relaxed min-h-[90px] flex items-center">
                <p>
                  {selectedQuest.completed
                    ? selectedQuest.completeDialogues[dialogueStep % selectedQuest.completeDialogues.length]
                    : selectedQuest.introDialogues[dialogueStep % selectedQuest.introDialogues.length]}
                </p>
              </div>

              {/* Dialogue Navigator Steps */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>
                  對話段落：
                  {dialogueStep + 1} /{' '}
                  {selectedQuest.completed
                    ? selectedQuest.completeDialogues.length
                    : selectedQuest.introDialogues.length}
                </span>

                <button
                  onClick={() => {
                    sound.playPop();
                    const totalSteps = selectedQuest.completed
                      ? selectedQuest.completeDialogues.length
                      : selectedQuest.introDialogues.length;
                    setDialogueStep((prev) => (prev + 1) % totalSteps);
                  }}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>下一句</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedQuestId(null)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                結束對話
              </button>

              {!selectedQuest.completed && (
                <button
                  onClick={() => {
                    onAcceptQuest(selectedQuest.id);
                    handleStartGame(selectedQuest.id);
                  }}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>答應幫忙並開始挑戰</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
