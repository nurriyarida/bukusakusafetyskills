import React from 'react';
import { Sparkles } from 'lucide-react';
import { soundEffects } from '../utils/audio';
import type { ModuleType, GenderType, ContactInfo, AccessibilitySettings } from '../types';

interface HomeViewProps {
  onSelectModule: (mod: ModuleType) => void;
  gender: GenderType;
  studentName: string;
  openProfileModal: () => void;
  settings?: AccessibilitySettings;
  contacts?: ContactInfo;
  openEmergency?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectModule,
  gender,
  studentName,
  openProfileModal,
}) => {
  const handleSelect = (module: ModuleType) => {
    soundEffects.playClick();
    onSelectModule(module);
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-[#5A7D6C] text-[#FDFBF7] p-6 md:p-8 shadow-xl border-b-8 border-[#4A6658]">
        <div className="relative z-10 max-w-2xl md:pr-64 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBF2EE] rounded-full font-black text-xs text-[#5A7D6C] uppercase tracking-wider shadow-sm">
            <Sparkles className="w-4 h-4 text-[#5A7D6C]" />
            <span>BUKU SAKU KESELAMATAN DIRI</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-[#FDFBF7]">
            Halo, {studentName}!
          </h2>
          <p className="text-xl md:text-2xl font-black text-[#EBF2EE]">
            Ayo belajar menjaga diri!
          </p>
        </div>

        <div
          onClick={() => {
            soundEffects.playClick();
            openProfileModal();
          }}
          className="mt-4 md:mt-0 flex md:absolute md:right-6 md:bottom-4 items-center gap-3 bg-[#FDFBF7]/15 hover:bg-[#FDFBF7]/25 backdrop-blur-md p-3.5 md:p-4 rounded-3xl border border-[#FDFBF7]/20 text-left cursor-pointer transition-all active:scale-95 group w-fit"
          title="Klik untuk membuka Profil Siswa"
        >
          <div className="text-5xl md:text-6xl group-hover:scale-105 transition-transform">
            <span
              role="img"
              aria-label={gender === 'boy' ? 'Laki-laki' : 'Perempuan'}
            >
              {gender === 'boy' ? '👦' : '👧'}
            </span>
          </div>
          <div className="text-left font-black text-[#FDFBF7]">
            <div className="text-xs uppercase text-[#E0B56E] flex items-center gap-1.5 font-black">
              <span>Profil Siswa</span>
              <span className="px-1.5 py-0.5 bg-[#E0B56E]/20 text-[#E0B56E] rounded-md text-[10px]">
                {' '}
                Ubah
              </span>
            </div>
            <div className="text-xl md:text-2xl truncate max-w-[150px]">
              {studentName}
            </div>
            <div className="text-xs text-[#EBF2EE]">
              "Aku anak hebat & berani!"
            </div>
          </div>
        </div>
      </div>

      {/* Hero Welcome Illustration */}
      <img
        src="/illustrations/welcome-v4.png"
        alt="Empat anak menyambutmu di halaman sekolah"
        width="2048"
        height="683"
        className="block w-full h-auto max-w-4xl mx-auto rounded-3xl"
      />

      {/* Book Choices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
        {/* Book 1: Lost Situation */}
        <div
          onClick={() => handleSelect('lost-situation')}
          className="relative rounded-r-[32px] rounded-l-md border-y-2 border-r-2 border-[#D9D2C7] bg-gradient-to-b from-[#FAF5EC] to-[#F3EDE2] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 sm:p-7 min-h-[440px] md:min-h-[480px] group hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[#293B32] via-[#385244] to-[#456353] border-r border-[#202E27] shadow-inner" />
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-black/10" />

          <div className="pl-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#D9D2C7] shadow-sm">
              <img
                src="/illustrations/lost-cover-v4.png"
                alt="Anak meminta bantuan kepada satpam di pusat perbelanjaan"
                width="1448"
                height="1086"
                className="block w-full h-auto"
              />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-[#2D2926] leading-tight">
                4 Langkah Saat Tersesat
              </h3>
              <p className="text-sm sm:text-base font-bold text-[#7C7267]">
                Panduan Mandiri Menemukan Bantuan
              </p>
            </div>
          </div>

          <div className="pl-5 pt-6">
            <button className="w-full py-4 bg-[#5A7D6C] group-hover:bg-[#4A6658] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-colors">
              <span>Mulai Membaca</span>
            </button>
          </div>
        </div>

        {/* Book 2: Bullying Response */}
        <div
          onClick={() => handleSelect('bullying-response')}
          className="relative rounded-r-[32px] rounded-l-md border-y-2 border-r-2 border-[#D9D2C7] bg-gradient-to-b from-[#FAF5EC] to-[#F3EDE2] shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between p-6 sm:p-7 min-h-[440px] md:min-h-[480px] group hover:-translate-y-2 overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-5 bg-gradient-to-r from-[#822828] via-[#A83737] to-[#BA4343] border-r border-[#691E1E] shadow-inner" />
          <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-black/10" />

          <div className="pl-5 space-y-6">
            <div className="rounded-3xl overflow-hidden border border-[#D9D2C7] shadow-sm">
              <img
                src="/illustrations/bullying-stop-v5.png"
                alt="Anak mengangkat telapak tangan dan berkata Aku tidak suka untuk menolak perundungan"
                width="1448"
                height="1086"
                className="block w-full h-auto"
              />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-2xl sm:text-3xl font-black text-[#2D2926] leading-tight">
                4 Langkah Respon Perundungan
              </h3>
              <p className="text-sm sm:text-base font-bold text-[#7C7267]">
                Sikap Berani, Tegas, & Melapor
              </p>
            </div>
          </div>

          <div className="pl-5 pt-6">
            <button className="w-full py-4 bg-[#C84F4F] group-hover:bg-[#B33E3E] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md transition-colors">
              <span>Mulai Membaca</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extra Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
        <button
          onClick={() => handleSelect('quiz')}
          className="p-5 bg-white rounded-2xl border-2 border-[#E8E2D9] hover:border-[#5A7D6C] text-left flex items-center gap-4 transition-all shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#EBF2EE] text-[#5A7D6C] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
            <span role="img" aria-label="Kuis">
              📝
            </span>
          </div>
          <div>
            <div className="text-xl font-black text-[#2D2926]">Kuis</div>
          </div>
        </button>

        <button
          onClick={() => handleSelect('stickers')}
          className="p-5 bg-white rounded-2xl border-2 border-[#E8E2D9] hover:border-[#E0B56E] text-left flex items-center gap-4 transition-all shadow-sm active:scale-95 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FAF4E8] text-[#E0B56E] flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
            <span role="img" aria-label="Piala">
              🏆
            </span>
          </div>
          <div>
            <div className="text-xl font-black text-[#2D2926]">
              Lencana & Bintang
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
