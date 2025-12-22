
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { personalizedTarotReading } from '@/ai/flows/personalized-tarot-reading';
import { majorArcana, TarotCardData } from '@/lib/cards';
import { TarotCard } from './tarot-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReadingStep = 'selecting' | 'asking' | 'reading' | 'result';

// Animation for the reading text
const AnimatedText = ({ text }: { text: string }) => {
  const words = text.split(' ');
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.015, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className="text-left text-lg leading-relaxed whitespace-pre-wrap font-body text-foreground/90"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} className="mr-1" key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

import { ShareReading } from './share-reading';

export function InteractiveTarotReading() {
  const [step, setStep] = useState<ReadingStep>('selecting');
  const [selectedCards, setSelectedCards] = useState<TarotCardData[]>([]);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [question, setQuestion] = useState('');
  const [readingStyle, setReadingStyle] = useState<"empathetic" | "direct" | "mystical" | "practical">("empathetic");
  const [reading, setReading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledDeck, setShuffledDeck] = useState<TarotCardData[]>([]);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    shuffleDeck();
  }, []);

  const shuffleDeck = () => {
    setShuffledDeck([...majorArcana].sort(() => Math.random() - 0.5));
  }

  const handleSelectCard = (card: TarotCardData, index: number) => {
    if (selectedCards.length < 3 && !selectedCards.find(c => c.name === card.name)) {
      setSelectedCards((prev) => [...prev, card]);
      setFlipped((prev) => ({ ...prev, [index]: true }));
    }
  };

  useEffect(() => {
    if (selectedCards.length === 3) {
      const timer = setTimeout(() => setStep('asking'), 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedCards]);

  const getReading = async () => {
    if (selectedCards.length !== 3 || !question) return;
    setIsLoading(true);
    setStep('reading');
    try {
      const result = await personalizedTarotReading({
        cardSelections: selectedCards.map(c => c.name),
        userContext: question,
        style: readingStyle,
      });
      setReading(result.reading);
      setStep('result');
      saveReading(result.reading);
    } catch (error) {
      console.error('Error getting tarot reading:', error);
      setReading('Apologies, the spirits are unclear at this moment. Please try again later.');
      setStep('result');
    } finally {
      setIsLoading(false);
    }
  };

  const saveReading = (currentReading: string) => {
    if (!user || !firestore) {
      // Save to local storage for anonymous users
      try {
        const newReading = {
          id: new Date().toISOString(),
          date: new Date().toISOString(),
          question: question,
          cards: selectedCards.map(c => c.name),
          reading: currentReading,
        };

        const existingReadings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        const updatedReadings = [newReading, ...existingReadings];
        localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));

        toast({
          title: "Reading Saved!",
          description: "Your reading has been saved locally. Log in to save it to your account.",
        });

      } catch (error) {
        console.error('Failed to save reading to local storage', error);
        toast({
          title: "Couldn't Save Reading",
          description: "Your reading could not be saved.",
          variant: "destructive"
        });
      }
      return;
    }

    // Save to Firestore for logged-in users
    const readingsColRef = collection(firestore, `users/${user.uid}/readings`);
    const newReading = {
      userId: user.uid,
      date: new Date().toISOString(),
      question: question,
      cards: selectedCards.map(c => c.name),
      reading: currentReading,
    };

    addDocumentNonBlocking(readingsColRef, newReading)
      .then(() => {
        toast({
          title: "Reading Saved!",
          description: "Your reading has been saved to your account.",
        });
      })
      .catch(error => {
        console.error('Failed to save reading to firestore', error);
        toast({
          title: "Couldn't Save Reading",
          description: "Your reading could not be saved to your account.",
          variant: "destructive"
        });
      })
  };

  const handleReset = () => {
    setStep('selecting');
    setSelectedCards([]);
    setFlipped({});
    setQuestion('');
    setReading('');
    shuffleDeck();
  };

  const canFlipCard = selectedCards.length < 3;

  return (
    <div className="w-full max-w-5xl">
      <AnimatePresence mode="wait">
        {step === 'selecting' && (
          <motion.div
            key="selecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {shuffledDeck.slice(0, 12).map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
                >
                  <TarotCard
                    card={card}
                    isFlipped={!!flipped[index]}
                    isSelected={!!selectedCards.find(c => c.name === card.name)}
                    onFlip={() => handleSelectCard(card, index)}
                    canFlip={canFlipCard}
                  />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-muted-foreground">
                {selectedCards.length} / 3 cards selected
              </p>
            </div>
          </motion.div>
        )}

        {step === 'asking' && (
          <motion.div
            key="asking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <h2 className="font-headline text-2xl md:text-3xl text-primary">Provide Context for Your Reading</h2>
            <div className="flex justify-center gap-4 -mb-2">
              {selectedCards.map((card) => (
                <motion.div key={card.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Image src={card.image.src} alt={card.name} width={60} height={100} className="rounded-md shadow-lg" />
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground">What question or situation is on your mind?</p>
            <div className="w-full max-w-lg space-y-4">
              <Textarea
                placeholder="e.g., I'm at a career crossroads and need guidance..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[120px] text-base bg-background/50"
                aria-label="Your question or context"
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Reading Style</label>
                <Select value={readingStyle} onValueChange={(val: any) => setReadingStyle(val)}>
                  <SelectTrigger className="w-full bg-background/50">
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empathetic">Empathetic (Warm & Comforting)</SelectItem>
                    <SelectItem value="direct">Direct (Straightforward Advice)</SelectItem>
                    <SelectItem value="mystical">Mystical (Esoteric & Poetic)</SelectItem>
                    <SelectItem value="practical">Practical (Grounded & Realistic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={getReading} disabled={!question || isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2 h-4 w-4" />Get My Reading</>}
              </Button>
            </div>
          </motion.div>
        )}

        {(step === 'reading' || step === 'result') && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col items-center"
          >
            <Card className="w-full max-w-3xl bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/10">
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary text-center flex items-center justify-center gap-2">
                  <Sparkles /> Your Reading <Sparkles />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 min-h-[200px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Consulting the cosmos...</p>
                  </div>
                ) : (
                  <AnimatedText text={reading} />
                )}

                {!isLoading && reading && (
                  <ShareReading reading={reading} question={question} />
                )}

                <div className="flex justify-center pt-4">
                  <Button onClick={handleReset} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Start a New Reading
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
