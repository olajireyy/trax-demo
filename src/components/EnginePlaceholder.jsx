import React from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EnginePlaceholder = ({ 
    title = "Music Engine Required", 
    message = "Connect your music DNA to unlock this area.", 
    type = "default",
    minimal = false,
    showButton = true
}) => {
    const navigate = useNavigate();

    if (minimal) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => navigate('/settings#engines')}
                className="glass-panel p-4 flex items-center justify-between group cursor-pointer border-dashed border-white/10 hover:border-brand-teal/30 transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 border border-white/5 group-hover:text-brand-teal transition-colors">
                        <Lock size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white italic uppercase tracking-tighter">{title}</p>
                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">Tap to link engine</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative overflow-hidden rounded-[32px] glass-panel p-8 text-center border-dashed border-white/20 group ${type === 'full' ? 'min-h-[400px] flex flex-col justify-center' : ''}`}
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-teal/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/5">
                        <Music size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-brand-bg border border-white/10 flex items-center justify-center text-brand-teal shadow-xl">
                        <Lock size={14} />
                    </div>
                </div>

                <div className="space-y-2 max-w-[240px]">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{title}</h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>
                </div>

                {showButton && (
                    <button 
                        onClick={() => navigate('/settings#engines')}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-teal text-brand-bg font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-teal/20 hover:scale-105 transition-all active:scale-95"
                    >
                        Link Engine <ChevronRight size={14} />
                    </button>
                )}
            </div>

            {/* Subtle floating particles */}
            <div className="absolute top-4 left-4">
                <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-1 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="absolute bottom-10 right-10">
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }} className="w-1.5 h-1.5 bg-brand-teal/30 rounded-full" />
            </div>
        </motion.div>
    );
};

export default EnginePlaceholder;
