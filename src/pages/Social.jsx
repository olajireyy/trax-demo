import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    UserPlus, 
    MessageSquare, 
    Search, 
    Plus,
    Send,
    X,
    Music,
    Clock,
    Trash2
} from 'lucide-react';

import ParticleBurst from '../components/ParticleBurst';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { useFeedback } from '../components/FeedbackContext';
import { useUser } from '../components/UserContext';
import Avatar from '../components/Avatar';

const Social = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'messages';
    const { showToast, showConfirm } = useFeedback();
    const { user, unreadMetrics } = useUser();
    const [bursts, setBursts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestedFriendIds, setRequestedFriendIds] = useState([]);
    
    // API Data State
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [messages, setMessages] = useState([]);
    const [totalUnread, setTotalUnread] = useState(0);
    const [suggested, setSuggested] = useState([]);
    const [isSelectingMutual, setIsSelectingMutual] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState(() => {
        const saved = localStorage.getItem('trax_search_history');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('trax_search_history', JSON.stringify(searchHistory));
    }, [searchHistory]);

    const handleTabChange = (tab) => {
        setSearchParams({ tab });
    };

    const strToSeed = (str) => {
        if (!str) return '1';
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 70).toString();
    };

    const removeBurst = (id) => {
        setBursts(prev => prev.filter(b => b.id !== id));
    };

    const fetchData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            // Always fetch friends (mutuals) for the New Chat flow
            const friendRes = await api.get('/social/friends/');
            setFriends((friendRes.data.friends || []).map(f => ({
                ...f,
                img: f.avatar_url,
                status: 'Active on Trax'
            })));
            setRequests((friendRes.data.pending_incoming_requests || []).map(r => ({
                connection_id: r.connection_id,
                id: r.user.id,
                name: r.user.name || r.user.username,
                img: r.user.avatar_url,
                compatibility: '85%'
            })));

            

            if (activeTab === 'messages') {
                const res = await api.get('/social/chat/rooms/');
                setMessages((res.data.rooms || []).map(m => ({
                    ...m,
                    lastMsg: m.last_message || 'No messages yet',
                    unreadCount: m.unread_count || 0
                })));
                setTotalUnread(res.data.total_unread || 0);
            }

            if (activeTab === 'discover' && !searchQuery) {
                const res = await api.get('/social/suggestions/');
                setSuggested(res.data.map(s => ({
                    id: s.id,
                    name: s.name || s.username,
                    img: s.avatar_url,
                    mutual: s.mutual || 0
                })));
            }
        } catch (err) {
            console.error("Failed to fetch social data", err);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, [activeTab, searchQuery]);

    // Initial fetch on tab change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Real-time polling engine — silently refresh every 5 seconds
    const pollRef = useRef(null);
    useEffect(() => {
        pollRef.current = setInterval(() => {
            fetchData(true);
        }, 5000);
        return () => clearInterval(pollRef.current);
    }, [fetchData]);



    const handleAcceptRequest = useCallback(async (id, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        try {
            await api.put(`/social/friends/requests/${id}/`, { action: 'accept' });
            setBursts(prev => [...prev, { id: Date.now(), x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }]);
            setRequests(prev => prev.filter(req => req.id !== id));
            showToast('Mutual connection established! 🥂', 'success');
            fetchData(); // Refresh friends list
        } catch (err) {
            showToast('Failed to accept request.', 'error');
        }
    }, [showToast, fetchData]);

    const handleRejectRequest = useCallback(async (id) => {
        try {
            await api.put(`/social/friends/requests/${id}/`, { action: 'reject' });
            setRequests(prev => prev.filter(req => req.id !== id));
            showToast('Request declined.');
        } catch (err) {
            showToast('Failed to decline request.', 'error');
        }
    }, [showToast]);

   

    const executeSearch = useCallback(async (query) => {
        if (!query.trim()) {
            fetchData(); // Refresh Discoveries fallback
            return;
        }

        // Logic to add to history (limit to 5)
        const addToHistory = (q) => {
            setSearchHistory(prev => {
                const filtered = prev.filter(item => item !== q);
                return [q, ...filtered].slice(0, 5);
            });
        };

        try {
            const res = await api.get(`/social/search/?q=${query}`);
            setSuggested(res.data.map(s => ({
                id: s.id,
                name: s.name || s.username,
                username: s.username,
                img: s.avatar_url,
                mutual: s.mutual || 0
            })));
            
            // Add to history if results found (optional refinement)
            if (res.data.length > 0) {
                addToHistory(query);
            }
        } catch (err) {
            console.error("Search failed", err);
        }
    }, [fetchData]);

    const clearHistory = () => {
        setSearchHistory([]);
        localStorage.removeItem('trax_search_history');
    };

    const removeFromHistory = (q) => {
        setSearchHistory(prev => prev.filter(item => item !== q));
    };

    const handleAddFriend = useCallback(async (userId, name) => {
        try {
            await api.post('/social/friends/requests/', { receiver_id: userId });
            setRequestedFriendIds(prev => [...prev, userId]);
            showToast(`Request sent to ${name} 🛰️`, 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send request.', 'error');
        }
    }, [showToast]);

const ChatSkeleton = () => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-transparent">
        <div className="flex items-center gap-4">
            <Skeleton circle width="48px" height="48px" />
            <div className="space-y-2">
                <Skeleton width="120px" height="14px" />
                <Skeleton width="180px" height="10px" />
            </div>
        </div>
        <Skeleton width="40px" height="10px" />
    </div>
);

const TabButton = ({ id, icon: Icon, label, activeTab, onTabChange, badge }) => (
    <button 
        onClick={() => onTabChange(id)}
        className={`flex flex-col items-center gap-1.5 pb-3 flex-1 relative transition-all haptic-hover ${activeTab === id ? 'text-brand-teal' : 'text-gray-500 hover:text-white'}`}
    >
        <div className="relative">
            <Icon size={20} />
            {badge > 0 && (
                <div className="absolute -top-2 -right-2 min-w-[14px] h-[14px] bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border border-brand-bg shadow-lg">
                    {badge > 10 ? '10+' : badge}
                </div>
            )}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        {activeTab === id && (
            <motion.div layoutId="socialTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" />
        )}
    </button>
);

    return (
        <div className="px-4 pt-12 space-y-6 relative pb-24">
            {/* Header */}
            <header className="flex items-center justify-between px-2">
                <h1 className="text-2xl font-black tracking-tighter italic">Social <span className="text-brand-teal">Hub</span></h1>
            </header>

            {/* Premium Tabs */}
            <div className="flex px-2 border-b border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
                <TabButton id="messages" icon={MessageSquare} label="Chats" activeTab={activeTab} onTabChange={(id) => { setIsSelectingMutual(false); handleTabChange(id); }} badge={totalUnread} />
                <TabButton id="discover" icon={UserPlus} label="Discover" activeTab={activeTab} onTabChange={(id) => { setIsSelectingMutual(false); handleTabChange(id); }} badge={unreadMetrics?.pending_requests} />
            </div>

            {/* Content Area */}
            <main>
                <AnimatePresence mode="wait">
                    {activeTab === 'messages' && isSelectingMutual && (
                        <motion.div 
                            key="select-mutual"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Mutual</h3>
                                <button 
                                    onClick={() => setIsSelectingMutual(false)}
                                    className="text-[10px] font-black text-brand-teal uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                            </div>
                            <div className="space-y-3">
                                {friends.length > 0 ? (
                                    friends.map((f, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => {
                                                navigate(`/chat/${f.id}`);
                                                setIsSelectingMutual(false);
                                            }}
                                            className="glass-panel p-4 flex items-center justify-between group cursor-pointer hover:border-brand-teal/30"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar src={f.img} name={f.name || f.username} size="w-12 h-12" className="border border-white/10" />
                                                <div>
                                                    <span className="font-bold text-sm">{f.name || f.username}</span>
                                                    <p className="text-[10px] text-gray-500">Mutual connection</p>
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-lg bg-brand-teal/10 text-brand-teal">
                                                <Send size={14} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState 
                                        icon={Users}
                                        title="No Mutuals"
                                        description="You need to establish mutual connections before starting a chat."
                                        actionLabel="Discover People"
                                        onAction={() => handleTabChange('discover')}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}


                    {activeTab === 'discover' && (
                        <motion.div 
                            key="discover"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-6"
                        >
                            <div className="glass-panel px-4 py-3 flex items-center gap-3">
                                <Search size={18} className="text-gray-500" />
                                <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchQuery)}
                                    placeholder="Search exact username, hit Enter..." 
                                    className="bg-transparent border-none text-sm font-bold placeholder-gray-600 w-full focus:outline-none" 
                                />
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(''); fetchData(); }} className="text-gray-500 hover:text-white transition-colors">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {!searchQuery && searchHistory.length > 0 && (
                                    <motion.section 
                                        key="history"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recent Searches</h3>
                                            <button onClick={clearHistory} className="text-[9px] font-black text-gray-600 hover:text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                <Trash2 size={10} /> Clear
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 px-1">
                                            {searchHistory.map((q, i) => (
                                                <div 
                                                    key={i}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-brand-teal/30 group transition-all cursor-pointer"
                                                    onClick={() => executeSearch(q)}
                                                >
                                                    <Clock size={12} className="text-gray-600 group-hover:text-brand-teal" />
                                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white">{q}</span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); removeFromHistory(q); }}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={10} className="text-gray-600 hover:text-red-500" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                
                            {/* Incoming Requests — Horizontal Carousel */}
                            {requests.length > 0 && (
                                <section className="space-y-3">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Incoming Requests</h3>
                                        <span className="text-[9px] font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full animate-pulse">{requests.length} New</span>
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
                                        <AnimatePresence>
                                            {requests.map((req) => (
                                                <motion.div
                                                    key={req.connection_id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="flex-shrink-0 w-[140px] glass-panel p-3 flex flex-col items-center text-center gap-2 border border-white/5 hover:border-brand-teal/20 transition-all"
                                                >
                                                    <Avatar src={req.img} name={req.name} size="w-12 h-12" className="border-2 border-brand-purple/30" />
                                                    <p className="font-bold text-xs text-white truncate w-full">{req.name}</p>
                                                    <p className="text-[8px] text-brand-teal font-black uppercase tracking-wider">Wants to connect</p>
                                                    <div className="flex gap-1.5 w-full mt-1">
                                                        <button
                                                            onClick={() => handleRejectRequest(req.connection_id)}
                                                            className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[9px] font-black uppercase hover:bg-red-500/20 transition-all"
                                                        >
                                                            Pass
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleAcceptRequest(req.connection_id, e)}
                                                            className="flex-1 py-1.5 rounded-lg bg-brand-teal/10 text-brand-teal text-[9px] font-black uppercase hover:bg-brand-teal/20 transition-all"
                                                        >
                                                            Accept
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            )}
                            </div>

                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">
                                    {searchQuery ? 'Search Results' : 'Suggested for you'}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {suggested.length === 0 && searchQuery ? (
                                        <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center opacity-60">
                                            <Search size={32} className="mb-2 text-gray-500" />
                                            <p className="text-sm font-bold text-gray-300">None found</p>
                                            <p className="text-[10px] text-gray-500">Try an exact username</p>
                                        </div>
                                    ) : (
                                        suggested.map((s, i) => {
                                            const isRequested = requestedFriendIds.includes(s.id);
                                            return (
                                                <div key={i} className="glass-panel p-4 flex flex-col items-center text-center gap-3 relative">
                                                    <Avatar src={s.img} name={s.name} size="w-16 h-16" className="border-2 border-brand-teal/20" />
                                                    <div>
                                                        <p className="font-bold text-sm w-[120px] truncate">{s.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">@{s.username}</p>
                                                        {!searchQuery && (
                                                             <p className="text-[9px] text-brand-teal font-black uppercase mt-1">{s.mutual} Mutuals</p>
                                                        )}
                                                    </div>
                                                    <button 
                                                        disabled={isRequested}
                                                        onClick={(e) => handleAddFriend(s.id, s.name)}
                                                        className={`py-1.5 text-[10px] w-full rounded-full font-black uppercase tracking-widest transition-all ${isRequested ? 'bg-gray-800 text-gray-500 italic' : 'btn-primary'}`}
                                                    >
                                                        {isRequested ? 'Requested' : 'Add'}
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'messages' && !isSelectingMutual && (
                        <motion.div 
                            key="messages"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Chats</h3>
                                <button 
                                    onClick={() => setIsSelectingMutual(true)}
                                    className="flex items-center gap-2 p-2 px-4 rounded-full bg-brand-teal/10 text-brand-teal text-[10px] font-black uppercase tracking-widest hover:bg-brand-teal/20 transition-all haptic-hover"
                                >
                                    <Plus size={14} /> New Chat
                                </button>
                            </div>
                            <div className="space-y-2">
                                {isLoading ? (
                                    <>
                                        <ChatSkeleton />
                                        <ChatSkeleton />
                                        <ChatSkeleton />
                                    </>
                                ) : messages.length > 0 ? messages.map((m, i) => (
                                    <div 
                                        key={i} 
                                        onClick={() => navigate(`/chat/${m.target_user_id}`)}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-white/5 ${m.unread ? 'bg-brand-teal/5 border-brand-teal/10' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar src={m.img} name={m.name} size="w-12 h-12" variant="circle" />
                                                {m.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-teal rounded-full border-2 border-brand-bg shadow-[0_0_8px_rgba(45,226,179,0.5)]" />}
                                            </div>
                                            <div className="max-w-[180px]">
                                                <h4 className={`text-sm font-bold ${m.unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>{m.name}</h4>
                                                <p className={`text-xs truncate ${m.unreadCount > 0 ? 'text-brand-teal font-semibold' : 'text-gray-500'}`}>{m.lastMsg}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="text-[9px] font-black text-gray-600 uppercase tracking-tighter">{m.time}</span>
                                            {m.unreadCount > 0 && (
                                                <div className="px-1.5 py-0.5 bg-brand-teal/20 rounded font-black text-[8px] text-brand-teal border border-brand-teal/20">
                                                    {m.unreadCount} NEW
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <EmptyState 
                                        icon={MessageSquare}
                                        title="No Conversations Yet"
                                        description="Start a chat with your mutuals or find people to connect with!"
                                        actionLabel="Find Friends"
                                        onAction={() => handleTabChange('discover')}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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

export default Social;
