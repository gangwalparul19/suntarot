
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { InteractiveTarotReading } from '@/components/tarot/interactive-tarot-reading';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Wand2, BookOpen, Quote, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { majorArcana, TarotCardData } from '@/lib/cards';
import { TarotCard } from '@/components/tarot/tarot-card';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "The reading was incredibly accurate and gave me the clarity I was searching for. It felt like a conversation with an old friend who knew me deeply.",
    name: "Alex Johnson",
    role: "Career Changer"
  },
  {
    quote: "I was skeptical at first, but the insights I gained were profound. The booking process was simple and the session itself was transformative.",
    name: "Samantha Lee",
    role: "Spiritual Seeker"
  },
  {
    quote: "A truly magical experience. The reader's compassionate approach and deep knowledge of the cards made me feel comfortable and understood.",
    name: "Michael Chen",
    role: "Relationship Quester"
  }
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Home() {
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile-photo');
  const [cardOfTheDay, setCardOfTheDay] = useState<TarotCardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Select a random card of the day on client-side to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * majorArcana.length);
    setCardOfTheDay(majorArcana[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-background/80 py-20 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container relative z-10"
        >
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary mb-4">
            Unveil Your Destiny
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Journey into the mystical world of tarot. Select your cards, ask your question, and let the ancient wisdom guide your path forward.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-accent to-yellow-500 text-accent-foreground font-bold shadow-lg shadow-accent/20">
            <a href="#interactive-reading">
              <Wand2 className="mr-2" /> Start Your Free Reading
            </a>
          </Button>
        </motion.div>
      </section>

      {/* Card of the day */}
      {cardOfTheDay && (
        <section id="card-of-the-day" className="w-full py-20 md:py-24 bg-background">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="container text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center font-headline text-primary mb-4">Card of the Day</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">A daily message from the cosmos. Click the card to reveal its wisdom.</p>
            <div className="flex justify-center items-center flex-col gap-4">
              <TarotCard
                card={cardOfTheDay}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(f => !f)}
                canFlip={true}
              />
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-xl"
                  >
                    <Card className="bg-card/80 mt-4 text-center">
                       <CardHeader>
                         <CardTitle className="text-primary">{cardOfTheDay.name}</CardTitle>
                       </CardHeader>
                       <CardContent>
                          <p className="text-muted-foreground">{cardOfTheDay.meaning}</p>
                       </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      )}


      {/* Interactive Reading Section */}
      <section id="interactive-reading" className="w-full py-20 md:py-24 bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="container mx-auto flex flex-col items-center justify-center text-center"
        >
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4">
            Your Personal Reading Awaits
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Select three cards from the deck below to begin your journey. Focus on a question or situation as you choose.
          </p>
          <InteractiveTarotReading />
        </motion.div>
      </section>
      
      {/* How it Works Section */}
      <section id="how-it-works" className="w-full py-20 md:py-24 bg-secondary/20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInUp}
          className="container text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline text-primary mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div variants={fadeInUp} className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Wand2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-bold">1. Select Your Cards</h3>
              <p className="text-muted-foreground">Choose the cards that call to you from the digital deck. Trust your intuition.</p>
            </motion.div>
            <motion.div variants={fadeInUp} transition={{delay:0.1}} className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-bold">2. Ask Your Question</h3>
              <p className="text-muted-foreground">Provide context about your situation or the question that weighs on your heart.</p>
            </motion.div>
            <motion.div variants={fadeInUp} transition={{delay:0.2}} className="flex flex-col items-center gap-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-bold">3. Receive Your Insight</h3>
              <p className="text-muted-foreground">Our AI-powered reader interprets your spread, delivering a personalized and insightful reading.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      {profileImage && (
        <section id="about" className="w-full py-20 md:py-24">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="container grid md:grid-cols-2 gap-12 items-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square max-w-md mx-auto md:mx-0 rounded-full overflow-hidden shadow-2xl shadow-primary/20 border-4 border-primary/50">
              <Image
                src={profileImage.imageUrl}
                alt={profileImage.description}
                data-ai-hint={profileImage.imageHint}
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="space-y-6 text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">About Your Guide</h2>
              <p className="text-lg text-muted-foreground">
                With over a decade of experience in tarot and esoteric studies, I am here to be your guide on this journey of self-discovery. My approach combines traditional wisdom with modern intuition to provide readings that are both insightful and empowering. Let's unlock the answers that lie within.
              </p>
              <Button asChild variant="outline">
                <Link href="/booking">Book a Deeper Session</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-20 md:py-24 bg-secondary/20">
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="container text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center font-headline text-primary mb-12">Words from Fellow Seekers</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{delay: index * 0.1}}>
                <Card className="bg-background/50 text-center h-full">
                  <CardContent className="p-8 space-y-4 flex flex-col justify-center items-center">
                    <Quote className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-muted-foreground italic flex-grow">"{testimonial.quote}"</p>
                    <div className="pt-4">
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
