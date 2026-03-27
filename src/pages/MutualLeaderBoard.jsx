import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Music, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from '../components/MusicIcons';
import Skeleton from '../components/Skeleton';
import { useUser } from '../components/UserContext';
import EnginePlaceholder from '../components/EnginePlaceholder';
import Avatar from '../components/Avatar';
import api from '../api';

const MutualLeaderBoard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = React.useState(true);
  const [leaderboardData, setLeaderboardData] = React.useState([]);

  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user.connectedService) return;
      try {
        const res = await api.get('/social/leaderboard/');
        setLeaderboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user.connectedService]);

  const podium = [
    leaderboardData.find(u => u.rank === 2),
    leaderboardData.find(u => u.rank === 1),
    leaderboardData.find(u => u.rank === 3)
  ].filter(Boolean);

  const restOfList = leaderboardData.filter(u => u.rank > 3);

  const getProviderIcon = (provider, size = 12) => {
    switch(provider) {
        case 'spotify': return <SpotifyIcon size={size} className="text-[#1DB954]" />;
        case 'apple': return <AppleMusicIcon size={size} className="text-[#FC3C44]" />;
        case 'youtube': return <YoutubeMusicIcon size={size} className="text-[#FF0000]" />;
        default: return <div className="rounded-full bg-gray-700 flex items-center justify-center text-white font-black" style={{ width: size, height: size, fontSize: size*0.5 }}>ALL</div>;
    }
  };

  return (
    <div className="px-4 pt-12 space-y-8 relative pb-24">
        {/* Header Area */}
        <header className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-yellow-400/10 text-yellow-500 shadow-lg shadow-yellow-500/5">
                <Trophy size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white mt-2">
                Mutual <span className="text-brand-teal">Leaderboard</span>
            </h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Week 09 • Global Prestige</p>
        </header>

        {!user.connectedService ? (
            <div className="pt-4">
                <EnginePlaceholder 
                    type="full"
                    title="Leaderboard Restricted"
                    message="You haven't synced your music engine. Join the cosmic competition by linking your service."
                />
            </div>
        ) : (
            <>
                {/* Podium Area - Recommendation #4 */}
                <div className="flex items-end justify-center gap-2 pt-8 px-2">
                    {isLoading ? (
                        [2, 1, 3].map((rank, idx) => (
                            <div key={rank} className={`flex flex-col items-center w-1/3 relative ${rank === 1 ? 'mb-2' : ''}`}>
                                <Skeleton circle width="64px" height="64px" className="mb-3" />
                                <Skeleton width="60%" height="12px" className="mb-1" />
                                <Skeleton width="40%" height="10px" className="mb-4" />
                                <Skeleton width="100%" height={rank === 1 ? '64px' : rank === 2 ? '40px' : '32px'} className="rounded-t-xl" />
                            </div>
                        ))
                    ) : (
                        podium.map((user, idx) => (
                            <motion.div 
                                key={user.rank}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2, duration: 0.8, ease: "easeOut" }}
                                onClick={() => !user.isYou && navigate(`/profile/${user.name.toLowerCase()}`)}
                                className={`flex flex-col items-center w-1/3 relative group cursor-pointer ${user.rank === 1 ? 'z-20 scale-110 mb-2' : 'z-10 opacity-90'}`}
                            >
                                {user.rank === 1 && (
                                    <motion.div 
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-10 text-3xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]"
                                    >
                                        👑
                                    </motion.div>
                                )}
                                
                                <div className="relative mb-3">
                                    <div className={`rounded-full p-1 bg-gradient-to-tr ${
                                        user.rank === 1 ? 'from-yellow-400 via-orange-500 to-yellow-600 shadow-[0_0_25px_rgba(255,165,0,0.4)]' : 
                                        user.rank === 2 ? 'from-gray-300 via-gray-400 to-gray-500 shadow-[0_0_15px_rgba(156,163,175,0.3)]' : 
                                        'from-amber-600 via-amber-700 to-amber-800 shadow-[0_0_15px_rgba(180,83,9,0.3)]'
                                    }`}>
                                        <div className="w-16 h-16 rounded-full bg-brand-bg p-1 overflow-hidden">
                                            <Avatar 
                                                src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.username || user.name}`} 
                                                name={user.name} 
                                                size="w-full h-full"
                                                className="rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs border-2 border-brand-bg ${
                                        user.rank === 1 ? 'bg-yellow-400 text-brand-bg' : 
                                        user.rank === 2 ? 'bg-gray-400 text-brand-bg' : 
                                        'bg-amber-700 text-white'
                                    }`}>
                                        {user.rank}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className={`text-xs font-black uppercase tracking-widest truncate w-24 ${user.isYou ? 'text-brand-teal' : 'text-white'}`}>
                                        {user.name}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-500 mt-0.5">{user.mins}m</p>
                                </div>

                                {/* Step Style Podium Base */}
                                <div className={`w-full mt-4 rounded-t-xl transition-all duration-700 group-hover:brightness-125 ${
                                    user.rank === 1 ? 'h-16 bg-gradient-to-b from-yellow-500/20 to-transparent border-t border-yellow-500/30' : 
                                    user.rank === 2 ? 'h-10 bg-gradient-to-b from-gray-500/10 to-transparent border-t border-gray-500/30' : 
                                    'h-8 bg-gradient-to-b from-amber-700/10 to-transparent border-t border-amber-700/30'
                                }`} />
                            </motion.div>
                        ))
                    )}
                </div>

                <main className="space-y-4">
                    {/* Column Headers */}
                    <div className="flex justify-between items-center px-4 pt-4 text-[10px] text-gray-600 font-extrabold uppercase tracking-[0.2em]">
                        <span>Member Profile</span>
                        <span>Weekly Minutes</span>
                    </div>

                    {/* Remaining List */}
                    <div className="space-y-3">
                        {isLoading ? (
                            [1,2,3,4].map(i => (
                                <div key={i} className="glass-panel px-4 py-3 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <Skeleton width="16px" height="12px" />
                                        <Skeleton circle width="40px" height="40px" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton width="40%" height="14px" />
                                            <Skeleton width="20%" height="8px" />
                                        </div>
                                    </div>
                                    <Skeleton width="48px" height="14px" />
                                </div>
                            ))
                        ) : (
                            restOfList.map((user, idx) => (
                                <motion.div 
                                    key={user.rank}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-panel px-4 py-3 flex items-center justify-between group hover:border-brand-teal/30 hover:bg-white/5 transition-all cursor-pointer"
                                    onClick={() => navigate(`/profile/${user.name.toLowerCase()}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-gray-700 w-4 tabular-nums">
                                            {user.rank}
                                        </span>
                                        <div className="relative">
                                            <Avatar src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.username || user.name}`} name={user.name} size="w-10 h-10" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white group-hover:text-brand-teal transition-colors">
                                                {user.name}
                                            </span>
                                            <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                                {getProviderIcon(user.provider, 10)}
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Premium</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                         <div className="text-sm font-black text-white italic tracking-tight">{user.mins}</div>
                                         <div className="text-[8px] font-black text-brand-teal uppercase tracking-widest">+4%</div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>
            </>
        )}
    </div>
  );
};

export default MutualLeaderBoard;
