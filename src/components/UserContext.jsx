import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api';

const UserContext = createContext();

const DEFAULT_AVATAR = null;

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [unreadMetrics, setUnreadMetrics] = useState({
        pending_requests: 0,
        unread_messages: 0,
        has_notifications: false
    });

    const [isLoading, setIsLoading] = useState(true);

    const [user, setUser] = useState({
        isAuthenticated: false,
        fullName: '',
        username: '',
        email: '',
        bio: '',
        avatar: null,
        isPro: false,
        connectedService: null,
        preferences: {
            showCurrentSong: true,
            profileSearch: true,
            shareInsights: true,
            notificationArtistUpdates: true,
            notificationSocialAlerts: true,
            notificationWeeklyRecap: true,
            darkMode: true,
            language: 'English (US)'
        }
    });

    const mapApiToUser = useCallback((apiData) => {
        return {
            id: apiData.id,
            email: apiData.email,
            username: apiData.username,
            fullName: apiData.name || '',
            bio: apiData.bio || '',
            avatar: apiData.avatar_url || DEFAULT_AVATAR,
            isPro: apiData.is_pro || false,
            connectedService: apiData.connected_service,
            preferences: {
                showCurrentSong: apiData.show_current_song ?? true,
                profileSearch: apiData.allow_profile_search ?? true,
                shareInsights: apiData.allow_profile_search ?? true,
                notificationArtistUpdates: apiData.artist_notifications ?? true,
                notificationSocialAlerts: apiData.friend_notifications ?? true,
                notificationWeeklyRecap: apiData.weekly_summaries ?? true,
                darkMode: apiData.dark_mode ?? true,
                language: 'English (US)'
            }
        };
    }, []);

    // ─── Check Auth on Mount ────────────────────────────────────────────
    // Hydrate user state from the server session, not localStorage.
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/me/');
                const mapped = mapApiToUser(res.data);
                setUser({ ...mapped, isAuthenticated: true });
            } catch (error) {
                console.warn("Auth check failed, staying on login.", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [mapApiToUser]);

    // Global Unread Metrics Poller (Phase 4)
    // useEffect(() => {
    //     let intervalId;
    //     const fetchMetrics = async () => {
    //         if (!user.isAuthenticated) return;
    //         try {
    //             const res = await api.get('/social/metrics/');
    //             setUnreadMetrics(res.data);
    //         } catch (error) {
    //             console.error("Failed to fetch unread metrics", error);
    //         }
    //     };
    //     if (user.isAuthenticated) {
    //         fetchMetrics();
    //         intervalId = setInterval(fetchMetrics, 30000);
    //     } else {
    //         setUnreadMetrics({ pending_requests: 0, unread_messages: 0, has_notifications: false });
    //     }
    //     return () => { if (intervalId) clearInterval(intervalId); };
    // }, [user.isAuthenticated]);

    const updatePreference = useCallback(async (key, value) => {
        const keyMap = {
            showCurrentSong: 'show_current_song',
            profileSearch: 'allow_profile_search',
            shareInsights: 'allow_profile_search',
            notificationArtistUpdates: 'artist_notifications',
            notificationSocialAlerts: 'friend_notifications',
            notificationWeeklyRecap: 'weekly_summaries',
            darkMode: 'dark_mode'
        };

        const backendKey = keyMap[key];
        if (backendKey) {
            try {
                await api.patch('/auth/user/', { [backendKey]: value });
                setUser(prev => ({
                    ...prev,
                    preferences: {
                        ...prev.preferences,
                        [key]: value
                    }
                }));
            } catch (err) {
                console.error("Failed to update preference on server", err);
            }
        }
    }, [setUser]);

    const login = useCallback((userData) => {
        const mappedData = mapApiToUser(userData);
        setUser({
            ...mappedData,
            isAuthenticated: true
        });
    }, [mapApiToUser]);

    const logout = useCallback(async () => {
        try {
            // In demo mode, we don't necessarily need a real backend call, 
            // but we'll call it anyway as the mock handles it.
            await api.post('/auth/logout/');
        } catch (err) {
            console.warn("Mock logout log recorded", err);
        }
        // Clear all cached data so next user starts fresh
        localStorage.removeItem('trax_dashboard_cache');
        localStorage.removeItem('trax_insights_cache');
        sessionStorage.clear();
        // Clear all local state regardless
        setUser({
            isAuthenticated: false,
            fullName: '',
            username: '',
            email: '',
            bio: '',
            avatar: null,
            isPro: false,
            connectedService: null,
            preferences: {
                showCurrentSong: true,
                profileSearch: true,
                shareInsights: true,
                notificationArtistUpdates: true,
                notificationSocialAlerts: true,
                notificationWeeklyRecap: true,
                darkMode: true,
                language: 'English (US)'
            }
        });
        window.location.href = '/login';
    }, []);

    const updateProfile = useCallback(async (newData) => {
        const payload = {};
        if (newData.fullName) payload.name = newData.fullName;
        if (newData.username) payload.username = newData.username.toLowerCase();
        if (newData.bio !== undefined) payload.bio = newData.bio;
        if (newData.avatar !== undefined) payload.avatar_url = newData.avatar;

        try {
            if (Object.keys(payload).length > 0) {
                const res = await api.patch('/auth/user/', payload);
                const mapped = mapApiToUser(res.data);
                setUser(prev => ({ ...prev, ...mapped }));
            } else {
                setUser(prev => ({ ...prev, ...newData }));
            }
        } catch (err) {
            console.error("Failed to update profile", err);
            throw err;
        }
    }, [mapApiToUser]);

    const updateAvatar = useCallback((newAvatar) => {
        setUser(prev => ({ ...prev, avatar: newAvatar }));
    }, []);

    return (
        <UserContext.Provider value={{
            user, isLoading, unreadMetrics, login, logout,
            updateProfile, updateAvatar, updatePreference,
        }}>
            {children}
        </UserContext.Provider>
    );
};
