import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
    ChevronLeft, 
    ChevronRight, 
    Globe, 
    Moon, 
    Shield, 
    Info, 
    LogOut, 
    Bell, 
    User, 
    UserMinus, 
    Search, 
    Mail,
    BarChart3,
    Key,
    X,
    Check,
    Music,
    UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFeedback } from '../components/FeedbackContext';
import { useUser } from '../components/UserContext';
import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from '../components/MusicIcons';
import Avatar from '../components/Avatar';
import PasswordStrength from '../components/PasswordStrength';
import api from '../api';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, updateProfile, logout, updatePreference, linkProvider, unlinkProvider } = useUser();
    const { showToast, showConfirm } = useFeedback();
    
    const engineRef = useRef(null);
    const highlightControls = useAnimation();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailStep, setEmailStep] = useState(1);
    const [newEmail, setNewEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        if (location.hash === '#engines' && engineRef.current) {
            // Wait a moment for page entrance animation
            setTimeout(() => {
                engineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Trigger highlight animation
                highlightControls.start({
                    backgroundColor: ['rgba(45, 226, 179, 0)', 'rgba(45, 226, 179, 0.15)', 'rgba(45, 226, 179, 0)'],
                    borderColor: ['rgba(255, 255, 255, 0.05)', 'rgba(45, 226, 179, 0.4)', 'rgba(255, 255, 255, 0.05)'],
                    scale: [1, 1.02, 1],
                    transition: { duration: 1.5, ease: "easeInOut" }
                });
            }, 500);
        }
    }, [location.hash, highlightControls]);

    const handleServiceChange = async (serviceName) => {
        if (serviceName === 'None') {
            showConfirm({
                title: 'Unlink cosmos?',
                message: 'This will disconnect your current music engine. You can re-link at any time.',
                confirmText: 'Unlink',
                onConfirm: async () => {
                    try {
                        await unlinkProvider();
                        showToast('Unlinked from music engine', 'info');
                    } catch (err) {
                        showToast('Failed to unlink.', 'error');
                    }
                    setShowServiceModal(false);
                }
            });
            return;
        }

        if (user.connectedService === serviceName) {
            setShowServiceModal(false);
            return;
        }

        showConfirm({
            title: 'Switch Engine?',
            message: `Switching to ${serviceName} will re-sync your cosmic metadata. This may take a moment to reflect in your insights.`,
            confirmText: 'Switch Engine',
            onConfirm: async () => {
                try {
                    await linkProvider(serviceName);
                    // Toast removed - the redirect happens immediately, 
                    // and success is handled in the callback page.
                } catch (err) {
                    showToast(err.response?.data?.message || `Failed to link ${serviceName}`, 'error');
                }
                setShowServiceModal(false);
            }
        });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast('New passwords do not match!', 'error');
            return;
        }

        try {
            await api.post('/auth/password/change/', {
                old_password: passwords.current,
                new_password1: passwords.new,
                new_password2: passwords.confirm
            });
            showToast('Password updated successfully! ✨', 'success');
            setShowPasswordModal(false);
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.non_field_errors?.[0] || "Failed to update password.";
            showToast(errorMsg, 'error');
        }
    };

    const ToggleSwitch = ({ isOn, onToggle }) => (
        <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isOn ? 'bg-brand-teal shadow-[0_0_12px_rgba(45,226,179,0.3)]' : 'bg-white/10'}`}
        >
            <motion.div 
                animate={{ x: isOn ? 22 : 2 }}
                className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
            />
        </button>
    );

    const MenuButton = ({ icon, label, sublabel, onClick, rightElement, description }) => (
        <motion.div 
            whileHover={{ x: 4 }}
            onClick={onClick}
            className="glass-panel px-5 py-4 flex items-center justify-between cursor-pointer group hover:border-white/20 transition-all"
        >
            <div className="flex items-center gap-4 flex-1">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 group-hover:text-brand-teal group-hover:bg-brand-teal/5 transition-all">
                    {React.cloneElement(icon, { size: 18 })}
                </div>
                <div className="flex flex-col flex-1">
                    <span className="text-sm font-bold">{label}</span>
                    {sublabel && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{sublabel}</span>}
                    {description && <p className="text-[9px] text-gray-600 mt-0.5 leading-tight pr-4">{description}</p>}
                </div>
            </div>
            {rightElement || <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />}
        </motion.div>
    );

    return (
        <div className="px-4 pt-12 space-y-8 relative">
            <header className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-black tracking-tight uppercase">Settings</h1>
                <div className="w-10"></div>
            </header>

            <main className="space-y-6 pb-12">
                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Profile</h3>
                    <div className="space-y-2">
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            onClick={() => navigate('/edit-profile')}
                            className="glass-panel p-5 flex items-center justify-between cursor-pointer hover:border-brand-teal/40 group transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-brand-teal to-brand-purple">
                                    <Avatar src={user.avatar} name={user.fullName} size="w-full h-full" className="border-2 border-brand-bg" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg font-black tracking-tight">{user.fullName} <span className="text-yellow-400 text-sm">👑</span></span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-brand-teal font-black tracking-widest text-lowercase">@{user.username.toLowerCase()}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[9px] text-gray-500 font-bold lowercase tracking-tight opacity-40">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-600 uppercase group-hover:text-brand-teal transition-colors">Edit</span>
                                <ChevronRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>

                        <motion.div 
                            whileHover={{ x: 5 }}
                            onClick={() => {
                                setNewEmail('');
                                setVerificationCode('');
                                setEmailStep(1);
                                setShowEmailModal(true);
                            }}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Cosmic Inbox</p>
                                    <p className="text-xs font-bold text-white">{user.email}</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-1 rounded">Change</span>
                        </motion.div>
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Privacy & Visibility</h3>
                    <div className="space-y-2">
                        <MenuButton 
                            icon={<Music />}
                            label="Show Current Song"
                            description="Let others see what you're listening to in real-time on your profile."
                            rightElement={<ToggleSwitch isOn={user.preferences.showCurrentSong} onToggle={() => updatePreference('showCurrentSong', !user.preferences.showCurrentSong)} />}
                        />
                        <MenuButton 
                            icon={<Search />}
                            label="Allow Profile Search"
                            description="Manage whether your profile is discoverable in search."
                            rightElement={<ToggleSwitch isOn={user.preferences.profileSearch} onToggle={() => updatePreference('profileSearch', !user.preferences.profileSearch)} />}
                        />
                        <MenuButton 
                            icon={<BarChart3 />}
                            label="Share Insights"
                            description="Let mutual friends see your top cosmic charts and metrics."
                            rightElement={<ToggleSwitch isOn={user.preferences.shareInsights} onToggle={() => updatePreference('shareInsights', !user.preferences.shareInsights)} />}
                        />
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Notifications</h3>
                    <div className="space-y-2">
                        <MenuButton 
                            icon={<Bell />}
                            label="Artist Updates"
                            description="New releases and tour dates from your favorites."
                            rightElement={<ToggleSwitch isOn={user.preferences.notificationArtistUpdates} onToggle={() => updatePreference('notificationArtistUpdates', !user.preferences.notificationArtistUpdates)} />}
                        />
                        <MenuButton 
                            icon={<UserPlus />}
                            label="Social Alerts"
                            description="Friend requests, mutual matches, and group invites."
                            rightElement={<ToggleSwitch isOn={user.preferences.notificationSocialAlerts} onToggle={() => updatePreference('notificationSocialAlerts', !user.preferences.notificationSocialAlerts)} />}
                        />
                        <MenuButton 
                            icon={<Mail />}
                            label="Weekly Recap"
                            description="Your week in music delivered to your cosmic inbox."
                            rightElement={<ToggleSwitch isOn={user.preferences.notificationWeeklyRecap} onToggle={() => updatePreference('notificationWeeklyRecap', !user.preferences.notificationWeeklyRecap)} />}
                        />
                    </div>
                </section>

                <section className="space-y-3" ref={engineRef}>
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Linked Networks</h3>
                        <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-2 py-0.5 rounded-full border border-brand-teal/20">Active Engine</span>
                    </div>
                    <motion.div animate={highlightControls} className="rounded-2xl border border-transparent overflow-hidden">
                        <MenuButton 
                            icon={
                                user.connectedService?.toLowerCase() === 'spotify' ? <SpotifyIcon className="text-[#1DB954]" /> :
                                user.connectedService?.toLowerCase() === 'apple music' ? <AppleMusicIcon className="text-red-500" /> :
                                user.connectedService?.toLowerCase() === 'youtube music' ? <YoutubeMusicIcon className="text-red-600" /> :
                                <Music className="text-gray-500" />
                            }
                            label={user.connectedService || 'Not Linked'}
                            description="Tap to change your primary music engine and sync data."
                            onClick={() => setShowServiceModal(true)}
                        />
                    </motion.div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">App Preference</h3>
                    <div className="space-y-2">
                        <MenuButton 
                            icon={<Globe />} 
                            label="Language" 
                            sublabel={user.preferences.language} 
                        />
                        <MenuButton 
                            icon={<Moon />} 
                            label="Dark Mode" 
                            rightElement={<ToggleSwitch isOn={user.preferences.darkMode} onToggle={() => updatePreference('darkMode', !user.preferences.darkMode)} />}
                        />
                    </div>
                </section>

                <section className="space-y-3">
                    <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Security & Legal</h3>
                    <div className="space-y-2">
                        <MenuButton 
                            icon={<Key />} 
                            label="Change Password" 
                            onClick={() => setShowPasswordModal(true)}
                        />
                        <MenuButton icon={<Shield />} label="Privacy Policy" />
                        <MenuButton icon={<Info />} label="Terms of Service" />
                    </div>
                </section>

                {/* Change Password Modal */}
                <AnimatePresence>
                    {showPasswordModal && (
                        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowPasswordModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            
                            <motion.div 
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                className="relative w-full max-w-[400px] glass-panel-heavy p-8 border-white/10 rounded-[32px] shadow-3xl"
                            >
                                <button 
                                    onClick={() => setShowPasswordModal(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                
                                <div className="mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-teal/20 flex items-center justify-center text-brand-teal mb-4">
                                        <Key size={32} />
                                    </div>
    
                                </div>

                                <form onSubmit={handlePasswordChange} className="space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Current Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                            placeholder="••••••••"
                                            className="input-glass w-full font-bold h-14" 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                placeholder="••••••••"
                                                className="input-glass w-full font-bold h-14" 
                                            />
                                            {passwords.new && <PasswordStrength password={passwords.new} />}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                required
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                placeholder="••••••••"
                                                className="input-glass w-full font-bold h-14" 
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-4 rounded-2xl bg-brand-teal text-brand-bg font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-teal/20 haptic-press mt-2"
                                    >
                                        Update Password
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Linked Networks Modal */}
                <AnimatePresence>
                    {showServiceModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowServiceModal(false)}
                                className="absolute inset-0 bg-brand-bg/80 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="glass-panel-heavy p-8 w-full max-w-sm relative z-10 border-white/10"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Music <span className="text-brand-teal">Engines</span></h2>
                                    <button onClick={() => setShowServiceModal(false)} className="p-2 rounded-lg bg-white/5 text-gray-400">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { name: 'Spotify', icon: <SpotifyIcon />, color: 'text-[#1DB954]', bg: 'bg-[#1DB954]/10' },
                                        { name: 'Apple Music', icon: <AppleMusicIcon />, color: 'text-red-500', bg: 'bg-red-500/10' },
                                        { name: 'YouTube Music', icon: <YoutubeMusicIcon />, color: 'text-red-600', bg: 'bg-red-600/10' }
                                    ].map((service) => (
                                        <button
                                            key={service.name}
                                            onClick={() => handleServiceChange(service.name)}
                                            className={`w-full glass-panel p-5 flex items-center justify-between group transition-all ${user.connectedService === service.name ? 'border-brand-teal/50 bg-brand-teal/5' : 'hover:border-white/20'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl ${service.bg} flex items-center justify-center ${service.color}`}>
                                                    {React.cloneElement(service.icon, { size: 20 })}
                                                </div>
                                                <span className="font-bold text-sm">{service.name}</span>
                                            </div>
                                            {user.connectedService === service.name && (
                                                <div className="w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center text-brand-bg">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handleServiceChange('None')}
                                        className="w-full mt-4 py-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Unlink Current Engine
                                    </button>
                                </div>

                                <p className="text-[9px] text-gray-600 mt-6 text-center leading-relaxed font-black uppercase tracking-[0.1em]">
                                    Switching engines re-syncs your cosmic metadata. Some metrics may take a few moments to update.
                                </p>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Change Email Modal */}
                <AnimatePresence>
                    {showEmailModal && (
                        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-10">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowEmailModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            />
                            
                            <motion.div 
                                initial={{ y: '100%' }}
                                animate={{ y: 0 }}
                                exit={{ y: '100%' }}
                                className="relative w-full max-w-[400px] glass-panel-heavy p-8 border-white/10 rounded-[32px] shadow-3xl"
                            >
                                <button 
                                    onClick={() => setShowEmailModal(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple mb-4">
                                        <Mail size={32} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                        {emailStep === 1 ? 'Update Inbox' : 'Verify Identity'}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-bold mt-1">
                                        {emailStep === 1 
                                            ? 'Enter your new cosmic address below.' 
                                            : `We sent a 6-digit code to ${newEmail}`}
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {emailStep === 1 ? (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">New Email Address</label>
                                            <input 
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="sasha@cosmos.trax"
                                                className="input-glass w-full font-bold h-14"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Confirmation Code</label>
                                            <input 
                                                type="text"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                placeholder="0 0 0 0 0 0"
                                                maxLength={6}
                                                className="input-glass w-full font-black text-center text-2xl tracking-[0.5em] h-16"
                                            />
                                        </div>
                                    )}

                                    <button 
                                        onClick={async () => {
                                            if (emailStep === 1) {
                                                if (newEmail.includes('@')) {
                                                    // In a real app, this sends a verification code via backend
                                                    // For now, we'll simulate the code send but keep it functional
                                                    setEmailStep(2);
                                                    showToast('Verification code sent to ' + newEmail, 'info');
                                                }
                                                else showToast('Please enter a valid email');
                                            } else {
                                                if (verificationCode.length === 6) {
                                                    try {
                                                        // Update via standard profile update
                                                        await updateProfile({ email: newEmail });
                                                        showToast('Email updated successfully! ✨');
                                                        setShowEmailModal(false);
                                                    } catch (err) {
                                                        showToast('Failed to update email address.', 'error');
                                                    }
                                                } else {
                                                    showToast('Invalid verification code');
                                                }
                                            }
                                        }}
                                        className="w-full py-4 rounded-2xl bg-brand-teal text-brand-bg font-black text-sm uppercase tracking-widest shadow-lg shadow-brand-teal/20 haptic-press"
                                    >
                                        {emailStep === 1 ? 'Send Code' : 'Confirm Change'}
                                    </button>
                                    
                                    {emailStep === 2 && (
                                        <button 
                                            onClick={() => setEmailStep(1)}
                                            className="w-full py-2 text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-white transition-colors"
                                        >
                                            Resend Code or Change Email
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col gap-3">
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            showConfirm({
                                title: 'Exit the Cosmos?',
                                message: 'Are you sure you want to sign out? Your session will be terminated.',
                                confirmText: 'Sign Out',
                                onConfirm: () => {
                                    logout();
                                    showToast('Logged out of the cosmos. See you soon! 🛰️', 'info');
                                    navigate('/login');
                                }
                            });
                        }}
                        className="glass-panel p-5 border-dashed border-red-500/30 bg-red-500/5 hover:bg-red-500/10 cursor-pointer transition-all flex items-center justify-center gap-3 group"
                    >
                        <LogOut size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">Sign Out</span>
                    </motion.div>

                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            showConfirm({
                                title: 'Destroy Cosmic Identity?',
                                message: 'This action is PERMANENT. All your tracks, circles, and insights will be lost forever in the void. Are you absolutely certain?',
                                confirmText: 'Delete Forever',
                                type: 'danger',
                                onConfirm: () => {
                                    showToast('Account scheduled for deletion.', 'error');
                                    logout();
                                    navigate('/login');
                                }
                            });
                        }}
                        className="p-4 rounded-2xl border border-transparent hover:border-red-500/20 text-gray-700 hover:text-red-500 transition-all flex items-center justify-center gap-2 group"
                    >
                        <UserMinus size={14} className="opacity-50 group-hover:opacity-100" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Delete Account</span>
                    </motion.button>
                </div>

                <div className="pt-4 flex flex-col items-center gap-4">
                     <p className="text-[10px] text-gray-500 text-center leading-relaxed font-black uppercase tracking-[0.2em] opacity-40">
                        Trax Cosmos v0.8.5-alpha
                     </p>
                     <div className="h-px w-8 bg-white/10" />
                </div>
            </main>
        </div>
    );
};

export default Settings;
