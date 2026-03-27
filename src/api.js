// MOCK API ADAPTER FOR DEMO

const MOCK_DELAY = 400; // ms

// --- Mock Data ---

const MOCK_USER = {
    id: 1,
    name: "Alex Rivera",
    username: "arivera_vibes",
    email: "alex@trax.demo",
    avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop`,
    bio: "Sonic architect & curated playlist enthusiast. Seeking the perfect mid-tempo groove.",
    connected_service: "SPOTIFY",
    mutuals_count: 124,
    minutes_played: "42,850",
    preferences: {
        showCurrentSong: true,
        profileSearch: true,
        shareInsights: true,
        notificationArtistUpdates: true,
        notificationSocialAlerts: true,
        notificationWeeklyRecap: true,
        language: "English",
        darkMode: true
    }
};

const MOCK_DASHBOARD = {
    summary: {
        total_minutes: 12450,
        total_songs: 412,
        total_artists: 85,
        unique_tracks: 412,
        unique_artists: 85,
        top_genre: "Synthwave",
        listening_streak: 15,
        global_rank: 42,
        minutes_delta: "+12%"
    },
    hourly_data: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        label: `${String(i).padStart(2, '0')}:00`,
        mins: Math.floor(Math.random() * 45) + 5,
        songs: Math.floor(Math.random() * 10) + 2,
        artists: Math.floor(Math.random() * 5) + 1,
        top_genre: "Synthwave",
        top_artist: "The Weeknd",
        top_artist_img: `https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop`,
        top_artist_mins: Math.floor(Math.random() * 20),
        top_artist_songs: Math.floor(Math.random() * 5)
    })),
    top_artists: [
        { id: "1", name: "The Weeknd", image_url: `https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop`, play_duration_mins: 450, color_mapping: "bg-brand-purple" },
        { id: "2", name: "SZA", image_url: `https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=300&h=300&fit=crop`, play_duration_mins: 380, color_mapping: "bg-brand-teal" },
        { id: "3", name: "Arctic Monkeys", image_url: `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop`, play_duration_mins: 310, color_mapping: "bg-red-500" },
        { id: "4", name: "Daft Punk", image_url: `https://images.unsplash.com/photo-1514525253361-bee8d41df47a?w=300&h=300&fit=crop`, play_duration_mins: 290, color_mapping: "bg-blue-500" },
        { id: "5", name: "Kanye West", image_url: `https://images.unsplash.com/photo-1459749411177-042180ceea72?w=300&h=300&fit=crop`, play_duration_mins: 275, color_mapping: "bg-orange-500" }
    ],
    top_tracks: [
        { id: "t1", title: "Starboy", artist: "The Weeknd", plays: 85, play_count: 85, img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop", image_url: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop" },
        { id: "t2", title: "Kill Bill", artist: "SZA", plays: 72, play_count: 72, img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop", image_url: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop" },
        { id: "t3", title: "Do I Wanna Know?", artist: "Arctic Monkeys", plays: 64, play_count: 64, img: "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=300&h=300&fit=crop", image_url: "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=300&h=300&fit=crop" }
    ],
    now_playing: {
        is_playing: true,
        title: "After Hours",
        artist: "The Weeknd",
        album: "After Hours",
        img: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=400&h=400&fit=crop",
        progress_ms: 145000,
        duration_ms: 362000,
        item: {
            name: "After Hours",
            artists: ["The Weeknd"],
            album_art_url: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=400&h=400&fit=crop",
            duration_ms: 362000
        }
    }
};

const createMockInsightsGroup = () => ({
    summary: MOCK_DASHBOARD.summary,
    top_tracks: MOCK_DASHBOARD.top_tracks,
    top_artists: MOCK_DASHBOARD.top_artists,
    top_albums: [
        { title: "After Hours", artist: "The Weeknd", img: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=400&h=400&fit=crop", play_count: 124 },
        { title: "SOS", artist: "SZA", img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400&h=400&fit=crop", play_count: 98 },
        { title: "AM", artist: "Arctic Monkeys", img: "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=400&h=400&fit=crop", play_count: 85 }
    ]
});

const MOCK_INSIGHTS = {
    data: {
        today: { trax_data: { data: createMockInsightsGroup() }, platform_data: createMockInsightsGroup() },
        '7d': { trax_data: { data: createMockInsightsGroup() }, platform_data: createMockInsightsGroup() },
        '4w': { trax_data: { data: createMockInsightsGroup() }, platform_data: createMockInsightsGroup() },
        '6m': { trax_data: { data: createMockInsightsGroup() }, platform_data: createMockInsightsGroup() },
        'all': { trax_data: { data: createMockInsightsGroup() }, platform_data: createMockInsightsGroup() }
    },
    config: {
        trax_eligibility: {
            today: { is_eligible: true },
            '7d': { is_eligible: true },
            '4w': { is_eligible: true },
            '6m': { is_eligible: true },
            'all': { is_eligible: true }
        },
        platform_support: ['today', '7d', '4w', '6m', 'all']
    },
    genres: [
        { name: "Synthwave", percentage: 35 },
        { name: "Indie Pop", percentage: 25 },
        { name: "Techno", percentage: 20 },
        { name: "Experimental", percentage: 15 },
        { name: "Jazz Fusion", percentage: 5 }
    ],
    vibe_check: "Celestial & Melancholic",
    listening_pattern: "Late Night Specialist",
    discovery_rate: 82,
    loyalty_score: 91
};

const MOCK_NOW_PLAYING = MOCK_DASHBOARD.now_playing;

const MOCK_FRIENDS = {
    friends: [
        { id: 2, name: "Jordan Smith", username: "jordan_s", avatar_url: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop` },
        { id: 3, name: "Sarah Lee", username: "sarah_l", avatar_url: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop` },
        { id: 4, name: "Marcus", username: "marcus_v", avatar_url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop` },
        { id: 5, name: "Elena", username: "elena_m", avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop` }
    ],
    pending_incoming_requests: [
        { connection_id: 101, user: { id: 6, name: "Kai", username: "kai_code", avatar_url: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop`, } }
    ]
};

const MOCK_CHAT_ROOMS = {
    rooms: [
        { target_user_id: 2, name: "Jordan Smith", img: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop`, last_message: "That new track is fire!", unread_count: 2, time: "2m ago" },
        { target_user_id: 3, name: "Sarah Lee", img: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop`, last_message: "Did you hear the new SZA album?", unread_count: 0, time: "1h ago" },
        { target_user_id: 4, name: "Marcus", img: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop`, last_message: "Yo, check this playlist.", unread_count: 0, time: "3h ago" }
    ],
    total_unread: 2
};

const MOCK_SUGGESTIONS = [
    { id: 7, name: "Olivia", username: "olivia_w", avatar_url: `https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop`, mutual: 15 },
    { id: 8, name: "Liam", username: "liam_tech", avatar_url: `https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop`, mutual: 9 },
    { id: 9, name: "Zoe", username: "zoe_vibe", avatar_url: `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop`, mutual: 21 },
    { id: 10, name: "Ethan", username: "ethan_j", avatar_url: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop`, mutual: 4 }
];

const MOCK_ACTIVITY = [
    { user: "Jordan Smith", action: "loved", target: "Kill Bill", artist: "SZA", time: "5m ago", img: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop`, targetImg: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop", type: "like" },
    { user: "Sarah Lee", action: "played", target: "Blinding Lights", artist: "The Weeknd", time: "15m ago", img: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop`, targetImg: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=300&h=300&fit=crop", type: "play" },
    { user: "Marcus", action: "shared", target: "Dawn FM", artist: "The Weeknd", time: "1h ago", img: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop`, targetImg: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop", type: "share" }
];

const MOCK_RECENTLY_PLAYED = [
    { title: "Starboy", artist: "The Weeknd", played_at: new Date().toISOString(), img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop" },
    { title: "SICKO MODE", artist: "Travis Scott", played_at: new Date(Date.now() - 3600000).toISOString(), img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&h=300&fit=crop" },
    { title: "Creepin'", artist: "Metro Boomin", played_at: new Date(Date.now() - 7200000).toISOString(), img: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300&fit=crop" }
];

const MOCK_LEADERBOARD = [
    { rank: 1, name: "Alex Rivera", mins: 12450, isYou: true, provider: "spotify", avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop` },
    { rank: 2, name: "Jordan Smith", mins: 11200, isYou: false, provider: "apple", avatar_url: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop` },
    { rank: 3, name: "Sarah Lee", mins: 9800, isYou: false, provider: "spotify", avatar_url: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop` },
    { rank: 4, name: "Marcus", mins: 8500, isYou: false, provider: "youtube", avatar_url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop` },
    { rank: 5, name: "Elena", mins: 7200, isYou: false, provider: "spotify", avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop` }
];

const MOCK_NOTIFICATIONS = [
    { id: 1, type: "friend_request", user: "Kai", text: "wants to join your unit", time: "2m ago", timestamp: new Date().toISOString(), fallbackUsername: "kai_code", actions: ["Accept", "Decline"] },
    { id: 2, type: "like", user: "Jordan Smith", text: "fanned your top track", target: "Starboy", time: "1h ago", timestamp: new Date(Date.now() - 3600000).toISOString(), img: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop`, targetImg: "14" },
    { id: 3, type: "message", user: "Sarah Lee", text: "sent you a transmission", time: "3h ago", timestamp: new Date(Date.now() - 10800000).toISOString(), img: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop` }
];

const MOCK_MESSAGES = [
    { id: 1, sender: "jordan_s", text: "Yo, did you hear that new Weeknd leak?", time: "10:05 AM", is_read: true },
    { id: 2, sender: "arivera_vibes", text: "Nah, is it actually good?", time: "10:06 AM", is_read: true },
    { id: 3, sender: "jordan_s", text: "Insane. Pure 80s synth vibes.", time: "10:07 AM", is_read: true },
    { id: 4, sender: "arivera_vibes", text: "Send the link!", time: "10:10 AM", is_read: true },
    { id: 5, sender: "jordan_s", text: "That new track is fire!", time: "10:15 AM", is_read: false }
];

const MOCK_TASTE_DNA = {
    metrics: { uniqueness: 92, breadth: 78, trend: 45, niche: 88 },
    insight: "Your sonic palette is a rare hybrid of classic synth textures and cutting-edge experimentalism.",
    sync_insight: "You and Jordan share an 85% overlap in late-night listening habits.",
    affinities: {
        genres: [
            { name: "Jordan Smith", match: "94%", detail: "Synthwave Fanatics", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400" },
            { name: "Sarah Lee", match: "82%", detail: "Indie Pop Twins", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400" }
        ],
        artists: [
            { name: "Marcus", match: "88%", detail: "Weeknd Warriors", cover: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=400" }
        ],
        tracks: [],
        albums: []
    }
};

const getMockProfile = (id) => ({
    id: id,
    name: id === 1 ? "Alex Rivera" : (MOCK_FRIENDS.friends.find(f => f.id == id)?.name || "Unknown Walker"),
    username: id === 1 ? "arivera_vibes" : (MOCK_FRIENDS.friends.find(f => f.id == id)?.username || "unknown"),
    avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop`,
    bio: "Exploring the intersections of sound and space.",
    connected_service: "SPOTIFY",
    mutuals_count: 85,
    minutes_played: "12,450",
    connection_status: "accepted",
    compatibility: "85%",
    showCurrentSong: true,
    nowPlaying: MOCK_NOW_PLAYING,
    recentHistory: MOCK_RECENTLY_PLAYED
});

// --- Mocking Setup ---

const mockResponse = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data });
        }, MOCK_DELAY);
    });
};

const api = {
    interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
    },
    get: async (url) => {
        // Auth
        if (url.includes('/auth/me')) return mockResponse(MOCK_USER);
        
        // Social hub
        if (url.includes('/social/metrics')) return mockResponse({ pending_requests: 1, unread_messages: 2, has_notifications: true });
        if (url.includes('/social/friends')) return mockResponse(MOCK_FRIENDS);
        if (url.includes('/social/chat/rooms')) return mockResponse(MOCK_CHAT_ROOMS);
        if (url.includes('/social/suggestions')) return mockResponse(MOCK_SUGGESTIONS);
        if (url.includes('/social/activity')) return mockResponse(MOCK_ACTIVITY);
        if (url.includes('/social/search')) return mockResponse(MOCK_SUGGESTIONS);
        if (url.includes('/social/leaderboard')) return mockResponse(MOCK_LEADERBOARD);
        if (url.includes('/social/notifications')) return mockResponse(MOCK_NOTIFICATIONS);
        
        // Chat
        if (url.includes('/social/chat/direct/')) {
            const userId = url.split('/').filter(Boolean).pop();
            return mockResponse({
                room_id: 101,
                messages: MOCK_MESSAGES,
                user: { name: "Jordan Smith", img: `https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop`, status: "Starboy", isOnline: true }
            });
        }

        // Profile
        if (url.includes('/social/profile/')) {
            const id = url.split('/').filter(Boolean).pop();
            return mockResponse(getMockProfile(id === 'me' ? 1 : id));
        }

        // Music
        if (url.includes('/music/dashboard')) return mockResponse(MOCK_DASHBOARD);
        if (url.includes('/music/insights')) return mockResponse(MOCK_INSIGHTS);
        if (url.includes('/music/spotify/now-playing')) return mockResponse(MOCK_NOW_PLAYING);
        if (url.includes('/music/spotify/sync-status')) return mockResponse({ is_syncing: false });
        if (url.includes('/music/spotify/recently-played')) return mockResponse(MOCK_RECENTLY_PLAYED);
        if (url.includes('/music/ai/daily-roast')) return mockResponse({ roast: "Your taste is a chaotic blend of main-character energy and 'I listen to everything'. It's impressive how you can transition from Eminem to SZA without a mid-life crisis." });
        if (url.includes('/music/ai/taste-profile')) return mockResponse(MOCK_TASTE_DNA);
        if (url.includes('/music/stats/summary')) return mockResponse(MOCK_DASHBOARD.summary);
        if (url.includes('/music/stats/top-genres')) return mockResponse({ results: MOCK_INSIGHTS.genres });
        if (url.includes('/social/top-listeners/')) {
            return mockResponse({
                item: { name: "After Hours", artist: "The Weeknd", img: "https://images.unsplash.com/photo-1621112904887-419379ce6824?w=400&h=400&fit=crop" },
                leaderboard: MOCK_LEADERBOARD,
                userStats: { rank: 1, totalUsers: 1450, percentile: 0.1, listenMinutes: 12450, topGenre: "Synthwave", genrePercent: 85 }
            });
        }
        
        return mockResponse({});
    },
    post: async (url, data) => {
        if (url.includes('/auth/logout')) return mockResponse({});
        if (url.includes('/auth/password/change')) return mockResponse({ success: true });
        if (url.includes('/music/spotify/refresh')) return mockResponse({});
        if (url.includes('/social/friends/requests')) return mockResponse({ success: true });
        if (url.includes('/social/chat/direct')) return mockResponse({ success: true });
        return mockResponse({ success: true, ...data });
    },
    patch: async (url, data) => {
        if (url.includes('/auth/user/')) {
            Object.assign(MOCK_USER, data);
            return mockResponse(MOCK_USER);
        }
        return mockResponse({ success: true, ...data });
    },
    put: async (url, data) => {
        if (url.includes('/social/friends/requests/')) return mockResponse({ success: true });
        return mockResponse({ success: true, ...data });
    },
    delete: async (url) => {
        if (url.includes('/social/chat/message/')) return mockResponse({ success: true });
        if (url.includes('/social/chat/room/')) return mockResponse({ success: true });
        if (url.includes('/social/friends/')) return mockResponse({ success: true });
        return mockResponse({ success: true });
    }
};

export default api;
