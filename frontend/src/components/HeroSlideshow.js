import React, { useState, useEffect, useCallback } from 'react';

const SLIDE_DURATION_MS = 4500;
const NUM_SLIDES = 8;
const BASE = process.env.PUBLIC_URL || '';

/**
 * Hero background slideshow: civic images with smooth crossfade, zoom-out.
 * Order: sanitation → water → electrical → roads → traffic → health → parks → housing.
 * Container shows first image as base layer so loop 8→1 never shows blue or pause.
 */
const HeroSlideshow = ({ className = '', index: controlledIndex = 0, onIndexChange }) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const index = onIndexChange != null ? controlledIndex : internalIndex;
  const setIndex = onIndexChange != null ? onIndexChange : setInternalIndex;
  const intervalRef = React.useRef(null);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % NUM_SLIDES);
  }, [setIndex]);

  useEffect(() => {
    intervalRef.current = setInterval(goNext, SLIDE_DURATION_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext]);

  const firstImageUrl = `${BASE}/civic-images/1.jpg`;

  return (
    <div
      className={`hero-slideshow ${className}`}
      aria-hidden
      style={{
        backgroundImage: `url(${firstImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <style>{`
        .hero-slideshow {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #0f172a;
        }
        .hero-slideshow__slide {
          position: absolute;
          inset: 0;
          background-color: transparent;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transform: scale(1);
          transition: opacity 2s ease-in-out;
          pointer-events: none;
          will-change: opacity;
        }
        .hero-slideshow__slide.is-active {
          opacity: 1;
          z-index: 1;
          transition: opacity 2s ease-in-out;
          animation: hero-slide-zoom-out 2s ease-out forwards;
        }
        .hero-slideshow__slide:not(.is-active) {
          z-index: 0;
        }
        @keyframes hero-slide-zoom-out {
          from { transform: scale(1.06); }
          to { transform: scale(1); }
        }
      `}</style>
      {Array.from({ length: NUM_SLIDES }, (_, i) => (
        <div
          key={i}
          className={`hero-slideshow__slide ${i === index ? 'is-active' : ''}`}
          style={{
            backgroundImage: `url(${BASE}/civic-images/${i + 1}.jpg)`,
          }}
        />
      ))}
    </div>
  );
};

export default HeroSlideshow;
