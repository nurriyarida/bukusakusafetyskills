import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldAlert,
  MapPin,
  Loader2,
  Check,
  RefreshCw,
  ExternalLink,
  PhoneCall,
  MessageSquare,
  Settings2,
} from 'lucide-react';
import { soundEffects, speechEngine } from '../../utils/audio';
import { defaultContacts } from '../../data/bookData';
import type { ContactInfo, AccessibilitySettings } from '../../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  gender?: string;
  studentName?: string;
  character?: string;
  settings: AccessibilitySettings;
  contacts: ContactInfo;
  onUpdateContacts: (contacts: ContactInfo) => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsUrl: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  studentName,
  character,
  settings,
  contacts,
  onUpdateContacts,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [teacherPhone, setTeacherPhone] = useState(contacts.teacherPhone);
  const [teacherName, setTeacherName] = useState(contacts.teacherName);
  const [parentPhone, setParentPhone] = useState(contacts.parentPhone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  const childTitle = studentName || (character === 'budi' ? 'Siswa' : 'Siswi');

  const fetchLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setGeoStatus('error');
      return;
    }
    setIsLocating(true);
    setGeoStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = Math.round(pos.coords.accuracy);
        setLocation({
          latitude: lat,
          longitude: lng,
          accuracy: acc,
          mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
        });
        setGeoStatus('success');
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation notice:', err.message);
        setGeoStatus('error');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    setTeacherPhone(contacts.teacherPhone);
    setTeacherName(contacts.teacherName);
    setParentPhone(contacts.parentPhone);
  }, [contacts]);

  useEffect(() => {
    if (isOpen) {
      fetchLocation();
    }
  }, [isOpen, fetchLocation]);

  if (!isOpen) return null;

  const cleanDigits = (n: string) => n.replace(/[^0-9+]/g, '');
  const toWaNumber = (n: string) => {
    let clean = n.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const rawTeacherPhone = cleanDigits(contacts.teacherPhone);
  const waTeacherPhone = toWaNumber(contacts.teacherPhone);
  const rawParentPhone = cleanDigits(contacts.parentPhone);
  const waParentPhone = toWaNumber(contacts.parentPhone);

  const buildSosMessage = (target: 'teacher' | 'parent', loc: LocationData | null) => {
    const contactName =
      target === 'teacher'
        ? contacts.teacherName || 'Bapak/Ibu Guru'
        : 'Bapak/Ibu Orang Tua';
    const locInfo = loc
      ? ` LOKASI SAYA SAAT INI:${loc.mapsUrl}(Koordinat GPS: ${loc.latitude.toFixed(
          6
        )}, ${loc.longitude.toFixed(6)} | Akurasi: ±${loc.accuracy}m)`
      : ` POSISI / LOKASI:(GPS perangkat sedang dicari atau izin belum aktif, mohon segera hubungi siswa)`;

    return ` PESAN DARURAT KESELAMATAN!Halo ${contactName}, saya ${childTitle} sedang butuh bantuan keselamatan sekarang!Mohon segera hubungi atau jemput saya.${locInfo}(Dikirim melalui Buku Saku Keselamatan Diri)`;
  };

  const handleOpenWhatsApp = (target: 'teacher' | 'parent') => {
    soundEffects.playClick();
    speechEngine.speak(
      `Membuka WhatsApp ke ${
        target === 'teacher' ? 'Guru' : 'Orang Tua'
      } dengan lokasi darurat.`,
      settings
    );
    const targetPhone = target === 'teacher' ? waTeacherPhone : waParentPhone;

    if (location) {
      const msg = buildSosMessage(target, location);
      window.open(
        `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
      return;
    }

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);
          const newLoc = {
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
          };
          setLocation(newLoc);
          setGeoStatus('success');
          const msg = buildSosMessage(target, newLoc);
          window.open(
            `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`,
            '_blank'
          );
        },
        () => {
          setIsLocating(false);
          const msg = buildSosMessage(target, null);
          window.open(
            `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`,
            '_blank'
          );
        },
        { enableHighAccuracy: true, timeout: 2000, maximumAge: 30000 }
      );
    } else {
      const msg = buildSosMessage(target, null);
      window.open(
        `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`,
        '_blank'
      );
    }
  };

  const handleCallTeacher = () => {
    soundEffects.playEmergencySound();
    speechEngine.speak(
      `Menghubungi nomor handphone Guru: ${contacts.teacherPhone}. Tetap tenang dan tunggu di tempat aman!`,
      settings
    );
    window.location.href = `tel:${rawTeacherPhone}`;
  };

  const handleCallParent = () => {
    soundEffects.playEmergencySound();
    speechEngine.speak(
      `Menghubungi nomor handphone Orang Tua: ${contacts.parentPhone}. Ibu dan Ayah siap melindungimu.`,
      settings
    );
    window.location.href = `tel:${rawParentPhone}`;
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();
    const updated: ContactInfo = {
      ...contacts,
      teacherPhone: teacherPhone.trim() || defaultContacts.teacherPhone,
      teacherName: teacherName.trim() || defaultContacts.teacherName,
      parentPhone: parentPhone.trim() || defaultContacts.parentPhone,
    };
    onUpdateContacts(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowForm(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2926]/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#FAF4E8] text-[#2D2926] rounded-[32px] border-4 border-[#E66B6B] shadow-2xl max-w-xl w-full p-5 md:p-7 space-y-5 relative my-auto animate-fade-in max-h-[92vh] overflow-y-auto">
        <button
          onClick={() => {
            soundEffects.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2.5 bg-[#E8E2D9] hover:bg-[#d8d0c3] rounded-full text-[#4A443F] transition-colors"
          title="Tutup Modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex p-3 bg-[#E66B6B] text-white rounded-3xl shadow-md animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-[#2D2926] uppercase tracking-wide">
              BANTUAN & DARURAT
            </h3>
            <p className="text-sm md:text-base font-bold text-[#E66B6B]">
              Tersambung Langsung ke Handphone Guru & Orang Tua
            </p>
          </div>
        </div>

        <div className="bg-[#FCE8E8] border border-[#E66B6B]/40 rounded-2xl p-3.5 text-center space-y-1">
          <p className="text-xs md:text-sm font-extrabold text-[#D45959]">
            "Kamu merasa takut, tersesat, atau diganggu? Tekan tombol di bawah
            untuk langsung menghubungi HP Guru sekarang!"
          </p>
        </div>

        {/* GPS location section */}
        <div className="bg-white/90 border-2 border-[#5A7D6C]/30 rounded-2xl p-3.5 shadow-sm space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E66B6B] shrink-0" />
              <span className="text-xs font-black uppercase text-[#2D2926] tracking-wider">
                Lokasi Pengguna (Otomatis Masuk WA)
              </span>
            </div>
            {isLocating ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-[#5A7D6C] animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Mendeteksi GPS...
              </span>
            ) : geoStatus === 'success' && location ? (
              <span className="px-2.5 py-0.5 bg-[#EBF2EE] text-[#5A7D6C] rounded-full text-[11px] font-black flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5 text-[#5A7D6C]" />
                GPS Terhubung
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  fetchLocation();
                }}
                className="px-2.5 py-0.5 bg-[#FAF4E8] hover:bg-[#F2EDE4] border border-[#E0B56E] text-[#B59155] rounded-full text-[11px] font-black flex items-center gap-1 transition-all"
                title="Perbarui titik lokasi GPS"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Perbarui Lokasi</span>
              </button>
            )}
          </div>

          {location ? (
            <div className="text-xs font-bold text-[#4A443F] flex items-center justify-between flex-wrap gap-2 bg-[#FAF7F0] p-2.5 rounded-xl border border-[#E8E2D9]">
              <span className="text-[#5A7D6C] font-mono">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}{' '}
                <span className="text-[#7C7267] font-sans font-normal">
                  (Akurasi: ±{location.accuracy}m)
                </span>
              </span>
              <a
                href={location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#5A7D6C] hover:text-[#385244] underline font-black inline-flex items-center gap-1"
                title="Lihat titik lokasi di Google Maps"
              >
                <span>Lihat di Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ) : (
            <p className="text-xs text-[#7C7267] font-medium leading-relaxed">
              {isLocating
                ? 'Sedang membaca titik lokasi GPS ponselmu agar posisi tepatmu ikut terkirim ke WhatsApp...'
                : 'Peta Google Maps posisi terkini akan otomatis disertakan ke dalam chat WhatsApp saat tombol ditekan.'}
            </p>
          )}
        </div>

        {/* Primary Contact: Teacher */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-[#7C7267] tracking-wider flex items-center justify-between">
            <span>KONTAK UTAMA: HP GURU</span>
            <span className="text-[#5A7D6C] font-extrabold">
              {contacts.teacherName}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCallTeacher}
              className="w-full py-4 px-4 bg-[#5A7D6C] hover:bg-[#4A6658] text-white rounded-2xl font-black text-base md:text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-[#3a5246]"
            >
              <PhoneCall className="w-6 h-6 text-[#E0B56E] animate-bounce" />
              <div className="text-left leading-tight">
                <div>TELEPON HP GURU</div>
                <div className="text-xs font-semibold text-[#EBF2EE]">
                  {contacts.teacherPhone}
                </div>
              </div>
            </button>

            <button
              onClick={() => handleOpenWhatsApp('teacher')}
              className="w-full py-4 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-2xl font-black text-base md:text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-[#169648]"
            >
              <MessageSquare className="w-6 h-6 text-white" />
              <div className="text-left leading-tight">
                <div>CHAT WA GURU</div>
                <div className="text-xs font-semibold text-white/90">
                  Kirim SOS & Lokasi
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Secondary Contact: Parents */}
        <div className="space-y-2 pt-1 border-t border-[#E8E2D9]">
          <div className="text-xs font-black uppercase text-[#7C7267] tracking-wider">
            KONTAK KELUARGA: ORANG TUA
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleCallParent}
              className="py-3 px-3 bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926] rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <PhoneCall className="w-5 h-5 text-[#2D2926]" />
              <span>Telepon Orang Tua ({contacts.parentPhone})</span>
            </button>

            <button
              onClick={() => handleOpenWhatsApp('parent')}
              className="py-3 px-3 bg-[#FAF4E8] hover:bg-[#F2EDE4] text-[#2D2926] border-2 border-[#E0B56E] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
              <span>Chat WA Orang Tua (+ Lokasi)</span>
            </button>
          </div>
        </div>

        {/* Police 110 Call */}
        <a
          href="tel:110"
          onClick={() => speechEngine.stop()}
          aria-label="Telepon Polisi 110"
          className="w-full py-3.5 px-4 bg-[#E66B6B] hover:bg-[#D45959] text-white rounded-2xl font-black text-base shadow-md flex items-center justify-center gap-2.5 active:scale-95 transition-all border-b-4 border-[#b84242]"
        >
          <PhoneCall className="w-6 h-6 text-white" aria-hidden="true" />
          <span>TELEPON POLISI 110</span>
        </a>

        {/* Edit phone numbers form */}
        <div className="pt-2 border-t border-[#E8E2D9]">
          <button
            onClick={() => {
              soundEffects.playClick();
              setShowForm((s) => !s);
            }}
            className="w-full py-2 px-3 bg-[#F2EDE4] hover:bg-[#E8E2D9] text-[#7C7267] rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-[#5A7D6C]" />
              <span>Pengaturan Nomor HP Guru & Orang Tua</span>
            </span>
            <span className="text-[#5A7D6C] font-black">
              {showForm ? 'Tutup Form ▲' : 'Ubah Nomor ▼'}
            </span>
          </button>

          {showForm && (
            <form
              onSubmit={handleSaveContacts}
              className="mt-3 p-4 bg-[#F2EDE4] rounded-2xl space-y-3 border border-[#E8E2D9]"
            >
              <div className="space-y-1">
                <label className="text-xs font-black text-[#4A443F]">
                  Nama Guru Pendamping:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Misal: Bu Ratna (Guru Kelas)"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8E2D9] text-sm font-bold text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#5A7D6C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#4A443F]">
                  Nomor HP / WhatsApp Guru:
                </label>
                <input
                  type="tel"
                  value={teacherPhone}
                  onChange={(e) => setTeacherPhone(e.target.value)}
                  placeholder="Misal: 081234567890"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8E2D9] text-sm font-bold text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#5A7D6C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-[#4A443F]">
                  Nomor HP Orang Tua:
                </label>
                <input
                  type="tel"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="Misal: 081987654321"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-[#E8E2D9] text-sm font-bold text-[#2D2926] focus:outline-none focus:ring-2 focus:ring-[#5A7D6C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#5A7D6C] hover:bg-[#4A6658] text-white rounded-xl font-black text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Nomor Kontak Darurat</span>
              </button>

              {savedSuccess && (
                <div className="p-2 bg-[#EBF2EE] text-[#5A7D6C] rounded-lg text-xs font-black text-center animate-fade-in">
                  Nomor HP Guru & Orang Tua Berhasil Disimpan!
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
