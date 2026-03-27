import React from 'react';
import { motion } from 'framer-motion';
import { Music, Search, Users, Ghost } from 'lucide-react';

const EmptyState = ({ 
    icon: Icon = Music, 
    title = "Silence is golden...", 
    description = "But music is better. Nothing found here yet.", 
    actionLabel, 
    onAction 
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full" />
                <div className="relative w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary shadow-2xl">
                    <Icon size={40} strokeWidth={1.5} />
                </div>
                <motion.div 
                    animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-brand-bg border border-white/10 flex items-center justify-center text-brand-secondary shadow-lg"
                >
                    <Ghost size={20} />
                </motion.div>
            </div>

            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2">
                {title}
            </h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-[240px] leading-relaxed mb-8">
                {description}
            </p>

            {actionLabel && onAction && (
                <button 
                    onClick={onAction}
                    className="btn-primary px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary/20"
                >
                    {actionLabel}
                </button>
            )}
        </motion.div>
    );
};

export default EmptyState;
