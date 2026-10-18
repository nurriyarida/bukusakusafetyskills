export type ModuleType =
  | 'home'
  | 'lost-situation'
  | 'bullying-response'
  | 'roleplay-teacher'
  | 'quiz'
  | 'stickers';

export type GenderType = 'boy' | 'girl';
export type CharacterType = 'budi' | 'siti';

export interface ContactInfo {
  teacherName: string;
  teacherPhone: string;
  parentName: string;
  parentPhone: string;
  policePhone: string;
}

export interface AccessibilitySettings {
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  speechRate: number;
  speechPitch: number;
  autoReadText: boolean;
  voiceGender: string;
}

export interface ContentItem {
  type: 'checklist' | 'warning' | 'tip' | 'rule' | 'dialogue';
  heading?: string;
  text: string;
  icon?: string;
}

export interface OptionItem {
  id: string;
  text: string;
  icon?: string;
  isSafe: boolean;
  feedback: string;
}

export interface BookPage {
  pageNumber: number;
  title: string;
  subtitle?: string;
  icon?: string;
  illustrationType?: string;
  illustrationBadge?: string;
  audioText: string;
  contentItems: ContentItem[];
  practiceSpeech?: string;
  interactivePrompt?: string;
  options?: OptionItem[];
}

export interface BookSpread {
  spreadNumber: number;
  leftPage: BookPage;
  rightPage: BookPage;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedbackAudio: string;
}

export interface QuizQuestion {
  id: string;
  category: 'tersesat' | 'bullying';
  questionText: string;
  audioQuestion: string;
  illustration: string;
  options: QuizOption[];
}

export interface StickerItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface RoleplayStep {
  stepIndex: number;
  teacherRole: string;
  teacherAction: string;
  teacherSpeech: string;
  childRole: string;
  childAction: string;
  childSpeech: string;
  options: {
    id: string;
    text: string;
    isSafe: boolean;
    feedback: string;
  }[];
}

export interface RoleplayScenario {
  id: string;
  title: string;
  scenarioDesc: string;
  teacherRole: string;
  childRole: string;
  steps: RoleplayStep[];
}
