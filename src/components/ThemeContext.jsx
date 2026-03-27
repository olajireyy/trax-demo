import React, { createContext, useContext, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Default Trax colors
    const [theme, setTheme] = useState({
        primary: '#8b5cf6', // brand-purple
        secondary: '#2de2b3', // brand-teal
        name: 'default'
    });

    const themeMap = {
        'Techno': { primary: '#06b6d4', secondary: '#8b5cf6', name: 'techno' },
        'House': { primary: '#f43f5e', secondary: '#fbbf24', name: 'house' },
        'Jazz': { primary: '#f59e0b', secondary: '#78350f', name: 'jazz' },
        'Ambient': { primary: '#10b981', secondary: '#064e3b', name: 'ambient' },
        'Electronic': { primary: '#8b5cf6', secondary: '#d946ef', name: 'electronic' },
        'Indie': { primary: '#2de2b3', secondary: '#1e3a8a', name: 'indie' },
        'Pop': { primary: '#ec4899', secondary: '#8b5cf6', name: 'pop' },
        'Hip-Hop': { primary: '#fbbf24', secondary: '#f43f5e', name: 'hiphop' },
    };

    const setThemeByGenre = useCallback((genre) => {
        if (!genre) {
            setTheme({ primary: '#8b5cf6', secondary: '#2de2b3', name: 'default' });
            return;
        }

        // Try to find a match in the map
        const found = Object.keys(themeMap).find(t => 
            genre.toLowerCase().includes(t.toLowerCase())
        );

        if (found) {
            setTheme(themeMap[found]);
        } else {
            setTheme({ primary: '#8b5cf6', secondary: '#2de2b3', name: 'default' });
        }
    }, []);

    const resetTheme = useCallback(() => {
        setTheme({ primary: '#8b5cf6', secondary: '#2de2b3', name: 'default' });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setThemeByGenre, resetTheme }}>
            <div style={{
                '--brand-primary': theme.primary,
                '--brand-secondary': theme.secondary,
                '--brand-primary-rgb': theme.primary.startsWith('#') ? hexToRgb(theme.primary) : '139, 92, 246',
                '--brand-secondary-rgb': theme.secondary.startsWith('#') ? hexToRgb(theme.secondary) : '45, 226, 179',
            }} className="h-full">
                {children}
            </div>
        </ThemeContext.Provider>
    );
};

// Helper to convert hex to RGB string for tailwind opacity support
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '139, 92, 246';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
