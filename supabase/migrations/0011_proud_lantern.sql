/*
  # Messaging and Notifications Update

  1. Changes
    - Add message thread support
    - Add notification triggers
    - Add product expiration
    - Add product edit history

  2. New Tables
    - product_edit_history
    - notification_preferences

  3. Updates
    - Add expiration_date to products
    - Add notification triggers
*/

-- Ürün süresi için kolon ekle
ALTER TABLE urunler
ADD COLUMN IF NOT EXISTS yayinlanma_suresi_bitis timestamptz;

-- Ürün düzenleme geçmişi
CREATE TABLE IF NOT EXISTS urun_duzenlemeleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  urun_id uuid REFERENCES urunler(id) NOT NULL,
  duzenleyen_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  degisiklikler jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Bildirim tercihleri
CREATE TABLE IF NOT EXISTS bildirim_tercihleri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  favori_bildirim boolean DEFAULT true,
  mesaj_bildirim boolean DEFAULT true,
  yorum_bildirim boolean DEFAULT true,
  urun_bildirim boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(kullanici_id)
);

-- Ürün yayınlanma süresi trigger fonksiyonu
CREATE OR REPLACE FUNCTION set_urun_yayinlanma_suresi()
RETURNS TRIGGER AS $$
BEGIN
  NEW.yayinlanma_suresi_bitis := NEW.created_at + INTERVAL '3 months';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER urun_yayinlanma_suresi_trigger
BEFORE INSERT ON urunler
FOR EACH ROW
EXECUTE FUNCTION set_urun_yayinlanma_suresi();

-- Ürün süresi dolunca bildirim gönderme fonksiyonu
CREATE OR REPLACE FUNCTION check_expired_products()
RETURNS void AS $$
DECLARE
  expired_product RECORD;
BEGIN
  FOR expired_product IN
    SELECT u.id, u.baslik, u.satici_id
    FROM urunler u
    WHERE u.yayinlanma_suresi_bitis <= NOW()
    AND u.satildi = false
  LOOP
    -- Ürünü pasife çek
    UPDATE urunler
    SET satildi = true
    WHERE id = expired_product.id;

    -- Bildirim gönder
    INSERT INTO bildirimler (
      kullanici_id,
      tip,
      baslik,
      icerik,
      veri
    ) VALUES (
      expired_product.satici_id,
      'urun',
      'Ürününüz Yayından Kaldırıldı',
      expired_product.baslik || ' başlıklı ürününüzün yayın süresi doldu.',
      jsonb_build_object(
        'urun_id', expired_product.id,
        'urun_baslik', expired_product.baslik
      )
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Her gün kontrol etmek için cron job ekle
SELECT cron.schedule(
  'check-expired-products',
  '0 0 * * *', -- Her gün gece yarısı
  'SELECT check_expired_products()'
);

-- Mesaj gönderildiğinde bildirim trigger'ı
CREATE OR REPLACE FUNCTION mesaj_bildirim_gonder()
RETURNS TRIGGER AS $$
BEGIN
  -- Alıcıya bildirim gönder
  INSERT INTO bildirimler (
    kullanici_id,
    tip,
    baslik,
    icerik,
    veri
  ) VALUES (
    NEW.alici_id,
    'mesaj',
    'Yeni Mesajınız Var',
    substring(NEW.icerik from 1 for 50) || '...',
    jsonb_build_object(
      'mesaj_id', NEW.id,
      'gonderen_id', NEW.gonderen_id,
      'urun_id', NEW.urun_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER yeni_mesaj_bildirim_trigger
AFTER INSERT ON mesajlar
FOR EACH ROW
EXECUTE FUNCTION mesaj_bildirim_gonder();

-- Favori eklendiğinde bildirim trigger'ı
CREATE OR REPLACE FUNCTION favori_bildirim_gonder()
RETURNS TRIGGER AS $$
DECLARE
  urun_data RECORD;
BEGIN
  SELECT u.baslik, u.satici_id
  INTO urun_data
  FROM urunler u
  WHERE u.id = NEW.urun_id;

  -- Ürün sahibine bildirim gönder
  INSERT INTO bildirimler (
    kullanici_id,
    tip,
    baslik,
    icerik,
    veri
  ) VALUES (
    urun_data.satici_id,
    'favori',
    'Ürününüz Favorilere Eklendi',
    urun_data.baslik || ' başlıklı ürününüz favorilere eklendi.',
    jsonb_build_object(
      'urun_id', NEW.urun_id,
      'kullanici_id', NEW.kullanici_id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER yeni_favori_bildirim_trigger
AFTER INSERT ON favori_urunler
FOR EACH ROW
EXECUTE FUNCTION favori_bildirim_gonder();

-- RLS Politikaları
ALTER TABLE urun_duzenlemeleri ENABLE ROW LEVEL SECURITY;
ALTER TABLE bildirim_tercihleri ENABLE ROW LEVEL SECURITY;

-- Ürün düzenleme geçmişi politikaları
CREATE POLICY "Ürün sahipleri düzenleme geçmişini görebilir"
  ON urun_duzenlemeleri FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM urunler
      WHERE id = urun_id
      AND satici_id = auth.uid()
    )
  );

-- Bildirim tercihleri politikaları
CREATE POLICY "Kullanıcılar kendi bildirim tercihlerini yönetebilir"
  ON bildirim_tercihleri FOR ALL
  TO authenticated
  USING (kullanici_id = auth.uid())
  WITH CHECK (kullanici_id = auth.uid());