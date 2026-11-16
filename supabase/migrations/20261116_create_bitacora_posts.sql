CREATE OR REPLACE FUNCTION public.is_bitacora_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.profiles AS profile
      WHERE profile.id = auth.uid()
        AND lower(profile.role) = 'admin'
    )
    OR lower(COALESCE(auth.jwt() ->> 'email', '')) IN (
      'ttservicios.arg@gmail.com',
      'admin@danzalab.com',
      'hola@danzalab.com'
    );
$$;

REVOKE ALL ON FUNCTION public.is_bitacora_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_bitacora_admin() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS public.bitacora_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 160),
  category text NOT NULL CHECK (char_length(btrim(category)) BETWEEN 1 AND 80),
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 1 AND 180),
  body text NOT NULL CHECK (char_length(btrim(body)) BETWEEN 1 AND 30000),
  caption text NOT NULL DEFAULT '' CHECK (char_length(caption) <= 2000),
  media jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (
    jsonb_typeof(media) = 'array' AND jsonb_array_length(media) <= 3
  ),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

CREATE INDEX IF NOT EXISTS bitacora_posts_status_published_at_idx
  ON public.bitacora_posts (status, published_at DESC);

ALTER TABLE public.bitacora_posts ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.bitacora_posts TO anon, authenticated;
GRANT INSERT, UPDATE ON public.bitacora_posts TO authenticated;

DROP POLICY IF EXISTS "Public can read published bitacora posts" ON public.bitacora_posts;
CREATE POLICY "Public can read published bitacora posts"
  ON public.bitacora_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.is_bitacora_admin());

DROP POLICY IF EXISTS "Admins can create bitacora drafts" ON public.bitacora_posts;
CREATE POLICY "Admins can create bitacora drafts"
  ON public.bitacora_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_bitacora_admin() AND status = 'draft');

DROP POLICY IF EXISTS "Admins can update bitacora posts" ON public.bitacora_posts;
CREATE POLICY "Admins can update bitacora posts"
  ON public.bitacora_posts
  FOR UPDATE
  TO authenticated
  USING (public.is_bitacora_admin())
  WITH CHECK (public.is_bitacora_admin());

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'bitacora-media',
  'bitacora-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can read bitacora media" ON storage.objects;
CREATE POLICY "Public can read bitacora media"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'bitacora-media');

DROP POLICY IF EXISTS "Admins can upload bitacora media" ON storage.objects;
CREATE POLICY "Admins can upload bitacora media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bitacora-media' AND public.is_bitacora_admin());

DROP POLICY IF EXISTS "Admins can remove bitacora media" ON storage.objects;
CREATE POLICY "Admins can remove bitacora media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'bitacora-media' AND public.is_bitacora_admin());
