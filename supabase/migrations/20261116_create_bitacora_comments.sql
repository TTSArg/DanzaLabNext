CREATE TABLE IF NOT EXISTS public.bitacora_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 100),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bitacora_comments_slug_created_at_idx
  ON public.bitacora_comments (slug, created_at DESC);

ALTER TABLE public.bitacora_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.bitacora_comments TO anon;

DROP POLICY IF EXISTS "Public can read bitacora comments" ON public.bitacora_comments;
CREATE POLICY "Public can read bitacora comments"
  ON public.bitacora_comments
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Public can add bitacora comments" ON public.bitacora_comments;
CREATE POLICY "Public can add bitacora comments"
  ON public.bitacora_comments
  FOR INSERT
  TO anon
  WITH CHECK (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    AND char_length(slug) <= 100
    AND char_length(btrim(name)) BETWEEN 1 AND 80
    AND char_length(btrim(body)) BETWEEN 1 AND 2000
  );
