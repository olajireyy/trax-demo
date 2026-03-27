import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useUser } from '../components/UserContext';
import Skeleton from '../components/Skeleton';
import Avatar from '../components/Avatar';

const Chat = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            if (!user.token) return;
            try {
                const res = await api.get('/social/chat/rooms/');
                setRooms(res.data);
            } catch (err) {
                console.error("Failed to load chat rooms", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRooms();
    }, [user.token]);

    return (
        <div className="min-h-screen bg-brand-bg text-white relative overflow-hidden pb-32">
            {/* Subtle Background Orbs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-brand-teal rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
            <div className="absolute bottom-20 right-0 w-80 h-80 bg-brand-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

            {/* Header Setup */}
            <header className="px-6 pt-12 pb-4 z-10 relative flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <h1 className="text-xl font-bold flex-1 text-center">Chat</h1>
                <button onClick={() => navigate('/circles/browse')} className="text-gray-400 hover:text-white mt-1">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                </button>
            </header>

            <main className="px-6 space-y-2 z-10 relative mt-2">
                
                {/* Search Bar - Glass Panel */}
                <div className="glass-panel w-full flex items-center px-4 py-3 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#9CA3AF" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-400"
                    />
                </div>

                {/* Chat List Items */}
                <div className="space-y-1">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-3">
                                <Skeleton circle width="48px" height="48px" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton width="40%" height="14px" />
                                    <Skeleton width="70%" height="10px" />
                                </div>
                            </div>
                        ))
                    ) : rooms.length === 0 ? (
                        <div className="py-20 text-center opacity-50 flex flex-col items-center">
                            <span className="text-4xl mb-4">💬</span>
                            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">No active signals</p>
                            <p className="text-xs mt-2 text-gray-500">Reach out to a mutual listener down below.</p>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <div 
                                key={room.room_id} 
                                onClick={() => navigate(room.is_group ? `/circle/${room.circle_id || room.room_id}` : `/chat/${room.target_user_id}`)}
                                className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer relative"
                            >
                                <div className="flex items-center gap-4 pl-3">
                                    <div className="relative">
                                        <Avatar 
                                            src={room.img?.startsWith('http') ? room.img : `https://i.pravatar.cc/150?img=${room.img}`} 
                                            name={room.name}
                                            variant={room.is_group ? 'square' : 'circular'}
                                            size="w-12 h-12"
                                        />
                                        {room.is_group && (
                                            <div className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-0.5 border-2 border-brand-bg">
                                                <div className="w-3.5 h-3.5 bg-brand-purple rounded-full flex items-center justify-center">
                                                    <span className="text-[6px] font-black text-white">GRP</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">{room.name}</h4>
                                        <p className={`text-sm font-medium truncate w-48 ${room.last_message !== 'Start a conversation...' ? 'text-gray-400' : 'text-brand-teal'}`}>
                                            {room.last_message || '...'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-brand-teal font-medium">
                                    {room.time}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
};

export default Chat;
