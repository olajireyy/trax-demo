import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from '../components/Skeleton';
import { 
    ChevronLeft, 
    Music, 
    Disc, 
    Mic2, 
    Clock, 
    Flame, 
    BarChart3,
    Library,
    TrendingUp,
    Zap,
    Share2,
    Download,
    X,
    LayoutGrid,
    Sparkles,
    Trophy,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Lock,
    Unlock,
    RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { useDataCache } from '../components/DataCacheContext';
import { useFeedback } from '../components/FeedbackContext';
import EnginePlaceholder from '../components/EnginePlaceholder';
import EngineStatusChip from '../components/EngineStatusChip';
import api from '../api';

const SectionHeader = ({ icon: Icon, title, color, isLoading }) => (
    <div className="flex items-center gap-3 mb-6 px-1">
        <div className={`p-2.5 rounded-2xl ${color} bg-opacity-10 backdrop-blur-md border border-white/5 text-white shadow-lg`}>
            {isLoading ? <Skeleton width="16px" height="16px" /> : <Icon size={18} className={color.replace('bg-', 'text-')} />}
        </div>
        <div className="flex flex-col">
            {isLoading ? <Skeleton width="100px" height="14px" /> : <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">{title}</h3>}
            <div className="h-0.5 w-8 bg-gradient-to-r from-current to-transparent rounded-full mt-1 opacity-50" />
        </div>
    </div>
);

const InsightsSkeleton = () => (
    <div className="space-y-10 animate-pulse">
        <section>
            <SectionHeader icon={Music} title="Top Tracks" color="bg-brand-teal" isLoading={true} />
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="glass-panel p-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton width="16px" height="10px" />
                            <Skeleton width="48px" height="48px" className="rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton width="60%" height="12px" />
                                <Skeleton width="40%" height="8px" />
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <Skeleton width="40px" height="10px" />
                            <Skeleton width="30px" height="8px" className="ml-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
        <section>
            <SectionHeader icon={Mic2} title="Top Artists" color="bg-brand-purple" isLoading={true} />
            <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => (
                    <div key={i} className="glass-panel p-4 flex flex-col items-center gap-3">
                        <Skeleton circle width="64px" height="64px" />
                        <div className="w-full space-y-2">
                            <Skeleton width="60%" height="10px" className="mx-auto" />
                            <Skeleton width="40%" height="8px" className="mx-auto" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </div>
);

const ShareCard = ({ title, type, color, totalMins, items, onAction }) => (
    <div className={`w-full h-full glass-panel-heavy overflow-hidden relative flex flex-col border-white/20 shadow-2xl group`}>
        {/* Holographic Background */}
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br ${color} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-1000`} />
        
        <div className="relative p-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
                    <LayoutGrid size={18} className="text-white" />
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-black tracking-widest text-gray-400 uppercase">Cosmic ID</p>
                    <p className="text-[10px] font-bold text-white uppercase italic">Trax #{Math.floor(Math.random() * 9999)}</p>
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-black tracking-tighter uppercase italic leading-none mb-1 text-white">{title}</h3>
                <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Music Galaxy Report</p>
            </div>

            <div className="flex-1 overflow-hidden pointer-events-none select-none">
                {type === 'Summary' && (
                    <div className="space-y-3 py-1">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                                <img src={item.img} className="w-10 h-10 rounded-xl object-cover shadow-lg border border-white/10" alt="Cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                    <p className="text-[11px] font-black text-white truncate leading-none">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'Artists' && (
                    <div className="grid grid-cols-2 gap-3 py-1">
                        {items.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/5 border border-white/5 text-center">
                                <img src={item.img || item.image_url} className="w-12 h-12 rounded-full border-2 border-brand-purple/30 shadow-lg" alt="Artist" />
                                <div className="w-full">
                                    <p className="text-[10px] font-black text-white truncate px-1">{item.label}</p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'Tracks' && (
                    <div className="space-y-1.5 py-1">
                        {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 group/track">
                                <img src={item.img} className="w-7 h-7 rounded-lg object-cover shadow-md border border-white/5" alt="Cover" />
                                <div className="flex-1 min-w-0 border-b border-white/5 pb-1">
                                    <p className="text-[10px] font-black text-white truncate leading-tight mb-0.5">{item.label}</p>
                                    <div className="flex items-center gap-2">
                                        <Music size={8} className="text-brand-teal" />
                                        <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">{item.value}</p>
                                        {item.delta && (
                                            <span className={`text-[9px] drop-shadow-[0_0_3px_rgba(255,255,255,0.1)] ${item.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                {item.delta.startsWith('+') ? '▲' : '▼'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'Albums' && (
                    <div className="grid grid-cols-2 gap-3 py-1">
                        {items.slice(0, 4).map((item, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group/album shadow-xl border border-white/10">
                                <img src={item.img || `https://i.pravatar.cc/300?img=${20+i}`} className="w-full h-full object-cover grayscale opacity-60 group-hover/album:grayscale-0 group-hover/album:opacity-100 transition-all duration-500" alt="Album" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2">
                                    <p className="text-[9px] font-black text-white truncate uppercase leading-none mb-0.5">{item.label}</p>
                                    <p className="text-[7px] font-bold text-gray-400 truncate uppercase tracking-tighter">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'Global' && (
                    <div className="space-y-3 py-1">
                        {items.map((item, i) => (
                            <div key={i} className="glass-panel p-2.5 border-white/10 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-lg bg-opacity-20 ${item.color} text-white`}>
                                        <item.icon size={12} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                                        <p className="text-[10px] font-black text-white truncate">{item.value}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-brand-teal italic">{item.rank}</p>
                                    <p className="text-[7px] font-bold text-gray-500 uppercase">Top {item.percentile}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'Genres' && (
                    <div className="space-y-2 py-1">
                        {items.map((item, i) => (
                            <div key={i} className="relative overflow-hidden rounded-2xl p-2.5 bg-white/5 border border-white/5 group/genre">
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${item.color} opacity-10 blur-2xl group-hover/genre:opacity-20 transition-opacity`} />
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`p-1.5 rounded-lg bg-opacity-20 ${item.bgColor} text-white`}>
                                            <Zap size={12} className={item.textColor} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase italic leading-none mb-0.5">{item.label}</p>
                                            <p className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">{item.percent}% dominance</p>
                                        </div>
                                    </div>
                                    <div className="h-0.5 w-10 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.percent}%` }}
                                            className={`h-full bg-gradient-to-r ${item.color}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Immersion Time</p>
                        <p className="text-lg font-black text-white italic">{totalMins} <span className="text-[10px] not-italic text-gray-500">mins</span></p>
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onAction('Download')}
                            className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/5"
                        >
                            <Download size={16} />
                        </button>
                        <button 
                            onClick={() => onAction('Share')}
                            className="p-2.5 rounded-xl bg-brand-teal text-brand-bg hover:scale-110 transition-all shadow-[0_0_20px_rgba(45,226,179,0.3)]"
                        >
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-brand-teal to-transparent opacity-30" />
    </div>
);

const Insights = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { showToast } = useFeedback();
    const { insightsData: cachedInsights, insightsLoading: cacheLoading, fetchInsights, isSyncing, startSync } = useDataCache();

    const [timeframe, setTimeframe] = useState('today');
    const [isLoading, setIsLoading] = useState(!cachedInsights);
    const [data, setData] = useState({
        summary: null,
        topSongs: [],
        topArtists: [],
        topAlbums: []
    });
    const [showShareSuite, setShowShareSuite] = useState(false);

    const [dataSource, setDataSource] = useState('trax'); // 'trax' or 'platform'
    const [insightsData, setInsightsData] = useState(cachedInsights || null);
    const [showInfo, setShowInfo] = useState(false);

    // 1. Fetch insights from cache or API (stale-while-revalidate)
    useEffect(() => {
        const loadInsights = async () => {
             if (!user.connectedService) {
                 setIsLoading(false);
                 return;
             }

             // Show cached data instantly — only show skeleton if we have nothing
             if (cachedInsights) {
                 setInsightsData(cachedInsights);
                 setIsLoading(false);
             } else {
                 setIsLoading(true);
             }
             
             // Background refresh (TTL-aware)
             try {
                 const data = await fetchInsights(); // This handles TTL internally
                 if (data) {
                     setInsightsData(data);
                 }
             } catch (error) {
                 console.error("Error fetching bulk insights:", error);
                 if (!cachedInsights) {
                    showToast("Failed to load insights engine", "error");
                 }
             } finally {
                 setIsLoading(false);
             }
        };
        loadInsights();
    }, [user.connectedService, fetchInsights]); // Removed cachedInsights as dependency to prevent loops

    // Auto-update local data when context data changes (e.g. after sync)
    useEffect(() => {
        if (cachedInsights) {
            setInsightsData(cachedInsights);
        }
    }, [cachedInsights]);

    // 2. Reactively update displayed data when timeframe or source changes
    useEffect(() => {
        if (!insightsData || !insightsData.data) return;

        const tfData = insightsData.data[timeframe];
        if (!tfData) return;

        const activeData = dataSource === 'platform' ? tfData.platform_data : tfData.trax_data?.data;
        
        setData({
            summary: activeData?.summary || null,
            topSongs: activeData?.top_tracks || [],
            topArtists: activeData?.top_artists || [],
            topAlbums: activeData?.top_albums || []
        });
    }, [timeframe, dataSource, insightsData]);

    useEffect(() => {
        if (showShareSuite) {
            document.body.classList.add('hide-nav');
        } else {
            document.body.classList.remove('hide-nav');
        }
        return () => document.body.classList.remove('hide-nav');
    }, [showShareSuite]);


    const timeframes = [
        { id: 'today', label: 'TDY', period: 'Today' },
        { id: '7d', label: '7D', period: '7 Days' },
        { id: '4w', label: '4W', period: '4 Weeks' },
        { id: '6m', label: '6M', period: '6 Months' },
        { id: 'all', label: 'All', period: 'All time' },
    ];

    const [expanded, setExpanded] = useState({
        tracks: false,
        artists: false,
        albums: false
    });

    const toggleExpand = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleTimeframeChange = (id) => {
        const eligibility = insightsData?.config?.trax_eligibility[id];
        const isEligible = eligibility ? eligibility.is_eligible : true;
        const timeframeData = insightsData?.data?.[id]?.trax_data?.data;
        const isSilent = dataSource === 'trax' && timeframeData && (!timeframeData.top_tracks || timeframeData.top_tracks.length === 0);
        
        // "Today" is never locked even if silent, per user request. 
        // Other timeframes are locked if not eligible or if silent (Trax only).
        const isLocked = dataSource === 'trax' && id !== 'today' && (!isEligible || isSilent);
        
        if (isLocked) {
            if (!isEligible) {
                const unlockDate = new Date(eligibility.unlock_date).toLocaleDateString();
                showToast(`Insights Brewing: We're still analyzing your sonic history. Available on ${unlockDate}`, "info");
            } else {
                showToast("Silent Orbit: Play more music on Trax to reveal insights for this timeframe.", "info");
            }
            return;
        }

        setTimeframe(id);
        // If moving to a timeframe not supported by platform, switch to trax
        if (dataSource === 'platform' && insightsData?.config && !insightsData.config.platform_support.includes(id)) {
            setDataSource('trax');
        }
    };

    const handleSourceChange = (source) => {
        if (source === 'trax') {
            setTimeframe('today');
        } else if (source === 'platform') {
            // Default to '4w' when switching to platform, unless already on a supported timeframe
            const support = insightsData?.config?.platform_support || ['4w', '6m', 'all'];
            if (!support.includes(timeframe)) {
                setTimeframe('4w');
            }
        }
        setDataSource(source);
    };

    return (
        <div className="px-4 pt-12 space-y-8 relative min-h-screen bg-brand-bg text-white">
            {/* Header */}
            <header className="flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-black tracking-tighter uppercase italic">Cosmic <span className="text-brand-teal">Insights</span></h1>
                        <button 
                            onClick={() => setShowInfo(true)}
                            className="p-1 text-gray-500 hover:text-brand-teal transition-colors"
                        >
                            <Info size={14} />
                        </button>
                    </div>
                    <div className="mt-2 mb-2">
                        <EngineStatusChip />
                    </div>
                </div>
                {user.connectedService && (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    const data = await fetchInsights(true);
                                    if (data) setInsightsData(data);
                                    showToast("Insights refreshed", "success");
                                } catch (e) {
                                    showToast("Refresh failed", "error");
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                            disabled={isSyncing || isLoading}
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-brand-teal hover:bg-brand-teal/10 transition-all disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={isSyncing || isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button 
                            onClick={() => setShowShareSuite(true)}
                            className="p-2.5 rounded-xl bg-brand-teal/10 border border-brand-teal/20 text-brand-teal hover:bg-brand-teal hover:text-brand-bg transition-all shadow-lg"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                )}
            </header>

            {/* Trax vs Platform Toggle - Premium Redesign */}
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 relative backdrop-blur-xl shadow-2xl">
                <div className="flex-1 relative z-10">
                    <button 
                        onClick={() => handleSourceChange('trax')}
                        className={`relative w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 z-10
                            ${dataSource === 'trax' ? 'text-white' : 'text-gray-500 hover:text-white'}
                        `}
                    >
                        {insightsData?.trax_data?.trax_locked && dataSource === 'trax' ? <Lock size={12} className="animate-pulse" /> : <Zap size={14} className={dataSource === 'trax' ? 'text-brand-purple' : ''} />}
                        <span className="italic">Trax Engine</span>
                    </button>
                    {dataSource === 'trax' && (
                        <motion.div 
                            layoutId="activeSource"
                            className="absolute inset-0 bg-gradient-to-br from-brand-purple/20 to-brand-purple/40 rounded-xl border border-brand-purple/30 shadow-[0_0_20px_rgba(147,51,234,0.2)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </div>
                <div className="flex-1 relative z-10">
                    <button 
                        onClick={() => handleSourceChange('platform')}
                        className={`relative w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 z-10 
                            ${dataSource === 'platform' ? 'text-white' : 'text-gray-500 hover:text-white'}
                        `}
                    >
                        <Music size={14} className={dataSource === 'platform' ? 'text-brand-teal' : ''} />
                        <span className="italic">Platform</span>
                    </button>
                    {dataSource === 'platform' && (
                        <motion.div 
                            layoutId="activeSource"
                            className="absolute inset-0 bg-gradient-to-br from-brand-teal/20 to-brand-teal/40 rounded-xl border border-brand-teal/30 shadow-[0_0_20px_rgba(45,226,179,0.2)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                </div>
            </div>

            {/* Timeframe Switcher - Floating Pill Redesign */}
            <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 shadow-inner backdrop-blur-md">
                {timeframes
                    .filter(tf => {
                        if (dataSource === 'trax') return true;
                        // Use backend provided support, fallback to hardcoded list if loading
                        const support = insightsData?.config?.platform_support || ['4w', '6m', 'all'];
                        return support.includes(tf.id);
                    })
                    .map((tf) => {
                        const eligibility = insightsData?.config?.trax_eligibility[tf.id];
                        const isEligible = eligibility ? eligibility.is_eligible : true;
                        const timeframeData = insightsData?.data?.[tf.id]?.trax_data?.data;
                        const isSilent = dataSource === 'trax' && timeframeData && (!timeframeData.top_tracks || timeframeData.top_tracks.length === 0);
                        
                        // "Today" (TDY) is never locked per user request. 
                        // Other timeframes are locked if not eligible or if silent in Trax mode.
                        const isLocked = dataSource === 'trax' && tf.id !== 'today' && (!isEligible || isSilent);
                        const active = timeframe === tf.id;

                        return (
                            <div key={tf.id} className="flex-1 relative group px-0.5">
                                <button 
                                    onClick={() => handleTimeframeChange(tf.id)}
                                    className={`w-full py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all relative flex items-center justify-center gap-1.5
                                        ${active ? 'text-white' : 'text-gray-500 hover:text-white'}
                                        ${isLocked ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}
                                    `}
                                >
                                    <span className="relative z-10">{tf.label}</span>
                                    {isLocked && <Lock size={9} className="relative z-10 opacity-60 ml-0.5" />}
                                    
                                    {active && (
                                        <motion.div 
                                            layoutId="tfTab" 
                                            className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 shadow-lg" 
                                            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                                        />
                                    )}
                                    {active && (
                                        <motion.div 
                                            layoutId="tfUnderline"
                                            className={`absolute bottom-1 w-4 h-0.5 rounded-full ${dataSource === 'platform' ? 'bg-brand-teal' : 'bg-brand-purple'}`}
                                        />
                                    )}
                                </button>

                                {isLocked && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-40 p-2.5 bg-brand-bg/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 transform translate-y-2 group-hover:translate-y-0">
                                        <p className="text-[7px] font-black text-white uppercase tracking-tighter text-center leading-relaxed">
                                            {isSilent ? "Sonic Activity Required" : "Intelligence Brewing"}
                                            <br/> 
                                            <span className="text-brand-purple">{isSilent ? "Play More Tracks" : "Analyzing History"}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                })}
            </div>

            <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                    <BarChart3 size={10} className="text-gray-500" />
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest leading-none">Sonic Rank</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/5 border border-white/5">
                    <div className={`w-1 h-1 rounded-full animate-pulse ${dataSource === 'platform' ? 'bg-brand-teal' : 'bg-brand-purple'}`} />
                    <p className="text-[8px] font-black text-white uppercase tracking-widest italic opacity-80 leading-none">
                        {timeframe === 'today' ? 'Today' : timeframe === 'all' ? 'All Time' : `Last ${timeframes.find(t => t.id === timeframe)?.period}`}
                    </p>
                </div>
            </div>

            <main className="space-y-10">
                {isLoading ? (
                    <div className="py-12 border-t border-white/5">
                        <InsightsSkeleton />
                    </div>
                ) : !user.connectedService ? (
                    <div className="py-12 border-t border-white/5">
                        <EnginePlaceholder 
                            type="full"
                            title="Cosmic Insights Offline"
                            message="Your musical trajectory cannot be calculated without an active engine link. Connect to reveal your insights."
                        />
                    </div>
                ) : (dataSource === 'trax' && timeframe !== 'today' && (!insightsData?.data?.[timeframe]?.trax_data?.data?.top_tracks || insightsData.data[timeframe].trax_data.data.top_tracks.length === 0)) ? (
                    <div className="py-24 border-t border-white/5">
                        <EnginePlaceholder 
                            type="locked"
                            showButton={false}
                            title={!insightsData?.config?.trax_eligibility[timeframe]?.is_eligible ? "Intelligence Brewing" : "Insufficient Data"}
                            message={!insightsData?.config?.trax_eligibility[timeframe]?.is_eligible 
                                ? `Your ${timeframes.find(t => t.id === timeframe)?.period} report is still brewing. We're currently analyzing your sonic trajectory.`
                                : "Your musical trajectory is currently a quiet orbit. Play more tracks with Trax to reveal these insights."
                            }
                        />
                    </div>
                ) : (!data.topSongs || data.topSongs.length === 0) && (!data.topArtists || data.topArtists.length === 0) ? (
                    <div className="py-24 border-t border-white/5 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center gap-6"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal/20 to-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="relative flex items-center justify-center"
                                >
                                    {timeframe === 'today' ? <Zap className="text-brand-teal animate-pulse" size={32} /> : <Sparkles className="text-brand-teal/40" size={32} />}
                                </motion.div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-black uppercase tracking-tighter italic text-white">
                                    {timeframe === 'today' ? "Intelligence Brewing" : "Quiet Orbit"}
                                </h3>
                                <p className="text-xs text-gray-500 max-w-[240px] leading-relaxed font-bold uppercase tracking-wider opacity-80">
                                    {timeframe === 'today' 
                                        ? "Establishing connection to your daily musical flow. Refresh in a few minutes to reveal your today's rank." 
                                        : `Your musical trajectory for ${timeframes.find(t => t.id === timeframe)?.period} is currently silent.`
                                    }
                                </p>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        {/* 1. Top Songs */}
                        <section>
                            <SectionHeader icon={Music} title="Top Tracks" color="bg-brand-teal" isLoading={isLoading} />
                            <div className="space-y-3">
                                {isLoading ? (
                                    [1,2,3].map(i => (
                                        <div key={i} className="glass-panel p-3 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <Skeleton width="16px" height="10px" />
                                                <Skeleton width="48px" height="48px" className="rounded-xl shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <Skeleton width="60%" height="12px" />
                                                    <Skeleton width="40%" height="8px" />
                                                </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <Skeleton width="40px" height="10px" />
                                                <Skeleton width="30px" height="8px" className="ml-auto" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    (data.topSongs && data.topSongs.length > 0) ? data.topSongs.slice(0, expanded.tracks ? 10 : 3).map((song, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="glass-panel p-3 flex items-center justify-between group hover:border-brand-teal/30 cursor-pointer active:scale-[0.98] transition-all"
                                            onClick={() => navigate(`/top-listeners/track/${song.id || song.title}`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex items-center justify-center w-6">
                                                    {i === 0 ? (
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                                            transition={{ duration: 3, repeat: Infinity }}
                                                            className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                                                        >
                                                            <Trophy size={16} fill="currentColor" />
                                                        </motion.div>
                                                    ) : (
                                                        <span className="text-[10px] font-black text-gray-500 italic tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                                                    )}
                                                </div>
                                                <img 
                                                    src={song.img || song.image_url} 
                                                    className="w-12 h-12 rounded-xl object-cover shadow-lg border border-white/10" 
                                                    alt="Song" 
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=♫'; }}
                                                />
                                                <div className="max-w-[140px]">
                                                    <p className="text-xs font-black truncate text-white">{song.title}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase truncate tracking-wider">{song.artist}</p>
                                                    {song.album && <p className="text-[8px] text-gray-500 font-medium truncate italic opacity-80 leading-none mt-0.5">{song.album}</p>}
                                                </div>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                {song.play_count !== null && (
                                                    <div className="flex items-center gap-1.5 justify-end">
                                                        <p className="text-[10px] font-black text-white tabular-nums">{song.play_count} <span className="text-[8px] text-gray-500 font-bold tracking-normal uppercase">plays</span></p>
                                                        {song.delta && (
                                                            <div className={`flex items-center gap-0.5 text-[10px] drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] ${song.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                                {song.delta.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                                <span>{song.delta}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                {song.play_duration_mins > 0 && (
                                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter mt-0.5">{song.play_duration_mins}m total</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )) : <div className="text-xs text-gray-500 italic p-4 text-center w-full">No top tracks found for this period.</div>
                                )}
                            </div>
                            {!isLoading && (
                                <button 
                                    onClick={() => toggleExpand('tracks')}
                                    className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {expanded.tracks ? 'Show Less' : 'See All (Top 10)'}
                                </button>
                            )}
                        </section>

                        {/* 2. Top Artists */}
                        <section>
                            <SectionHeader icon={Mic2} title="Top Artists" color="bg-brand-purple" isLoading={isLoading} />
                            <div className={`grid gap-3 transition-all ${expanded.artists ? 'grid-cols-2' : 'grid-cols-3'}`}>
                                {isLoading ? (
                                    [1,2,3].map(i => (
                                        <div key={i} className="glass-panel p-4 flex flex-col items-center gap-3">
                                            <Skeleton circle width="64px" height="64px" />
                                            <div className="w-full space-y-2">
                                                <Skeleton width="60%" height="10px" className="mx-auto" />
                                                <Skeleton width="40%" height="8px" className="mx-auto" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    (data.topArtists && data.topArtists.length > 0) ? data.topArtists.slice(0, expanded.artists ? 10 : 3).map((artist, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            whileHover={{ y: -5 }}
                                            className="glass-panel p-4 flex flex-col items-center text-center gap-3 cursor-pointer active:scale-95 transition-all hover:border-brand-purple/30 group/artist"
                                            onClick={() => navigate(`/top-listeners/artist/${artist.id || artist.name}`)}
                                        >
                                            <div className="relative">
                                                <div className="absolute -top-3 -left-3 z-20">
                                                     {i === 0 ? (
                                                         <motion.div 
                                                            animate={{ rotate: [0, 10, -10, 0] }}
                                                            transition={{ duration: 4, repeat: Infinity }}
                                                            className="w-7 h-7 bg-yellow-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)] border border-yellow-200"
                                                         >
                                                             <Trophy size={14} className="text-brand-bg" fill="currentColor" />
                                                         </motion.div>
                                                     ) : (
                                                         <div className="bg-gradient-to-br from-brand-purple to-brand-pink px-2 py-0.5 rounded-lg shadow-xl border border-white/10">
                                                            <span className="text-[9px] font-black text-white italic tabular-nums">#{String(i + 1).padStart(2, '0')}</span>
                                                         </div>
                                                     )}
                                                </div>
                                                <img src={artist.image_url || `https://i.pravatar.cc/150?u=${artist.name}`} className="w-16 h-16 rounded-full border-2 border-white/10 shadow-2xl group-hover/artist:scale-105 transition-transform" alt={artist.name} />
                                                <div className="absolute -bottom-1 -right-1 bg-brand-bg rounded-full p-1 border border-white/20 shadow-lg">
                                                    <div className={`w-3 h-3 rounded-full ${artist.color_mapping || 'bg-brand-teal'} animate-pulse`} />
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                <p className="text-[10px] font-black truncate w-full mb-1 italic text-white">{artist.name}</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    {artist.play_duration_mins > 0 && <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{artist.play_duration_mins}m</p>}
                                                    {artist.delta && (
                                                        <div className={`flex items-center gap-0.5 ${artist.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                            {artist.delta.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                            <span className="text-[10px] font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">{artist.delta}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : <div className="text-xs text-gray-500 italic p-4 text-center w-full col-span-full">No top artists found for this period.</div>
                                )}
                            </div>
                            {!isLoading && (
                                <button 
                                    onClick={() => toggleExpand('artists')}
                                    className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {expanded.artists ? 'Hide Extra' : 'See Full Rank (Top 10)'}
                                </button>
                            )}
                        </section>

                        {/* 3. Top Albums */}
                        <section>
                            <SectionHeader icon={Disc} title="Top Albums" color="bg-pink-500" isLoading={isLoading} />
                            <div className={expanded.albums ? "grid grid-cols-2 gap-4 pb-4" : "flex gap-4 overflow-x-auto pb-4 no-scrollbar"}>
                                {isLoading ? (
                                    [1,2,3].map(i => (
                                        <div key={i} className={`${expanded.albums ? "w-full" : "shrink-0 w-40"} glass-panel p-3 space-y-3`}>
                                            <Skeleton width="100%" height="auto" className="aspect-square rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton width="80%" height="12px" />
                                                <Skeleton width="60%" height="10px" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    (data.topAlbums && data.topAlbums.length > 0) ? data.topAlbums.slice(0, expanded.albums ? 10 : 3).map((album, i) => (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            whileHover={{ scale: 1.02 }}
                                            className={`${expanded.albums ? "w-full" : "shrink-0 w-42"} glass-panel p-3 space-y-3 cursor-pointer active:scale-[0.98] transition-all hover:border-pink-500/30 group/album`}
                                            onClick={() => navigate(`/top-listeners/album/${album.id || album.title}`)}
                                        >
                                            <div className="relative overflow-hidden rounded-xl">
                                                <div className="absolute top-2 left-2 z-20">
                                                    {i === 0 ? (
                                                        <div className="w-6 h-6 bg-yellow-400 rounded-lg flex items-center justify-center shadow-lg border border-yellow-200">
                                                            <Trophy size={12} className="text-brand-bg" fill="currentColor" />
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gradient-to-r from-pink-500 to-brand-purple px-1.5 py-0.5 rounded-lg border border-white/10 shadow-lg">
                                                            <span className="text-[8px] font-black text-white italic tabular-nums">#{String(i + 1).padStart(2, '0')}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <img src={album.image_url || `https://i.pravatar.cc/300?u=${album.title}`} className="w-full aspect-square rounded-lg object-cover shadow-2xl group-hover/album:scale-110 transition-transform duration-500" alt="Album" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/album:opacity-100 transition-opacity" />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black truncate text-white uppercase tracking-tight">{album.title}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase truncate tracking-wider">{album.artist}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    {album.play_duration_mins > 0 ? (
                                                        <div className="flex items-center gap-1">
                                                            <Clock size={10} className="text-brand-teal" />
                                                            <span className="text-[8px] font-black text-white uppercase tracking-widest">{album.play_duration_mins}m</span>
                                                        </div>
                                                    ) : <div />}
                                                    {album.delta && (
                                                        <div className={`flex items-center gap-0.5 ${album.delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                            {album.delta.startsWith('+') ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                            <span className="text-[10px] font-black drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">{album.delta}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : <div className="text-xs text-gray-500 italic p-4 text-center w-full col-span-full">No top albums found for this period.</div>
                                )}
                            </div>
                            {!isLoading && (
                                <button 
                                    onClick={() => toggleExpand('albums')}
                                    className="w-full mt-2 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    {expanded.albums ? 'Minimize' : 'Explore All Albums (Top 10)'}
                                </button>
                            )}
                        </section>


                        {/* Music Identity Insight */}
                        <section className="glass-panel p-6 border-brand-teal/20 bg-gradient-to-br from-brand-teal/5 to-transparent relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                            <div className="relative z-10 flex items-center gap-4">
                                {isLoading ? (
                                    <>
                                        <Skeleton width="48px" height="48px" className="rounded-2xl" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton width="100px" height="10px" />
                                            <Skeleton width="180px" height="14px" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-2xl bg-brand-teal/20 flex items-center justify-center text-brand-teal shadow-inner">
                                            <Zap size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mb-1">Cosmic Identity</h4>
                                            <p className="text-xs font-bold text-white italic">
                                                Your taste has evolved by <span className="text-brand-teal">{data.summary?.cosmic_evolution || '0%'}</span> this {timeframe === 'all' ? 'year' : 'period'}.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Cosmic Share Suite Modal */}
            <AnimatePresence>
                {showShareSuite && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-brand-bg/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        <div className="absolute top-10 right-6">
                            <button onClick={() => setShowShareSuite(false)} className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-2">Cosmic <span className="text-brand-teal">Cards</span></h2>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Pick a card to share your story</p>
                        </div>

                        {/* Card Carousel */}
                        <div className="w-full flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-4 pb-12">
                            {/* 1. Summary Card */}
                            <div className="shrink-0 w-full max-w-[340px] aspect-[4/5.2] snap-center">
                                <ShareCard 
                                    title="My Cosmic Summary"
                                    type="Summary"
                                    color="from-brand-teal to-brand-purple"
                                    totalMins={data.summary?.total_minutes || "0"}
                                    items={data.topSongs.length > 0 && data.topArtists.length > 0 && data.topAlbums.length > 0 ? [
                                        { label: "Top Track", value: data.topSongs[0].title, img: data.topSongs[0].image_url || `https://i.pravatar.cc/150?u=1` },
                                        { label: "Top Artist", value: data.topArtists[0].name, img: data.topArtists[0].image_url || `https://i.pravatar.cc/150?u=2` },
                                        { label: "Top Album", value: data.topAlbums[0].title, img: data.topAlbums[0].image_url || `https://i.pravatar.cc/150?u=3` }
                                    ] : []}
                                    onAction={(act) => showToast(`${act}ed Summary Card! ✨`)}
                                />
                            </div>

                            {/* 2. Top Artists Card */}
                            <div className="shrink-0 w-full max-w-[340px] aspect-[4/5.2] snap-center">
                                <ShareCard 
                                    title="Heavy Rotation: Artists"
                                    type="Artists"
                                    color="from-brand-purple to-pink-500"
                                    totalMins={data.summary?.total_minutes || "0"}
                                    items={data.topArtists.slice(0, 4).map(a => ({ label: a.name, value: `${a.play_duration_mins}m` }))}
                                    onAction={(act) => showToast(`${act}ed Artists Card! 🎤`)}
                                />
                            </div>

                            {/* 3. Top Tracks Card */}
                            <div className="shrink-0 w-full max-w-[340px] aspect-[4/5.2] snap-center">
                                <ShareCard 
                                    title="Daily Anthem: Tracks"
                                    type="Tracks"
                                    color="from-pink-500 to-orange-500"
                                    totalMins={data.summary?.total_minutes || "0"}
                                    items={data.topSongs.slice(0, 5).map(s => ({ label: s.title, value: s.artist, img: s.img || s.image_url || `https://i.pravatar.cc/150?u=${s.title}` }))}
                                    onAction={(act) => showToast(`${act}ed Tracks Card! 🎵`)}
                                />
                            </div>

                            {/* 4. Top Albums Card */}
                            <div className="shrink-0 w-full max-w-[320px] aspect-[4/5] snap-center">
                                <ShareCard 
                                    title="Infinite Replay: Albums"
                                    type="Albums"
                                    color="from-orange-500 to-brand-teal"
                                    totalMins={data.summary?.total_minutes || "0"}
                                    items={data.topAlbums.slice(0, 5).map(a => ({ label: a.title, value: a.artist, img: a.img || a.image_url || `https://i.pravatar.cc/300?u=${a.title}` }))}
                                    onAction={(act) => showToast(`${act}ed Albums Card! 💿`)}
                                />
                            </div>

                            {/* 5. Global Rank Card */}
                            <div className="shrink-0 w-full max-w-[340px] aspect-[4/5.2] snap-center">
                                <ShareCard 
                                    title="Global Dominance"
                                    type="Global"
                                    color="from-brand-teal via-brand-purple to-pink-500"
                                    totalMins="12,430"
                                    items={[
                                        { label: "Top Track Rank", value: data.topSongs[0].title, rank: "#42", percentile: "98.5", icon: Music, color: "bg-brand-teal" },
                                        { label: "Top Artist Rank", value: data.topArtists[0].name, rank: "#12", percentile: "99.2", icon: Mic2, color: "bg-brand-purple" },
                                        { label: "Top Album Rank", value: data.topAlbums[0].title, rank: "#84", percentile: "96.8", icon: Disc, color: "bg-pink-500" }
                                    ]}
                                    onAction={(act) => showToast(`${act}ed Global Card! 🌍`)}
                                />
                            </div>

                            {/* 6. Genre Vibe Card */}
                            <div className="shrink-0 w-full max-w-[340px] aspect-[4/5.2] snap-center">
                                <ShareCard 
                                    title="Vibe Check: Genres"
                                    type="Genres"
                                    color="from-indigo-500 via-brand-purple to-brand-teal"
                                    totalMins="12,430"
                                    items={[
                                        { label: "Electronic", percent: 45, color: "from-brand-teal to-blue-500", bgColor: "bg-brand-teal", textColor: "text-brand-teal" },
                                        { label: "Post-Punk", percent: 28, color: "from-brand-purple to-pink-500", bgColor: "bg-brand-purple", textColor: "text-brand-purple" },
                                        { label: "Jazz-Hop", percent: 15, color: "from-pink-500 to-orange-500", bgColor: "bg-pink-500", textColor: "text-pink-500" },
                                        { label: "Hyperpop", percent: 12, color: "from-orange-500 to-yellow-500", bgColor: "bg-orange-500", textColor: "text-orange-500" }
                                    ]}
                                    onAction={(act) => showToast(`${act}ed Genre Card! ⚡`)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-500 animate-pulse">
                            <Sparkles size={14} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Swipe for more cards</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Info Modal */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowInfo(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="glass-panel max-w-sm w-full p-8 border-brand-teal/20 relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-2xl bg-brand-teal/20">
                                        <Info className="text-brand-teal" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Data Intelligence</h2>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hybrid Insights Engine</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="p-2 h-fit rounded-lg bg-brand-purple/20 text-brand-purple shrink-0">
                                            <Zap size={16} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-white uppercase tracking-wide">Trax Database</h3>
                                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                Hyper-accurate, delta-validated data analyzed live from our high-performance listening engine. Updated to the second.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="p-2 h-fit rounded-lg bg-brand-teal/20 text-brand-teal shrink-0">
                                            <Music size={16} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-black text-white uppercase tracking-wide">Platform (Spotify)</h3>
                                            <h4 className="text-[9px] font-black text-brand-teal uppercase tracking-widest">Snapshots only</h4>
                                            <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                                Official platform data used for broad benchmarking. Limited to fixed time-ranges and updated less frequently.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setShowInfo(false)}
                                    className="w-full py-4 mt-2 rounded-2xl bg-white text-brand-bg font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-teal hover:text-brand-bg transition-colors haptic-press shadow-xl"
                                >
                                    Understood
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Insights;
