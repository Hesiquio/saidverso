const SUPABASE_URL = "https://cqsveyvxozegcxbidvqh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3ZleXZ4b3plZ2N4YmlkdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Mzg4MTcsImV4cCI6MjA5NDExNDgxN30.-wxhr3p_Sltxe37FUZzsO7h6xv0e5WOC_n6Oi-384hU";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Database = {
    async fetchLevels() {
        const { data, error } = await supabaseClient.from('niveles').select('*').order('id', { ascending: true });
        if (error) {
            console.error("Error al obtener niveles:", error.message);
            return [];
        }
        return data.map(d => d.config);
    },

    async saveScore(username, levelIndex, streak, coins) {
        if (!username || username === "EXPLORADOR") return;
        
        const combinedScore = (levelIndex * 1000) + streak;
        
        // Guardamos en Supabase (Ranking Global)
        const { error } = await supabaseClient.from('rankings').upsert([{ 
            username: username, 
            score: combinedScore 
        }], { onConflict: 'username' });

        if (error) {
            console.error("Error al guardar en Ranking:", error.message);
        } else {
            console.log("Progreso sincronizado con éxito.");
        }
    },

    async getRanking() {
        const { data, error } = await supabaseClient.from('rankings')
            .select('username, score')
            .order('score', { ascending: false })
            .limit(10);
            
        if (error) {
            console.error("Error al obtener Ranking:", error.message);
            return [];
        }
        return data || [];
    }
};
