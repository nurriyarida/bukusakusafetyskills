import React from 'react';
import { Volume2, BookOpen, Settings } from 'lucide-react';
import { soundEffects, speechEngine } from '../utils/audio';
import type { AccessibilitySettings } from '../types';

interface HeaderProps {
  gender?: string;
  setGender?: (gender: string) => void;
  studentName?: string;
  openProfileModal?: () => void;
  character?: string;
  setCharacter?: (char: string) => void;
  isSpeaking: boolean;
  settings: AccessibilitySettings;
  openSettings: () => void;
  openParentGuide: () => void;
  openEmergency?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSpeaking,
  settings,
  openSettings,
  openParentGuide,
}) => {
  const toggleSpeech = () => {
    soundEffects.playClick();
    if (isSpeaking) {
      speechEngine.stop();
    } else {
      speechEngine.speak(
        'Selamat datang di Buku Saku Keselamatan Diri. Tekan tombol untuk mendengarkan suara.',
        settings
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b-2 border-[#E8E2D9] shadow-sm px-3 py-2 md:px-6 md:py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#5A7D6C] flex items-center justify-center text-2xl shadow-sm text-white font-bold">
            <span role="img" aria-label="Buku">
              📖
            </span>
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black text-[#2D2926] leading-tight tracking-wide">
              BUKU SAKU
            </h1>
            <p className="text-xs md:text-sm font-semibold text-[#7C7267]">
              Keselamatan Diri
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 md:gap-3">
          <button
            onClick={toggleSpeech}
            className={`p-2 md:px-3 md:py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all border-2 ${
              isSpeaking
                ? 'bg-[#E0B56E] text-[#2D2926] border-[#B59155] animate-pulse shadow-md'
                : 'bg-[#EBF2EE] text-[#5A7D6C] border-[#5A7D6C]/30 hover:bg-[#d8e5dd]'
            }`}
            title="Pengolah Suara (Narasi)"
          >
            {isSpeaking ? (
              <>
                <Volume2 className="w-5 h-5 text-[#2D2926] animate-bounce" />
                <span className="hidden md:inline font-black">Membaca...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-[#5A7D6C]" />
                <span className="hidden md:inline">Baca Suara</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              openParentGuide();
            }}
            className="p-2 md:px-3 md:py-2 bg-[#FAF4E8] text-[#4A443F] hover:bg-[#F2EDE4] border border-[#E8E2D9] rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1 transition-all"
            title="Panduan Pendamping (Guru & Orang Tua)"
          >
            <BookOpen className="w-5 h-5 text-[#5A7D6C]" />
            <span className="hidden lg:inline">Panduan Pendamping</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              openSettings();
            }}
            className="p-2 bg-[#F2EDE4] hover:bg-[#E8E2D9] text-[#4A443F] border border-[#E8E2D9] rounded-2xl transition-all"
            title="Pengaturan Aksesibilitas"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
