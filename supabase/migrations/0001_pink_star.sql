/*
  # HypeSepet Veritabanı Şeması

  1. Yeni Tablolar
    - `kullanicilar`: Kullanıcı bilgileri
    - `urunler`: İlan edilen ürünler
    - `kategoriler`: Ürün kategorileri
    - `yorumlar`: Ürün yorumları
    - `yorum_gorselleri`: Yorumlara ait görseller
    - `favori_urunler`: Kullanıcıların favori ürünleri
    - `mesajlar`: Kullanıcılar arası mesajlaşma

  2. Güvenlik
    - Tüm tablolar için RLS aktif
    - Kullanıcı bazlı erişim politikaları
*/

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS kategoriler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  aciklama text,
  ikon text,
  created_at timestamptz DEFAULT now()
);

-- Kullanıcılar profil tablosu
CREATE TABLE IF NOT EXISTS kullanici_profilleri (
  id uuid PRIMARY KEY REFERENCES auth.users,
  ad text NOT NULL,
  soyad text NOT NULL,
  kullanici_adi text UNIQUE NOT NULL,
  telefon text,
  avatar_url text,
  konum jsonb,
  degerlendirme_puani numeric(3,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS urunler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  satici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  kategori_id uuid REFERENCES kategoriler(id) NOT NULL,
  baslik text NOT NULL,
  aciklama text NOT NULL,
  fiyat numeric(10,2) NOT NULL,
  durum text NOT NULL,
  konum jsonb NOT NULL,
  gorsel_urls text[] NOT NULL,
  satildi boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Yorumlar tablosu
CREATE TABLE IF NOT EXISTS yorumlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  urun_id uuid REFERENCES urunler(id) NOT NULL,
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  ust_yorum_id uuid REFERENCES yorumlar(id),
  icerik text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Yorum görselleri tablosu
CREATE TABLE IF NOT EXISTS yorum_gorselleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yorum_id uuid REFERENCES yorumlar(id) NOT NULL,
  gorsel_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Favori ürünler tablosu
CREATE TABLE IF NOT EXISTS favori_urunler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  urun_id uuid REFERENCES urunler(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(kullanici_id, urun_id)
);

-- Mesajlar tablosu
CREATE TABLE IF NOT EXISTS mesajlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gonderen_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  alici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  urun_id uuid REFERENCES urunler(id),
  icerik text NOT NULL,
  okundu boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS Politikaları
ALTER TABLE kategoriler ENABLE ROW LEVEL SECURITY;
ALTER TABLE kullanici_profilleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE urunler ENABLE ROW LEVEL SECURITY;
ALTER TABLE yorumlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE yorum_gorselleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE favori_urunler ENABLE ROW LEVEL SECURITY;
ALTER TABLE mesajlar ENABLE ROW LEVEL SECURITY;

-- Kategori politikaları
CREATE POLICY "Herkes kategorileri görebilir" ON kategoriler
  FOR SELECT TO public USING (true);

-- Kullanıcı profili politikaları
CREATE POLICY "Kullanıcılar kendi profillerini düzenleyebilir" ON kullanici_profilleri
  FOR ALL TO authenticated USING (auth.uid() = id);

CREATE POLICY "Herkes profilleri görebilir" ON kullanici_profilleri
  FOR SELECT TO public USING (true);

-- Ürün politikaları
CREATE POLICY "Herkes ürünleri görebilir" ON urunler
  FOR SELECT TO public USING (true);

CREATE POLICY "Kullanıcılar kendi ürünlerini yönetebilir" ON urunler
  FOR ALL TO authenticated USING (auth.uid() = satici_id);

-- Yorum politikaları
CREATE POLICY "Herkes yorumları görebilir" ON yorumlar
  FOR SELECT TO public USING (true);

CREATE POLICY "Kullanıcılar yorum yapabilir" ON yorumlar
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Kullanıcılar kendi yorumlarını düzenleyebilir" ON yorumlar
  FOR UPDATE TO authenticated USING (auth.uid() = kullanici_id);

-- Yorum görselleri politikaları
CREATE POLICY "Herkes yorum görsellerini görebilir" ON yorum_gorselleri
  FOR SELECT TO public USING (true);

CREATE POLICY "Kullanıcılar yorum görseli ekleyebilir" ON yorum_gorselleri
  FOR INSERT TO authenticated WITH CHECK (true);

-- Favori ürünler politikaları
CREATE POLICY "Kullanıcılar kendi favorilerini yönetebilir" ON favori_urunler
  FOR ALL TO authenticated USING (auth.uid() = kullanici_id);

-- Mesaj politikaları
CREATE POLICY "Kullanıcılar kendi mesajlarını görebilir" ON mesajlar
  FOR SELECT TO authenticated 
  USING (auth.uid() = gonderen_id OR auth.uid() = alici_id);

CREATE POLICY "Kullanıcılar mesaj gönderebilir" ON mesajlar
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = gonderen_id);