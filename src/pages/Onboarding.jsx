import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Camera,
    Music,
    Check,
    Sparkles,
    User,
    Zap,
    Plus,
    Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../components/FeedbackContext';
import { useUser } from '../components/UserContext';
import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from '../components/MusicIcons';
import api from '../api';
import Avatar from '../components/Avatar';

const Onboarding = () => {
    const navigate = useNavigate();
    const { showToast } = useFeedback();
    const { updateProfile, uploadAvatar, user: currentUser } = useUser();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profile, setProfile] = useState({
        bio: '',
        avatar: currentUser?.avatar || '',
        service: null // 'spotify', 'apple', 'youtube'
    });

    const nextStep = () => setStep(step + 1);

    const handleComplete = () => {
        setIsLoading(true);
        updateProfile({
            bio: profile.bio,
            avatar: profile.avatar,
            connectedService: profile.service ? profile.service.charAt(0).toUpperCase() + profile.service.slice(1) : 'None'
        });
        setTimeout(() => {
            showToast('Welcome to the Trax Cosmos!', 'success');
            navigate('/');
        }, 1500);
    };

    const steps = [
        { id: 1, title: 'Define Your Persona', subtitle: 'Choose how the cosmos sees you' },
        { id: 2, title: 'Sync Your Rhythm', subtitle: 'Connect your music dna' },
        { id: 3, title: 'Ready for Liftoff', subtitle: 'Finalizing your trajectory' }
    ];

    return (
        <div className="min-h-screen bg-brand-bg relative overflow-hidden flex flex-col p-8">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] bg-brand-teal/10 blur-[150px] rounded-full animate-float" />

            <header className="relative z-10 mb-12 flex justify-between items-center">
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-brand-teal' : 'w-2 bg-white/10'}`} />
                    ))}
                </div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Phase {step}</span>
            </header>

            <main className="flex-1 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                                    Identity <span className="text-brand-teal">Setup</span>
                                </h1>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{steps[0].subtitle}</p>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-tr from-brand-teal to-brand-purple rotate-6 shadow-2xl relative">
                                        {uploadingAvatar ? (
                                            <div className="w-full h-full rounded-2xl bg-brand-bg flex items-center justify-center -rotate-6">
                                                <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : (
                                            <Avatar 
                                                src={profile.avatar} 
                                                name={currentUser?.fullName}
                                                size="w-full h-full" 
                                                className="border-4 border-brand-bg -rotate-6 transition-transform group-hover:rotate-0" 
                                            />
                                        )}
                                    </div>
                                    <label className="absolute -bottom-2 -right-2 p-3 bg-brand-bg border border-white/10 rounded-2xl text-white shadow-xl hover:text-brand-teal transition-colors cursor-pointer">
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setUploadingAvatar(true);
                                                    try {
                                                        const url = await uploadAvatar(file);
                                                        setProfile({ ...profile, avatar: url });
                                                        showToast('Aura captured!', 'success');
                                                    } catch (err) {
                                                        showToast('Transmission failed.', 'error');
                                                    } finally {
                                                        setUploadingAvatar(false);
                                                    }
                                                }
                                            }}
                                        />
                                        <Camera size={18} />
                                    </label>
                                </div>
                                <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Profile Identity Matrix</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Vibe Description</label>
                                    <textarea 
                                        placeholder="Techno soul wandering the digital cosmos..." 
                                        value={profile.bio}
                                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-brand-teal min-h-[120px] resize-none transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={nextStep}
                                className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all bg-brand-teal text-brand-bg shadow-xl shadow-brand-teal/20 active:scale-95`}
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-10"
                        >
                            <div className="space-y-2">
                                <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                                    Sync <span className="text-brand-teal">Rhythm</span>
                                </h1>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{steps[1].subtitle}</p>
                            </div>

                            <div className="grid gap-4">
                                <button 
                                    onClick={() => setProfile({...profile, service: 'spotify'})}
                                    className={`glass-panel p-6 flex items-center justify-between group transition-all ${profile.service === 'spotify' ? 'border-brand-teal/50 bg-brand-teal/10' : 'hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-[#1DB954]/10 flex items-center justify-center text-[#1DB954]">
                                            <SpotifyIcon size={28} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg">Spotify</h3>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Connect Library</p>
                                        </div>
                                    </div>
                                    {profile.service === 'spotify' && <Check className="text-brand-teal" size={24} />}
                                </button>

                                <button 
                                    onClick={() => setProfile({...profile, service: 'apple'})}
                                    className={`glass-panel p-6 flex items-center justify-between group transition-all ${profile.service === 'apple' ? 'border-red-500/50 bg-red-500/10' : 'hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                            <AppleMusicIcon size={28} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg">Apple Music</h3>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Link Playlists</p>
                                        </div>
                                    </div>
                                    {profile.service === 'apple' && <Check className="text-red-500" size={24} />}
                                </button>

                                <button 
                                    onClick={() => setProfile({...profile, service: 'youtube'})}
                                    className={`glass-panel p-6 flex items-center justify-between group transition-all ${profile.service === 'youtube' ? 'border-red-600/50 bg-red-600/10' : 'hover:border-white/20'}`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600">
                                            <YoutubeMusicIcon size={28} />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-bold text-lg">YouTube Music</h3>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Sync History</p>
                                        </div>
                                    </div>
                                    {profile.service === 'youtube' && <Check className="text-red-600" size={24} />}
                                </button>
                            </div>

                            <div className="py-6 space-y-4">
                                <div className="glass-panel p-5 bg-white/5 border-dashed border-white/10 flex items-center gap-4">
                                    <Zap size={20} className="text-brand-teal" />
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">Trax uses real listening data to generate your cosmos. Linking is required for active tracking.</p>
                                </div>
                            </div>

                            <button 
                                onClick={nextStep}
                                disabled={!profile.service}
                                className={`w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all ${profile.service ? 'bg-brand-teal text-brand-bg shadow-xl shadow-brand-teal/20 active:scale-95' : 'bg-white/5 text-gray-600 grayscale'}`}
                            >
                                Secure Link <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center space-y-12"
                        >
                            <div className="relative">
                                <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="w-48 h-48 rounded-full border-2 border-dashed border-brand-teal/20 p-4"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-3xl p-1 bg-gradient-to-tr from-brand-teal to-brand-purple rotate-12">
                                        <Avatar src={profile.avatar} name={currentUser?.username} size="w-full h-full" className="border-4 border-brand-bg -rotate-12" />
                                    </div>
                                </div>
                                <motion.div 
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-4 -right-4 p-4 rounded-3xl bg-brand-bg border border-white/10 shadow-2xl glass-panel-heavy"
                                >
                                    <Sparkles className="text-brand-teal" size={24} />
                                </motion.div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                                    Calculations <span className="text-brand-teal">Complete</span>
                                </h1>
                                <p className="text-xs text-brand-teal font-black uppercase tracking-[0.3em]">Trajectory Locked: @{currentUser?.username}</p>
                            </div>

                            <button 
                                onClick={handleComplete}
                                disabled={isLoading}
                                className="w-full py-5 rounded-3xl bg-white text-brand-bg font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl hover:bg-brand-teal transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>Enter Cosmos <Globe size={20} /></>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Onboarding;
