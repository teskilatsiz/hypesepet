import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useUrunDetay(urunId?: string) {
  const [urun, setUrun] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (urunId) {
      urunGetir();
    }
  }, [urunId]);

  async function urunGetir() {
    try {
      const { data, error } = await supabase
        .from('urunler')
        .select(`
          *,
          satici:kullanici_profilleri(*),
          kategori:kategoriler(*)
        `)
        .eq('id', urunId)
        .single();

      if (error) throw error;
      setUrun(data);
    } catch (error) {
      console.error('Ürün yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  return { urun, yukleniyor };
}