import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    MoreVertical, 
    Send, 
    Headphones, 
    Smile,
    Image as ImageIcon,
    Mic,
    Plus,
    X,
    Reply,
    Trash2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useFeedback } from '../components/FeedbackContext';
import api from '../api';
import Avatar from '../components/Avatar';
import { supabase } from '../lib/supabaseClient';

const ChatBox = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user: currentUser } = useUser();
    const { showConfirm, showToast } = useFeedback();
    const [message, setMessage] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const scrollRef = useRef(null);
    const menuRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [targetUser, setTargetUser] = useState({ name: 'Loading', img: null, status: 'Connecting...', isOnline: false });
    const [replyingTo, setReplyingTo] = useState(null);
    const [activeMessageId, setActiveMessageId] = useState(null);
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            if (!userId) return;
            try {
                const res = await api.get(`/social/chat/direct/${userId}/`);
                if (isMounted) {
                    setRoomId(res.data.room_id);
                    setMessages(prev => {
                        const fetchedMap = new Map(res.data.messages.map(m => [m.id, m]));
                        const merged = [...res.data.messages];
                        
                        // Prevent UI flicker by keeping optimistic messages until the server confirms them
                        prev.forEach(localMsg => {
                            if (localMsg.isOptimistic) {
                                // Keep the optimistic sending bubble ONLY if the real message hasn't arrived in the fetch yet
                                const isNowConfirmed = res.data.messages.some(rm => rm.text === localMsg.text && rm.sender === localMsg.sender);
                                if (!isNowConfirmed) merged.push(localMsg);
                            } else if (!fetchedMap.has(localMsg.id)) {
                                // A real message that disappeared from the fetch (stale read race condition). Keep it.
                                merged.push(localMsg);
                            }
                        });
                        
                        // Sort so optimistic/unsaved messages always stay at the bottom
                        return merged.sort((a, b) => {
                            if (a.isOptimistic && !b.isOptimistic) return 1;
                            if (!a.isOptimistic && b.isOptimistic) return -1;
                            return a.id - b.id; 
                        });
                    });
                    setTargetUser(res.data.user);
                }
            } catch (err) {
                console.error("Failed to load conversation", err);
            }
        };

        fetchMessages();
        
        let channel = null;
        let interval = null;
        
        // Supabase Realtime Subscription (Only if configured)
        if (supabase) {
            channel = supabase
                .channel(`room_${userId}`) 
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'social_message' },
                    (payload) => {
                        console.log('New message received via real-time!', payload);
                        fetchMessages(); 
                    }
                )
                .subscribe();
        } else {
            // Temporary 3-second polling fallback since Supabase env vars are missing
            interval = setInterval(fetchMessages, 3000);
        }

        return () => {
            isMounted = false;
            if (interval) clearInterval(interval);
            if (supabase && channel) supabase.removeChannel(channel);
        };
    }, [userId]);

    const handleSend = async () => {
        if (!message.trim() || !userId) return;
        
        const tempId = Date.now();
        const optimisticMsg = {
            id: tempId,
            sender: currentUser.username,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            is_read: false,
            isOptimistic: true,
            reply_to_text: replyingTo ? replyingTo.text : null
        };
        
        // Optimistic UI update: instantly show the message on screen
        setMessages(prev => [...prev, optimisticMsg]);
        const messageToSend = message;
        const replyToId = replyingTo ? replyingTo.id : null;
        
        setMessage(''); // clear input instantly
        setReplyingTo(null);
        setActiveMessageId(null);
        
        try {
            const res = await api.post(`/social/chat/direct/${userId}/`, { 
                content: messageToSend,
                reply_to_id: replyToId
            });
            
            // Just let fetchMessages or the Supabase realtime hook pull down the final confirmed message.
            // When fetchMessages runs, it will safely overwrite our temporary optimistic message.
        } catch (err) {
            console.error("Failed to send message", err);
            // Revert optimistic update only on total failure
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const handleDeleteMessage = (msgId) => {
        showConfirm({
            title: "Delete Message",
            message: "Are you sure you want to delete this message? This action cannot be undone.",
            confirmText: "Delete",
            type: "danger",
            onConfirm: async () => {
                try {
                    // Optimistic delete
                    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_deleted: true, text: "This message was deleted." } : m));
                    setActiveMessageId(null);
                    await api.delete(`/social/chat/message/${msgId}/`);
                } catch (err) {
                    console.error("Failed to delete message", err);
                    showToast("Failed to delete message.", "error");
                }
            }
        });
    };

    const handleDeleteConversation = () => {
        if (!roomId) return;
        showConfirm({
            title: "Delete Conversation",
            message: "Are you sure you want to delete this entire conversation permanently?",
            confirmText: "Delete",
            type: "danger",
            onConfirm: async () => {
                try {
                    await api.delete(`/social/chat/room/${roomId}/`);
                    navigate('/social');
                } catch (err) {
                    console.error("Failed to delete conversation", err);
                    showToast("Failed to delete conversation.", "error");
                }
            }
        });
    };

    const handleBack = () => {
        // If there's no history, navigate to social hub
        if (window.history.length <= 1) {
            navigate('/social');
        } else {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    // Replaced by targetUser state

    return (
        <div className="flex flex-col h-[100dvh] bg-brand-bg relative overflow-hidden">
            {/* Redesigned Premium Header */}
            <header className="relative z-40 pb-4">
                <div className="glass-panel-heavy border-none !rounded-none px-4 py-5 flex items-center justify-between shadow-2xl backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={handleBack} 
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all pointer-events-auto"
                        >
                            <ChevronLeft size={20} />
                        </motion.button>
                        
                        <div 
                            className="flex items-center gap-3 group cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${userId}`)}
                        >
                            <div className="relative">
                                <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-brand-teal to-brand-purple">
                                    <Avatar src={targetUser.img} name={targetUser.name} size="w-full h-full" className="border-2 border-brand-bg" />
                                </div>
                                {targetUser.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-brand-teal border-2 border-brand-bg rounded-full shadow-lg" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-base font-black leading-tight text-white tracking-tight">{targetUser.name}</h2>
                                <motion.div 
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: [0.8, 1, 0.8] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex items-center gap-1.5"
                                >
                                    <Headphones size={12} className="text-brand-teal animate-pulse" />
                                    <span className="text-[10px] text-gray-400 font-bold tracking-wide italic whitespace-nowrap overflow-hidden">"Vibing on {targetUser.status}"</span>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 relative" ref={menuRef}>
                         <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all"
                        >
                            <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 w-48 glass-panel-heavy p-2 border-white/10 shadow-3xl z-50 rounded-2xl"
                                >
                                    <button 
                                        onClick={() => {
                                            setShowMenu(false);
                                            showConfirm({
                                                title: 'Remove Mutual Connection',
                                                message: `Are you sure you want to remove ${targetUser.name}? You will both lose access to this chat permanently.`,
                                                confirmText: 'Remove Connection',
                                                type: 'danger',
                                                onConfirm: async () => {
                                                    try {
                                                        await api.delete(`/social/friends/${userId}/`);
                                                        showToast(`Connection with ${targetUser.name} severed.`);
                                                        navigate('/social');
                                                    } catch (err) {
                                                        showToast("Failed to remove connection.", "error");
                                                    }
                                                }
                                            });
                                        }}
                                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/10 text-red-500 transition-colors"
                                    >
                                        Remove Connection
                                    </button>
                                    <button className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 text-gray-400 transition-colors">
                                        Report Profile
                                    </button>
                                    <button 
                                        onClick={handleDeleteConversation}
                                        className="w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/10 text-red-500 transition-colors"
                                    >
                                        Delete Conversation
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                
                {/* Visual Depth Accent */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </header>



            {/* Messages Area */}
            <main 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-32 pt-6"
            >
                <div className="flex justify-center mb-8">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">Today</span>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div 
                            key={m.id}
                            initial={(m.isOptimistic || m.sender !== currentUser.username) ? { opacity: 0, y: 10, scale: 0.95 } : false}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex ${m.sender === currentUser.username ? 'justify-end' : 'justify-start'} mb-2 items-end gap-2`}
                        >
                            {m.sender !== currentUser.username && (
                                <Avatar src={m.senderImg} name={m.sender} size="sm" className="mb-4" />
                            )}
                            <div className={`max-w-[75%] space-y-1 ${m.sender === currentUser.username ? 'items-end' : 'items-start'}`}>
                                <div 
                                    onClick={() => setActiveMessageId(activeMessageId === m.id ? null : m.id)}
                                    className={`relative px-4 py-3 text-sm font-medium cursor-pointer transition-transform active:scale-[0.98] ${
                                        m.sender === currentUser.username 
                                        ? 'bg-brand-teal text-brand-bg rounded-2xl rounded-tr-none shadow-[0_4px_15px_rgba(45,226,179,0.2)]' 
                                        : 'glass-panel text-white rounded-2xl rounded-tl-none border-white/5'
                                    }`}
                                >
                                    {m.reply_to_text && (
                                        <div className={`mb-2 pl-2 border-l-2 text-[10px] font-bold opacity-70 truncate line-clamp-2 leading-relaxed ${m.sender === currentUser.username ? 'border-brand-bg/30 text-brand-bg' : 'border-brand-teal/50 text-brand-teal'}`}>
                                            {m.reply_to_text}
                                        </div>
                                    )}
                                    <div className={m.is_deleted ? "italic opacity-50" : ""}>
                                        {m.text}
                                    </div>
                                    
                                    {/* Message Context Menu */}
                                    <AnimatePresence>
                                        {activeMessageId === m.id && !m.is_deleted && !m.isOptimistic && (
                                            <motion.div 
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className={`absolute top-full mt-1 z-30 flex gap-1 ${m.sender === currentUser.username ? 'right-0' : 'left-0'}`}
                                            >
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setReplyingTo(m); setActiveMessageId(null); }}
                                                    className="p-2 glass-panel bg-zinc-900 rounded-full hover:bg-white/10 text-white shadow-xl border-white/10"
                                                >
                                                    <Reply size={14} />
                                                </button>
                                                {m.sender === currentUser.username && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(m.id); }}
                                                        className="p-2 glass-panel bg-zinc-900 rounded-full hover:bg-red-500/20 text-red-500 shadow-xl border-red-500/20"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">
                                        {m.time}
                                    </p>
                                    {m.sender === currentUser.username && m.is_read && !m.isOptimistic && (
                                        <span className="text-[8px] font-black text-brand-teal uppercase tracking-tighter animate-pulse">Seen</span>
                                    )}
                                    {m.isOptimistic && (
                                         <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Sending...</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </main>

            {/* Input Area */}
            <div className="absolute bottom-6 left-0 right-0 px-4 z-20 flex flex-col gap-2">
                <AnimatePresence>
                    {replyingTo && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-panel p-3 mx-2 rounded-xl border-l-2 border-l-brand-teal text-left relative"
                        >
                            <button 
                                onClick={() => setReplyingTo(null)}
                                className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                            <div className="text-[10px] font-black tracking-widest uppercase text-brand-teal mb-1">
                                Replying to {replyingTo.sender}
                            </div>
                            <div className="text-xs text-gray-400 font-medium truncate pr-6">
                                {replyingTo.text}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="glass-panel p-2 flex items-center gap-2 border-white/10 shadow-2xl backdrop-blur-3xl">
                    <button className="p-2 text-gray-500 hover:text-brand-teal transition-colors">
                        <Plus className="rotate-45" size={20} />
                    </button>
                    <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a soulful message..."
                        className="flex-1 bg-transparent border-none text-sm font-bold text-white placeholder-gray-600 focus:outline-none py-2"
                    />
                    <div className="flex items-center gap-1 pr-1">
                        <button className="p-2 text-gray-500 hover:text-brand-teal transition-colors rounded-lg hover:bg-white/5">
                            <Smile size={20} />
                        </button>
                        <motion.button 
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSend}
                            className={`p-2 rounded-xl transition-all ${
                                message.trim() 
                                ? 'bg-brand-teal text-brand-bg shadow-lg shadow-brand-teal/20' 
                                : 'text-gray-500 bg-white/5'
                            }`}
                        >
                            <Send size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Background Orbs (Decorative) */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-teal op-10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-purple op-10 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
};

export default ChatBox;
