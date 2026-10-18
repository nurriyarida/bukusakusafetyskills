import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { LostSituationView } from './components/LostSituationView';
import { BullyingResponseView } from './components/BullyingResponseView';
import { RoleplayTeacherView } from './components/RoleplayTeacherView';
import { QuizView } from './components/QuizView';
import { StickersView } from './components/StickersView';
import { ProfileModal } from './components/modals/ProfileModal';
import { EmergencyModal } from './components/modals/EmergencyModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ParentGuideModal } from './components/modals/ParentGuideModal';
import { defaultContacts, stickers as initialStickers } from './data/bookData';
import { speechEngine } from './utils/audio';
import type {
  ModuleType,
  GenderType,
  ContactInfo,
  AccessibilitySettings,
  StickerItem,
} from './types';

const MODULE_FLOW: ModuleType[] = [
  'home',
  'lost-situation',
  'bullying-response',
  'quiz',
  'stickers',
];

export default function App() {
  const [currentModule, setCurrentModule] = useState<ModuleType>('home');

  const [gender, setGender] = useState<GenderType>(() => {
    try {
      if (localStorage.getItem('talkbook_gender') === 'girl') return 'girl';
    } catch {}
    return 'boy';
  });

  const [studentName, setStudentName] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('talkbook_student_name');
      if (stored && stored.trim()) return stored.trim();
    } catch {}
    return 'Teman Hebat';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [stickersList, setStickersList] = useState<StickerItem[]>(initialStickers);

  const [contacts, setContacts] = useState<ContactInfo>(() => {
    try {
      const stored = localStorage.getItem('talkbook_emergency_contacts');
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultContacts;
  });

  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 'normal',
    highContrast: false,
    speechRate: 1,
    speechPitch: 1,
    autoReadText: false,
    voiceGender: 'default',
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isParentGuideOpen, setIsParentGuideOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    return speechEngine.subscribeState((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, [currentModule]);

  const handleUpdateContacts = (updated: ContactInfo) => {
    setContacts(updated);
    try {
      localStorage.setItem(
        'talkbook_emergency_contacts',
        JSON.stringify(updated)
      );
    } catch {}
  };

  const handleUnlockSticker = (stickerId: string) => {
    setStickersList((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, unlocked: true } : s))
    );
  };

  const currentIndex = MODULE_FLOW.indexOf(currentModule);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < MODULE_FLOW.length - 1;

  const handleGoBack = () => {
    if (canGoBack) {
      setCurrentModule(MODULE_FLOW[currentIndex - 1]);
    }
  };

  const handleGoNext = () => {
    if (canGoNext) {
      setCurrentModule(MODULE_FLOW[currentIndex + 1]);
    }
  };

  const getFontSizeClass = () => {
    if (settings.fontSize === 'large') return 'text-lg text-scale-large';
    if (settings.fontSize === 'xlarge') return 'text-xl text-scale-xlarge';
    return 'text-base';
  };

  const character = gender === 'girl' ? 'siti' : 'budi';

  return (
    <div
      className={`min-h-screen font-sans transition-colors ${
        settings.highContrast
          ? 'bg-black text-amber-300'
          : 'bg-[#FDFBF7] text-[#2D2926]'
      } ${getFontSizeClass()}`}
    >
      <Header
        gender={gender}
        setGender={(g) => setGender(g as GenderType)}
        studentName={studentName}
        openProfileModal={() => setIsProfileOpen(true)}
        character={character}
        setCharacter={(c) =>
          setGender(c === 'siti' || c === 'girl' ? 'girl' : 'boy')
        }
        isSpeaking={isSpeaking}
        settings={settings}
        openSettings={() => setIsSettingsOpen(true)}
        openParentGuide={() => setIsParentGuideOpen(true)}
        openEmergency={() => setIsEmergencyOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        {currentModule === 'home' && (
          <HomeView
            onSelectModule={setCurrentModule}
            gender={gender}
            studentName={studentName}
            openProfileModal={() => setIsProfileOpen(true)}
            settings={settings}
            contacts={contacts}
            openEmergency={() => setIsEmergencyOpen(true)}
          />
        )}

        {currentModule === 'lost-situation' && (
          <LostSituationView
            gender={gender}
            character={character}
            settings={settings}
            contacts={contacts}
            openEmergency={() => setIsEmergencyOpen(true)}
            goToNextModule={() => setCurrentModule('bullying-response')}
            goToRoleplay={() => setCurrentModule('roleplay-teacher')}
          />
        )}

        {currentModule === 'bullying-response' && (
          <BullyingResponseView
            gender={gender}
            character={character}
            settings={settings}
            contacts={contacts}
            openEmergency={() => setIsEmergencyOpen(true)}
            goToNextModule={() => setCurrentModule('quiz')}
            goToQuiz={() => setCurrentModule('quiz')}
            goToRoleplay={() => setCurrentModule('roleplay-teacher')}
          />
        )}

        {currentModule === 'roleplay-teacher' && (
          <RoleplayTeacherView
            character={character}
            settings={settings}
            contacts={contacts}
            openEmergency={() => setIsEmergencyOpen(true)}
            unlockSticker={handleUnlockSticker}
            goToQuiz={() => setCurrentModule('quiz')}
          />
        )}

        {currentModule === 'quiz' && (
          <QuizView
            settings={settings}
            unlockSticker={handleUnlockSticker}
            goToStickers={() => setCurrentModule('stickers')}
          />
        )}

        {currentModule === 'stickers' && (
          <StickersView stickers={stickersList} />
        )}
      </main>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        gender={gender}
        setGender={setGender}
        studentName={studentName}
        setStudentName={setStudentName}
        settings={settings}
      />

      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        gender={gender}
        studentName={studentName}
        character={character}
        settings={settings}
        contacts={contacts}
        onUpdateContacts={handleUpdateContacts}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      <ParentGuideModal
        isOpen={isParentGuideOpen}
        onClose={() => setIsParentGuideOpen(false)}
      />

      <BottomNav
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        onGoBack={handleGoBack}
        onGoNext={handleGoNext}
        openEmergency={() => setIsEmergencyOpen(true)}
        settings={settings}
      />
    </div>
  );
}
