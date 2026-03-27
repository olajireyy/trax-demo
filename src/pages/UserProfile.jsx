import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBurst from '../components/ParticleBurst';
import Skeleton from '../components/Skeleton';
import { 
    MoreVertical, 
    MessageSquare, 
    UserPlus, 
    UserMinus, 
    Heart, 
    Share2, 
    TrendingUp,
    Zap,
    ChevronRight,
    ChevronLeft,
    Settings,
    Edit3,
    Headphones,
    Music,
    Plus,
    BarChart3,
    Disc,
    Mail,
    Image as ImageIcon,
    Users
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useFeedback } from '../components/FeedbackContext';
import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from '../components/MusicIcons';
import EnginePlaceholder from '../components/EnginePlaceholder';
import Avatar from '../components/Avatar';

const UserProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user, logout } = useUser();
    const { showConfirm, showToast } = useFeedback();
    const [isFriend, setIsFriend] = useState(true); // Default to true for mutual demo
    const [bursts, setBursts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [profileCover, setProfileCover] = useState('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60');

    const isMe = !userId || userId === 'me';
    const [profile, setProfile] = useState(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const id = isMe ? user.id : userId;
            const res = await api.get(`/social/profile/${id}/`);
            setProfile(res.data);
            setIsFriend(res.data.connection_status === 'accepted');
        } catch (err) {
            console.error("Failed to fetch profile", err);
            if (isMe) {
                showToast("Session expired or profile unavailable.", "error");
                logout();
                navigate('/login');
            } else {
                showToast("User not found or connection removed.", "error");
                navigate('/');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isMe, userId, user.id, showToast, logout, navigate]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const triggerBurst = (e) => {
        if (e && e.clientX) {
            const newBurst = { id: Date.now(), x: e.clientX, y: e.clientY };
            setBursts(prev => [...prev, newBurst]);
        }
    };

    const removeBurst = (id) => {
        setBursts(prev => prev.filter(b => b.id !== id));
    };

    // Mock Data for the Profile
    // Mock Data for the Profile
    const [showMenu, setShowMenu] = useState(false);

    
    // Manage bottom navigation visibility
    useEffect(() => {
        if (!isMe) {
            document.body.classList.add('hide-nav');
        } else {
            document.body.classList.remove('hide-nav');
        }
        return () => {
            document.body.classList.remove('hide-nav');
        };
    }, [isMe]);

    // Mock Data for the Profile
    const handleAction = async () => {
        try {
            if (isFriend) {
                 showConfirm({
                    title: 'Remove Mutual?',
                    message: `Are you sure you want to remove ${profile.name} from your inner circle? This will also permanently delete any direct chat history you have together.`,
                    confirmText: 'Remove',
                    type: 'danger',
                    onConfirm: async () => {
                        try {
                            await api.delete(`/social/friends/${profile.id}/`);
                            setIsFriend(false);
                            showToast(`${profile.name} removed from mutuals.`);
                            // Optionally redirect them back to /social or let them stay on the un-friended profile
                            navigate('/social');
                        } catch (err) {
                            showToast("Failed to remove mutual.", "error");
                        }
                    }
                });
            } else {
                await api.post('/social/friends/requests/', { receiver_id: profile.id });
                showToast(`Friend request sent to ${profile.name}!`, 'success');
            }
        } catch (err) {
            showToast("Action failed.", "error");
        }
    };


    if (isLoading || !profile) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg relative pb-24">
            {/* Top Navigation Bar */}
            <header className="fixed top-2 left-0 right-0 z-50 px-4 py-6 flex items-center justify-between pointer-events-none">
                <div className="relative pointer-events-auto">
                    {!isMe && (
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                </div>
                <div className="relative pointer-events-auto flex gap-2">
                    <AnimatePresence>
                        {showMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-14 right-0 w-48 glass-panel-heavy p-2 border-white/10 shadow-3xl z-50 rounded-2xl"
                            >
                                {!isMe && (
                                    <>
                                        <button 
                                            onClick={() => {
                                                setShowMenu(false);
                                                handleAction(); // Trigger the remove mutual flow
                                            }}
                                            className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/10 text-red-500 transition-colors"
                                        >
                                            {isFriend ? 'Remove Mutual' : 'Add Mutual'}
                                        </button>
                                        <button className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 text-gray-400 transition-colors">
                                            Report Profile
                                        </button>
                                    </>
                                )}
                                <button className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 text-gray-400 transition-colors">
                                    Copy Link
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            {/* Profile Header / Cover Area */}
            <div className="relative h-[320px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/40 to-brand-bg z-10" />
                <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    src={profileCover} 
                    className="w-full h-full object-cover opacity-60" 
                    alt="Cover"
                />
                
                {isMe && (
                    <button 
                        onClick={() => {
                            const covers = [
                                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
                                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
                                'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?w=800&q=80',
                                'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&q=80'
                            ];
                            setProfileCover(covers[Math.floor(Math.random() * covers.length)]);
                            showToast('Cover updated!', 'success');
                        }}
                        className="absolute top-24 right-6 z-30 p-2.5 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all shadow-lg group"
                        title="Switch Cover"
                    >
                        <ImageIcon size={18} className="group-hover:scale-110 transition-transform" />
                    </button>
                )}
                
                {/* Profile Identity */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 z-20 flex flex-col items-center">
                    <div className="relative mb-4">
                        {isLoading ? (
                            <Skeleton circle width="96px" height="96px" className="border-4 border-brand-bg shadow-2xl" />
                        ) : (
                            <>
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-brand-teal to-brand-purple shadow-2xl"
                                >
                                    <Avatar src={profile.avatar_url} name={profile.name} size="w-full h-full" className="border-4 border-brand-bg" />
                                </motion.div>
                                {profile.connected_service && (
                                    <div className={`absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-brand-bg shadow-2xl border border-white/10 flex items-center justify-center backdrop-blur-md`}>
                                        {profile.connected_service === 'SPOTIFY' && <SpotifyIcon size={22} />}
                                        {profile.connected_service === 'APPLE_MUSIC' && <AppleMusicIcon size={22} />}
                                        {profile.connected_service === 'YOUTUBE_MUSIC' && <YoutubeMusicIcon size={22} />}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {isLoading ? (
                        <>
                            <Skeleton width="120px" height="24px" className="mb-2" />
                            <Skeleton width="200px" height="12px" />
                        </>
                    ) : (
                        <div className="text-center relative w-full space-y-2">
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">{profile.name}</h1>
                                <p className="text-[11px] font-black text-brand-teal tracking-[0.1em]">@{profile.username.toLowerCase()}</p>
                            </div>
                            
                            {isMe && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm"
                                >
                                    <Mail size={10} className="text-gray-500" />
                                    <p className="text-[10px] font-bold text-gray-400 lowercase tracking-tight">{user.email}</p>
                                </motion.div>
                            )}
                            
                            <p className="text-xs text-gray-400 font-bold text-center max-w-[280px] mx-auto pt-1">{profile.bio}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Bar */}
            <div className="px-6 -mt-3 relative z-30">
                <div className="glass-panel py-4 px-2 flex justify-around items-center border-white/10 backdrop-blur-3xl">
                    <div className="text-center">
                        {isLoading ? <Skeleton width="40px" height="14px" className="mb-1" /> : <p className="text-sm font-black text-white italic">{profile.mutuals_count}</p>}
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Mutuals</p>
                    </div>
                    <div className="w-px h-6 bg-white/5" />
                    <div className="text-center">
                        {isLoading ? <Skeleton width="60px" height="14px" className="mb-1" /> : <p className="text-sm font-black text-white italic">{profile.minutes_played}</p>}
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Minutes</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 mt-6 flex gap-3">
                {isMe ? (
                    <>
                        <button 
                            onClick={() => navigate('/edit-profile')}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-brand-teal text-brand-bg font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-teal/20"
                        >
                            <Edit3 size={16} />
                            Edit Profile
                        </button>
                        <button 
                            onClick={() => navigate('/settings')}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white"
                        >
                            <Settings size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <button 
                            onClick={handleAction}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                isFriend 
                                ? 'bg-white/5 border border-white/10 text-white' 
                                : 'bg-brand-teal text-brand-bg shadow-lg shadow-brand-teal/20'
                            }`}
                        >
                            {isFriend ? <UserMinus size={16} /> : <UserPlus size={16} />}
                            {isFriend ? 'Remove Mutual' : 'Add Mutual'}
                        </button>
                        <button 
                            onClick={() => navigate(`/chat/${profile.username}`)}
                            className="p-3.5 rounded-2xl bg-brand-teal text-brand-bg shadow-lg shadow-brand-teal/20"
                        >
                            <MessageSquare size={20} />
                        </button>
                    </>
                )}
                <button className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                    <Share2 size={20} />
                </button>
            </div>

            {/* Compatibility Badge Area */}
            <div className="px-6 mt-6">
                <div 
                    onClick={() => navigate(`/taste-dna/${userId || 'me'}`)}
                    className="glass-panel p-4 bg-gradient-to-r from-brand-teal/10 to-brand-purple/10 border-brand-teal/20 flex items-center justify-between cursor-pointer haptic-hover"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-teal/20 flex items-center justify-center text-brand-teal">
                            <Zap size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{isMe ? 'Music Identity Quotient' : 'Cosmic Match'}</p>
                            <p className="text-sm font-black text-white italic">{isMe ? 'Your taste is 98% Unique' : `Music taste is ${profile.compatibility} identical`}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <ChevronRight className="text-gray-600" size={20} />
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <main className="px-6 mt-8 space-y-8">
                {/* Unique Section based on Identity */}
                {isLoading ? (
                    <section className="space-y-4">
                        <Skeleton width="100px" height="14px" className="mb-4" />
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} width="80px" height="32px" className="rounded-full" />
                            ))}
                        </div>
                    </section>
                ) : (
                    isMe ? (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Music size={18} className="text-brand-teal" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Top Genres</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {['Techno', 'Indie Pop', 'Synthwave', 'Experimental'].map((genre, i) => (
                                    <span key={i} className="px-4 py-2 rounded-full glass-panel border-white/5 text-[10px] font-black uppercase text-gray-400 hover:text-brand-teal hover:border-brand-teal/30 transition-all cursor-default">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Heart size={18} className="text-red-500" />
                                <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Our Anthem</h3>
                            </div>
                            <div className="glass-panel p-4 border-red-500/10 bg-red-500/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg shrink-0">
                                    <Avatar src="https://i.pravatar.cc/150?img=14" name="After Hours" variant="square" size="w-full h-full" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-white">After Hours</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">The Weeknd</p>
                                </div>
                                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">Both Love this</span>
                            </div>
                        </section>
                    )
                )}

                {/* Now Playing (Conditional) */}
                {(isMe ? profile.showCurrentSong : true) && (
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Headphones size={18} className="text-brand-teal" />
                            <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Now Playing</h3>
                        </div>
                        {isLoading ? (
                            <div className="glass-panel p-4 flex items-center gap-4 relative overflow-hidden border-brand-teal/20">
                                <Skeleton width="64px" height="64px" className="rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton width="60%" height="16px" />
                                    <Skeleton width="40%" height="10px" />
                                </div>
                                <Skeleton width="40px" height="40px" className="rounded-xl" />
                            </div>
                        ) : !profile.connected_service ? (
                            <EnginePlaceholder 
                                title="No Live Sync" 
                                message="Sync an engine to show your live vibrations on your profile."
                            />
                        ) : (
                            <div className="glass-panel p-4 flex items-center gap-4 relative overflow-hidden group border-brand-teal/20">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-teal/10 rounded-full blur-3xl opacity-50" />
                                <div 
                                    className="relative w-16 h-16 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform shrink-0"
                                    onClick={() => showToast(`Opening album: ${profile.nowPlaying?.album}`)}
                                >
                                    <img src={profile.nowPlaying?.img ? `https://i.pravatar.cc/150?img=${profile.nowPlaying.img}` : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80'} className="w-full h-full object-cover" alt="Album" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className="w-2 h-2 rounded-full bg-brand-teal shadow-[0_0_10px_#2de2b3]"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => showToast(`Opening album: ${profile.nowPlaying?.album}`)}>
                                    <h4 className="text-sm font-black text-white truncate">{profile.nowPlaying?.title || 'Unknown Track'}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{profile.nowPlaying?.artist || 'Unknown Artist'}</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <span className="text-[8px] font-black bg-brand-teal/10 text-brand-teal px-1.5 py-0.5 rounded uppercase tracking-tighter animate-pulse">Live Sync</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        className="p-2.5 rounded-xl bg-brand-teal text-brand-bg hover:scale-105 transition-transform shadow-lg shadow-brand-teal/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showToast(`${profile.nowPlaying?.title} added to your playlist!`, e);
                                        }}
                                    >
                                        <Plus size={18} />
                                    </button>
                                    <Heart className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer" size={20} />
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Listening History */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={18} className="text-brand-teal" />
                            <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Recent Sessions</h3>
                        </div>
                        <button className="text-[10px] font-black text-gray-600 uppercase tracking-widest">See All</button>
                    </div>
                    
                    <div className="space-y-3">
                        {isLoading ? (
                            [1,2,3].map(i => (
                                <div key={i} className="flex items-center gap-4 p-2 transition-all">
                                    <Skeleton width="48px" height="48px" className="rounded-xl shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton width="50%" height="14px" />
                                        <Skeleton width="30%" height="10px" />
                                    </div>
                                    <Skeleton width="24px" height="14px" />
                                </div>
                            ))
                        ) : !profile.connected_service ? (
                            <EnginePlaceholder 
                                title="Cosmic History Locked" 
                                message="Connect to an engine to reveal your historical music patterns."
                            />
                        ) : (
                            (profile.recentHistory || []).map((track, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-2 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
                                >
                                    <Avatar 
                                        src={track.img} 
                                        name={track.title}
                                        variant="square"
                                        size="w-12 h-12"
                                        className="grayscale group-hover:grayscale-0 transition-all shadow-lg hover:scale-105 cursor-pointer" 
                                        onClick={() => showToast(`Opening album: ${track.album}`)}
                                    />
                                    <div className="flex-1 cursor-pointer" onClick={() => showToast(`Opening album: ${track.album}`)}>
                                        <p className="text-sm font-bold text-gray-200">{track.title}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{track.artist}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-black text-gray-700 uppercase">{track.time}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                triggerBurst(e);
                                                showToast(`${track.title} adopt-ed!`);
                                            }}
                                            className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:text-brand-teal hover:bg-brand-teal/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>


            {/* Particle Bursts Layer */}
            {bursts.map(burst => (
                <ParticleBurst 
                  key={burst.id} 
                  x={burst.x} 
                  y={burst.y} 
                  onComplete={() => removeBurst(burst.id)} 
                />
            ))}
        </div>
    );
};

export default UserProfile;
