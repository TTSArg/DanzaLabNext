ALTER TABLE IF EXISTS public.espacios_solicitudes
  ADD COLUMN IF NOT EXISTS fotos_adicionales text[] DEFAULT '{}';

ALTER TABLE IF EXISTS public.salas
  ADD COLUMN IF NOT EXISTS fotos_adicionales text[] DEFAULT '{}';
