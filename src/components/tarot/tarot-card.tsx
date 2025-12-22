
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import type { TarotCardData } from '@/lib/cards';
import { motion } from 'framer-motion';

type TarotCardProps = {
  card: TarotCardData;
  isFlipped: boolean;
  onFlip: () => void;
  isSelected?: boolean;
  canFlip: boolean;
};

export function TarotCard({ card, isFlipped, onFlip, isSelected, canFlip }: TarotCardProps) {
  const cardBack = PlaceHolderImages.find((img) => img.id === 'card-back');

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
      role="button"
      aria-label={`Select card: ${card.name}`}
      aria-disabled={!canFlip || isFlipped}
      whileHover={canFlip && !isFlipped ? { y: -10, scale: 1.05 } : {}}
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
        <div className="absolute w-full h-full [backface-visibility:hidden] rounded-lg overflow-hidden">
          <Card className="w-full h-full overflow-hidden border-2 border-accent/50">
            {cardBack && (
              <Image
                src={cardBack.imageUrl}
                alt={cardBack.description}
                data-ai-hint={cardBack.imageHint}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 150px, 180px"
              />
            )}
          </Card>
        </div>

        {/* Card Front */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-lg overflow-hidden">
          <Card className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-br from-background via-secondary to-background border-2 border-accent overflow-hidden">
            <div className="relative w-full flex-grow mt-4">
              <Image
                src={card.image.src}
                alt={card.name}
                fill
                data-ai-hint={card.image.hint}
                className="object-contain"
                sizes="(max-width: 768px) 150px, 180px"
              />
            </div>
            <p className="font-headline text-sm font-semibold text-primary py-2 whitespace-nowrap">
              {card.name}
            </p>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

    