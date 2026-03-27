import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Flame, 
    Share2, 
    Zap, 
    Music, 
    RotateCcw,
    Activity,
    Dice5
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import EnginePlaceholder from '../components/EnginePlaceholder';
import api from '../api';

const DailyRoast = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isGenerating, setIsGenerating] = useState(false);
    const [roast, setRoast] = useState(null);
    const [stats, setStats] = useState({
        mins: "0",
        topGenre: "Unknown",
        vibe: "Mysterious",
        repetitiveness: "0%"
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user.connectedService) return;
            try {
                const [summaryRes, genresRes] = await Promise.all([
                    api.get('/music/stats/summary/?timeframe=4w'),
                    api.get('/music/stats/top-genres/?timeframe=4w')
                ]);
                
                const sData = summaryRes.data;
                const gData = genresRes.data.results || [];
                
                // Calculate pseudo-repetitiveness: how many times the same unique tracks are replayed
                let rep = 0;
                // Since total playing isn't explicitly top-tracks total, let's just make up a stat 
                // or assume total_tracks means total plays if available. If not, fallback 50%.
                if (sData.unique_tracks && sData.unique_tracks > 0) {
                    // Let's assume average plays per track = 3 for 50%. (unique * 3 = total). 
                    // Let's just mock repetitiveness using unique_tracks to total_minutes ratio
                    const expectedMinsPerTrack = 3.5;
                    const estimatedPlays = sData.total_minutes / expectedMinsPerTrack;
                    rep = Math.min(100, Math.max(0, Math.round((1 - (sData.unique_tracks / estimatedPlays)) * 100)));
                }

                setStats({
                    mins: sData.total_minutes?.toLocaleString() || "0",
                    topGenre: gData.length > 0 ? gData[0].name : "Unknown",
                    vibe: gData.length > 0 ? `${gData[0].name} Enthusiast` : "Mysterious",
                    repetitiveness: `${rep}%`
                });
            } catch (err) {
                console.error("Failed to fetch roast stats:", err);
            }
        };
        fetchStats();
    }, [user.connectedService]);

    const generateRoast = async () => {
        setIsGenerating(true);
        setRoast(null);
        
        try {
            const res = await api.get('/music/ai/daily-roast/?force=true');
            setRoast(res.data.roast || "Your taste is so bad, even the AI refused to roast it.");
        } catch (err) {
            console.error("Roast generation failed", err);
            setRoast("The Roast Engine overheated trying to process your terrible music taste. Try again later.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="px-6 pt-12 space-y-8 relative pb-28 min-h-screen bg-brand-bg text-white overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-orange-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="flex items-center justify-between relative z-10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md">
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2 justify-center">
                        Daily <span className="text-orange-500">Roast</span> <Flame size={18} className="text-orange-500 animate-bounce" />
                    </h1>
                </div>
                <div className="w-10" />
            </header>

            {!user.connectedService ? (
                <div className="pt-12">
                    <EnginePlaceholder 
                        type="full"
                        title="Your Sins are Hidden"
                        message="We can't roast your taste if we can't see it. Link your music engine to receive your daily judgment."
                    />
                </div>
            ) : (
                <>
                    {/* Roastable Stats Card */}
                    <section className="relative z-10">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity size={12} /> Roastable Stats
                            </h3>
                        </div>
                        <div className="glass-panel p-6 border-orange-500/20 bg-orange-500/5 grid grid-cols-2 gap-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            
                            <div>
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Immersion</p>
                                <p className="text-lg font-black text-white italic">{stats.mins} <span className="text-[10px] not-italic text-gray-500">mins</span></p>
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Repetitiveness</p>
                                <p className="text-lg font-black text-white italic">{stats.repetitiveness}</p>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-white/5">
                                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Vibe</p>
                                <p className="text-sm font-black text-orange-500 uppercase italic tracking-tight">{stats.vibe}</p>
                            </div>
                        </div>
                    </section>

                    {/* AI Generation Area */}
                    <section className="relative z-10 min-h-[300px] flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {!roast && !isGenerating && (
                                <motion.div 
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 group cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-500" onClick={generateRoast}>
                                        <Flame size={40} className="text-gray-600 group-hover:text-orange-500 transition-colors" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Ready to be roasted?</h2>
                                        <p className="text-xs text-gray-500 font-bold mt-2">Calculated based on your last 24h music sins.</p>
                                    </div>
                                    <button 
                                        onClick={generateRoast}
                                        className="px-8 py-4 bg-orange-500 text-brand-bg text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-[0_10px_40px_rgba(249,115,22,0.3)] hover:scale-[1.05] active:scale-95 transition-all"
                                    >
                                        GENERATE ROAST
                                    </button>
                                </motion.div>
                            )}

                            {isGenerating && (
                                <motion.div 
                                    key="generating"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="relative">
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-20 h-20 rounded-full border-2 border-orange-500/20 border-t-orange-500"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Zap size={24} className="text-orange-500 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] animate-pulse">Analyzing your sins...</p>
                                        <p className="text-[8px] text-gray-500 font-bold mt-2 uppercase">Feeding stats to the Cosmic Roast Machine</p>
                                    </div>
                                </motion.div>
                            )}

                            {roast && !isGenerating && (
                                <motion.div 
                                    key="roast"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="w-full"
                                >
                                    <div className="glass-panel p-8 border-orange-500/30 bg-orange-500/10 relative overflow-hidden group">
                                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl" />
                                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-brand-purple/10 rounded-full blur-3xl" />
                                        
                                        <div className="relative z-10 flex flex-col gap-6 text-center">
                                            <div className="flex justify-center">
                                                <div className="bg-orange-500/20 p-3 rounded-2xl">
                                                    <Flame size={24} className="text-orange-500" />
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-black text-white italic leading-tight uppercase tracking-tighter">
                                                "{roast}"
                                            </h3>
                                            
                                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                                <button 
                                                    onClick={() => {
                                                        if (navigator.share) {
                                                            navigator.share({ title: 'My Daily Roast on Trax', text: roast });
                                                        }
                                                    }}
                                                    className="flex-1 glass-panel py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-white hover:bg-white/5"
                                                >
                                                    <Share2 size={14} /> Share
                                                </button>
                                                <button 
                                                    onClick={generateRoast}
                                                    className="flex-1 glass-panel py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-white hover:bg-white/5"
                                                >
                                                    <RotateCcw size={14} /> Regenerate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-center flex items-center justify-center gap-3">
                                        <div className="h-px w-8 bg-white/5" />
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Powered by Trax AI Insights</p>
                                        <div className="h-px w-8 bg-white/5" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </>
            )}
        </div>
    );
};

export default DailyRoast;

