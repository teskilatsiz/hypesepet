-- Check and create storage buckets if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'profil-resimleri') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('profil-resimleri', 'profil-resimleri', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'urun-gorselleri') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('urun-gorselleri', 'urun-gorselleri', true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'yorum-gorselleri') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('yorum-gorselleri', 'yorum-gorselleri', true);
    END IF;
END $$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Herkes profil resimlerini görebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi profil resimlerini yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Herkes ürün görsellerini görebilir" ON storage.objects;
DROP POLICY IF EXISTS "Giriş yapmış kullanıcılar ürün görseli yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Herkes yorum görsellerini görebilir" ON storage.objects;
DROP POLICY IF EXISTS "Giriş yapmış kullanıcılar yorum görseli yükleyebilir" ON storage.objects;

-- Recreate storage policies
CREATE POLICY "Herkes profil resimlerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'profil-resimleri');

CREATE POLICY "Kullanıcılar kendi profil resimlerini yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profil-resimleri'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Herkes ürün görsellerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'urun-gorselleri');

CREATE POLICY "Giriş yapmış kullanıcılar ürün görseli yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'urun-gorselleri'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Herkes yorum görsellerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'yorum-gorselleri');

CREATE POLICY "Giriş yapmış kullanıcılar yorum görseli yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'yorum-gorselleri'
  AND auth.role() = 'authenticated'
);