-- Sohbetler tablosu
CREATE TABLE IF NOT EXISTS sohbetler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  diger_kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  urun_id uuid REFERENCES urunler(id),
  guncelleme_zamani timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(kullanici_id, diger_kullanici_id, urun_id)
);

-- Mesajlar tablosuna sohbet_id ekle
ALTER TABLE mesajlar 
ADD COLUMN IF NOT EXISTS sohbet_id uuid REFERENCES sohbetler(id);

-- Sohbet güncelleme zamanı için trigger
CREATE OR REPLACE FUNCTION guncelle_sohbet_zamani()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sohbetler 
  SET guncelleme_zamani = now()
  WHERE id = NEW.sohbet_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mesaj_guncelleme_trigger
AFTER INSERT ON mesajlar
FOR EACH ROW
EXECUTE FUNCTION guncelle_sohbet_zamani();

-- RLS politikaları
ALTER TABLE sohbetler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi sohbetlerini görebilir"
  ON sohbetler FOR SELECT
  TO authenticated
  USING (
    auth.uid() = kullanici_id OR 
    auth.uid() = diger_kullanici_id
  );

CREATE POLICY "Kullanıcılar yeni sohbet başlatabilir"
  ON sohbetler FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = kullanici_id);

-- Mesajlar için güncellenmiş politikalar
CREATE POLICY "Kullanıcılar sohbetteki mesajları görebilir"
  ON mesajlar FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sohbetler
      WHERE id = mesajlar.sohbet_id
      AND (kullanici_id = auth.uid() OR diger_kullanici_id = auth.uid())
    )
  );

CREATE POLICY "Kullanıcılar sohbete mesaj gönderebilir"
  ON mesajlar FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sohbetler
      WHERE id = sohbet_id
      AND (kullanici_id = auth.uid() OR diger_kullanici_id = auth.uid())
    )
  );