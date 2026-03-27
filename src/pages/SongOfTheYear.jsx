import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Trophy, Calendar, Filter } from 'lucide-react';
import { useUser } from '../components/UserContext';
import EnginePlaceholder from '../components/EnginePlaceholder';

const SongOfTheYear = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedYear, setSelectedYear] = useState('2024');

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white relative overflow-hidden pb-32 px-4">
        {/* Background Orbs */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 bg-brand-teal/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-10 left-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-[150px]" />
        </div>

        {/* Header Setup */}
        <header className="pt-12 pb-8 z-10 relative flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md">
                <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2">
                Song of the <span className="text-brand-teal">Year</span> <Trophy size={18} className="text-yellow-400" />
            </h1>
            <div className="w-10" />
        </header>

        {!user.connectedService ? (
            <div className="relative z-10 pt-4">
                <EnginePlaceholder 
                    type="full"
                    title="Vault is Sealed"
                    message="Your yearly anthems are waiting. Connect your music service to unlock the Hall of Fame."
                />
            </div>
        ) : (
            <main className="space-y-6 z-10 relative">
                {/* Interactive Year Filters */}
                <div className="flex justify-between items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {['2025', '2024', '2023'].map((year) => (
                        <button 
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl ${selectedYear === year ? 'bg-brand-teal text-brand-bg shadow-lg shadow-brand-teal/20' : 'text-gray-500 hover:text-white'}`}
                        >
                            {year}
                        </button>
                    ))}
                </div>

                {/* Grid Layout - 2 Columns */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { title: "As It Was", artist: "Harry Styles", plays: "3.0M", img: "32", color: "purple" },
                        { title: "Less I Know...", artist: "Tame Impala", plays: "2.4M", img: "12", color: "teal", grayscale: true },
                        { title: "Kill Bill", artist: "SZA", plays: "1.8M", img: "5", color: "teal" },
                        { title: "Delicate", artist: "Taylor Swift", plays: "1.2M", img: "17", color: "purple" }
                    ].map((song, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col gap-3 group cursor-pointer"
                        >
                            <div className="glass-panel w-full aspect-square overflow-hidden hover:border-brand-teal transition-all duration-500 relative rounded-2xl">
                                <img src={`https://i.pravatar.cc/300?img=${song.img}`} className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${song.grayscale ? 'grayscale' : ''}`} alt="Song" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center shadow-lg">
                                        <Trophy size={14} className="text-brand-bg" />
                                    </div>
                                </div>
                            </div>
                            <div className="px-1">
                                <h3 className="font-black text-white text-xs truncate uppercase italic tracking-tighter leading-tight">{song.title}</h3>
                                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{song.artist}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className={`w-1 h-1 rounded-full ${song.color === 'teal' ? 'bg-brand-teal' : 'bg-brand-purple'}`} />
                                    <p className={`text-[9px] font-black ${song.color === 'teal' ? 'text-brand-teal' : 'text-brand-purple'} uppercase tracking-tighter`}>{song.plays} plays</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        )}
    </div>
  );
};

export default SongOfTheYear;
