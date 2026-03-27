import React, { useMemo } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PasswordStrength = ({ password }) => {
    const strength = useMemo(() => {
        let score = 0;
        let requirements = {
            length: password.length >= 8,
            number: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
            mixed: /[a-z]/.test(password) && /[A-Z]/.test(password)
        };

        if (requirements.length) score += 25;
        if (requirements.number) score += 25;
        if (requirements.special) score += 25;
        if (requirements.mixed) score += 25;

        return { score, requirements };
    }, [password]);

    const getStatusColor = () => {
        if (!password) return 'bg-white/10';
        if (strength.score < 50) return 'bg-red-500';
        if (strength.score < 100) return 'bg-yellow-500';
        return 'bg-brand-teal';
    };

    const getStatusText = () => {
        if (!password) return 'Enter secure password';
        if (strength.score < 50) return 'Weak Signal';
        if (strength.score < 100) return 'Good Signal';
        return 'Maximum Security';
    };

    const getIcon = () => {
        if (!password) return <Shield size={14} className="text-gray-500" />;
        if (strength.score < 50) return <ShieldAlert size={14} className="text-red-500" />;
        if (strength.score < 100) return <Shield size={14} className="text-yellow-500" />;
        return <ShieldCheck size={14} className="text-brand-teal" />;
    };

    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                    {getIcon()}
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {getStatusText()}
                    </span>
                </div>
                <span className="text-[9px] font-black text-gray-500">{strength.score}%</span>
            </div>
            
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
                {[25, 50, 75, 100].map((threshold) => (
                    <motion.div 
                        key={threshold}
                        initial={false}
                        animate={{ 
                            backgroundColor: password ? (strength.score >= threshold ? (
                                strength.score < 50 ? '#ef4444' : 
                                strength.score < 100 ? '#eab308' : '#00f2fe'
                            ) : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.05)'
                        }}
                        className="h-full flex-1"
                    />
                ))}
            </div>

            <div className="flex items-center justify-between gap-1 mt-2">
                 <Requirement met={strength.requirements.length} text="8+ Chars" />
                 <Requirement met={strength.requirements.mixed} text="Abc..." />
                 <Requirement met={strength.requirements.number} text="123..." />
                 <Requirement met={strength.requirements.special} text="@#$..." />
            </div>
        </div>
    );
};

const Requirement = ({ met, text }) => (
    <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${met ? 'text-brand-teal' : 'text-gray-600'}`}>
        <div className={`w-1 h-1 rounded-full ${met ? 'bg-brand-teal shadow-[0_0_5px_rgba(0,242,254,0.5)]' : 'bg-gray-700'}`} />
        {text}
    </div>
);

export default PasswordStrength;
