import React from 'react';
import { Sparkles, CheckCircle, Lock } from 'lucide-react';
import { soundEffects, speechEngine } from '../utils/audio';
import { StoryArt } from './StoryArt';
import type { StickerItem } from '../types';

interface StickersViewProps {
  stickers: StickerItem[];
}

export const StickersView: React.FC<StickersViewProps> = ({ stickers }) => {
  return (
    <div className="space-y-6 pb-24">
      {/* Header Banner */}
      <div className="bg-[#5A7D6C] text-[#FDFBF7] p-6 rounded-3xl shadow-lg border-b-8 border-[#4A6658] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0B56E] text-[#2D2926] font-black rounded-full text-xs">
            <Sparkles className="w-4 h-4" />
            <span>KOLEKSI HADIAH</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#FDFBF7]">
            Lencana & Bintang Keselamatan
          </h2>
          <p className="text-[#EBF2EE] text-sm md:text-base font-medium">
            Kumpulkan semua lencana dengan menyelesaikan modul dan kuis latihan!
          </p>
        </div>

        <div className="text-5xl">
          <StoryArt scene="boy" className="art-icon" />
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stickers.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              soundEffects.playClick();
              speechEngine.speak(
                `Lencana: ${item.title}. ${
                  item.unlocked
                    ? item.description
                    : 'Selesaikan modul kuis untuk membuka lencana ini.'
                }`
              );
            }}
            className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 relative overflow-hidden cursor-pointer ${
              item.unlocked
                ? 'bg-[#FAF4E8] border-[#E0B56E] shadow-md hover:scale-105'
                : 'bg-[#F2EDE4] border-[#E8E2D9] opacity-60'
            }`}
          >
            <div className="absolute top-3 right-3">
              {item.unlocked ? (
                <CheckCircle className="w-6 h-6 text-[#5A7D6C]" />
              ) : (
                <Lock className="w-6 h-6 text-[#7C7267]" />
              )}
            </div>

            <div
              className={`text-6xl p-3 rounded-full ${
                item.unlocked ? 'bg-[#E0B56E]/20 shadow-inner' : 'bg-[#E8E2D9]'
              }`}
            >
              <StoryArt
                scene={
                  item.id === 'st-lost-safe'
                    ? 'lost-2'
                    : item.id === 'st-no-bully'
                    ? 'bully-2'
                    : 'boy'
                }
                className="art-reward"
              />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#2D2926]">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-[#7C7267] font-medium">
                {item.description}
              </p>
            </div>

            <div className="text-xs font-bold text-[#5A7D6C] mt-2">
              {item.unlocked ? '✓ Sudah Terbuka' : '🔒 Belum Terbuka'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
