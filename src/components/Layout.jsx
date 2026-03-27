import React from 'react';
import BottomNav from './BottomNav';
import { motion } from 'framer-motion';

const Layout = ({ children, showNav = true }) => {
    return (
        <div className="min-h-screen relative overflow-x-hidden bg-brand-bg selection:bg-brand-teal/30 transition-colors duration-1000">
            {/* Standard Background Orbs for Global Premium Feel */}
            <div 
                className="bg-orb top-[-10%] left-[-10%] w-[50%] h-[50%] animate-pulse-slow transition-all duration-1000"
                style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.15 }}
            ></div>
            <div 
                className="bg-orb bottom-[-5%] right-[-5%] w-[40%] h-[40%] animate-float opacity-10 transition-all duration-1000"
                style={{ backgroundColor: 'var(--brand-secondary)' }}
            ></div>
            
            <motion.main 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`relative z-10 max-w-md mx-auto min-h-screen ${showNav ? 'pb-24' : ''}`}
            >
                {children}
            </motion.main>

            {showNav && <BottomNav />}
        </div>
    );
};

export default Layout;
