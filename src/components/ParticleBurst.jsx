import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Particle = ({ color, x, y, duration }) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 50 + Math.random() * 100;
    const targetX = Math.cos(angle) * velocity;
    const targetY = Math.sin(angle) * velocity;

    return (
        <motion.div
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ 
                x: targetX, 
                y: targetY, 
                scale: 0, 
                opacity: 0,
                rotate: Math.random() * 360 
            }}
            transition={{ duration, ease: "easeOut" }}
            className="absolute w-1.5 h-1.5 rounded-full pointer-events-none z-50"
            style={{ backgroundColor: color }}
        />
    );
};

const ParticleBurst = ({ x, y, onComplete }) => {
    const colors = ['#2de2b3', '#7c3aed', '#ffffff']; // Brand teal, purple, white
    const particles = Array.from({ length: 12 });

    useEffect(() => {
        const timer = setTimeout(onComplete, 1000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div 
            className="fixed pointer-events-none z-[100]" 
            style={{ left: x, top: y }}
        >
            {particles.map((_, i) => (
                <Particle 
                    key={i} 
                    color={colors[i % colors.length]} 
                    duration={0.6 + Math.random() * 0.4}
                />
            ))}
        </div>
    );
};

export default ParticleBurst;
