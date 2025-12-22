
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import type { TarotCardData } from '@/lib/cards';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type TarotCardProps = {
  card: TarotCardData;
  isFlipped: boolean;
  onFlip: () => void;
  isSelected?: boolean;
  canFlip: boolean;
};

export function TarotCard({ card, isFlipped, onFlip, isSelected, canFlip }: TarotCardProps) {
  const cardBack = PlaceHolderImages.find((img) => img.id === 'card-back');

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleCardClick = () => {
    if (canFlip && !isFlipped) {
      onFlip();
    }
  };

  return (
    <motion.div
      className={cn(
        "group w-[150px] h-[250px] md:w-[180px] md:h-[300px] [perspective:1000px]",
        canFlip && !isFlipped && "cursor-pointer"
      )}
      onClick={handleCardClick}
      onMouseMove={canFlip ? onMouseMove : undefined}
      onMouseLeave={canFlip ? onMouseLeave : undefined}
      role="button"
      aria-label={`Select card: ${card.name}`}
      aria-disabled={!canFlip || isFlipped}
      whileHover={canFlip && !isFlipped ? { scale: 1.05, z: 50 } : {}}
      style={canFlip && !isFlipped ? {
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div
        className={cn(
          'relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d]',
          isFlipped ? '[transform:rotateY(180deg)]' : '',
          isSelected ? 'shadow-2xl shadow-primary/50 scale-105' : 'shadow-lg shadow-black/20'
        )}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg overflow-hidden border-2 border-accent/20">
          <Card className="w-full h-full overflow-hidden border-0 bg-transparent">
            {cardBack && (
              <img
                src={cardBack.imageUrl}
                alt={cardBack.description}
                className="object-cover w-full h-full"
              />
            )}
            {/* Holographic Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay" />
          </Card>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden">
          <Card className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-background via-secondary to-background border-2 border-accent overflow-hidden">
            <div className="relative w-full flex-grow mt-4">
              <img
                src={card.image.src}
                alt={card.name}
                className="object-contain w-full h-full"
              />
            </div>
            <p className="font-headline text-sm font-semibold text-primary py-2 whitespace-nowrap">
              {card.name}
            </p>
            {/* Holographic Sheen Overlay for Front */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-30 pointer-events-none" />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

