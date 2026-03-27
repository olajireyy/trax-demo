import React, { useState, useEffect } from 'react';
import api from '../api';
import Avatar from '../components/Avatar';
import { useFeedback } from '../components/FeedbackContext';

const AddFriends = () => {
    const { showToast } = useFeedback();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sentRequests, setSentRequests] = useState(new Set());

    const executeSearch = async (currentQuery) => {
        if (!currentQuery.trim()) {
            setUsers([]);
            return;
        }
        setIsLoading(true);
        try {
            const res = await api.get(`/social/search/?q=${currentQuery}`);
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdd = async (userId) => {
        try {
            await api.post('/social/friends/requests/', { receiver_id: userId });
            setSentRequests(new Set([...sentRequests, userId]));
            showToast("Friend request sent!", "success");
        } catch (err) {
            console.error("Add friend error:", err);
            const msg = err.response?.data?.message || err.response?.data?.error || "Failed to send request";
            showToast(msg, "error");
        }
    };
    return (
        <div className="min-h-screen bg-brand-bg text-white relative overflow-hidden pb-32">
            {/* Subtle Background Orbs */}
            <div className="absolute top-10 right-10 w-80 h-80 bg-brand-teal rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-brand-purple rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>

            {/* Header Setup */}
            <header className="px-6 pt-12 pb-4 z-10 relative flex items-center justify-between">
                <button className="text-gray-400 hover:text-white mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                </button>
                <h1 className="text-xl font-bold flex-1 text-center pr-6">Add Friends</h1>
            </header>

            <main className="px-6 space-y-6 z-10 relative mt-2">
                
                {/* Search Bar - Glass Panel */}
                <div className="glass-panel w-full flex items-center px-4 py-3 mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#9CA3AF" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeSearch(query)}
                        placeholder="Search exact username, hit Enter..." 
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder-gray-400"
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setUsers([]); }} className="text-gray-500 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {/* Section Title */}
                <h3 className="font-semibold text-lg mb-4">{query.length >= 1 ? "Search Results" : "Suggested Connections"}</h3>

                {/* Suggestions List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center text-sm text-gray-500 py-4">Searching the cosmos...</div>
                    ) : users.length === 0 && query ? (
                        <div className="text-center text-sm text-gray-500 py-8">
                            <p className="font-bold text-gray-300">None found</p>
                            <p className="text-xs mt-1">Try searching for an exact username.</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center text-sm text-gray-500 py-4">Type a name to begin.</div>
                    ) : (
                        users.map((u) => (
                            <div key={u.id} className="glass-panel p-4 flex items-center justify-between hover:border-brand-teal transition-colors">
                                <div className="flex items-center gap-4">
                                    <Avatar src={u.avatar_url} name={u.name || u.username} size="w-12 h-12" className="border border-white/10" />
                                    <div>
                                        <h4 className="font-semibold text-white">{u.name || u.username}</h4>
                                        <p className="text-xs text-brand-teal">@{u.username}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAdd(u.id)}
                                    disabled={sentRequests.has(u.id)}
                                    className={`text-sm font-semibold px-4 py-1.5 rounded-full transition-transform ${sentRequests.has(u.id) ? 'bg-gray-700 text-gray-400' : 'bg-brand-teal text-black hover:scale-105'}`}
                                >
                                    {sentRequests.has(u.id) ? 'Sent' : 'Add'}
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Invite Button */}
                <div className="pt-8">
                     <button className="w-full bg-brand-teal text-black font-bold text-lg rounded-full py-4 mt-2 hover:bg-[#20c997] transition-colors shadow-lg shadow-brand-teal/20">
                        Invite Friends
                    </button>
                </div>

            </main>
        </div>
    );
};

export default AddFriends;
