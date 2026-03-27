import React from 'react';
import { motion } from 'framer-motion';
import { Music, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';
import { SpotifyIcon, AppleMusicIcon, YoutubeMusicIcon } from './MusicIcons';

const EngineStatusChip = ({ showLabel = true }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [isSyncing, setIsSyncing] = React.useState(false);
    const isConnected = !!user.connectedService;

    // Simulate a brief sync when the service changes
    React.useEffect(() => {
        if (user.connectedService) {
            setIsSyncing(true);
            const timer = setTimeout(() => setIsSyncing(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [user.connectedService]);

    const getServiceIcon = () => {
        const service = user.connectedService?.toLowerCase();
        if (service === 'spotify') return <SpotifyIcon size={12} className="text-[#1DB954]" />;
        if (service === 'apple music') return <AppleMusicIcon size={12} className="text-red-500" />;
        if (service === 'youtube music') return <YoutubeMusicIcon size={12} className="text-red-600" />;
        return <Music size={12} />;
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/settings#engines')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border cursor-pointer transition-all duration-500 ${
                isSyncing 
                ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal animate-pulse'
                : isConnected 
                ? 'bg-brand-teal/10 border-brand-teal/20 text-brand-teal' 
                : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}
        >
            <div className="relative flex items-center justify-center">
                {isSyncing ? (
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Zap size={12} />
                    </motion.div>
                ) : isConnected ? (
                    <div className="relative">
                        <div className="relative z-10">
                            {getServiceIcon()}
                        </div>
                        <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-brand-teal rounded-full blur-[2px]"
                        />
                    </div>
                ) : (
                    <AlertCircle size={12} />
                )}
            </div>
            
            {showLabel && (
                <span className="text-[9px] font-black uppercase tracking-widest italic leading-none flex items-center gap-1">
                    {isSyncing ? 'Syncing Cosmic Data...' : isConnected ? user.connectedService : 'Engine Offline'}
                </span>
            )}
        </motion.div>
    );
};

export default EngineStatusChip;
