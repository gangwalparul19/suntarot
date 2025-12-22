
'use client';

import Image from 'next/image';
import Link from 'next/link';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Wand2, BookOpen, Quote, Eye, Sparkles, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { majorArcana, TarotCardData } from '@/lib/cards';
import { TarotCard } from '@/components/tarot/tarot-card';
import { StaggerText } from '@/components/ui/stagger-text';
import { DeckShowcase } from '@/components/layout/deck-showcase';
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

import { HeroAnimations } from '@/components/layout/hero-animations';

export default function Home() {
  const profileImage = PlaceHolderImages.find((img) => img.id === 'profile-photo');
  const [cardOfTheDay, setCardOfTheDay] = useState<TarotCardData | null>(null);
  const [isFlipped, setIsFlipped] = useState(true);

  useEffect(() => {
    // Select a random card of the day on client-side to avoid hydration mismatch
    const randomIndex = Math.floor(Math.random() * majorArcana.length);
    setCardOfTheDay(majorArcana[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center overflow-x-hidden bg-[#0a0a0a] min-h-screen">
      {/* Hero Section */}
      <section className="w-full relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden py-12 md:py-0">
        <div className="absolute inset-0 z-0">
          <HeroAnimations />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 z-0 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="container relative z-10 text-center px-4"
        >
          <div className="mb-6 inline-block p-1 rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse">
            <div className="px-6 py-1 bg-background/50 backdrop-blur-md rounded-full border border-primary/50 shadow-[0_0_15px_-3px_hsl(var(--primary))]">
              <span className="text-sm font-bold text-accent tracking-[0.2em] uppercase drop-shadow-md">Ancient Wisdom • Modern Insight</span>
            </div>
          </div>

          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFF] via-[#E2E2E2] to-[#737373] mb-6 drop-shadow-2xl">
            Sun Tarot
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Unveil the mysteries of your path. Let the cards guide your journey through the cosmos.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-[0_0_30px_-5px_hsl(var(--primary))] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-5px_hsl(var(--primary))] border border-white/10">
              <Link href="/learn">
                <Wand2 className="mr-2 h-5 w-5" /> Explore the Cards
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg border-primary/20 hover:bg-primary/10 hover:text-accent hover:border-primary/50 rounded-full backdrop-blur-sm transition-all duration-300">
              <Link href="/booking">Book a Reading</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Deck Showcase - New Feature */}
      <section className="w-full relative z-20 -mt-10 md:-mt-20 mb-12 md:mb-20">
        <div className="container mb-8 text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Featuring the Rider-Waite Smith Deck</p>
        </div>
        <DeckShowcase />
      </section>


      {/* Card of the day */}
      {cardOfTheDay && (
        <section id="card-of-the-day" className="w-full py-12 md:py-20 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-30" />

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="container"
          >
            <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
                <div className="mb-6 flex items-center justify-center lg:justify-start gap-2 text-primary/80">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-bold tracking-wider uppercase">Daily Guidance</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold font-headline text-foreground mb-8">{cardOfTheDay.name}</h2>
                <div className="prose prose-invert prose-lg max-w-none text-muted-foreground/90">
                  <div className="leading-relaxed text-xl italic border-l-4 border-primary/30 pl-6 my-6 min-h-[100px]">
                    "
                    <StaggerText text={cardOfTheDay.meaning} />
                    "
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    variant="outline"
                    className="border-primary/50 hover:bg-primary/10"
                    onClick={() => {
                      const text = `Today's Tarot Card: ${cardOfTheDay.name}\n\nMeaning: ${cardOfTheDay.meaning}\n\nDiscover more at Sun Tarot.`;
                      navigator.clipboard.writeText(text);
                      alert("Card reading copied to clipboard!");
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Share Reading
                  </Button>
                </div>
              </div>

              <div className="order-1 lg:order-2 flex justify-center perspective-1000 relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-20 animate-pulse pointer-events-none" />
                <TarotCard
                  card={cardOfTheDay}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(f => !f)}
                  canFlip={true}
                />
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* How it Works Section */}
      <section id="how-it-works" className="w-full py-12 md:py-20 relative overflow-hidden">
        <div className="container relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center font-headline text-foreground mb-20">The Journey</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-12 max-w-6xl mx-auto">
            <motion.div variants={fadeInUp} className="group flex flex-col items-center text-center p-8 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors border border-white/5">
              <div className="mb-6 p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/20">
                <Wand2 className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">1. Select</h3>
              <p className="text-muted-foreground leading-relaxed">Connect with your intuition and choose the cards that call to you from the digital deck.</p>
            </motion.div>
            <motion.div variants={fadeInUp} transition={{ delay: 0.1 }} className="group flex flex-col items-center text-center p-8 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors border border-white/5">
              <div className="mb-6 p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/20">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">2. Inquire</h3>
              <p className="text-muted-foreground leading-relaxed">Formulate your question clearly in your mind. The cards respond to your intent.</p>
            </motion.div>
            <motion.div variants={fadeInUp} transition={{ delay: 0.2 }} className="group flex flex-col items-center text-center p-8 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors border border-white/5">
              <div className="mb-6 p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500 ring-1 ring-primary/20">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">3. Receive</h3>
              <p className="text-muted-foreground leading-relaxed">Gain clarity through our AI-guided interpretation of ancient symbols and archetypes.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {profileImage && (
        <section id="about" className="w-full py-12 md:py-20 relative bg-secondary/5">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            className="container max-w-5xl"
          >
            <div className="flex flex-col md:flex-row gap-12 items-center bg-card/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex-shrink-0 relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl shadow-primary/20 border-4 border-primary/20"
              >
                <Image
                  src={profileImage.imageUrl}
                  alt={profileImage.description}
                  data-ai-hint={profileImage.imageHint}
                  fill
                  className="object-cover object-top"
                />
              </motion.div>

              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-6">Meet Your Guide</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  "Tarot is a mirror of the soul. My mission is to help you see your own reflection clearly, empowering you to navigate life's currents with wisdom and grace."
                </p>
                <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground">
                  <Link href="/booking">Book a Private Session</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
          className="container mx-auto px-4"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-foreground mb-4">Seeker Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Real experiences from those who have consulted the cards.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp} transition={{ delay: index * 0.1 }}>
                <Card className="bg-gradient-to-br from-card/50 to-card/10 border border-white/5 hover:border-primary/30 transition-all duration-300 h-full p-8 group">
                  <CardContent className="p-0 space-y-6">
                    <div className="flex justify-center text-primary/40 group-hover:text-primary transition-colors">
                      <Quote className="w-10 h-10" />
                    </div>
                    <p className="text-muted-foreground italic text-lg leading-relaxed text-center">"{testimonial.quote}"</p>
                    <div className="pt-6 border-t border-white/5 text-center">
                      <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                      <p className="text-sm text-primary font-medium">{testimonial.role}</p>
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
