/*
  # Add notifications table and policies

  1. New Tables
    - `bildirimler`
      - `id` (uuid, primary key)
      - `kullanici_id` (uuid, foreign key to kullanici_profilleri)
      - `tip` (text) - bildirim tipi (yorum, mesaj, teklif vb.)
      - `baslik` (text)
      - `icerik` (text)
      - `veri` (jsonb) - bildirimle ilgili ek veriler
      - `okundu` (boolean)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS bildirimler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kullanici_id uuid REFERENCES kullanici_profilleri(id) NOT NULL,
  tip text NOT NULL,
  baslik text NOT NULL,
  icerik text NOT NULL,
  veri jsonb DEFAULT '{}',
  okundu boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bildirimler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcılar kendi bildirimlerini görebilir"
  ON bildirimler FOR SELECT
  TO authenticated
  USING (auth.uid() = kullanici_id);

CREATE POLICY "Sistem bildirimleri ekleyebilir"
  ON bildirimler FOR INSERT
  TO authenticated
  WITH CHECK (true);