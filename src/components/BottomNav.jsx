import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Trophy, BarChart3 } from 'lucide-react';
import { useUser } from './UserContext';
import Avatar from './Avatar';

const BottomNav = () => {
    const { user, unreadMetrics } = useUser();

    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50">
            <div className="glass-panel pt-4 pb-6 px-10 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl rounded-t-[32px] rounded-b-none border-x-0 border-b-0">
                <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all haptic-press ${isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-white'}`}>
                    <Home size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                </NavLink>
                <NavLink to="/social" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all haptic-press ${isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-white'}`}>
                    <div className="relative">
                        <Users size={22} strokeWidth={2.5} />
                        {unreadMetrics?.has_notifications && (
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-brand-bg shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Social</span>
                </NavLink>
                <NavLink to="/insights" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all haptic-press ${isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-white'}`}>
                    <BarChart3 size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Stats</span>
                </NavLink>
                <NavLink to="/leaderboard" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all haptic-press ${isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-white'}`}>
                    <Trophy size={22} strokeWidth={2.5} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Ranks</span>
                </NavLink>
                <NavLink to="/profile/me" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all haptic-press ${isActive ? 'text-brand-teal' : 'text-gray-400 hover:text-white'}`}>
                    {({ isActive }) => (
                        <>
                            <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${isActive ? 'border-brand-teal shadow-[0_0_10px_rgba(45,226,179,0.5)]' : 'border-transparent group-hover:border-white/50'}`}>
                                <Avatar src={user.avatar} name={user.fullName} size="w-full h-full" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
                        </>
                    )}
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
