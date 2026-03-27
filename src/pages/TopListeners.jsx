import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import { useUser } from '../components/UserContext';
import EnginePlaceholder from '../components/EnginePlaceholder';
import { 
    ChevronLeft, 
    Trophy, 
    Music, 
    Disc, 
    Mic2, 
    Clock, 
    TrendingUp, 
    Users,
    Activity,
    Zap,
    Crown
} from 'lucide-react';
import Avatar from '../components/Avatar';
import api from '../api';
const TopListeners = () => {
    const { itemType, itemId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(true);

    const [data, setData] = useState({
        item: {
            name: "Loading...",
            artist: "Loading...",
            img: "https://i.pravatar.cc/300",
            type: itemType
        },
        leaderboard: [],
        userStats: {
            rank: 0,
            totalUsers: 0,
            percentile: 0,
            listenMinutes: 0,
            topGenre: "Loading...",
            genrePercent: 0
        }
    });

    useEffect(() => {
        const fetchTopListeners = async () => {
            if (!user.connectedService) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get(`/social/top-listeners/${itemType}/${itemId}/`);
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch top listeners", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopListeners();
    }, [itemType, itemId, user.connectedService]);

    const getIcon = () => {
        switch(itemType) {
            case 'track': return <Music size={14} />;
            case 'album': return <Disc size={14} />;
            case 'artist': return <Mic2 size={14} />;
            default: return <Music size={14} />;
        }
    };

    return (
        <div className="px-4 pt-12 space-y-8 relative pb-28 min-h-screen bg-brand-bg text-white overflow-x-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-teal/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="flex items-center justify-between relative z-10">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all backdrop-blur-md">
                    <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                    <h1 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-2 justify-center">
                        Top <span className="text-brand-teal">Listeners</span> <Trophy size={18} className="text-yellow-400" />
                    </h1>
                </div>
                <div className="w-10" /> {/* Spacer for symmetry */}
            </header>

            {!user.connectedService ? (
                <div className="pt-8 relative z-10">
                    <EnginePlaceholder 
                        type="full"
                        title="Cosmic Leaderboard Locked"
                        message="Who is listening most? You'll need to link your music engine to see the global hierarchy."
                    />
                </div>
            ) : (
                <>
                    {/* Item Detail Card */}
                    <section className="relative z-10">
                        {isLoading ? (
                            <div className="glass-panel p-6 flex items-center gap-6 overflow-hidden relative group">
                                <Skeleton width="96px" height="96px" className="rounded-2xl shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <Skeleton width="40%" height="8px" />
                                    <Skeleton width="80%" height="18px" />
                                    <Skeleton width="60%" height="12px" />
                                </div>
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-panel p-6 flex items-center gap-6 overflow-hidden relative group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-teal/10 transition-colors" />
                                
                                <div className="relative">
                                    <Avatar src={data.item.img} name={data.item.name} variant="square" size="w-24 h-24" className="shadow-2xl border border-white/10" />
                                    <div className="absolute -bottom-2 -right-2 bg-brand-teal p-2 rounded-xl shadow-lg border-2 border-brand-bg">
                                        {getIcon()}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mb-1">Globally Ranked</p>
                                    <h2 className="text-xl font-black text-white truncate leading-tight uppercase italic mb-1">{data.item.name}</h2>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest truncate">{data.item.artist}</p>
                                </div>
                            </motion.div>
                        )}
                    </section>

                    {/* User Stats Grid */}
                    <section className="grid grid-cols-2 gap-4 relative z-10">
                        {isLoading ? (
                            <>
                                <div className="glass-panel p-4 space-y-3">
                                    <Skeleton width="60px" height="8px" />
                                    <Skeleton width="40px" height="24px" />
                                    <Skeleton width="80px" height="8px" />
                                </div>
                                <div className="glass-panel p-4 space-y-3">
                                    <Skeleton width="60px" height="8px" />
                                    <Skeleton width="60px" height="24px" />
                                    <Skeleton width="80px" height="8px" />
                                </div>
                                <div className="glass-panel p-4 space-y-4 col-span-2">
                                    <Skeleton width="100px" height="8px" />
                                    <div className="flex justify-between items-end">
                                        <Skeleton width="140px" height="24px" />
                                        <Skeleton width="30px" height="12px" />
                                    </div>
                                    <Skeleton width="100%" height="4px" className="rounded-full" />
                                </div>
                            </>
                        ) : (
                            <>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="glass-panel p-4 border-brand-teal/20 bg-brand-teal/5"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-brand-teal">
                                        <TrendingUp size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Global Rank</span>
                                    </div>
                                    <p className="text-2xl font-black text-white italic">#{data.userStats.rank}</p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">out of {data.userStats.totalUsers.toLocaleString()} Users</p>
                                </motion.div>

                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="glass-panel p-4 border-brand-purple/20 bg-brand-purple/5"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-brand-purple">
                                        <Zap size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Percentile</span>
                                    </div>
                                    <p className="text-2xl font-black text-white italic">Top {data.userStats.percentile}%</p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">Among {itemType} listeners</p>
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="glass-panel p-4 border-pink-500/20 bg-pink-500/5 col-span-2"
                                >
                                    <div className="flex items-center gap-2 mb-2 text-pink-500">
                                        <Activity size={14} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Top Genre Influence</span>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <p className="text-2xl font-black text-white italic uppercase">{data.userStats.topGenre}</p>
                                        <p className="text-[10px] font-black text-pink-500 italic">{data.userStats.genrePercent}%</p>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.userStats.genrePercent}%` }}
                                            className="h-full bg-gradient-to-r from-pink-500 to-brand-purple"
                                        />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </section>

                    {/* Leaderboard List */}
                    <section className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users size={12} /> Global Leaderboard
                            </h3>
                            <div className="flex items-center gap-1 text-[8px] font-black text-brand-teal uppercase tracking-widest">
                                <Activity size={10} /> Active Now
                            </div>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                [1,2,3,4,5].map(i => (
                                    <div key={i} className="glass-panel p-3 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Skeleton width="16px" height="10px" />
                                            <Skeleton circle width="40px" height="40px" className="shrink-0" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton width="60%" height="12px" />
                                                <Skeleton width="40%" height="8px" />
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <Skeleton width="40px" height="12px" />
                                            <Skeleton width="30px" height="8px" className="ml-auto" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {data.leaderboard.map((user, idx) => (
                                        <motion.div 
                                            key={user.rank + user.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`glass-panel p-3 flex items-center justify-between group transition-all duration-300 ${user.isYou ? 'border-brand-teal/50 bg-brand-teal/10 shadow-[0_0_20px_rgba(45,226,179,0.1)]' : 'hover:border-white/10 hover:bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 text-center">
                                                    {user.rank === 1 ? (
                                                        <Crown size={16} className="text-yellow-400 mx-auto" />
                                                    ) : (
                                                        <span className={`text-xs font-black ${user.rank <= 3 ? 'text-white' : 'text-gray-600'}`}>
                                                            {user.rank}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="relative">
                                                    <Avatar src={user.img} name={user.name} size="w-10 h-10" className={`border-2 ${user.isYou ? 'border-brand-teal' : 'border-white/10'}`} />
                                                    {user.isYou && (
                                                        <div className="absolute -top-1 -right-1 bg-brand-teal rounded-full p-0.5 shadow-lg">
                                                            <Zap size={6} className="text-brand-bg fill-brand-bg" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold truncate ${user.isYou ? 'text-brand-teal' : 'text-white'}`}>
                                                        {user.name} {user.isYou && <span className="text-[9px] lowercase font-normal italic opacity-60">(you)</span>}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-tighter leading-none">Verified Listener</p>
                                                        <span className="text-[7px] font-black text-brand-purple uppercase tracking-[0.2em] bg-brand-purple/10 px-1.5 py-0.5 rounded leading-none">{user.topGenre}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-black italic tabular-nums ${user.isYou ? 'text-brand-teal' : 'text-white'}`}>{user.mins.toLocaleString()}</p>
                                                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">MINS</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </section>

                    {/* Action Footer */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-bg via-brand-bg/90 to-transparent pointer-events-none relative z-20">
                        <div className="max-w-md mx-auto pointer-events-auto">
                            <button className="w-full glass-panel-heavy py-4 bg-brand-teal text-brand-bg text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(45,226,179,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                                Invite Mutuals to Compete <Users size={14} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TopListeners;
