import React from 'react';
import { X, Eye, Type, Contrast, Volume2 } from 'lucide-react';
import { soundEffects, speechEngine } from '../../utils/audio';
import type { AccessibilitySettings } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  setSettings: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    soundEffects.playClick();
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2926]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F2EDE4] rounded-3xl border-2 border-[#E8E2D9] shadow-2xl max-w-lg w-full p-6 space-y-6 relative animate-fade-in">
        <div className="flex items-center justify-between border-b pb-4 border-[#E8E2D9]">
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#5A7D6C]" />
            <h3 className="text-xl font-black text-[#2D2926]">
              Pengaturan Aksesibilitas
            </h3>
          </div>
          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-2 bg-[#FAF4E8] hover:bg-[#E8E2D9] rounded-full text-[#2D2926]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5 text-[#2D2926]">
          {/* Font Size */}
          <div className="space-y-2">
            <label className="text-sm font-black flex items-center gap-2">
              <Type className="w-5 h-5 text-[#5A7D6C]" />
              <span>Ukuran Teks & Gambar</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`py-2 px-3 rounded-2xl font-black text-sm capitalize border transition-all ${
                    settings.fontSize === size
                      ? 'bg-[#5A7D6C] text-white border-[#4A6658] shadow-sm'
                      : 'bg-[#FAF4E8] text-[#4A443F] border-[#E8E2D9]'
                  }`}
                >
                  {size === 'normal'
                    ? 'Sedang'
                    : size === 'large'
                    ? 'Besar'
                    : 'Sangat Besar'}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3 bg-[#FAF4E8] rounded-2xl border border-[#E8E2D9]">
            <div className="space-y-0.5">
              <div className="text-sm font-black flex items-center gap-2">
                <Contrast className="w-5 h-5 text-[#5A7D6C]" />
                <span>Mode Kontras Tinggi</span>
              </div>
              <p className="text-xs text-[#7C7267] font-medium">
                Mempermudah keterbacaan mata
              </p>
            </div>
            <button
              onClick={() =>
                updateSetting('highContrast', !settings.highContrast)
              }
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                settings.highContrast
                  ? 'bg-[#5A7D6C] justify-end'
                  : 'bg-[#E8E2D9] justify-start'
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Auto Read Text */}
          <div className="flex items-center justify-between p-3 bg-[#FAF4E8] rounded-2xl border border-[#E8E2D9]">
            <div className="space-y-0.5">
              <div className="text-sm font-black flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#5A7D6C]" />
                <span>Otomatis Bacakan Teks</span>
              </div>
              <p className="text-xs text-[#7C7267] font-medium">
                Narasi suara otomatis saat membuka halaman
              </p>
            </div>
            <button
              onClick={() =>
                updateSetting('autoReadText', !settings.autoReadText)
              }
              className={`w-12 h-7 rounded-full transition-colors p-1 flex items-center ${
                settings.autoReadText
                  ? 'bg-[#5A7D6C] justify-end'
                  : 'bg-[#E8E2D9] justify-start'
              }`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow-md" />
            </button>
          </div>

          {/* Speech Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-black">
              <span>Kecepatan Suara Narasi:</span>
              <span className="text-[#5A7D6C] font-black">
                {settings.speechRate.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.2"
              step="0.05"
              value={settings.speechRate}
              onChange={(e) =>
                updateSetting('speechRate', parseFloat(e.target.value))
              }
              className="w-full accent-[#5A7D6C] h-2 bg-[#E8E2D9] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-xs font-bold text-[#7C7267]">
              <span>Perlahan (Mudah Dipahami)</span>
              <span>Cepat</span>
            </div>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#4A6658] bg-[#EBF2EE] rounded-xl p-3">
          Narasi buku menggunakan audio neural bahasa Indonesia. Sapaan dengan
          nama dan nomor kontak memakai suara perangkat.
        </p>

        <button
          onClick={() => {
            soundEffects.playClick();
            speechEngine.speak(
              'Ini adalah contoh uji coba suara narasi aksesibel.',
              settings
            );
          }}
          className="w-full py-3 bg-[#E0B56E] hover:bg-[#d0a45e] text-[#2D2926] font-black rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm"
        >
          <Volume2 className="w-5 h-5" />
          <span>Uji Coba Suara Narasi</span>
        </button>
      </div>
    </div>
  );
};
