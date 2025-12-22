'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { majorArcana, TarotCardData } from '@/lib/cards';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function LearnPage() {
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);

  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div className="container py-12 px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-4">
          Explore the Major Arcana
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the meanings and symbolism behind the 22 cards of the Major Arcana, which represent life's karmic and spiritual lessons.
        </p>
      </motion.div>

      <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6 rounded-xl p-4 md:p-8 border border-white/5 bg-black/20 overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -inset-px transition duration-300 z-0"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(212, 169, 93, 0.1), transparent 40%)`
          }}
        />
        {majorArcana.map((card) => (
          <motion.div
            key={card.name}
            variants={fadeInUp}
            whileHover={{ y: -5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="cursor-pointer relative z-10"
            onClick={() => setSelectedCard(card)}
          >
            <Card className="h-full overflow-hidden bg-card/50 hover:shadow-primary/20 transition-shadow duration-300 group rounded-lg md:rounded-xl border-border/50">
              <CardContent className="p-0 flex flex-col items-center justify-center relative aspect-[9/15]">
                <img
                  src={card.image.src}
                  alt={card.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-110 w-full h-full"
                />
                <div className="absolute bottom-0 w-full p-1 md:p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <p className="font-headline text-[10px] md:text-sm font-semibold text-white text-center whitespace-nowrap overflow-hidden text-ellipsis px-1">
                    {card.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedCard} onOpenChange={(isOpen) => !isOpen && setSelectedCard(null)}>
        <DialogContent className="max-w-sm md:max-w-4xl bg-card/95 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10 p-0 overflow-hidden">
          <button
            onClick={() => setSelectedCard(null)}
            className="absolute right-4 top-4 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors z-50 shadow-lg"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>

          {selectedCard && (
            <div className="flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[600px]">
              {/* Image Section - Left on desktop, Top on mobile */}
              <div className="relative w-full md:w-2/5 aspect-[3/4] md:aspect-auto bg-black/40">
                <img
                  src={selectedCard.image.src}
                  alt={selectedCard.name}
                  className="object-contain w-full h-full p-6 md:p-8"
                />
                {/* Background blur effect for image */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 -z-10"
                  style={{ backgroundImage: `url(${selectedCard.image.src})` }}
                />
              </div>

              {/* Content Section - Right on desktop, Bottom on mobile */}
              <div className="flex-1 p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
                <DialogHeader className="mb-4 md:mb-6 text-left">
                  <DialogTitle className="font-headline text-3xl md:text-4xl text-primary mb-2">{selectedCard.name}</DialogTitle>
                  <div className="h-1 w-20 bg-primary/30 rounded-full" />
                </DialogHeader>
                <DialogDescription className="text-muted-foreground text-base md:text-lg leading-relaxed md:leading-loose text-left">
                  {selectedCard.meaning}
                </DialogDescription>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
