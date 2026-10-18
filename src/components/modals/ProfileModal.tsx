import React, { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';
import { soundEffects, speechEngine } from '../../utils/audio';
import type { GenderType, AccessibilitySettings } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender: GenderType;
  setGender: (g: GenderType) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  settings: AccessibilitySettings;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  gender,
  setGender,
  studentName,
  setStudentName,
  settings,
}) => {
  const [selectedGender, setSelectedGender] = useState<GenderType>(gender);
  const [nameInput, setNameInput] = useState<string>(studentName);

  useEffect(() => {
    if (isOpen) {
      setSelectedGender(gender);
      setNameInput(studentName);
    }
  }, [isOpen, gender, studentName]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEffects.playSuccess();
    const cleanName =
      nameInput.trim() ||
      (selectedGender === 'boy' ? 'Teman Hebat' : 'Kawan Hebat');
    setGender(selectedGender);
    setStudentName(cleanName);

    try {
      localStorage.setItem('talkbook_gender', selectedGender);
      localStorage.setItem('talkbook_student_name', cleanName);
    } catch {}

    speechEngine.speak(`Halo ${cleanName}, profil berhasil diperbarui!`, settings);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-title"
    >
      <div className="bg-[#FAF7F0] border-4 border-[#5A7D6C] rounded-[32px] w-full max-w-md p-6 sm:p-7 shadow-2xl relative space-y-6">
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute right-4 top-4 w-10 h-10 rounded-full bg-[#E8E2D9] hover:bg-[#D9D2C7] flex items-center justify-center text-[#2D2926] font-black transition-colors"
          aria-label="Tutup jendela"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5A7D6C] text-white flex items-center justify-center text-2xl shadow-md">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-[#5A7D6C]">
              Pengaturan Profil
            </div>
            <h2
              id="profile-title"
              className="text-xl sm:text-2xl font-black text-[#2D2926]"
            >
              Pilih Gender & Tulis Namamu
            </h2>
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-2">
          <label className="text-sm font-black text-[#4A443F] flex items-center gap-1.5">
            <span>1. Pilih Gender:</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSelectedGender('boy');
              }}
              className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 transition-all ${
                selectedGender === 'boy'
                  ? 'bg-[#EBF2EE] border-[#5A7D6C] shadow-md scale-102 ring-4 ring-[#5A7D6C]/20'
                  : 'bg-white border-[#E8E2D9] hover:bg-[#F2EDE4]'
              }`}
            >
              <span className="text-4xl">
                <span role="img" aria-label="Laki-laki">
                  👦
                </span>
              </span>
              <span className="text-sm font-black text-[#2D2926]">
                Laki-laki
              </span>
              {selectedGender === 'boy' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#5A7D6C] bg-white px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Dipilih
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSelectedGender('girl');
              }}
              className={`p-4 rounded-2xl border-3 flex flex-col items-center justify-center gap-2 transition-all ${
                selectedGender === 'girl'
                  ? 'bg-[#FAF4E8] border-[#E0B56E] shadow-md scale-102 ring-4 ring-[#E0B56E]/20'
                  : 'bg-white border-[#E8E2D9] hover:bg-[#F2EDE4]'
              }`}
            >
              <span className="text-4xl">
                <span role="img" aria-label="Perempuan">
                  👧
                </span>
              </span>
              <span className="text-sm font-black text-[#2D2926]">
                Perempuan
              </span>
              {selectedGender === 'girl' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#B59155] bg-white px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" /> Dipilih
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Student Name */}
        <div className="space-y-2">
          <label
            htmlFor="student-name-input"
            className="text-sm font-black text-[#4A443F] flex items-center justify-between"
          >
            <span>2. Tulis Namamu (Bisa Custom):</span>
            <span className="text-xs font-bold text-[#7C7267]">
              Ketik di bawah
            </span>
          </label>
          <div className="relative">
            <input
              id="student-name-input"
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Contoh: Budi, Siti, Rian, Aisyah..."
              maxLength={25}
              className="w-full px-4 py-3.5 bg-white border-2 border-[#D9D2C7] focus:border-[#5A7D6C] focus:ring-4 focus:ring-[#5A7D6C]/20 rounded-2xl text-lg font-black text-[#2D2926] placeholder-[#A0988E] outline-none transition-all shadow-inner"
            />
          </div>
          <p className="text-xs font-semibold text-[#7C7267]">
            Nama ini akan muncul di beranda, sapaan audio, serta latihan buku saku.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3.5 bg-[#5A7D6C] hover:bg-[#4A6658] text-white rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-98"
          >
            <Check className="w-5 h-5" />
            <span>Simpan Nama & Gender</span>
          </button>
        </div>
      </div>
    </div>
  );
};
