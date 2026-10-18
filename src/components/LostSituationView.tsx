import React, { useState } from 'react';
import { PocketBookView } from './PocketBookView';
import { lostModule } from '../data/bookData';
import type { AccessibilitySettings, ContactInfo } from '../types';

interface LostSituationViewProps {
  gender?: string;
  character?: string;
  settings: AccessibilitySettings;
  contacts?: ContactInfo;
  openEmergency?: () => void;
  goToNextModule?: () => void;
  goToRoleplay?: () => void;
}

export const LostSituationView: React.FC<LostSituationViewProps> = ({
  settings,
  goToNextModule,
  goToRoleplay,
}) => {
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const next = goToNextModule || goToRoleplay;

  return (
    <div className="space-y-6">
      <PocketBookView
        bookTitle="Buku 1: 4 Langkah Saat Tersesat"
        bookBadge="Buku Saku 1"
        themeColor="sage"
        spreads={lostModule}
        currentSpreadIndex={currentSpreadIndex}
        onSpreadChange={setCurrentSpreadIndex}
        settings={settings}
        onNextModule={next}
        nextModuleLabel="Lanjut ke Buku 2: Respon Bullying "
      />
    </div>
  );
};
