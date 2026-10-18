import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, RotateCcw, Award } from 'lucide-react';
import { soundEffects, speechEngine } from '../utils/audio';
import { StoryArt } from './StoryArt';
import { quizQuestions } from '../data/bookData';
import type { AccessibilitySettings } from '../types';

interface QuizViewProps {
  settings: AccessibilitySettings;
  unlockSticker: (id: string) => void;
  goToStickers: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  settings,
  unlockSticker,
  goToStickers,
}) => {
  const [topic, setTopic] = useState<'tersesat' | 'bullying'>('tersesat');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questionsForTopic = quizQuestions.filter((q) => q.category === topic);
  const totalQuestions = questionsForTopic.length;
  const currentQuestion = questionsForTopic[questionIndex] || questionsForTopic[0];

  useEffect(() => {
    speechEngine.stop();
    setSelectedOptionId(null);
    return () => speechEngine.stop();
  }, [questionIndex, topic]);

  const switchTopic = (newTopic: 'tersesat' | 'bullying') => {
    soundEffects.playClick();
    setTopic(newTopic);
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleSelectOption = (opt: any) => {
    const isAlreadyCorrect = currentQuestion.options.find(
      (o) => o.id === selectedOptionId
    )?.isCorrect;
    if (isAlreadyCorrect) return;

    soundEffects.playClick();
    setSelectedOptionId(opt.id);

    if (opt.isCorrect) {
      soundEffects.playSuccess();
      setScore((s) => s + 1);
      speechEngine.speak('Benar sekali! ' + opt.feedbackAudio, settings);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } else {
      soundEffects.playGentleRetry();
      speechEngine.speak('Ayo coba lagi ya. ' + opt.feedbackAudio, settings);
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((q) => q + 1);
    } else {
      setIsFinished(true);
      soundEffects.playSuccess();
      unlockSticker(topic === 'tersesat' ? 'st-lost-safe' : 'st-no-bully');
      unlockSticker('st-master-safety');
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
        });
      } catch {}
      speechEngine.speak(
        `Luar biasa! Kamu telah menyelesaikan 5 soal kuis ${
          topic === 'tersesat' ? 'situasi tersesat' : 'merespons perundungan'
        } dengan hebat!`,
        settings
      );
    }
  };

  const handleRestart = () => {
    speechEngine.stop();
    soundEffects.playClick();
    setQuestionIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-fade-in">
      {/* Quiz Banner */}
      <div className="bg-[#5A7D6C] text-[#FDFBF7] p-5 md:p-6 rounded-3xl shadow-lg border-b-8 border-[#4A6658] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E0B56E] text-[#2D2926] font-black rounded-full text-xs">
            <span>5 SOAL PER TOPIK • SESUAI MODUL BUKU SAKU</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-wide text-[#FDFBF7]">
            Kuis Keselamatan Diri
          </h2>
          <p className="text-[#EBF2EE] text-xs md:text-sm font-bold">
            Perhatikan ilustrasi, lalu pilih jawaban yang paling aman.
          </p>
        </div>

        {!isFinished && (
          <div className="bg-[#FDFBF7]/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#FDFBF7]/30 text-center font-black text-base md:text-lg text-[#FDFBF7] shrink-0">
            Soal {questionIndex + 1} dari {totalQuestions}
          </div>
        )}
      </div>

      {/* Topic Switcher */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => switchTopic('tersesat')}
          className={`flex-1 max-w-xs py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-2 shadow-sm ${
            topic === 'tersesat'
              ? 'bg-[#5A7D6C] text-white border-[#4A6658] shadow-md scale-105'
              : 'bg-[#F2EDE4] hover:bg-[#E8E2D9] text-[#4A443F] border-[#E8E2D9]'
          }`}
        >
          <span className="text-xl">
            <StoryArt scene="lost-1" className="art-icon" />
          </span>
          <span>Topik 1: Tersesat (5 Soal)</span>
        </button>

        <button
          onClick={() => switchTopic('bullying')}
          className={`flex-1 max-w-xs py-3 px-4 rounded-2xl font-black text-xs sm:text-sm border-2 transition-all flex items-center justify-center gap-2 shadow-sm ${
            topic === 'bullying'
              ? 'bg-[#C84F4F] text-white border-[#A83737] shadow-md scale-105'
              : 'bg-[#F2EDE4] hover:bg-[#E8E2D9] text-[#4A443F] border-[#E8E2D9]'
          }`}
        >
          <span className="text-xl">
            <StoryArt scene="bully-2" className="art-icon" />
          </span>
          <span>Topik 2: Perundungan (5 Soal)</span>
        </button>
      </div>

      {isFinished ? (
        /* Results View */
        <div className="bg-[#FAF4E8] rounded-3xl border-2 border-[#E8E2D9] p-8 shadow-xl text-center space-y-6">
          <StoryArt scene="boy" className="art-reward mx-auto" />
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D2926]">
              Luar Biasa! 5 Soal Selesai!
            </h3>
            <p className="text-[#4A443F] text-sm md:text-base font-semibold">
              Kamu telah menyelesaikan 5 soal topik{' '}
              <strong>
                {topic === 'tersesat'
                  ? 'Situasi Tersesat di Komunitas'
                  : 'Merespons Perundungan (Bullying)'}
              </strong>{' '}
              dengan skor:
            </p>
            <div className="text-4xl font-black text-[#5A7D6C]">
              {score} / {totalQuestions} Benar
            </div>
          </div>

          <div className="p-4 bg-white border border-[#E8E2D9] rounded-2xl text-[#4A443F] font-bold text-sm max-w-md mx-auto">
            Terima kasih sudah berlatih. Ingat langkah aman yang sudah kamu pelajari!
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#F2EDE4] text-[#4A443F] border border-[#E8E2D9] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi 5 Soal Topik Ini</span>
            </button>
            <button
              onClick={() => switchTopic(topic === 'tersesat' ? 'bullying' : 'tersesat')}
              className="w-full sm:w-auto px-6 py-3 bg-[#E0B56E] hover:bg-[#d0a35c] text-[#2D2926] rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Coba Topik {topic === 'tersesat' ? 'Perundungan' : 'Tersesat'}</span>
            </button>
            <button
              onClick={goToStickers}
              className="w-full sm:w-auto px-6 py-3 bg-[#5A7D6C] hover:bg-[#4A6658] text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Award className="w-4 h-4 text-[#E0B56E]" />
              <span>Lihat Lencana Kamu</span>
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Question View */
        <div className="bg-[#FAF4E8] rounded-3xl border-2 border-[#E8E2D9] p-6 md:p-8 shadow-md space-y-6">
          <StoryArt
            scene={`${topic === 'tersesat' ? 'lost' : 'bully'}-${Math.min(
              questionIndex + 1,
              4
            )}`}
            className="quiz-art"
          />

          <div className="bg-white p-5 md:p-6 rounded-3xl border border-[#E8E2D9] text-center space-y-3 shadow-sm">
            <div className="inline-flex items-center gap-2 text-[#2D2926] font-black text-lg md:text-xl leading-snug">
              <Sparkles className="w-6 h-6 text-[#E0B56E] shrink-0" />
              <span>{currentQuestion.questionText}</span>
            </div>
            <div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  speechEngine.speak(currentQuestion.audioQuestion, settings);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#5A7D6C] hover:bg-[#4A6658] text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-sm"
              >
                <Volume2 className="w-4 h-4 text-[#E0B56E]" />
                <span>Bacakan Soal Ini</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const hasAlreadyAnsweredCorrect = currentQuestion.options.find(
                (o) => o.id === selectedOptionId
              )?.isCorrect;

              return (
                <button
                  key={opt.id}
                  disabled={!!hasAlreadyAnsweredCorrect}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-5 md:p-6 rounded-3xl border-3 flex flex-col items-center text-center gap-3 transition-all active:scale-95 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-[#EBF2EE] border-[#5A7D6C] shadow-lg scale-102 ring-4 ring-[#5A7D6C]/20'
                        : 'bg-[#FCE8E8] border-[#E66B6B] ring-4 ring-[#E66B6B]/20'
                      : 'bg-white hover:bg-[#F2EDE4] border-[#E8E2D9] shadow-sm'
                  }`}
                >
                  <div className="font-black text-base md:text-lg text-[#2D2926] leading-snug">
                    {opt.text}
                  </div>
                  {isSelected && (
                    <div
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        opt.isCorrect
                          ? 'bg-[#5A7D6C] text-white'
                          : 'bg-[#E66B6B] text-white'
                      }`}
                    >
                      <StoryArt
                        scene={opt.isCorrect ? 'boy' : 'think'}
                        className="feedback-art"
                      />
                      {opt.isCorrect ? 'Jawaban Benar!' : 'Ayo Coba Lagi'}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedOptionId && (
            <div className="text-center pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3.5 bg-[#5A7D6C] hover:bg-[#4A6658] text-white rounded-2xl font-black text-sm md:text-base shadow-md active:scale-95 transition-all"
              >
                {questionIndex < totalQuestions - 1
                  ? 'Lanjut ke Soal Berikutnya '
                  : 'Lihat Hasil 5 Soal '}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
