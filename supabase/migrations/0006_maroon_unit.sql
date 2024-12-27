/*
  # Yorum beğeni sistemi

  1. Yeni Tablolar
    - `yorum_begeniler`
      - `id` (uuid, primary key)
      - `yorum_id` (uuid, foreign key)
      - `kullanici_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Değişiklikler
    - `yorumlar` tablosuna `begeni_sayisi` kolonu eklendi

  3. Güvenlik
    - RLS politikaları eklendi
    - Kullanıcıların kendi beğenilerini yönetmesi için politikalar
*/

-- Yorum beğeni tablosu
CREATE TABLE IF NOT EXISTS yorum_begeniler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yorum_id uuid REFERENCES yorumlar(id) NOT NULL,
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(yorum_id, kullanici_id)
);

-- Yorumlar tablosuna beğeni sayısı kolonu ekle
ALTER TABLE yorumlar ADD COLUMN IF NOT EXISTS begeni_sayisi integer DEFAULT 0;

-- Beğeni sayısını güncellemek için trigger fonksiyonu
CREATE OR REPLACE FUNCTION guncelle_yorum_begeni_sayisi()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE yorumlar 
    SET begeni_sayisi = begeni_sayisi + 1 
    WHERE id = NEW.yorum_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE yorumlar 
    SET begeni_sayisi = begeni_sayisi - 1 
    WHERE id = OLD.yorum_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ı ekle
CREATE TRIGGER yorum_begeni_sayisi_trigger
AFTER INSERT OR DELETE ON yorum_begeniler
FOR EACH ROW
EXECUTE FUNCTION guncelle_yorum_begeni_sayisi();

-- RLS politikaları
ALTER TABLE yorum_begeniler ENABLE ROW LEVEL SECURITY;

-- Herkes beğenileri görebilir
CREATE POLICY "Herkes beğenileri görebilir"
  ON yorum_begeniler FOR SELECT
  TO public
  USING (true);

-- Kullanıcılar beğeni ekleyebilir
CREATE POLICY "Kullanıcılar beğeni ekleyebilir"
  ON yorum_begeniler FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = kullanici_id);

-- Kullanıcılar kendi beğenilerini kaldırabilir
CREATE POLICY "Kullanıcılar kendi beğenilerini kaldırabilir"
  ON yorum_begeniler FOR DELETE
  TO authenticated
  USING (auth.uid() = kullanici_id);