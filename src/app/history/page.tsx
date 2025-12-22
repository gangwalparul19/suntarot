
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Inbox, LogIn, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

interface ReadingRecord {
  id: string;
  date: string;
  question: string;
  cards: string[];
  reading: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const readingsQuery = useMemoFirebase(() => 
    user && firestore ? query(collection(firestore, `users/${user.uid}/readings`), orderBy('date', 'desc')) : null, 
    [user, firestore]
  );
  
  const { data: firestoreReadings, isLoading: isFirestoreLoading } = useCollection<ReadingRecord>(readingsQuery);
  const [localReadings, setLocalReadings] = useState<ReadingRecord[]>([]);
  const [selectedReading, setSelectedReading] = useState<ReadingRecord | null>(null);

  const readings = user ? firestoreReadings : localReadings;
  const isLoading = isUserLoading || isFirestoreLoading;

  useEffect(() => {
    if (!user && !isUserLoading) {
      try {
        const storedReadings = localStorage.getItem('tarotReadings');
        if (storedReadings) {
          setLocalReadings(JSON.parse(storedReadings));
        }
      } catch (error) {
        console.error("Failed to load readings from local storage", error);
        toast({
          title: 'Error',
          description: 'Could not load your past readings.',
          variant: 'destructive'
        });
      }
    }
  }, [user, isUserLoading, toast]);
  
  useEffect(() => {
      // when readings are loaded, or change, select the first one
      if (readings && readings.length > 0 && !selectedReading) {
          setSelectedReading(readings[0]);
      }
      if (readings && selectedReading) {
          const updatedSelected = readings.find(r => r.id === selectedReading.id);
          setSelectedReading(updatedSelected || null);
      }
      if (!readings || readings.length === 0) {
        setSelectedReading(null);
      }
  }, [readings, selectedReading]);


  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (user && firestore) {
      const docRef = doc(firestore, `users/${user.uid}/readings`, id);
      deleteDocumentNonBlocking(docRef);
      toast({
        title: 'Reading Deleted',
        description: 'The selected reading has been removed from your history.',
      });
    } else {
      try {
        const updatedReadings = localReadings.filter(r => r.id !== id);
        setLocalReadings(updatedReadings);
        localStorage.setItem('tarotReadings', JSON.stringify(updatedReadings));
        if (selectedReading?.id === id) {
          setSelectedReading(null);
        }
        toast({
          title: 'Reading Deleted',
          description: 'The selected reading has been removed from your history.',
        });
      } catch (error) {
        console.error("Failed to delete reading", error);
        toast({
          title: 'Error',
          description: 'Could not delete the reading.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleClearAll = async () => {
    if (user && firestore && firestoreReadings) {
        const batch = writeBatch(firestore);
        firestoreReadings.forEach(reading => {
            const docRef = doc(firestore, `users/${user.uid}/readings`, reading.id);
            batch.delete(docRef);
        });
        await batch.commit();
         toast({
            title: 'History Cleared',
            description: 'All your past readings have been deleted.',
        });

    } else {
        try {
          setLocalReadings([]);
          localStorage.removeItem('tarotReadings');
          setSelectedReading(null);
          toast({
            title: 'History Cleared',
            description: 'All your past readings have been deleted.',
          });
        } catch (error) {
          console.error("Failed to clear history", error);
           toast({
            title: 'Error',
            description: 'Could not clear your reading history.',
            variant: 'destructive'
          });
        }
    }
  };
  
  if (isLoading) {
    return (
        <div className="container py-12 px-4 flex justify-center items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  if (!user) {
    return (
        <div className="container py-12 px-4 text-center">
            <motion.div initial="initial" animate="animate" variants={fadeInUp}>
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-4">
                    Log In to See Your History
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                    Please log in to view your saved tarot readings and track your journey.
                </p>
                <Button>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                </Button>
            </motion.div>
        </div>
    )
  }

  return (
    <div className="container py-12 px-4">
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-center text-primary mb-4">
          Your Reading History
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-center mb-12">
          Revisit the guidance and insights from your past tarot readings.
        </p>
      </motion.div>

      {readings && readings.length > 0 && (
          <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{delay: 0.2}} className="text-center mb-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" /> Clear All History
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your saved readings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Readings List */}
        <motion.div 
            initial="initial" animate="animate" variants={fadeInUp} transition={{delay: 0.3}}
            className="md:col-span-1"
        >
          <Card className="bg-card/50 h-full">
            <CardHeader>
              <CardTitle>Past Readings</CardTitle>
            </CardHeader>
            <CardContent>
              {!readings || readings.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Inbox className="mx-auto h-12 w-12 mb-4" />
                  <p>You have no saved readings yet.</p>
                  <p className="text-sm">Complete a reading on the home page to see it here.</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {readings.map((reading) => (
                    <li key={reading.id}>
                      <button
                        onClick={() => setSelectedReading(reading)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedReading?.id === reading.id ? 'bg-primary/20 text-primary' : 'hover:bg-accent/50'
                        }`}
                      >
                        <p className="font-semibold truncate">{reading.question}</p>
                        <p className="text-sm text-muted-foreground">{new Date(reading.date).toLocaleDateString()}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Reading Details */}
        <motion.div 
            initial="initial" animate="animate" variants={fadeInUp} transition={{delay: 0.4}}
            className="md:col-span-2"
        >
          <AnimatePresence mode="wait">
            {selectedReading ? (
              <motion.div
                key={selectedReading.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-xl shadow-primary/10">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="font-headline text-3xl text-primary">{selectedReading.question}</CardTitle>
                      <CardDescription>{new Date(selectedReading.date).toLocaleString()}</CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this reading. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => handleDelete(selectedReading.id, e)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-accent">Cards Drawn:</h3>
                      <p className="text-muted-foreground">{selectedReading.cards.join(', ')}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-accent">Reading:</h3>
                      <div className="text-left text-lg leading-relaxed whitespace-pre-wrap font-body text-foreground/90">
                        {selectedReading.reading}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center bg-card/20 rounded-lg border-2 border-dashed border-border">
                <div className="text-center text-muted-foreground">
                   {readings && readings.length > 0 
                    ? <p>Select a reading from the list to view its details.</p>
                    : <p>Your readings will appear here once you've completed one.</p>
                   }
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
