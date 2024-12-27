/*
  # Add comment replies functionality
  
  1. Changes
    - Add `parent_id` column to `yorumlar` table for nested replies
    - Add index on parent_id for faster queries
    - Update RLS policies for comment replies
*/

-- Add parent_id column for nested replies
ALTER TABLE yorumlar 
ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES yorumlar(id);

-- Add index for faster comment thread queries
CREATE INDEX IF NOT EXISTS yorumlar_parent_id_idx ON yorumlar(parent_id);

-- Update RLS policy for viewing comment replies
CREATE POLICY "Herkes yorum yanıtlarını görebilir" ON yorumlar
  FOR SELECT TO public USING (true);

-- Policy for adding replies
CREATE POLICY "Kullanıcılar yorumlara yanıt verebilir" ON yorumlar
  FOR INSERT TO authenticated 
  WITH CHECK (true);