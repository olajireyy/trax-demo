import React from 'react';
import { User } from 'lucide-react';

const Avatar = ({ src, name, size = 'md', variant = 'circle', className = '' }) => {
    const sizeClasses = {
        xs: 'w-6 h-6 text-[8px]',
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-11 h-11 text-xs',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const iconSizes = {
        xs: 12,
        sm: 14,
        md: 18,
        lg: 24,
        xl: 32
    };

    const getInitials = (fullName) => {
        if (!fullName) return '';
        const parts = fullName.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return fullName[0].toUpperCase();
    };

    const initials = getInitials(name);
    const radiusClass = variant === 'circle' ? 'rounded-full' : 'rounded-2xl';

    return (
        <div className={`${sizeClasses[size] || size} ${radiusClass} overflow-hidden flex items-center justify-center bg-gradient-to-tr from-brand-teal/20 to-brand-purple/20 border border-white/10 ${className}`}>
            {src ? (
                <img 
                    src={src} 
                    alt={name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            
            <div 
                className="flex items-center justify-center w-full h-full"
                style={{ display: src ? 'none' : 'flex' }}
            >
                {initials ? (
                    <span className="font-black text-brand-teal tracking-tighter uppercase italic">{initials}</span>
                ) : (
                    <User size={iconSizes[size] || 18} className="text-brand-teal/50" />
                )}
            </div>
        </div>
    );
};

export default Avatar;
