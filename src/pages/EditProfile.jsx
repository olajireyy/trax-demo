import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, ChevronLeft, Check, Music, Youtube, Play, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFeedback } from '../components/FeedbackContext';
import { useUser } from '../components/UserContext';
import Avatar from '../components/Avatar';

import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from '../components/MusicIcons';

const EditProfile = () => {
    const navigate = useNavigate();
    const { showToast } = useFeedback();
    const { user, updateProfile, uploadAvatar } = useUser();
    
    const [isSaving, setIsSaving] = useState(false);
    const [profileImage, setProfileImage] = useState(user.avatar);
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);
    const [username, setUsername] = useState(user.username.toLowerCase());
    const [fullName, setFullName] = useState(user.fullName);
    const [bio, setBio] = useState(user.bio || '');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                showToast('Avatar updated in preview! ✨', 'success');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let finalAvatar = user.avatar;
            
            if (imageFile) {
                finalAvatar = await uploadAvatar(imageFile);
            }

            await updateProfile({
                fullName,
                username,
                bio,
                avatar: finalAvatar
            });
            showToast('Profile updated in the cosmos! 🛰️', 'success');
            setTimeout(() => {
                navigate('/profile/me');
            }, 1000);
        } catch (err) {
            showToast('Failed to sync changes with the cosmos.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="px-4 pt-12 space-y-8 relative">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*"
            />

            {/* Header Setup */}
            <header className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-black tracking-tight uppercase">Edit Profile</h1>
                <div className="w-10"></div>
            </header>

            <main className="space-y-8 pb-8">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={triggerFileSelect}
                        className="relative mb-4 group cursor-pointer"
                    >
                         <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-brand-teal to-brand-purple">
                            <Avatar src={profileImage} name={fullName} size="w-full h-full" className="border-4 border-brand-bg" />
                         </div>
                         <div className="absolute bottom-1 right-1 w-7 h-7 bg-brand-teal rounded-full flex items-center justify-center text-black border-2 border-brand-bg shadow-xl">
                            <Camera size={14} />
                         </div>
                    </motion.div>
                    <h2 className="font-black text-lg tracking-tight">{fullName} <span className="text-yellow-400">👑</span></h2>
                    <p className="text-[10px] text-brand-teal font-black uppercase tracking-widest bg-brand-teal/10 px-3 py-1 rounded-full">{username}</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Name" 
                            className="input-glass w-full font-bold"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Username</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                                placeholder="Username" 
                                className="input-glass w-full border-brand-teal/30 focus:border-brand-teal font-bold pr-10 lowercase"
                            />
                            <Check size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-teal" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Bio</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the cosmos your story..." 
                            className="input-glass w-full font-bold min-h-[100px] py-4 resize-none"
                        />
                    </div>
                </div>



                <div className="pt-4">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full btn-primary font-black uppercase tracking-widest py-4 transition-all active:scale-95 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Syncing...' : 'Save cosmic changes'}
                    </button>
                </div>

            </main>
        </div>
    );
};

export default EditProfile;
