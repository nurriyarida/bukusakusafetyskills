import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Info,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import { soundEffects, speechEngine } from '../utils/audio';
import { StoryArt } from './StoryArt';
import { roleplayScenarios } from '../data/bookData';
import type { AccessibilitySettings, ContactInfo } from '../types';

interface RoleplayTeacherViewProps {
  character: string;
  settings: AccessibilitySettings;
  contacts?: ContactInfo;
  openEmergency?: () => void;
  unlockSticker: (id: string) => void;
  goToQuiz: () => void;
}

export const RoleplayTeacherView: React.FC<RoleplayTeacherViewProps> = ({
  character,
  settings,
  unlockSticker,
  goToQuiz,
}) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const scenario = roleplayScenarios[scenarioIndex] as any;

  useEffect(() => {
    speechEngine.stop();
    return () => speechEngine.stop();
  }, [scenarioIndex, stepIndex]);

  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[stepIndex];
  const childName = character === 'budi' ? 'Budi' : 'Siti';

  const handleNextStep = () => {
    soundEffects.playClick();
    if (stepIndex < totalSteps - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      handleFinishRoleplay();
    }
  };

  const handlePrevStep = () => {
    soundEffects.playClick();
    if (stepIndex > 0) {
      setStepIndex((s) => s - 1);
    }
  };

  const toggleChecklist = (cIdx: number) => {
    soundEffects.playClick();
    const key = `${scenario.id}-${cIdx}`;
    setCheckedCriteria((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinishRoleplay = () => {
    soundEffects.playSuccess();
    setIsCompleted(true);
    unlockSticker('st-roleplay-star');
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}
    speechEngine.speak(
      `Hebat sekali! Kamu dan Guru berhasil menyelesaikan bermain peran ${scenario.title}!`,
      settings
    );
  };

  const handleRestart = () => {
    soundEffects.playClick();
    setStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in max-w-5xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#F2EDE4] p-4 rounded-3xl border border-[#E8E2D9] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B59155] text-white flex items-center justify-center text-2xl shadow-inner shrink-0">
            <StoryArt scene="bully-4" className="art-icon" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/70 text-[#4A443F]">
              <span>ARAHAN PRAKTIK GURU & MURID</span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-[#2D2926] leading-tight">
              Bermain Peran Bersama Guru
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {roleplayScenarios.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                soundEffects.playClick();
                setScenarioIndex(idx);
                setStepIndex(0);
                setIsCompleted(false);
              }}
              className={`px-3 py-2 rounded-xl font-black text-xs md:text-sm transition-all border flex items-center gap-1.5 ${
                scenarioIndex === idx
                  ? 'bg-[#2D2926] text-[#E0B56E] border-transparent shadow-sm'
                  : 'bg-[#FAF4E8] text-[#7C7267] border-[#E8E2D9] hover:bg-white'
              }`}
            >
              <StoryArt
                scene={idx === 0 ? 'lost-2' : 'bully-4'}
                className="art-icon"
              />
              <span>{idx === 0 ? 'Materi 1: Tersesat' : 'Materi 2: Diganggu'}</span>
            </button>
          ))}
        </div>
      </div>

      <StoryArt
        scene={`${scenarioIndex === 0 ? 'lost' : 'bully'}-${stepIndex + 1}`}
        className="roleplay-art"
      />

      <div className="bg-[#FAF4E8] p-3.5 md:p-4 rounded-2xl border border-[#E8E2D9] flex items-center justify-between text-xs md:text-sm font-semibold text-[#4A443F]">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#B59155] shrink-0" />
          <span>{scenario.scenarioDesc}</span>
        </div>
        <div className="hidden sm:block text-xs font-black text-[#7C7267] shrink-0">
          Arahan Langkah {stepIndex + 1} dari {totalSteps}
        </div>
      </div>

      {/* Book Container */}
      <div
        className="relative rounded-[32px] p-3 sm:p-5 md:p-6 shadow-2xl border-4 bg-[#B59155] border-[#8C6F3D]"
        style={{
          boxShadow:
            '0 20px 35px -10px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenarioIndex}-${stepIndex}`}
            initial={{ opacity: 0, rotateY: 8, scale: 0.98 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 rounded-[24px] overflow-hidden bg-[#FAF4E8] border border-[#D9D2C7] relative"
            style={{ minHeight: '480px' }}
          >
            {/* Left Page: Guru */}
            <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-5 relative bg-gradient-to-r from-[#F6EFE3] via-[#FAF4E8] to-[#F5ECE0] border-b md:border-b-0 md:border-r border-[#E8E2D9]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-[#E8E2D9]">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">
                      <StoryArt scene="bully-4" className="art-icon" />
                    </span>
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#5A7D6C] tracking-wider">
                        HALAMAN GURU
                      </span>
                      <h3 className="text-lg md:text-xl font-black text-[#2D2926]">
                        {scenario.teacherRole}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechEngine.speak(
                        `Kalimat Guru: ${currentStep.teacherSpeech}`,
                        settings
                      );
                    }}
                    className="p-2 bg-[#EBF2EE] hover:bg-[#d8e5dd] text-[#5A7D6C] rounded-xl transition-colors shrink-0"
                    title="Dengarkan Suara Guru"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D9] space-y-1">
                  <div className="text-[11px] font-black uppercase text-[#7C7267]">
                    Aksi yang Dilakukan Guru:
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#2D2926]">
                    {currentStep.teacherAction}
                  </p>
                </div>

                <div className="p-4 bg-[#EBF2EE] rounded-2xl border-2 border-[#5A7D6C]/40 space-y-1.5 shadow-sm">
                  <div className="text-xs font-black uppercase text-[#5A7D6C]">
                    Dialog Guru untuk Diucapkan:
                  </div>
                  <p className="text-sm md:text-base font-black text-[#2D2926] italic">
                    "{currentStep.teacherSpeech}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] text-xs font-black text-[#7C7267]">
                <span> Arahan untuk Guru</span>
                <span>Langkah Praktik {currentStep.stepIndex}</span>
              </div>
            </div>

            {/* Spine shadow */}
            <div
              className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-10"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0.12) 100%)',
                boxShadow: 'inset 0 0 8px rgba(0,0,0,0.15)',
              }}
            />

            {/* Right Page: Murid */}
            <div className="p-5 sm:p-6 md:p-7 flex flex-col justify-between gap-5 relative bg-gradient-to-l from-[#F6EFE3] via-[#FAF4E8] to-[#F5ECE0]">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-[#E8E2D9]">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">
                      <StoryArt scene="boy" className="art-icon" />
                    </span>
                    <div>
                      <span className="text-[11px] font-black uppercase text-[#E66B6B] tracking-wider">
                        HALAMAN MURID ({childName})
                      </span>
                      <h3 className="text-lg md:text-xl font-black text-[#2D2926]">
                        {scenario.studentRole}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechEngine.speak(
                        `Kalimat Murid: ${currentStep.studentSpeech}`,
                        settings
                      );
                    }}
                    className="p-2 bg-[#FCE8E8] hover:bg-[#fad3d3] text-[#D45959] rounded-xl transition-colors shrink-0"
                    title="Dengarkan Suara Murid"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D9] space-y-1">
                  <div className="text-[11px] font-black uppercase text-[#7C7267]">
                    Gerakan & Aksi {childName}:
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#2D2926]">
                    {currentStep.studentAction}
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border-2 border-[#E0B56E] space-y-2 shadow-sm">
                  <div className="text-xs font-black uppercase text-[#B59155] flex items-center justify-between">
                    <span>Ayo Ucapkan Kalimat Ini:</span>
                    <span> Suara Murid</span>
                  </div>
                  <p className="text-base md:text-lg font-black text-[#2D2926] italic">
                    "{currentStep.studentSpeech}"
                  </p>
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechEngine.speak(currentStep.audioSample, settings);
                    }}
                    className="w-full py-2 px-3 bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926] rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Suara Contoh & Tirukan</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] text-xs font-black text-[#7C7267]">
                <span>Langkah Praktik {currentStep.stepIndex}</span>
                <span>Latihan Mandiri Murid </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4 px-2">
          <button
            onClick={handlePrevStep}
            disabled={stepIndex === 0}
            className={`py-3 px-4 sm:px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 transition-all ${
              stepIndex === 0
                ? 'bg-white/10 text-white/40 border-white/20 cursor-not-allowed'
                : 'bg-white hover:bg-[#F2EDE4] text-[#2D2926] border-white shadow-lg active:scale-95'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Langkah Sebelumnya</span>
            <span className="sm:hidden">Sebelumnya</span>
          </button>

          <div className="text-xs font-black text-white/90 bg-black/25 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Langkah {stepIndex + 1} / {totalSteps}
          </div>

          {stepIndex < totalSteps - 1 ? (
            <button
              onClick={handleNextStep}
              className="py-3 px-4 sm:px-5 bg-white hover:bg-[#F2EDE4] text-[#2D2926] rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 border-2 border-white shadow-lg active:scale-95 transition-all"
            >
              <span className="hidden sm:inline">Lanjut Langkah Berikutnya</span>
              <span className="sm:hidden">Berikutnya</span>
              <ChevronRight className="w-5 h-5 text-[#5A7D6C]" />
            </button>
          ) : (
            <button
              onClick={handleFinishRoleplay}
              className="py-3 px-4 sm:px-6 bg-[#2D2926] hover:bg-black text-[#E0B56E] rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl active:scale-95 transition-all border-2 border-[#E0B56E]"
            >
              <span>Selesai Bermain Peran </span>
            </button>
          )}
        </div>
      </div>

      {/* Completion Card */}
      {isCompleted && (
        <div className="p-6 bg-[#EBF2EE] rounded-3xl border-2 border-[#5A7D6C] text-center space-y-4 shadow-lg animate-fade-in">
          <div className="text-5xl">
            <StoryArt scene="boy" className="art-icon" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-[#5A7D6C]">
              Luar Biasa! Simulasi Berhasil Dilakukan!
            </h3>
            <p className="text-sm font-bold text-[#4A443F]">
              {childName} dan Guru telah memperagakan peran dengan sangat berani
              dan mandiri!
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#5A7D6C]/30 text-left max-w-lg mx-auto space-y-2">
            <div className="text-xs font-black uppercase text-[#5A7D6C]">
              Checklist Observasi Guru:
            </div>
            {scenario.criteriaChecklist?.map((crit: string, cIdx: number) => {
              const checked = !!checkedCriteria[`${scenario.id}-${cIdx}`];
              return (
                <button
                  key={cIdx}
                  onClick={() => toggleChecklist(cIdx)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-[#F2EDE4] rounded-xl text-xs md:text-sm font-semibold text-[#2D2926] text-left transition-colors"
                >
                  <CheckCircle
                    className={`w-5 h-5 shrink-0 ${
                      checked ? 'text-[#5A7D6C]' : 'text-[#A3998F]'
                    }`}
                  />
                  <span className={checked ? 'line-through text-[#7C7267]' : ''}>
                    {crit}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 bg-white text-[#2D2926] rounded-2xl font-black text-xs md:text-sm border border-[#E8E2D9] hover:bg-[#F2EDE4] transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Peran</span>
            </button>
            <button
              onClick={goToQuiz}
              className="px-5 py-2.5 bg-[#5A7D6C] text-white rounded-2xl font-black text-xs md:text-sm shadow-md hover:bg-[#4A6658] transition-all flex items-center gap-2"
            >
              <span>Ayo Coba Kuis Latihan </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
