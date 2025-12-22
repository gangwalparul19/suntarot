
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { majorArcana, TarotCardData } from '@/lib/cards';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function LearnPage() {
  const [selectedCard, setSelectedCard] = useState<TarotCardData | null>(null);

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

      <motion.div 
        initial="initial"
        animate="animate"
        variants={{
          animate: { transition: { staggerChildren: 0.05 }}
        }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
      >
        {majorArcana.map((card, index) => (
          <motion.div
            key={card.name}
            variants={fadeInUp}
            whileHover={{ y: -5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="cursor-pointer"
            onClick={() => setSelectedCard(card)}
          >
            <Card className="h-full overflow-hidden bg-card/50 hover:shadow-primary/20 transition-shadow duration-300 group">
              <CardContent className="p-0 flex flex-col items-center justify-center relative aspect-[9/15]">
                <Image
                  src={card.image.src}
                  alt={card.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="font-headline text-sm font-semibold text-white text-center whitespace-nowrap">
                    {card.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!selectedCard} onOpenChange={(isOpen) => !isOpen && setSelectedCard(null)}>
        <DialogContent className="max-w-md bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/10">
          {selectedCard && (
            <>
              <DialogHeader>
                <div className="relative w-full aspect-[9/15] mb-4 rounded-lg overflow-hidden">
                    <Image
                        src={selectedCard.image.src}
                        alt={selectedCard.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <DialogTitle className="font-headline text-3xl text-primary text-center">{selectedCard.name}</DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-center text-muted-foreground text-base leading-relaxed px-4 pb-4">
                {selectedCard.meaning}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
