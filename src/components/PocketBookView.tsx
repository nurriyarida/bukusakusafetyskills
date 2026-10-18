import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { soundEffects, speechEngine } from '../utils/audio';
import { StoryScene } from './StoryArt';
import type { BookSpread, BookPage, ContentItem, AccessibilitySettings } from '../types';

interface PocketBookViewProps {
  bookTitle: string;
  bookBadge: string;
  themeColor: 'sage' | 'terracotta' | 'ochre';
  spreads: BookSpread[];
  currentSpreadIndex: number;
  onSpreadChange: (index: number) => void;
  settings: AccessibilitySettings;
  onNextModule?: () => void;
  nextModuleLabel?: string;
}

const formatContentItemText = (item: ContentItem) => {
  return [item.heading?.replace(/:$/, ''), item.text]
    .filter(Boolean)
    .join('. ');
};

const extractPageTexts = (page: BookPage): string[] => {
  return [
    page.audioText,
    ...(page.contentItems ?? []).map(formatContentItemText),
  ];
};

export const PocketBookView: React.FC<PocketBookViewProps> = ({
  bookTitle,
  bookBadge,
  themeColor,
  spreads,
  currentSpreadIndex,
  onSpreadChange,
  settings,
  onNextModule,
  nextModuleLabel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoType =
    themeColor === 'sage'
      ? 'lost'
      : themeColor === 'terracotta'
      ? 'bullying'
      : null;

  const [isIntroMode, setIsIntroMode] = useState(true);
  const currentSpread = spreads[currentSpreadIndex];

  useEffect(() => {
    videoRef.current?.pause();
    speechEngine.stop();
    if (!isIntroMode && settings.autoReadText && currentSpread) {
      speechEngine.speakSequence(
        [
          ...extractPageTexts(currentSpread.leftPage),
          ...extractPageTexts(currentSpread.rightPage),
        ],
        settings
      );
    }
    return () => speechEngine.stop();
  }, [currentSpreadIndex, bookTitle, settings.autoReadText, isIntroMode]);

  const totalSpreads = spreads.length;
  const left = currentSpread?.leftPage;
  const right = currentSpread?.rightPage;

  const colorThemes = {
    sage: {
      cover: 'bg-[#4A6658] border-[#374C42]',
      badge: 'bg-[#EBF2EE] text-[#5A7D6C]',
      spine: 'from-[#2e4037] to-[#1f2c25]',
      accentBtn: 'bg-[#5A7D6C] hover:bg-[#4A6658] text-white',
      pageBorder: 'border-[#D9D2C7]',
      ribbon: 'bg-[#E0B56E] text-[#2D2926]',
    },
    terracotta: {
      cover: 'bg-[#C55353] border-[#9E3E3E]',
      badge: 'bg-[#FCE8E8] text-[#D45959]',
      spine: 'from-[#822828] to-[#5a1b1b]',
      accentBtn: 'bg-[#E66B6B] hover:bg-[#D45959] text-white',
      pageBorder: 'border-[#D9D2C7]',
      ribbon: 'bg-[#5A7D6C] text-white',
    },
    ochre: {
      cover: 'bg-[#B59155] border-[#8C6F3D]',
      badge: 'bg-[#FAF4E8] text-[#8C6F3D]',
      spine: 'from-[#735a2f] to-[#4e3c1e]',
      accentBtn: 'bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926]',
      pageBorder: 'border-[#D9D2C7]',
      ribbon: 'bg-[#2D2926] text-[#E0B56E]',
    },
  }[themeColor];

  const jumpToSpread = (index: number) => {
    videoRef.current?.pause();
    speechEngine.stop();
    setIsIntroMode(false);
    onSpreadChange(index);
  };

  const handlePrev = () => {
    if (!isIntroMode && currentSpreadIndex === 0) {
      soundEffects.playClick();
      setIsIntroMode(true);
      return;
    }
    if (currentSpreadIndex > 0) {
      soundEffects.playClick();
      onSpreadChange(currentSpreadIndex - 1);
    }
  };

  const handleNext = () => {
    if (isIntroMode) {
      soundEffects.playClick();
      jumpToSpread(0);
      return;
    }
    if (currentSpreadIndex < totalSpreads - 1) {
      soundEffects.playClick();
      onSpreadChange(currentSpreadIndex + 1);
    }
  };

  const handleReadBothPages = () => {
    soundEffects.playClick();
    if (left && right) {
      speechEngine.speakSequence(
        [...extractPageTexts(left), ...extractPageTexts(right)],
        settings
      );
    }
  };

  const renderPage = (page: BookPage, isLeft: boolean) => {
    return (
      <div
        className={`p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-5 relative bg-gradient-to-${
          isLeft ? 'r' : 'l'
        } from-[#F6EFE3] via-[#FAF4E8] to-[#F5ECE0] ${
          isLeft ? 'border-b md:border-b-0 md:border-r border-[#E8E2D9]' : ''
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5 border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#7C7267] tracking-wider">
                  {page.illustrationBadge || 'PANDUAN KESELAMATAN'}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-[#2D2926] leading-tight">
                  {page.title}
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                speechEngine.speakSequence(extractPageTexts(page), settings);
              }}
              className="p-2 bg-[#EBF2EE] hover:bg-[#d8e5dd] text-[#5A7D6C] rounded-xl transition-colors shrink-0"
              title={isLeft ? 'Dengar Halaman Kiri' : 'Dengar Halaman Kanan'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {page.subtitle && (
            <p className="text-sm md:text-base font-medium text-[#7C7267]">
              {page.subtitle}
            </p>
          )}

          {page.illustrationType && (
            <div className="my-2 shadow-sm rounded-3xl overflow-hidden">
              <StoryScene
                type={page.illustrationType}
                settings={settings}
                key={page.illustrationType}
              />
            </div>
          )}

          <div className="space-y-2.5 pt-1">
            {page.contentItems?.map((item, idx) => (
              <div
                key={idx}
                className={`book-content p-4 rounded-2xl border text-base font-medium leading-relaxed flex items-start gap-2.5 ${
                  item.type === 'warning'
                    ? 'bg-[#FCE8E8] border-[#E66B6B]/40 text-[#D45959]'
                    : item.type === 'checklist'
                    ? 'bg-[#EBF2EE] border-[#5A7D6C]/30 text-[#2D2926]'
                    : item.type === 'dialogue'
                    ? 'bg-white border-[#E0B56E] text-[#2D2926] italic'
                    : 'bg-white/80 border-[#E8E2D9] text-[#2D2926]'
                }`}
              >
                <div className="space-y-0.5">
                  {item.heading && (
                    <div className="book-item-heading font-bold text-sm">
                      {item.heading.replace(/:$/, '')}
                    </div>
                  )}
                  <div>{item.text}</div>
                  <button
                    type="button"
                    onClick={() =>
                      speechEngine.speak(formatContentItemText(item), settings)
                    }
                    aria-label={`Dengarkan ${
                      item.heading?.replace(/:$/, '') || 'penjelasan'
                    }`}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl border border-current/20 bg-white/80 px-3 py-2 text-xs font-bold not-italic hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                    <span>Dengarkan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {page.practiceSpeech && (
            <div className="p-4 bg-white rounded-2xl border-2 border-[#E0B56E] space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-[#B59155] uppercase">
                <span>Ayo Tirukan Kalimat Ini:</span>
              </div>
              <p className="text-base md:text-lg font-semibold text-[#2D2926]">
                {page.practiceSpeech}
              </p>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  speechEngine.speak(page.practiceSpeech!, settings);
                }}
                className="w-full py-2 px-3 bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926] rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Volume2 className="w-4 h-4" />
                <span>Dengarkan & Tirukan Suara Ini</span>
              </button>
            </div>
          )}

          {page.options && (
            <div className="space-y-2.5">
              {page.interactivePrompt && (
                <div className="text-xs font-bold text-[#4A443F] uppercase">
                  {page.interactivePrompt}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {page.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundEffects.playClick();
                      if (opt.isSafe) {
                        soundEffects.playSuccess();
                        speechEngine.speak(
                          'Benar sekali! ' + opt.feedback,
                          settings
                        );
                      } else {
                        soundEffects.playGentleRetry();
                        speechEngine.speak(
                          'Hati-hati ya! ' + opt.feedback,
                          settings
                        );
                      }
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-2 transition-all active:scale-95 ${
                      opt.isSafe
                        ? 'bg-white hover:bg-[#EBF2EE] border-[#5A7D6C]/40 text-[#2D2926]'
                        : 'bg-white hover:bg-[#FCE8E8] border-[#E66B6B]/40 text-[#2D2926]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm md:text-base">
                        {opt.text}
                      </div>
                      <div className="text-[10px] font-bold text-[#7C7267]">
                        Ketuk untuk memilih
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] text-xs font-bold text-[#7C7267]">
          <span className="text-[11px] font-bold text-[#A3998F]">
            Keselamatan Diri
          </span>
          <span>Halaman {page.pageNumber}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="pocket-book space-y-4 pb-20 animate-fade-in max-w-5xl mx-auto"
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          videoRef.current?.pause();
        }
      }}
    >
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F2EDE4] p-3 md:p-4 rounded-3xl border border-[#E8E2D9] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2D2926] text-white flex items-center justify-center text-xl shadow-inner shrink-0">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/70 text-[#4A443F]">
              <span>{bookBadge}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2D2926] leading-tight">
              {bookTitle}
            </h2>
          </div>
        </div>

        {!isIntroMode && (
          <button
            onClick={handleReadBothPages}
            className="px-4 py-2 bg-[#FAF4E8] hover:bg-white text-[#2D2926] rounded-2xl font-bold text-xs md:text-sm flex items-center gap-2 border border-[#E8E2D9] shadow-sm transition-all"
          >
            <Volume2 className="w-4 h-4 text-[#5A7D6C]" />
            <span>Bacakan 2 Halaman Ini</span>
          </button>
        )}
      </div>

      {/* Page Tabs */}
      <div className="flex items-center justify-center gap-2 flex-wrap px-2">
        <button
          onClick={() => {
            speechEngine.stop();
            setIsIntroMode(true);
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm border ${
            isIntroMode
              ? colorThemes.ribbon
              : 'bg-[#F2EDE4] text-[#7C7267] border-[#E8E2D9]'
          }`}
        >
          Daftar Isi & Video
        </button>
        {spreads.map((spr, idx) => {
          const isSelected = !isIntroMode && idx === currentSpreadIndex;
          return (
            <button
              key={spr.spreadNumber}
              onClick={() => {
                soundEffects.playClick();
                jumpToSpread(idx);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs md:text-sm transition-all border flex items-center gap-1.5 ${
                isSelected
                  ? `${colorThemes.ribbon} shadow-md scale-105 border-transparent`
                  : 'bg-[#F2EDE4] text-[#7C7267] border-[#E8E2D9] hover:bg-[#E8E2D9]'
              }`}
            >
              <span>
                Hal. {spr.leftPage.pageNumber}-{spr.rightPage.pageNumber}
              </span>
              {isSelected && <Sparkles className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>

      {/* Main Book Frame */}
      <div
        className={`relative rounded-[32px] p-3 sm:p-5 md:p-6 shadow-2xl border-4 ${colorThemes.cover}`}
        style={{
          boxShadow:
            '0 20px 35px -10px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isIntroMode ? 'intro' : `spread-${currentSpreadIndex}`}
            initial={{ opacity: 0, rotateY: 8, scale: 0.98 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 rounded-[24px] overflow-hidden bg-[#FAF4E8] border border-[#D9D2C7] relative"
            style={{ minHeight: '480px' }}
          >
            {isIntroMode ? (
              <>
                {/* Intro Left Page: Table of Contents */}
                <section className="p-5 sm:p-7 md:p-9 flex flex-col justify-between bg-gradient-to-r from-[#F6EFE3] via-[#FAF4E8] to-[#F5ECE0] border-b md:border-b-0 md:border-r border-[#E8E2D9]">
                  <div>
                    <p className="text-center text-xs tracking-widest uppercase text-[#7C7267] mb-3">
                      {bookBadge}
                    </p>
                    <h3 className="text-center font-serif text-3xl font-bold text-[#2D2926] tracking-wide mb-8">
                      DAFTAR ISI
                    </h3>
                    <nav
                      aria-label="Daftar isi buku"
                      className="font-serif text-[#2D2926] space-y-3"
                    >
                      <div className="flex items-baseline gap-2 text-sm">
                        <span>Video Simulasi</span>
                        <span className="flex-1 border-b border-dotted border-[#A3998F]" />
                        <span>ii</span>
                      </div>
                      {spreads.flatMap((s, sIdx) =>
                        [s.leftPage, s.rightPage].map((p) => (
                          <button
                            key={p.pageNumber}
                            onClick={() => jumpToSpread(sIdx)}
                            className="w-full flex items-baseline gap-2 text-left text-sm hover:text-[#5A7D6C] focus-visible:outline focus-visible:outline-2 rounded"
                          >
                            <span className="max-w-[85%]">{p.title}</span>
                            <span
                              aria-hidden="true"
                              className="flex-1 min-w-3 border-b border-dotted border-[#A3998F]"
                            />
                            <span className="tabular-nums">{p.pageNumber}</span>
                          </button>
                        ))
                      )}
                    </nav>
                  </div>
                  <div className="text-center text-xs text-[#7C7267] border-t border-[#E8E2D9] pt-4 mt-8">
                    i
                  </div>
                </section>

                {/* Intro Right Page: Simulation Video */}
                <section className="p-5 sm:p-7 md:p-9 flex flex-col justify-between gap-6 bg-[#FAF4E8]">
                  <div className="space-y-5">
                    <p className="text-center text-xs tracking-widest uppercase text-[#7C7267]">
                      Mari mengamati
                    </p>
                    <h3 className="text-center font-serif text-2xl font-bold text-[#2D2926]">
                      Video Simulasi{' '}
                      {videoType === 'lost'
                        ? 'Situasi Tersesat'
                        : 'Situasi Bullying'}
                    </h3>
                    <video
                      key={videoType}
                      ref={videoRef}
                      controls
                      playsInline
                      preload="none"
                      poster={`/videos/simulation-${videoType}-poster.jpg`}
                      className="w-full aspect-video rounded-xl bg-black shadow-sm"
                      onPlay={() => speechEngine.stop()}
                      aria-label={
                        videoType === 'lost'
                          ? 'Video simulasi situasi tersesat'
                          : 'Video simulasi situasi bullying'
                      }
                    >
                      <source
                        src={`/videos/simulation-${videoType}.mp4`}
                        type="video/mp4"
                      />
                      Browser Anda tidak mendukung pemutaran video.
                    </video>
                    <p className="text-center text-sm leading-relaxed text-[#7C7267]">
                      Tonton situasinya, lalu balik halaman untuk mempelajari
                      empat langkah penanganannya.
                    </p>
                  </div>
                  <div className="text-center text-xs text-[#7C7267] border-t border-[#E8E2D9] pt-4">
                    ii
                  </div>
                </section>
              </>
            ) : (
              <>
                {left && renderPage(left, true)}
                {/* Book Spine shadow */}
                <div
                  className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-10"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.12) 100%)',
                    boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
                  }}
                />
                {right && renderPage(right, false)}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation bottom row */}
        <div className="flex items-center justify-between gap-3 pt-4 px-2">
          <button
            onClick={handlePrev}
            disabled={isIntroMode}
            className={`py-3 px-4 sm:px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-2 transition-all ${
              isIntroMode
                ? 'bg-white/10 text-white/40 border-white/20 cursor-not-allowed'
                : 'bg-white hover:bg-[#F2EDE4] text-[#2D2926] border-white shadow-lg active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Buka Halaman Sebelumnya</span>
            <span className="sm:hidden">Sebelumnya</span>
          </button>

          <div className="text-xs font-bold text-white/90 bg-black/25 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Lembar {isIntroMode ? 1 : currentSpreadIndex + 2} / {totalSpreads + 1}
          </div>

          {isIntroMode || currentSpreadIndex < totalSpreads - 1 ? (
            <button
              onClick={handleNext}
              className="py-3 px-4 sm:px-5 bg-white hover:bg-[#F2EDE4] text-[#2D2926] rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-white shadow-lg active:scale-95 transition-all"
            >
              <span className="hidden sm:inline">Buka Halaman Berikutnya</span>
              <span className="sm:hidden">Berikutnya</span>
              <ChevronRight className="w-5 h-5 text-[#5A7D6C]" />
            </button>
          ) : onNextModule ? (
            <button
              onClick={onNextModule}
              className="py-3 px-4 sm:px-6 bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926] rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl active:scale-95 transition-all border-2 border-[#B59155]"
            >
              <span>{nextModuleLabel || 'Lanjut Pembelajaran '}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <div className="py-3 px-4 text-xs font-bold text-white/90">
              Selesai Membaca
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
