// src/components/layout/starry-background.tsx
'use client'
import React from 'react';
import { motion } from 'framer-motion';

export function StarryBackground() {
  return (
    <div className="stars">
      <motion.div 
        className="stars-bg"
        animate={{
          translateY: ['0px', '-2000px']
        }}
        transition={{
          duration: 120,
          ease: "linear",
          repeat: Infinity,
        }}
      ></motion.div>
    </div>
  );
}
