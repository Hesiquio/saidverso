-- 00000000000000_create_tables.sql
-- Migración inicial para Cipher Quest (Actualizada: 2026-05-11)
-- Migración inicial para Cipher Quest

CREATE TABLE IF NOT EXISTS niveles (
  id SERIAL PRIMARY KEY,
  nombre TEXT,
  config JSONB
);

CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  username TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE niveles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura pública" ON niveles FOR SELECT USING (true);

ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir inserción pública" ON rankings FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura pública rankings" ON rankings FOR SELECT USING (true);
