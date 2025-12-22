'use client';

import { motion } from 'framer-motion';

export function StaggerText({ text, className }: { text: string; className?: string }) {
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ overflow: "hidden", display: "inline-block" }} // Fix for text wrapping
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span variants={child} style={{ marginRight: "0.25em", display: "inline-block" }} key={index}>
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
