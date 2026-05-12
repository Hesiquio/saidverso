const SUPABASE_URL = "https://cqsveyvxozegcxbidvqh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3ZleXZ4b3plZ2N4YmlkdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg4MTcsImV4cCI6MjA5NDExNDgxN30.-wxhr3p_Sltxe37FUZzsO7h6xv0e5WOC_n6Oi-384hU";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Database = {
    async fetchLevels() {
        try {
            const { data, error } = await supabaseClient.from('niveles').select('*').order('id', { ascending: true });
            if (error) { console.error("fetchLevels:", error.message); return []; }
            return data.map(d => d.config);
        } catch(e) { console.error("fetchLevels exception:", e); return []; }
    },

    async saveProfile(username, state) {
        if (!username) return;
        const score = (state.currentLevelIndex * 1000) + state.streak;
        try {
            const payload = {
                username: username,
                score: score,
                level: state.currentLevelIndex,
                streak: state.streak,
                coins: state.coins,
                inventory: state.inventory
            };
            const { error } = await supabaseClient.from('rankings')
                .upsert([payload], { onConflict: 'username' });
            if (error) console.error("saveProfile:", error.message);
        } catch(e) { console.error("saveProfile exception:", e); }
    },

    async loadProfile(username) {
        if (!username) return null;
        try {
            const { data, error } = await supabaseClient.from('rankings')
                .select('*')
                .eq('username', username)
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 significa "0 rows" (usuario nuevo)
                console.error("loadProfile:", error.message); 
                return null;
            }
            return data || null;
        } catch(e) { console.error("loadProfile exception:", e); return null; }
    },

    async getRanking() {
        try {
            const { data, error } = await supabaseClient.from('rankings')
                .select('username, score, level, streak')
                .order('score', { ascending: false })
                .limit(10);
            if (error) { console.error("getRanking:", error.message); return []; }
            return data || [];
        } catch(e) { console.error("getRanking exception:", e); return []; }
    }
};
