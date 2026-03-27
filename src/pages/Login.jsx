import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';

const Login = () => {
    const { user, isLoading } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && user.isAuthenticated) {
            navigate('/dashboard');
        }
    }, [user, isLoading, navigate]);

    const handleSpotifyLogin = () => {
        // Mock successful login call
        login({
            id: 1,
            name: "Alex Designer",
            username: "alex_design",
            email: "alex@example.com",
            bio: "Creating stunning visual experiences and writing code for the music soul.",
            avatar_url: "https://i.pravatar.cc/150?u=alex",
            is_pro: true,
            connected_service: "spotify",
            show_current_song: true,
            allow_profile_search: true,
            artist_notifications: true,
            friend_notifications: true,
            weekly_summaries: true,
            dark_mode: true
        });
        navigate('/dashboard');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-white/10 border-t-brand-teal rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg text-white px-6 text-center">
            <div className="mb-10 relative">
                <div className="w-24 h-24 bg-gradient-to-tr from-brand-teal to-brand-purple rounded-3xl rotate-12 absolute -top-4 -left-4 opacity-20 blur-xl animate-pulse"></div>
                <h1 className="text-6xl font-black italic tracking-tighter relative">TRAX</h1>
                <p className="text-brand-teal font-black uppercase tracking-[0.3em] text-[10px] mt-2">Music Intelligence</p>
            </div>

            <div className="glass-panel p-8 w-full max-w-sm border-white/5 bg-white/5 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Portfolio Demo</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Experience the full interface with sampled data. No real Spotify account required for this demo.
                    </p>
                </div>

                <button
                    onClick={handleSpotifyLogin}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90 text-brand-bg font-black py-4 px-8 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(45,226,179,0.3)] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                    Enter Demo
                </button>

                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                    Standalone Frontend Preview
                </p>
            </div>
        </div>
    );
};

export default Login;
