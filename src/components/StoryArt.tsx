import React from 'react';
import { Rb, _E } from '../data/bookData';

interface StoryArtProps {
  scene?: string;
  className?: string;
}

export const StoryArt: React.FC<StoryArtProps> = ({
  scene = 'boy',
  className = '',
}) => {
  const [sheet, x, y, width, height, label] = Rb[scene] || Rb.boy;
  const sheetWidth = sheet === 'book' ? 1536 : 1024;

  return (
    <span
      className={`story-art ${className}`}
      role="img"
      aria-label={label}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <img
        src={`/references/${sheet}.png`}
        alt=""
        draggable={false}
        style={{
          width: `${(sheetWidth / width) * 100}%`,
          maxWidth: 'none',
          left: `${(-x / width) * 100}%`,
          top: `${(-y / height) * 100}%`,
        }}
      />
    </span>
  );
};

interface StorySceneProps {
  type: string;
  className?: string;
  settings?: any;
}

export const StoryScene: React.FC<StorySceneProps> = ({
  type,
  className = '',
}) => {
  const sceneData = _E[type];
  if (!sceneData) return null;

  if (type.endsWith('summary')) {
    const isLost = type.startsWith('lost');
    return (
      <figure
        className={`story-scene rounded-3xl overflow-hidden border border-[#D9D2C7] bg-[#FFFCF5] ${className}`}
      >
        <img
          src={`/references/${isLost ? 'lost' : 'bullying'}.png`}
          alt={
            isLost
              ? 'Poster empat langkah meminta pertolongan saat tersesat'
              : 'Poster empat langkah merespons perundungan'
          }
          className="w-full h-auto"
        />
      </figure>
    );
  }

  return (
    <figure
      className={`story-scene rounded-3xl overflow-hidden border border-[#D9D2C7] bg-[#FFFCF5] ${className}`}
    >
      <StoryArt scene={type} className="w-full" />
    </figure>
  );
};
