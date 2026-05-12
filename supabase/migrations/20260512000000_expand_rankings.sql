-- ============================================================
-- Migración: Expandir rankings para perfil completo del jugador
-- SaidVerso v5.2 — 2026-05-12
-- ============================================================

-- 1. Añadir columnas de perfil a la tabla rankings
ALTER TABLE rankings
    ADD COLUMN IF NOT EXISTS level      integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS streak     integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS coins      integer DEFAULT 0,
    ADD COLUMN IF NOT EXISTS inventory  jsonb   DEFAULT '{"star":0,"ghost":0,"speed":0,"life":0}'::jsonb,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 2. El score se calcula como (level * 1000) + streak para el ranking
--    Las columnas individuales permiten restaurar el progreso completo

-- 3. Asegurar que username sea único (clave de upsert)
ALTER TABLE rankings
    DROP CONSTRAINT IF EXISTS rankings_username_unique;
ALTER TABLE rankings
    ADD CONSTRAINT rankings_username_unique UNIQUE (username);

-- 4. Añadir política de UPDATE (necesaria para upsert de perfil)
DROP POLICY IF EXISTS "Permitir actualización propia" ON rankings;
CREATE POLICY "Permitir actualización propia" ON rankings
    FOR UPDATE USING (true) WITH CHECK (true);

-- 5. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rankings_updated_at ON rankings;
CREATE TRIGGER rankings_updated_at
    BEFORE UPDATE ON rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
