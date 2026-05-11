-- CIPHER QUEST: SQL SETUP
-- Copia y pega esto en el SQL Editor de tu proyecto en Supabase

-- 1. Tabla de Niveles
CREATE TABLE IF NOT EXISTS niveles (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  config JSONB
);

-- 2. Tabla de Rankings
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  username TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Nivel de Prueba (ROBOT con César +1)
INSERT INTO niveles (nombre, config) VALUES (
  'Nivel 1: Iniciación',
  '{
    "word": "ROBOT",
    "hint": "César +1 (A -> B)",
    "shift": 1,
    "maze": [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,1,1,0,1,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
  }'
) ON CONFLICT DO NOTHING;

-- 4. Políticas de Seguridad (RLS)
ALTER TABLE niveles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir lectura pública" ON niveles;
CREATE POLICY "Permitir lectura pública" ON niveles FOR SELECT USING (true);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir inserción pública" ON rankings;
CREATE POLICY "Permitir inserción pública" ON rankings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Permitir lectura pública rankings" ON rankings;
CREATE POLICY "Permitir lectura pública rankings" ON rankings FOR SELECT USING (true);
