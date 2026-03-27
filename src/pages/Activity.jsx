import React, { useState, useEffect } from 'react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Repeat, Play, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import Avatar from '../components/Avatar';

const Activity = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('activity');

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'activity') {
                const res = await api.get('/social/activity/');
                setActivities(res.data);
            } else {
                // Fetch real history
                const res = await api.get('/music/spotify/recently-played/');
                const formatted = res.data.map(item => ({
                    user: 'You',
                    action: 'played',
                    target: item.title,
                    artist: item.artist, // Added artist for clarity
                    time: new Date(item.played_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    img: user.avatar,
                    targetImg: item.img,
                    type: 'play'
                }));
                setActivities(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [activeTab, user.token]);

  const getIcon = (type) => {
    switch(type) {
      case 'like': return <Heart size={10} fill="currentColor" />;
      case 'share': return <Repeat size={10} strokeWidth={3} />;
      default: return <Play size={10} fill="currentColor" />;
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'mutual': return 'bg-brand-purple';
      case 'play': return 'bg-brand-teal';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="px-4 pt-12 space-y-6 relative">
        {/* Header Setup */}
        <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-brand-teal p-0.5">
                    <Avatar src={`https://i.pravatar.cc/150?img=${user.avatar}`} name={user.fullName} size="w-full h-full" />
                </div>
                <h1 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                    Activity <span className="text-red-500 animate-pulse">❤️</span>
                </h1>
            </div>
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <ChevronLeft size={20} />
            </button>
        </header>

        <main>
            {/* Tabs */}
            <div className="flex gap-8 mb-8 px-2 border-b border-white/5">
                {['activity', 'recent'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-brand-teal' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal" />
                        )}
                    </button>
                ))}
            </div>

            {/* Activity List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {isLoading ? (
                         <div className="py-20 text-center opacity-30 text-xs font-black uppercase tracking-widest">
                            Scanning frequencies...
                         </div>
                    ) : activities.length === 0 ? (
                        <div className="py-20 text-center opacity-40 flex flex-col items-center">
                            <span className="text-3xl mb-4">🛰️</span>
                            <p className="text-xs font-black uppercase tracking-widest">Quiet in the cosmos</p>
                            <p className="text-[10px] mt-2 text-gray-500">Your mutuals are silent right now.</p>
                        </div>
                    ) : (
                        activities.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                whileHover={{ x: 4 }}
                                className={`glass-panel p-4 flex items-center justify-between cursor-pointer group hover:border-brand-teal/30`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar 
                                            src={item.img?.startsWith('http') ? item.img : `https://i.pravatar.cc/150?img=${item.img}`} 
                                            name={item.user}
                                            size="w-12 h-12"
                                            className="grayscale group-hover:grayscale-0 transition-all border border-white/10" 
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-1 shadow-lg">
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-white ${getColor(item.type)}`}>
                                                {getIcon(item.type)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="max-w-[180px]">
                                        <p className="text-xs font-bold leading-tight">
                                            {item.user} <span className="text-gray-500 uppercase font-black text-[9px] ml-1">{item.action}</span>
                                        </p>
                                        <p className={`text-xs font-bold truncate mt-1 ${item.type === 'play' ? 'text-brand-teal' : item.type === 'mutual' ? 'text-brand-purple' : 'text-gray-300'}`}>
                                            {item.target}
                                        </p>
                                        {item.artist && (
                                            <p className="text-[10px] text-gray-500 font-bold truncate italic">{item.artist}</p>
                                        )}
                                        <p className="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-tighter">{item.time}</p>
                                    </div>
                                </div>
                                
                                {item.targetImg ? (
                                    <Avatar 
                                        src={item.targetImg.startsWith('http') ? item.targetImg : `https://i.pravatar.cc/150?img=${item.targetImg}`} 
                                        name="Activity Target"
                                        variant="square"
                                        size="w-10 h-10"
                                        className="shadow-2xl group-hover:scale-110 transition-transform" 
                                    />
                                ) : (
                                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-600 group-hover:text-brand-teal transition-colors">
                                        <Play size={16} fill="currentColor" />
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </main>
    </div>
  );
};

export default Activity;
