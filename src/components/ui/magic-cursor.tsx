'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function MagicCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    // Smooth mouse movement
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable element
            const target = e.target as HTMLElement;
            setIsPointer(
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName === 'BUTTON' ||
                target.tagName === 'A'
            );
        };

        window.addEventListener('mousemove', moveCursor);
        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [cursorX, cursorY]);

    // Don't render on touch devices roughly
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        setIsVisible(!window.matchMedia("(pointer: coarse)").matches);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] mix-blend-screen"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <div className={`relative w-full h-full transition-all duration-300 ${isPointer ? 'scale-150' : 'scale-100'}`}>
                    <div className="absolute inset-0 bg-accent/30 rounded-full blur-md" />
                    <div className="absolute inset-2 bg-primary/50 rounded-full blur-sm" />
                    <div className="absolute inset-[10px] bg-white rounded-full" />
                </div>
            </motion.div>
        </>
    );
}
