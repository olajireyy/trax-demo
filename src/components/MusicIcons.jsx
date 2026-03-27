import React from 'react';

export const SpotifyIcon = ({ size = 24, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
    >
        <circle cx="12" cy="12" r="12" fill="#1DB954"/>
        <path d="M17.5 17.3c-.2.3-.6.4-.9.2-2.8-1.7-6.2-2.1-10.2-1.2-.3.1-.7-.1-.8-.4-.1-.3.1-.7.4-.8 4.4-1 8.2-.5 11.3 1.4.3.2.4.6.2.8zm1.5-3.3c-.3.4-.8.5-1.2.2-3.1-1.9-7.9-2.5-11.6-1.3-.5.1-1-.2-1.1-.7-.1-.5.2-1 .7-1.1 4.3-1.3 9.5-.7 13.1 1.5.4.3.5.9.1 1.4zm.1-3.4c-3.7-2.2-9.9-2.4-13.5-1.3-1.1.4-1.9-.3-1.9-1.2 0-.6.3-1.1.8-1.3 4.1-1.2 11-1 15.3 1.5.5.3.7.9.4 1.4-.2.5-.8.7-1.3.4z" fill="black"/>
    </svg>
);

export const AppleMusicIcon = ({ size = 24, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
    >
        <defs>
            <linearGradient id="appleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fa2d32" />
                <stop offset="100%" stopColor="#ff5e62" />
            </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="12" fill="url(#appleGradient)"/>
        <path d="M16 7.5v6.5c0 1.5-1.12 2.5-2.5 2.5S11 15.5 11 14s1.12-2.5 2.5-2.5c.3 0 .58.05.84.14V8.44L10.28 9.38v5.62c0 1.5-1.12 2.5-2.5 2.5S5.28 16.5 5.28 15s1.12-2.5 2.5-2.5c.3 0 .58.05.84.14V7.5L16 7.5z" fill="white"/>
    </svg>
);

export const YoutubeMusicIcon = ({ size = 24, className = "" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        className={className}
    >
        <circle cx="12" cy="12" r="12" fill="black"/>
        <circle cx="12" cy="12" r="11" fill="none" stroke="#FF0000" strokeWidth="1"/>
        <circle cx="12" cy="12" r="8" fill="none" stroke="#FF0000" strokeWidth="1.5"/>
        <path d="M10.5 9v6l5-3-5-3z" fill="#FF0000"/>
    </svg>
);
