import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Zap, 
    Music, 
    Mic2, 
    Disc, 
    Layers,
    Trophy,
    Heart,
    Flame,
    Share2,
    Compass,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useFeedback } from '../components/FeedbackContext';
import Skeleton from '../components/Skeleton';
import api from '../api';

const CATEGORIES = [
    { id: 'genres', label: 'Genre Soulmates', icon: Music, color: 'text-brand-teal', bgColor: 'bg-brand-teal/10' },
    { id: 'artists', label: 'Artist Allies', icon: Mic2, color: 'text-brand-purple', bgColor: 'bg-brand-purple/10' },
    { id: 'tracks', label: 'Track Twins', icon: Zap, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
    { id: 'albums', label: 'Album Architects', icon: Disc, color: 'text-rose-500', bgColor: 'bg-rose-500/10' }
];

// Mock definition removed. Will use state.

const MetricBar = ({ label, value, color }) => (
    <div className="space-y-1.5 w-full">
        <div className="flex justify-between items-center px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
            <span className="text-[10px] font-black text-white italic">{value}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    </div>
);

const TasteDNA = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user } = useUser();
    const { showToast } = useFeedback();
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('genres');
    const [profileData, setProfileData] = useState({
        metrics: { uniqueness: 0, breadth: 0, trend: 0, niche: 0 },
        insight: "",
        sync_insight: "",
        affinities: { genres: [], artists: [], tracks: [], albums: [] }
    });

    const isMe = !userId || userId === 'me';

    useEffect(() => {
        const fetchTasteProfile = async () => {
            if (!user.connectedService && isMe) {
                setIsLoading(false);
                return;
            }
            try {
                // If it's a specific user comparison, using TasteDNAView. But right now we only show general Taste Profile.
                const res = await api.get('/music/ai/taste-profile/');
                setProfileData(res.data);
            } catch (err) {
                console.error("Taste profile error", err);
                showToast("Failed to calculate your Sonic DNA", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasteProfile();
    }, [userId, user.connectedService]);

    const handleShare = () => {
        showToast('DNA Identity Card copied to clipboard!', 'success');
    };

    return (
        <div className="min-h-screen bg-brand-bg pb-24 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-teal/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />

            {/* Header */}
            <header className="px-6 pt-12 flex items-center justify-between relative z-10">
                <button 
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white haptic-hover"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Music <span className="text-brand-teal">DNA</span></h1>
                <button 
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white haptic-hover"
                >
                    <Share2 size={20} />
                </button>
            </header>

            <main className="px-6 mt-10 space-y-10 relative z-10">
                {/* Identity Paradox / Personality Breakdown */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 relative overflow-hidden border-brand-teal/20"
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-teal/5 via-transparent to-brand-purple/5 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2 bg-brand-teal/10 px-3 py-1.5 rounded-full border border-brand-teal/20">
                            <Layers size={14} className="text-brand-teal" />
                            <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em]">Identity Paradox Profile</span>
                        </div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 shadow-sm">Sonic Non-Conformist</h2>

                        <div className="grid grid-cols-1 w-full gap-6">
                            <MetricBar label="Uniqueness" value={profileData.metrics.uniqueness} color="bg-brand-teal" />
                            <MetricBar label="Sonic Breadth" value={profileData.metrics.breadth} color="bg-brand-purple" />
                            <MetricBar label="Trend Sensitivity" value={profileData.metrics.trend} color="bg-amber-500" />
                            <MetricBar label="Niche Adherence" value={profileData.metrics.niche} color="bg-rose-500" />
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 w-full">
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                    <TrendingUp size={32} className="text-brand-teal" />
                                </div>
                                <div className="text-center w-full">
                                    <p className="text-[11px] text-gray-400 font-bold leading-relaxed italic">
                                        "{profileData.insight || 'Connect your streaming service to see your Identity Paradox snippet.'}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Categories Tab Selector */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl whitespace-nowrap transition-all haptic-hover border ${
                                    isActive 
                                    ? `glass-panel border-white/20 bg-white/5 shadow-xl text-brand-teal` 
                                    : 'border-white/5 text-gray-500 hover:text-white'
                                }`}
                            >
                                <Icon size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{cat.label.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Top 5 Affinity Cards */}
                <section className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Trophy size={18} className="text-brand-teal" />
                            <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">
                                Affinity Top 5: {activeCategory}
                            </h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {isLoading ? (
                                    [1,2,3].map(i => (
                                        <div key={i} className="glass-panel h-48 overflow-hidden">
                                            <Skeleton width="100%" height="100%" />
                                        </div>
                                    ))
                                ) : (
                                    profileData.affinities[activeCategory]?.map((mutual, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="glass-panel-heavy group relative h-48 overflow-hidden haptic-hover cursor-pointer rounded-3xl"
                                            onClick={() => navigate(`/profile/${mutual.id || mutual.name.toLowerCase()}`)}
                                        >
                                            {/* Cover Art Background */}
                                            <div className="absolute inset-0 z-0">
                                                <img src={mutual.cover} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="Cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-black/20" />
                                            </div>

                                            {/* Rank Badge */}
                                            <div className="absolute top-4 left-4 z-10 w-9 h-9 rounded-xl bg-brand-bg/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-sm font-black text-brand-teal italic shadow-2xl">
                                                #{i + 1}
                                            </div>

                                            {/* Compatibility Score Bubble */}
                                            <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-brand-teal/90 backdrop-blur-md text-brand-bg shadow-lg flex items-center gap-1.5">
                                                <span className="text-[11px] font-black italic">{mutual.match}</span>
                                                <Zap size={10} className="fill-brand-bg" />
                                            </div>

                                            {/* Content Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex items-end justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-teal to-brand-purple">
                                                            <img 
                                                                src={`https://i.pravatar.cc/150?img=${mutual.img || i}`} 
                                                                className="w-full h-full rounded-full object-cover border-2 border-brand-bg" 
                                                                alt={mutual.name} 
                                                            />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand-bg rounded-full flex items-center justify-center border border-white/10">
                                                            <Heart size={10} className="text-rose-500 fill-rose-500/20" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-white italic tracking-tighter shadow-black drop-shadow-md">{mutual.name}</h4>
                                                        <div className="flex items-center gap-1.5 opacity-80">
                                                            <Music size={10} className="text-brand-teal" />
                                                            <span className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">{mutual.detail}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronLeft className="text-white/40 rotate-180 group-hover:text-brand-teal transition-colors" size={20} />
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* Insight Quote */}
                <div className="glass-panel p-6 border-brand-teal/10 bg-brand-teal/[0.03] relative overflow-hidden text-center group">
                    <div className="absolute -top-10 -left-10 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] mb-3">Sync Insight</p>
                    <p className="text-xs text-gray-300 font-bold leading-relaxed italic max-w-xs mx-auto">
                        "{profileData.sync_insight || 'Link your engine to reveal sync insights with your squad.'}"
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TasteDNA;
