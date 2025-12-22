'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Using Mixkit's "Stars" ambient track (free for commercial use with attribution)
    // This is a direct preview stream which is more reliable for testing
    const audioUrl = "https://assets.mixkit.co/music/preview/mixkit-stars-635.mp3";

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            console.log("Audio stopped");
        } else {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Audio playing successfully");
                    })
                    .catch(error => {
                        console.error("Audio play failed:", error);
                        alert("Could not play audio. Please check your connection or browser settings.");
                    });
            }
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.6; // Low volume for ambience
            audioRef.current.loop = true;
        }
    }, []);

    return (
        <>
            <audio ref={audioRef} src={audioUrl} />
            <motion.div
                className="fixed bottom-8 left-8 z-40"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
            >
                <Button
                    onClick={togglePlay}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 bg-background/50 backdrop-blur-md border-primary/20 hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 shadow-[0_0_15px_-5px_hsl(var(--primary))]"
                    title={isPlaying ? "Mute Ambience" : "Play Ambience"}
                >
                    <AnimatePresence mode="wait">
                        {isPlaying ? (
                            <motion.div
                                key="playing"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <Volume2 className="h-5 w-5 text-primary" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="muted"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                            >
                                <VolumeX className="h-5 w-5 text-muted-foreground" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Button>
            </motion.div>
        </>
    );
}
