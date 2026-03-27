import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Disc, Music, Mic2 } from 'lucide-react';
import { useUser } from '../components/UserContext';
import EnginePlaceholder from '../components/EnginePlaceholder';

const TopAlbums = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-brand-bg text-white relative overflow-hidden pb-32 px-4">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-10 left-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 right-0 w-80 h-80 bg-brand-teal/10 rounded-full blur-[120px]" />
        </div>

        {/* Header Setup */}
        <header className="pt-12 pb-8 z-10 relative flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                Top <span className="text-brand-purple">Albums</span> <Disc size={18} className="text-brand-purple" />
            </h1>
            <div className="w-10" />
        </header>

        {!user.connectedService ? (
            <div className="relative z-10 pt-4">
                <EnginePlaceholder 
                    type="full"
                    title="Album Archives Locked"
                    message="Connect your music DNA to explore the albums that defined your timeline."
                />
            </div>
        ) : (
            <main className="space-y-6 z-10 relative">
                {/* Search Bar - Glass Panel */}
                <div className="glass-panel w-full flex items-center px-4 py-3 mb-6 focus-within:border-brand-purple/50 transition-all">
                    <Search size={18} className="text-gray-500 mr-3" />
                    <input 
                        type="text" 
                        placeholder="Search your library..." 
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-500 text-sm font-bold uppercase tracking-wider"
                    />
                </div>

                {/* Album List Container */}
                <div className="space-y-4">
                    {[
                        { name: "Harry's House", artist: "Harry Styles", img: "1", color: "purple" },
                        { name: "SOS", artist: "SZA", img: "2", color: "teal" },
                        { name: "RENAISSANCE", artist: "Beyoncé", img: "3", color: "purple" }
                    ].map((album, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-panel p-4 flex items-center gap-4 hover:border-brand-purple transition-all duration-300 group cursor-pointer"
                        >
                            <img src={`https://i.pravatar.cc/150?img=${album.img}`} className="w-16 h-16 rounded-xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="Album" />
                            <div className="flex-1">
                                <h3 className="font-black text-white italic uppercase tracking-tighter">{album.name}</h3>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${album.color === 'teal' ? 'text-brand-teal' : 'text-gray-500'}`}>{album.artist}</p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Disc size={16} className="text-brand-purple animate-spin-slow" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        )}
    </div>
  );
};

export default TopAlbums;
