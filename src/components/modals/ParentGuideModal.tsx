import React from 'react';
import { X, BookOpen, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface ParentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParentGuideModal: React.FC<ParentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2926]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#F2EDE4] rounded-3xl border-2 border-[#E8E2D9] shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-4 border-[#E8E2D9]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#EBF2EE] text-[#5A7D6C] rounded-2xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#2D2926]">
                Panduan Pedagogis Guru & Orang Tua
              </h3>
              <p className="text-xs text-[#7C7267] font-bold">
                Petunjuk Pelaksanaan Buku Saku Disabilitas Intelektual
              </p>
            </div>
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

        <div className="space-y-5 text-[#2D2926] text-sm md:text-base">
          {/* Section 1 */}
          <div className="p-4 bg-[#EBF2EE] border border-[#5A7D6C]/40 rounded-2xl space-y-2">
            <h4 className="font-black text-[#5A7D6C] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#5A7D6C]" />
              <span>Fokus 2 Aspek Keselamatan Diri:</span>
            </h4>
            <p className="text-[#4A443F] font-semibold leading-relaxed text-xs md:text-sm">
              Media ini mengkhususkan diri pada 2 situasi paling berisiko bagi
              anak disabilitas intelektual:
              <br />
              1. <strong>Situasi Tersesat:</strong> Melatih anak untuk tidak
              panik, diam di tempat terang, mengenali satpam berseragam sebagai
              penolong aman, dan menolak orang asing.
              <br />
              2. <strong>Respons terhadap Bullying:</strong> Melatih refleks
              angkat tangan dan berkata <strong>"STOP!"</strong>, melangkah
              menjauh tanpa kekerasan fisik, serta berani melapor ke Guru.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-[#FAF4E8] border border-[#E0B56E] rounded-2xl space-y-2">
            <h4 className="font-black text-[#2D2926] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#E0B56E]" />
              <span>Kelanjutan Pembelajaran: Bermain Peran (Roleplay)</span>
            </h4>
            <p className="text-[#4A443F] text-xs md:text-sm font-semibold leading-relaxed">
              Bagi anak disabilitas intelektual, pemahaman verbal saja tidak
              cukup. Fitur <strong>Bermain Peran</strong> menyediakan skrip
              dialog dan aksi timbal balik antara Guru dan Siswa untuk melatih
              memori motorik dan keberanian berbicara dalam situasi nyata.
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-[#FCE8E8] border border-[#E66B6B]/40 rounded-2xl space-y-2">
            <h4 className="font-black text-[#E66B6B] flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#E66B6B]" />
              <span>Tombol Bantuan Tersambung ke HP Guru / Orang Tua</span>
            </h4>
            <p className="text-[#4A443F] text-xs md:text-sm font-semibold leading-relaxed">
              Tombol darurat di navbar dan menu utama telah ditautkan langsung ke
              nomor handphone Guru. Ketika anak mengetuk tombol tersebut,
              aplikasi membuka sambungan telepon langsung (<code>tel:</code>) atau
              chat WhatsApp darurat dengan pesan lokasi otomatis ke HP Bapak/Ibu
              Guru. Nomor HP dapat disesuaikan pada menu pengaturan di dalam modal
              bantuan.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="w-full py-3 bg-[#5A7D6C] hover:bg-[#4A6658] text-white font-black rounded-2xl text-sm"
        >
          Saya Mengerti & Siap Mendampingi
        </button>
      </div>
    </div>
  );
};
