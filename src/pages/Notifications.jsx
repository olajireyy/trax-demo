import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Repeat, Play, ChevronLeft, BellOff, UserPlus, Users, Check, X, Music, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';
import { useUser } from '../components/UserContext';
import { useFeedback } from '../components/FeedbackContext';
import Avatar from '../components/Avatar';
import api from '../api';

const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { showToast } = useFeedback();
    const [isLoading, setIsLoading] = React.useState(true);
    const [notifications, setNotifications] = React.useState([]);

    const getRelativeTime = (isoString) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        
        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        
        const diffInHours = Math.floor(diffInMins / 60);
        if (diffInHours < 24) return `${diffInHours}h ${diffInMins % 60}m ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString();
    };

    React.useEffect(() => {
        const fetchNotifications = async () => {
            if (!user.isAuthenticated) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get('/social/notifications/');
                // Map the relative time format
                const mappedNotifications = res.data.map(n => ({
                    ...n,
                    time: getRelativeTime(n.timestamp)
                }));
                
                setNotifications(mappedNotifications);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotifications();
    }, [user.isAuthenticated]);

    const filterNotification = (n) => {
        const prefs = user?.preferences || {};
        
        // Social Alerts
        if (['like', 'share', 'friend_request', 'group_invite', 'mutual_match', 'message'].includes(n.type)) {
            return prefs.notificationSocialAlerts !== false;
        }
        
        // Artist Updates
        if (['new_release', 'tour_date'].includes(n.type)) {
            return prefs.notificationArtistUpdates !== false;
        }
        
        // Weekly Recap
        if (n.type === 'weekly_recap') {
            return prefs.notificationWeeklyRecap !== false;
        }
        
        return true;
    };

    const handleAction = async (id, action) => {
        const actionType = action === 'Accept' ? 'accept' : 'reject';
        try {
            await api.put(`/social/friends/requests/${id}/`, { action: actionType });
            setNotifications(notifications.filter(n => n.id !== id));
            showToast(`Friend request ${actionType}ed.`, 'success');
        } catch (err) {
            console.error("Action failed", err);
            showToast("Action failed. Try again.", "error");
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'like': return <Heart size={10} fill="currentColor" />;
            case 'share': return <Repeat size={10} strokeWidth={3} />;
            case 'group_invite': return <Users size={10} />;
            case 'friend_request': return <UserPlus size={10} />;
            case 'mutual_match': return <Music size={10} />;
            case 'message': return <MessageSquare size={10} />;
            default: return <Play size={10} fill="currentColor" />;
        }
    };

    const getColor = (type) => {
        switch(type) {
            case 'like': return 'bg-red-500';
            case 'share': return 'bg-brand-purple';
            case 'group_invite': return 'bg-brand-teal';
            case 'friend_request': return 'bg-brand-purple';
            case 'mutual_match': return 'bg-brand-teal';
            case 'message': return 'bg-brand-purple';
            default: return 'bg-brand-teal';
        }
    };

    return (
        <div className="px-4 pt-12 space-y-6 relative min-h-screen bg-brand-bg pb-24 text-white">
            {/* Header Setup */}
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 italic">
                    Inboxed <span className="text-brand-teal">Activity</span>
                </h1>
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
            </header>

            <main className="space-y-4">
                {isLoading ? (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Scanning Orbits...</h3>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="glass-panel p-4 space-y-3">
                                <div className="flex items-center gap-4">
                                    <Skeleton width="48px" height="48px" circle />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton width="60%" height="12px" />
                                        <Skeleton width="40%" height="10px" />
                                        <Skeleton width="20%" height="8px" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.filter(filterNotification).length > 0 ? (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Active Orbits</h3>
                        <AnimatePresence>
                            {notifications
                                .filter(filterNotification)
                                .map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`glass-panel p-4 space-y-3 cursor-pointer group hover:border-brand-teal/30 ${item.isNew ? 'border-brand-teal/20 bg-brand-teal/5' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar src={item.img || `https://i.pravatar.cc/150?u=${item.fallbackUsername}`} name={item.user} size="w-12 h-12" className="border border-white/10 shadow-lg" />
                                                <div className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-1 shadow-md">
                                                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ${getColor(item.type)}`}>
                                                        {getIcon(item.type)}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="max-w-[180px]">
                                                <p className="text-xs font-bold leading-tight">
                                                    {item.user} <span className="text-gray-500 font-medium">{item.text}</span>
                                                </p>
                                                <p className="text-[10px] font-bold truncate mt-0.5 text-brand-purple italic">
                                                    {item.target}
                                                </p>
                                                <p className="text-[8px] font-black text-gray-600 uppercase mt-1 tracking-widest">{item.time}</p>
                                            </div>
                                        </div>
                                        
                                        {item.targetImg && (
                                            <Avatar src={`https://i.pravatar.cc/150?img=${item.targetImg}`} name="Notification Target" variant="square" size="w-9 h-9" className="shadow-xl group-hover:scale-110 transition-transform" />
                                        )}
                                    </div>

                                    {item.actions && item.actions.length > 0 && (
                                        <div className="flex gap-2 pt-1">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'Accept'); }}
                                                className="flex-1 py-2 rounded-lg bg-brand-teal text-brand-bg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
                                            >
                                                <Check size={12} /> Accept
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'Decline'); }}
                                                className="flex-1 py-2 rounded-lg bg-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-white/10 transition-colors"
                                            >
                                                <X size={12} /> Decline
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                    <BellOff size={48} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">No unread signals</p>
                    <p className="text-xs font-medium mt-2">Interact with others to start the cosmos!</p>
                </div>
            )}
        </main>
    </div>
  );
};

export default Notifications;
