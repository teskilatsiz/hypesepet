/*
  # Alt Kategoriler ve İyileştirmeler

  1. Değişiklikler
    - kategoriler tablosuna üst_kategori_id kolonu eklendi
    - Örnek alt kategoriler eklendi
    - Yorum görselleri için indeks eklendi
*/

-- Kategoriler tablosuna üst kategori ilişkisi ekle
ALTER TABLE kategoriler
ADD COLUMN IF NOT EXISTS ust_kategori_id uuid REFERENCES kategoriler(id);

-- Alt kategorileri ekle
INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Cep Telefonları', 'Akıllı telefonlar ve cep telefonları', 'smartphone', id 
FROM kategoriler WHERE ad = 'Elektronik';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Bilgisayarlar', 'Dizüstü ve masaüstü bilgisayarlar', 'laptop', id 
FROM kategoriler WHERE ad = 'Elektronik';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Tabletler', 'Tablet bilgisayarlar', 'tablet', id 
FROM kategoriler WHERE ad = 'Elektronik';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Erkek Giyim', 'Erkek giyim ürünleri', 'user', id 
FROM kategoriler WHERE ad = 'Giyim';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Kadın Giyim', 'Kadın giyim ürünleri', 'user', id 
FROM kategoriler WHERE ad = 'Giyim';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Çocuk Giyim', 'Çocuk giyim ürünleri', 'user', id 
FROM kategoriler WHERE ad = 'Giyim';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Mobilya', 'Ev mobilyaları', 'couch', id 
FROM kategoriler WHERE ad = 'Ev & Yaşam';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Mutfak', 'Mutfak gereçleri', 'utensils', id 
FROM kategoriler WHERE ad = 'Ev & Yaşam';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Dekorasyon', 'Ev dekorasyon ürünleri', 'lamp', id 
FROM kategoriler WHERE ad = 'Ev & Yaşam';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Spor Aletleri', 'Fitness ve spor ekipmanları', 'dumbbell', id 
FROM kategoriler WHERE ad = 'Spor & Outdoor';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Kamp Malzemeleri', 'Kamp ve outdoor ekipmanları', 'tent', id 
FROM kategoriler WHERE ad = 'Spor & Outdoor';

INSERT INTO kategoriler (ad, aciklama, ikon, ust_kategori_id) 
SELECT 'Bisikletler', 'Bisiklet ve aksesuarları', 'bike', id 
FROM kategoriler WHERE ad = 'Spor & Outdoor';

-- Yorum görselleri için indeks
CREATE INDEX IF NOT EXISTS idx_yorum_gorselleri_yorum_id ON yorum_gorselleri(yorum_id);