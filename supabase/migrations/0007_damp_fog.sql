-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profil-resimleri', 'profil-resimleri', true),
  ('urun-gorselleri', 'urun-gorselleri', true),
  ('yorum-gorselleri', 'yorum-gorselleri', true);

-- Set up storage policies for profil-resimleri
CREATE POLICY "Herkes profil resimlerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'profil-resimleri');

CREATE POLICY "Kullanıcılar kendi profil resimlerini yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profil-resimleri'
  AND auth.role() = 'authenticated'
);

-- Set up storage policies for urun-gorselleri
CREATE POLICY "Herkes ürün görsellerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'urun-gorselleri');

CREATE POLICY "Giriş yapmış kullanıcılar ürün görseli yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'urun-gorselleri'
  AND auth.role() = 'authenticated'
);

-- Set up storage policies for yorum-gorselleri
CREATE POLICY "Herkes yorum görsellerini görebilir"
ON storage.objects FOR SELECT
USING (bucket_id = 'yorum-gorselleri');

CREATE POLICY "Giriş yapmış kullanıcılar yorum görseli yükleyebilir"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'yorum-gorselleri'
  AND auth.role() = 'authenticated'
);