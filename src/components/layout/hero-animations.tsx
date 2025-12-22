'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function HeroAnimations() {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);

    useEffect(() => {
        // Generate random stars on the client side to avoid hydration mismatch
        const newStars = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
        }));
        setStars(newStars);
    }, []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Orbiting Satellite 1 */}
            <motion.div
                className="absolute w-3 h-3 rounded-full bg-accent/60 blur-[1px]"
                initial={{ x: -20, y: 100, opacity: 0 }}
                animate={{
                    x: ['0vw', '100vw'],
                    y: ['20%', '60%'],
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 1,
                }}
            />

            {/* Orbiting Satellite 2 (Counter direction) */}
            <motion.div
                className="absolute w-2 h-2 rounded-full bg-primary/60 blur-[1px]"
                initial={{ x: '100vw', y: '10%' }}
                animate={{
                    x: ['100vw', '-10vw'],
                    y: ['10%', '80%'],
                    opacity: [0, 1, 1, 0],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5,
                }}
            />

            {/* Glowing Orb/Star */}
            <motion.div
                className="absolute right-[15%] top-[15%] w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
}
