import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import api from '../api';

// ── 0. Context Definition ──────────────────────────────────────────────────
const DataCacheContext = createContext();

// ── 1. TTL Constants ────────────────────────────────────────────────────────
const DASHBOARD_TTL = 3 * 60 * 1000;   // 3 min
const INSIGHTS_TTL  = 5 * 60 * 1000;   // 5 min

export const DataCacheProvider = ({ children }) => {
    // ── 1. Unified Hydration Helper ──────────────────────────────────────────
    // Uses localStorage so cache survives tab close & browser restart
    const getCached = (key, ttl) => {
        try {
            const cached = localStorage.getItem(key);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < ttl) return { data, timestamp };
            }
        } catch (e) { console.warn(`Cache hydration fail: ${key}`, e); }
        return { data: null, timestamp: 0 };
    };

    // ── 2. All State and Refs First ──────────────────────────────────────────
    
    // Dashboard Cache with synchronous hydration
    const dashboardHydration = getCached('trax_dashboard_cache', DASHBOARD_TTL);
    const [dashboardData, setDashboardData] = useState(dashboardHydration.data);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const dashboardTimestamp = useRef(dashboardHydration.timestamp);

    // Insights Cache with synchronous hydration
    const insightsHydration = getCached('trax_insights_cache', INSIGHTS_TTL);
    const [insightsData, setInsightsData] = useState(insightsHydration.data);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const insightsTimestamp = useRef(insightsHydration.timestamp);

    // Now Playing Cache (transient)
    const [nowPlaying, setNowPlaying] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // ── 3. Retention Layer ───────────────────────────────────────────────────
    
    // Save to localStorage whenever data changes
    useEffect(() => {
        if (dashboardData) {
            localStorage.setItem('trax_dashboard_cache', JSON.stringify({
                data: dashboardData,
                timestamp: dashboardTimestamp.current
            }));
        }
    }, [dashboardData]);

    useEffect(() => {
        if (insightsData) {
            localStorage.setItem('trax_insights_cache', JSON.stringify({
                data: insightsData,
                timestamp: insightsTimestamp.current
            }));
        }
    }, [insightsData]);

    // ── 3. Sync & Fetch Methods ──────────────────────────────────────────────

    const fetchDashboard = useCallback(async (force = false) => {
        const now = Date.now();
        const isStale = now - dashboardTimestamp.current > DASHBOARD_TTL;

        if (!force && !isStale && dashboardData) {
            return dashboardData;
        }

        setDashboardLoading(true);
        try {
            const res = await api.get(`/music/dashboard/?offset=${new Date().getTimezoneOffset()}`);
            const data = res.data;
            setDashboardData(data);
            dashboardTimestamp.current = Date.now();
            return data;
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
            return dashboardData;
        } finally {
            setDashboardLoading(false);
        }
    }, [dashboardData]);

    const fetchInsights = useCallback(async (force = false) => {
        const now = Date.now();
        const isStale = now - insightsTimestamp.current > INSIGHTS_TTL;

        if (!force && !isStale && insightsData) {
            return insightsData;
        }

        setInsightsLoading(true);
        try {
            const res = await api.get(`/music/insights/?bulk=true&offset=${new Date().getTimezoneOffset()}`);
            const data = res.data;
            setInsightsData(data);
            insightsTimestamp.current = Date.now();
            return data;
        } catch (error) {
            console.error('Failed to fetch insights:', error);
            return insightsData;
        } finally {
            setInsightsLoading(false);
        }
    }, [insightsData]);

    const fetchNowPlaying = useCallback(async () => {
        try {
            const res = await api.get('/music/spotify/now-playing/');
            if (res.data.is_playing) {
                const item = res.data.item || {};
                const np = {
                    is_playing: true,
                    title: item.name || '',
                    artist: (item.artists || []).join(', '),
                    img: item.album_art_url || '',
                    progress_ms: res.data.progress_ms || 0,
                    duration_ms: item.duration_ms || 0,
                };
                setNowPlaying(np);
                return np;
            } else {
                setNowPlaying(null);
                return null;
            }
        } catch {
            return nowPlaying;
        }
    }, [nowPlaying]);

    const startSync = useCallback(async () => {
        if (isSyncing) return;
        
        // Anti-Spam: Don't sync if last successful fetch was < 60s ago
        const now = Date.now();
        if (now - dashboardTimestamp.current < 60000 && dashboardData) {
            console.log("Skipping sync: last fetch was < 60s ago");
            return;
        }

        setIsSyncing(true);
        try {
            await api.post('/music/spotify/refresh/');
            
            let retryCount = 0;
            const maxRetries = 20; // ~1 minute total
            
            const pollInterval = setInterval(async () => {
                try {
                    const res = await api.get('/music/spotify/sync-status/');
                    // In a demo, we want this to be very fast
                    if (!res.data.is_syncing || retryCount >= 1) { 
                        clearInterval(pollInterval);
                        
                        dashboardTimestamp.current = 0;
                        insightsTimestamp.current = 0;
                        
                        await Promise.all([
                            fetchDashboard(true),
                            fetchInsights(true),
                        ]);
                        setIsSyncing(false);
                    }
                    retryCount++;
                } catch (err) {
                    console.error("Error polling sync status:", err);
                    clearInterval(pollInterval);
                    setIsSyncing(false);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Failed to start sync:', error);
            setIsSyncing(false);
            throw error;
        }
    }, [isSyncing, fetchDashboard, fetchInsights]);

    const invalidateAll = useCallback(() => {
        dashboardTimestamp.current = 0;
        insightsTimestamp.current = 0;
        localStorage.removeItem('trax_dashboard_cache');
        localStorage.removeItem('trax_insights_cache');
    }, []);

    // ── 4. Provide Context ───────────────────────────────────────────────────

    return (
        <DataCacheContext.Provider value={{
            dashboardData,
            dashboardLoading,
            fetchDashboard,
            insightsData,
            insightsLoading,
            fetchInsights,
            isSyncing,
            startSync,
            nowPlaying,
            setNowPlaying,
            fetchNowPlaying,
            invalidateAll,
        }}>
            {children}
        </DataCacheContext.Provider>
    );
};

/**
 * Global data cache Hook.
 */
export const useDataCache = () => {
    const context = useContext(DataCacheContext);
    if (!context) {
        throw new Error('useDataCache must be used within a DataCacheProvider');
    }
    return context;
};
