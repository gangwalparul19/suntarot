'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { majorArcana, minorArcana } from '@/lib/cards';
import { Card } from '@/components/ui/card';

// Combine decks and take a subset for display to performance
const displayCards = [...majorArcana, ...minorArcana.slice(0, 10)];

export function DeckShowcase() {
  return (
    <div className="w-full py-12 overflow-hidden bg-background/50 border-y border-border/40 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />

      <div className="flex gap-6 animate-scroll hover:pause-scroll w-max">
        {/* Duplicate list for seamless loop */}
        {[...displayCards, ...displayCards].map((card, idx) => (
          <div
            key={`${card.name}-${idx}`}
            className="relative group w-[100px] h-[166px] md:w-[160px] md:h-[266px] flex-shrink-0"
          >
            <Card className="w-full h-full overflow-hidden border border-border/50 shadow-md group-hover:shadow-primary/30 group-hover:border-primary/50 transition-all duration-300">
              <img
                src={card.image.src}
                alt={card.name}
                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                loading="eager"
              />
            </Card>
            <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[10px] md:text-xs text-center font-medium text-white truncate">
                {card.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .hover\\:pause-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
