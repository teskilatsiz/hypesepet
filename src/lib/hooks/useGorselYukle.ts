import { useState } from 'react';
import { supabase } from '../supabase';

export function useGorselYukle() {
  const [yukleniyor, setYukleniyor] = useState(false);

  async function gorselYukle(dosya) {
    setYukleniyor(true);
    try {
      const dosyaAdi = `${Date.now()}-${dosya.name}`;
      const { error: yukleError } = await supabase.storage
        .from('urun-gorselleri')
        .upload(dosyaAdi, dosya);

      if (yukleError) throw yukleError;

      const { data: url } = supabase.storage
        .from('urun-gorselleri')
        .getPublicUrl(dosyaAdi);

      return url.publicUrl;
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error);
      throw error;
    } finally {
      setYukleniyor(false);
    }
  }

  return { gorselYukle, yukleniyor };
}