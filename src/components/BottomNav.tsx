import React from 'react';
import { Home, ChevronLeft, ChevronRight, Award, ShieldAlert } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import type { ModuleType, AccessibilitySettings } from '../types';

interface BottomNavProps {
  currentModule: ModuleType;
  setCurrentModule: (mod: ModuleType) => void;
  canGoBack: boolean;
  canGoNext: boolean;
  onGoBack: () => void;
  onGoNext: () => void;
  openEmergency: () => void;
  settings?: AccessibilitySettings;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentModule,
  setCurrentModule,
  canGoBack,
  canGoNext,
  onGoBack,
  onGoNext,
  openEmergency,
}) => {
  const goHome = () => {
    soundEffects.playClick();
    setCurrentModule('home');
  };

  const goStickers = () => {
    soundEffects.playClick();
    setCurrentModule('stickers');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t-2 border-[#E8E2D9] shadow-2xl px-2 py-2 md:px-6 md:py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        <button
          onClick={goHome}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-2xl font-bold transition-all border-2 ${
            currentModule === 'home'
              ? 'bg-[#5A7D6C] border-[#4A6658] text-white scale-105 shadow-md'
              : 'bg-[#F2EDE4] hover:bg-[#E8E2D9] border-[#E8E2D9] text-[#4A443F]'
          }`}
          title="Halaman Beranda Utama"
        >
          <Home
            className={`w-6 h-6 ${
              currentModule === 'home' ? 'text-white' : 'text-[#4A443F]'
            }`}
          />
          <span className="text-xs md:text-sm font-extrabold">Beranda</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onGoBack();
          }}
          disabled={!canGoBack}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-2xl font-bold transition-all border-2 ${
            canGoBack
              ? 'bg-[#FAF4E8] hover:bg-[#F2EDE4] text-[#4A443F] border-[#E8E2D9] shadow-md active:scale-95'
              : 'bg-[#F2EDE4] text-[#7C7267]/50 border-[#E8E2D9]/50 cursor-not-allowed opacity-50'
          }`}
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs md:text-sm font-extrabold">Kembali</span>
        </button>

        <button
          onClick={goStickers}
          className={`hidden sm:flex flex-col md:flex-row items-center justify-center gap-1 min-w-[64px] min-h-[56px] px-3 py-1.5 rounded-2xl font-bold transition-all border-2 ${
            currentModule === 'stickers'
              ? 'bg-[#E0B56E] text-[#2D2926] border-[#B59155] scale-105 shadow-md'
              : 'bg-[#FAF4E8] hover:bg-[#F2EDE4] border-[#E8E2D9] text-[#4A443F]'
          }`}
          title="Koleksi Lencana Bintang"
        >
          <Award
            className={`w-6 h-6 ${
              currentModule === 'stickers' ? 'text-[#2D2926]' : 'text-[#5A7D6C]'
            }`}
          />
          <span className="text-xs md:text-sm font-extrabold">Lencana</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onGoNext();
          }}
          disabled={!canGoNext}
          className={`flex flex-col md:flex-row items-center justify-center gap-1 min-w-[64px] min-h-[56px] px-3.5 py-1.5 rounded-2xl font-bold transition-all border-2 ${
            canGoNext
              ? 'bg-[#5A7D6C] hover:bg-[#4A6658] text-white border-[#4A6658] shadow-md active:scale-95'
              : 'bg-[#F2EDE4] text-[#7C7267]/50 border-[#E8E2D9]/50 cursor-not-allowed opacity-50'
          }`}
          title="Halaman Selanjutnya"
        >
          <span className="text-xs md:text-sm font-extrabold">Selanjutnya</span>
          <ChevronRight className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            soundEffects.playEmergencySound();
            openEmergency();
          }}
          className="flex flex-col md:flex-row items-center justify-center gap-1 min-w-[72px] min-h-[56px] px-3.5 py-1.5 bg-[#E66B6B] hover:bg-[#D45959] border-2 border-[#D45959] text-white rounded-2xl font-black shadow-md active:scale-95 transition-all"
          title="Tombol Bantuan"
        >
          <ShieldAlert className="w-6 h-6 text-[#FDFBF7]" />
          <span className="text-xs md:text-sm font-black tracking-wide">
            BANTUAN
          </span>
        </button>
      </div>
    </nav>
  );
};
