import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, ChevronRight, TrendingUp, Music, Disc, Plus, Mic2, Flame, Heart, RefreshCw, Info, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ParticleBurst from '../components/ParticleBurst';
import Skeleton from '../components/Skeleton';
import { useFeedback } from '../components/FeedbackContext';
import { useUser } from '../components/UserContext';
import { useDataCache } from '../components/DataCacheContext';
import api from '../api';
import EnginePlaceholder from '../components/EnginePlaceholder';
import EngineStatusChip from '../components/EngineStatusChip';
import Avatar from '../components/Avatar';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast: globalToast } = useFeedback();
    const { user, unreadMetrics } = useUser();
    const { dashboardData, fetchDashboard, isSyncing, startSync } = useDataCache();
    const [bursts, setBursts] = useState([]);
    const [isLoading, setIsLoading] = useState(!dashboardData);
    const [summary, setSummary] = useState(dashboardData?.summary || null);
    const [topArtists, setTopArtists] = useState(dashboardData?.top_artists || []);
    const [nowPlaying, setNowPlaying] = useState(dashboardData?.now_playing || null);
    const [hourlyData, setHourlyData] = useState(dashboardData?.hourly_data || []);
    const [hoveredHour, setHoveredHour] = useState(null);

    const loadDashboard = useCallback(async (force = false) => {
        if (!user.connectedService) {
            setIsLoading(false);
            return;
        }

        // If it's a manual refresh button click
        if (force) {
            try {
                // startSync triggers the backend Spotify fetch + polling
                await startSync();
                // AFTER sync finishes, we NEED to reload the local states with the fresh data
                const freshData = await fetchDashboard(false); // Get the just-cached data
                if (freshData) {
                    setSummary(freshData.summary);
                    setTopArtists(freshData.top_artists || []);
                    setNowPlaying(freshData.now_playing);
                    setHourlyData(freshData.hourly_data || []);
                }
                return; 
            } catch (err) {
                console.error("Manual sync failed:", err);
                globalToast("Sync failed. Using cached data.", "error");
                return;
            }
        }

        // Hydration: if we already have data in states from initialization, 
        // and we haven't forced a refresh, don't trigger redundant setStates
        if (!dashboardData) {
            setIsLoading(true);
            const data = await fetchDashboard(false);
            if (data) {
                setSummary(data.summary);
                setTopArtists(data.top_artists || []);
                setNowPlaying(data.now_playing);
                setHourlyData(data.hourly_data || []);
            }
            setIsLoading(false);
        }
    }, [user.connectedService, dashboardData, fetchDashboard, startSync, globalToast]);

    // Main refresh alias for clarity
    const fetchDashboardData = () => loadDashboard(true);

    // Auto-update local states when dashboardData changes in context
    // (e.g. after background sync completes)
    useEffect(() => {
        if (dashboardData) {
            setSummary(dashboardData.summary);
            setTopArtists(dashboardData.top_artists || []);
            setNowPlaying(dashboardData.now_playing);
            setHourlyData(dashboardData.hourly_data || []);
            setIsLoading(false);
        }
    }, [dashboardData]);

    const autoSyncRef = useRef(false);
    useEffect(() => {
        const init = async () => {
            // Initial data load (from cache or quick-fetch)
            await loadDashboard();
            
            // AUTO-SYNC: Trigger a silent background sync on mount
            // Guard against infinite loops with autoSyncRef
            if (!autoSyncRef.current) {
                autoSyncRef.current = true;
                startSync().catch(() => {}); 
            }
        };
        init();

        // Polling for Now Playing if connected (Independent of main sync)
        let interval;
        if (user.connectedService) {
            interval = setInterval(async () => {
                try {
                    const res = await api.get('/music/spotify/now-playing/');
                    if (res.data.is_playing) {
                        const item = res.data.item || {};
                        setNowPlaying({
                            is_playing: true,
                            title: item.name || '',
                            artist: (item.artists || []).join(', '),
                            img: item.album_art_url || '',
                            progress_ms: res.data.progress_ms || 0,
                            duration_ms: item.duration_ms || 0,
                        });
                    } else {
                        setNowPlaying(null);
                    }
                } catch (e) {
                    console.error("Failed to poll now playing", e);
                }
            }, 30000);
        }

        return () => clearInterval(interval);
    }, [user.connectedService, loadDashboard]);

    const removeBurst = (id) => {
        setBursts(prev => prev.filter(b => b.id !== id));
    };
  return (
    <div className="px-6 pt-12 space-y-8 relative">
      {/* Silent Sync Indicator / Overlay removed per user request */}
      
      {/* Header Area */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-brand-teal to-brand-purple">
            <Avatar src={user.avatar} name={user.fullName} size="w-full h-full" className="border-2 border-brand-bg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight">{user.fullName} <span className="text-yellow-400">👑</span></span>
            {/* <span className="text-[10px] text-brand-teal font-bold uppercase tracking-wider mt-0.5">{user.isPro ? 'Soundtrax Pro' : 'Free Spirit'}</span> */}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link to="/notifications" className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10 haptic-press">
            <Bell size={20} strokeWidth={2} />
            {unreadMetrics?.has_notifications && (
                <div className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-brand-bg"></div>
            )}
          </Link>
          <Link to="/settings" className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all hover:bg-white/10 haptic-press">
            <Settings size={20} strokeWidth={2} />
          </Link>
        </div>
      </header>

      {/* Stats Quick Status */}
      <div className="flex items-center justify-between px-1 mb--2">
          <div className="flex flex-col gap-1">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Sync Status</p>
              <EngineStatusChip />
          </div>
      </div>

      {/* Hero Chart Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 relative overflow-hidden group border-brand-teal/20"
      >
        {isLoading ? (
            <div className="space-y-4">
                <Skeleton width="40%" height="16px" />
                <Skeleton width="60%" height="48px" />
                <Skeleton width="100%" height="112px" />
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
                    <Skeleton width="100%" height="32px" />
                    <Skeleton width="100%" height="32px" />
                    <Skeleton width="100%" height="32px" />
                </div>
            </div>
        ) : !user.connectedService ? (
            <EnginePlaceholder 
                title="Activity Metrics Locked" 
                message="Sync your music engine to see your listening minutes and trends."
            />
        ) : (
            <>
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                    <TrendingUp size={48} className="text-brand-teal" />
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-400 text-sm uppercase tracking-widest">Listening Minutes</h3>
                            <div className="group/tooltip relative">
                                <Info size={14} className="text-gray-500 hover:text-brand-teal cursor-help transition-colors" />
                                <div className="absolute top-full left-0 mt-2 w-48 p-2 bg-brand-bg/95 border border-white/10 rounded-lg text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-[60] shadow-xl backdrop-blur-md">
                                    Your daily listening minutes are calculated live and reset every night at <span className="text-brand-teal font-black">1:00 AM</span>.
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => fetchDashboardData()}
                            disabled={isSyncing}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all haptic-press disabled:opacity-50 ${
                                isSyncing
                                    ? 'bg-brand-teal/20 text-brand-teal'
                                    : 'bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/25 border border-brand-teal/30'
                            }`}
                        >
                            <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
                        </button>
                    </div>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-black tracking-tight">
                            {summary?.total_minutes !== undefined ? summary.total_minutes.toLocaleString() : '0'}
                        </span>
                        {summary?.minutes_delta != null && (
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                String(summary.minutes_delta).startsWith('-')
                                    ? 'bg-red-500/10 text-red-400'
                                    : 'bg-brand-teal/10 text-brand-teal'
                            }`}>
                                {summary.minutes_delta}
                            </span>
                        )}
                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-1">vs yesterday</span>
                    </div>

                    {/* Interactive 24h Chart */}
                    {(() => {
                        const W = 320, H = 80, pad = 10;
                        const data = hourlyData.length ? hourlyData : Array.from({length:24},(_,i)=> {
                            const h = (i + 1) % 24;
                            return { hour: h, label: `${String(h).padStart(2,'0')}:00`, mins: 0 };
                        });
                        const maxMins = Math.max(...data.map(d=>d.mins), 1);
                        const now = new Date().getHours();
                        const pts = data.map((d,i) => ({
                            x: pad + (i/(23)) * (W - pad*2),
                            y: H - pad - ((d.mins/maxMins) * (H - pad*2)),
                            ...d
                        }));
                        const pathD = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(' ');
                        const areaD = `${pathD} L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
                        return (
                            <div className="relative h-28 w-full mb-4 select-none">
                                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chart-grad" x1="0" x2="1" y1="0" y2="0">
                                            <stop offset="0%" stopColor="#7c3aed" />
                                            <stop offset="100%" stopColor="#2de2b3" />
                                        </linearGradient>
                                        <linearGradient id="area-grad" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#2de2b3" stopOpacity="0.25" />
                                            <stop offset="100%" stopColor="#2de2b3" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Area fill */}
                                    <path d={areaD} fill="url(#area-grad)" />
                                    {/* Line */}
                                    <motion.path
                                        d={pathD}
                                        fill="none"
                                        stroke="url(#chart-grad)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                                    />
                                    {/* Dots + hover zones */}
                                    {pts.map((p, i) => p.mins > 0 && (
                                        <g key={i}
                                            onMouseEnter={() => setHoveredHour(i)}
                                            onMouseLeave={() => setHoveredHour(null)}
                                            onTouchStart={() => setHoveredHour(i)}
                                            style={{cursor:'pointer'}}
                                        >
                                            {/* hit area */}
                                            <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
                                            {/* visible dot */}
                                            <circle
                                                cx={p.x} cy={p.y} r={hoveredHour===i ? 4 : 2.5}
                                                fill={hoveredHour===i ? '#2de2b3' : '#7c3aed'}
                                                style={{transition:'r 0.15s'}}
                                            />
                                            {/* current hour marker: matches the actual hour property */}
                                            {p.hour === now && <circle cx={p.x} cy={p.y} r={6} fill="none" stroke="#2de2b3" strokeWidth="1" opacity="0.4" />}
                                        </g>
                                    ))}
                                    {/* x-axis labels: Every 4 hours for better visibility of the shift */}
                                    {[0, 4, 8, 12, 16, 20, 23].map(idx => {
                                        const p = pts[idx];
                                        if (!p) return null;
                                        return (
                                            <text 
                                                key={idx} 
                                                x={p.x} 
                                                y={H} 
                                                fontSize="6" 
                                                fill="#4b5563" 
                                                textAnchor="middle"
                                                className="font-bold font-mono"
                                            >
                                                {p.label}
                                            </text>
                                        );
                                    })}
                                </svg>
                                {/* Tooltip */}
                                {hoveredHour !== null && hourlyData[hoveredHour] && hourlyData[hoveredHour].mins > 0 && (() => {
                                    const d = hourlyData[hoveredHour];
                                    const p = pts[hoveredHour];
                                    const pctX = (p.x / W) * 100;

                                    const nextH = (d.hour + 1) % 24;
                                    const timeLabel = `From ${String(d.hour).padStart(2,'0')}:00 – ${String(nextH).padStart(2,'0')}:00`;

                                    const pos = pctX < 20
                                        ? { left: 0, right: 'auto', transform: 'none' }
                                        : pctX > 70
                                        ? { left: 'auto', right: 0, transform: 'none' }
                                        : { left: `${pctX}%`, right: 'auto', transform: 'translateX(-50%)' };

                                    return (
                                        <motion.div
                                            initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                                            className="absolute z-20 min-w-[140px] max-w-[168px]"
                                            style={{ ...pos, top: 0 }}
                                            onMouseEnter={() => setHoveredHour(hoveredHour)}
                                            onMouseLeave={() => setHoveredHour(null)}
                                        >
                                            <div className="glass-panel p-2.5 border-brand-teal/30 text-left shadow-xl">
                                                <p className="text-[9px] font-black text-brand-teal uppercase tracking-widest mb-1">{timeLabel}</p>
                                                <p className="text-sm font-black text-white">{d.mins} min{d.mins !== 1 && 's'}</p>
                                                <div className="text-[9px] text-gray-400 space-y-0.5 mt-1">
                                                    <p>🎵 {d.songs} song{d.songs !== 1 && 's'}</p>
                                                    <p>🎤 {d.artists} artist{d.artists !== 1 && 's'}</p>
                                                    {d.top_genre && <p>🎸 {d.top_genre}</p>}
                                                </div>
                                                {d.top_artist && (
                                                    <div className="mt-2 pt-2 border-t border-white/10 bg-brand-teal/10 rounded-lg p-1.5">
                                                        <div className="flex items-center gap-2">
                                                            {d.top_artist_img
                                                                ? <img src={d.top_artist_img} alt={d.top_artist} className="w-8 h-8 rounded-full object-cover ring-1 ring-brand-teal/40 shrink-0" />
                                                                : <div className="w-8 h-8 rounded-full bg-brand-teal/20 flex items-center justify-center text-sm font-black text-brand-teal shrink-0">{d.top_artist[0]}</div>
                                                            }
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-[9px] font-black text-brand-teal uppercase tracking-wider">Top Artist</p>
                                                                <p className="text-[11px] font-black text-white truncate leading-tight">{d.top_artist}</p>
                                                                <p className="text-[9px] text-gray-400">{d.top_artist_mins}m · {d.top_artist_songs} song{d.top_artist_songs !== 1 && 's'}</p>
                                                            </div>
                                                            {/* Refresh button — re-fetches in background */}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); fetchDashboardData(); }}
                                                                className="p-1 rounded-md bg-white/5 hover:bg-brand-teal/20 text-gray-500 hover:text-brand-teal transition-all shrink-0"
                                                                title="Refresh"
                                                            >
                                                                <RefreshCw size={10} className={isSyncing ? 'animate-spin' : ''} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })()}
                            </div>
                        );
                    })()}

                    <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-brand-purple/20 text-brand-purple">
                                <Music size={14} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold truncate">{summary?.unique_tracks || 0}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">Songs</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 justify-end">
                            <div className="min-w-0 text-right">
                                <p className="text-sm font-bold truncate">{summary?.unique_artists || 0}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase truncate">Artists</p>
                            </div>
                            <div className="p-2 rounded-lg bg-pink-500/20 text-pink-500">
                                <Mic2 size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}
      </motion.div>
      
      {/* Current Playing Card */}
      <AnimatePresence>
        {nowPlaying && (
            <motion.div 
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: 'auto', mb: 8 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="overflow-hidden"
            >
                <div className="glass-panel p-4 border-brand-teal/30 bg-gradient-to-r from-brand-teal/10 via-brand-bg to-brand-bg relative group">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <img 
                                src={nowPlaying.img} 
                                className="w-16 h-16 rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform" 
                                alt="Album Art" 
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-bg flex items-center justify-center">
                                <Plus size={14} className="text-brand-teal" />
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest animate-pulse">Now Playing</span>
                                <div className="flex gap-0.5">
                                    <div className="w-1 h-3 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite]" />
                                    <div className="w-1 h-3 bg-brand-teal rounded-full animate-[bounce_0.8s_infinite]" />
                                    <div className="w-1 h-3 bg-brand-teal rounded-full animate-[bounce_0.5s_infinite]" />
                                </div>
                            </div>
                            <h2 className="text-lg font-black text-white truncate leading-tight">{nowPlaying.title}</h2>
                            <p className="text-sm font-bold text-gray-500 truncate italic">{nowPlaying.artist}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-center justify-between h-16 py-1">
                            <span className="text-[10px] font-black text-gray-600">
                                {Math.floor(nowPlaying.progress_ms / 60000)}:{String(Math.floor((nowPlaying.progress_ms % 60000) / 1000)).padStart(2, '0')}
                            </span>
                            <div className="p-3 rounded-full bg-brand-teal text-brand-bg shadow-lg shadow-brand-teal/20 haptic-press cursor-pointer">
                                <Heart size={18} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                        <motion.div 
                            className="h-full bg-brand-teal shadow-[0_0_10px_rgba(45,226,179,0.5)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(nowPlaying.progress_ms / nowPlaying.duration_ms) * 100}%` }}
                        />
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Top Artists Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-0.5">
                <h2 className="text-lg font-bold tracking-tight">Your Week in Review</h2>
                {(() => {
                    const now = new Date();
                    const daysSinceMonday = now.getDay() === 0 ? 6 : now.getDay() - 1; // Mon=0
                    const monday = new Date(now);
                    monday.setDate(now.getDate() - daysSinceMonday);
                    monday.setHours(0, 0, 0, 0);
                    const monLabel = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    // Next Monday
                    const nextMonday = new Date(monday);
                    nextMonday.setDate(monday.getDate() + 7);
                    const daysLeft = Math.ceil((nextMonday - now) / (1000 * 60 * 60 * 24));
                    return (
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-teal/60 inline-block" />
                                Since Mon {monLabel} · Resets in {daysLeft}d
                            </span>
                            <div className="group/tooltip relative">
                                <Info size={12} className="text-gray-500 hover:text-brand-teal cursor-help transition-colors" />
                                <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-brand-bg/95 border border-white/10 rounded-lg text-[10px] text-gray-300 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-[60] shadow-xl backdrop-blur-md translate-x-[-20%]">
                                    Refreshes every <span className="text-brand-teal font-black">Monday at 1:00 AM</span>.
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>
            <Link to="/insights" className="text-xs font-bold text-brand-teal hover:underline">See All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {isLoading ? (
                [1,2,3,4].map(i => (
                    <div key={i} className="flex flex-col items-center shrink-0 w-24 gap-2">
                        <Skeleton circle width="80px" height="80px" />
                        <Skeleton width="60px" height="12px" />
                    </div>
                ))
            ) : !user.connectedService ? (
                <div className="w-full">
                    <EnginePlaceholder 
                        minimal 
                        title="Charts Unavailable" 
                    />
                </div>
            ) : (
                (topArtists && topArtists.length > 0) ? topArtists.map((artist, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex flex-col items-center shrink-0 w-24 group cursor-pointer haptic-hover"
                        onClick={() => navigate(`/top-listeners/artist/${artist.id || artist.name}`)}
                    >
                        <div className="w-20 h-20 rounded-full bg-white/5 p-1 mb-2 relative group-hover:shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.3)] transition-all">
                            <Avatar src={artist.image_url} name={artist.name} size="w-full h-full" className="rounded-full" />
                            <div className={`absolute bottom-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center p-0.5`}>
                                <div className={`w-3 h-3 ${artist.color_mapping || 'bg-brand-teal'} rounded-full`}></div>
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-center truncate w-full group-hover:text-brand-teal transition-colors font-black uppercase italic tracking-tighter">{artist.name}</span>
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{artist.play_duration_mins || 0} MINS</span>
                    </motion.div>
                )) : <div className="text-xs text-gray-500 italic p-4">No top artists found for this period.</div>
            )}
        </div>
      </section>

      {/* Daily Roast Teaser - Recommendation #2 */}
      {!user.connectedService ? (
        <EnginePlaceholder 
            minimal 
            title="Daily Roast Locked" 
            message="We need your music sins to roast you properly."
        />
      ) : (
        <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative group cursor-pointer"
            onClick={() => navigate('/roast')}
        >
            <div className="glass-panel p-5 border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-brand-bg to-brand-purple/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity rotate-12">
                    <Flame size={64} className="text-orange-500" />
                </div>
                
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <Flame size={16} className="text-orange-500" />
                            </div>
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Daily Roast Preview</h3>
                        </div>
                        <span className="text-[8px] font-black bg-orange-500 text-brand-bg px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Hot</span>
                    </div>

                    <div className="relative">
                        <p className="text-sm font-black text-white italic leading-relaxed select-none">
                            "Your taste is so generic even Spotify's algorithm is bored. It's like you asked an AI..." 
                            <span className="blur-sm opacity-50 ml-1">to make music for people who have no personality."</span>
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-brand-bg/80" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight italic">Tap to reveal your full sins...</p>
                        <ChevronRight size={16} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.section>
      )}

      {/* Mutual Listenings Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold tracking-tight italic">Mutual <span className="text-brand-teal">Listenings</span></h2>
            <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-brand-teal uppercase tracking-widest">Live Syncing</span>
            </div>
        </div>

        <div className="space-y-3">
            {isLoading ? (
                [1,2].map(i => (
                    <div key={i} className="glass-panel p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <Skeleton circle width="40px" height="40px" />
                            <div className="space-y-2 flex-1">
                                <Skeleton width="30%" height="10px" />
                                <Skeleton width="60%" height="14px" />
                            </div>
                        </div>
                        <Skeleton width="40px" height="40px" className="rounded-lg" />
                    </div>
                ))
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 flex flex-col items-center text-center gap-3 border-brand-teal/10"
                >
                    <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center">
                        <Music size={20} className="text-brand-teal/60" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">No mutual listens yet</p>
                        <p className="text-[10px] text-gray-500 mt-1">Follow friends to see what they're playing in real time.</p>
                    </div>
                </motion.div>
            )}
        </div>
      </section>

      <div className="pb-10" />

      {/* Particle Bursts Layer */}
      {bursts.map(burst => (
          <ParticleBurst 
            key={burst.id} 
            x={burst.x} 
            y={burst.y} 
            onComplete={() => removeBurst(burst.id)} 
          />
      ))}
    </div>
  );
};

export default Dashboard;
