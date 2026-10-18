import React, { useState } from 'react';
import { PocketBookView } from './PocketBookView';
import { bullyingModule } from '../data/bookData';
import type { AccessibilitySettings, ContactInfo } from '../types';

interface BullyingResponseViewProps {
  gender?: string;
  character?: string;
  settings: AccessibilitySettings;
  contacts?: ContactInfo;
  openEmergency?: () => void;
  goToNextModule?: () => void;
  goToQuiz?: () => void;
  goToRoleplay?: () => void;
}

export const BullyingResponseView: React.FC<BullyingResponseViewProps> = ({
  settings,
  goToNextModule,
  goToQuiz,
  goToRoleplay,
}) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const next = goToNextModule || goToQuiz || goToRoleplay;

  return (
    <div className="space-y-6">
      <PocketBookView
        bookTitle="Buku 2: 4 Langkah Respon Perundungan"
        bookBadge="Buku Saku 2"
        themeColor="terracotta"
        spreads={bullyingModule}
        currentSpreadIndex={currentSpreadIndex}
        onSpreadChange={setCurrentSpreadIndex}
        settings={settings}
        onNextModule={next}
        nextModuleLabel="Lanjut ke Kuis Evaluasi "
      />
    </div>
  );
};
