import React from 'react';
import { motion } from 'framer-motion';
import { Music, Disc } from 'lucide-react';

const CosmicLogo = ({ size = "lg", className = "" }) => {
    const isSmall = size === "sm";
    const iconSize = isSmall ? 20 : 36;
    const containerSize = isSmall ? "w-10 h-10" : "w-20 h-20";
    const borderRadius = isSmall ? "rounded-xl" : "rounded-2xl";

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <motion.div 
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 3, scale: 1 }}
                whileHover={{ rotate: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`${containerSize} ${borderRadius} bg-gradient-to-br from-brand-purple to-brand-teal p-0.5 relative group`}
            >
                {/* Orbit Effect */}
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-20 border border-white rounded-full scale-125"
                />
                
                <div className={`w-full h-full ${borderRadius} bg-brand-bg flex items-center justify-center relative z-10 overflow-hidden`}>
                    <Music size={iconSize} className="text-brand-teal" />
                    
                    {/* Pulsing Core */}
                    <motion.div 
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-brand-teal/10 blur-xl"
                    />
                </div>
            </motion.div>
            
            {!isSmall && (
                <div className="mt-4 text-center">
                    <h1 className="text-3xl font-black tracking-tighter text-white italic leading-none">
                        TRAX<span className="text-brand-teal">.</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-1 opacity-60">
                        Cosmic Music DNA
                    </p>
                </div>
            )}
        </div>
    );
};

export default CosmicLogo;
