import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useYorumlar(urunId: string) {
  const [yorumlar, setYorumlar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    yorumlariGetir();
  }, [urunId]);

  async function yorumlariGetir() {
    try {
      const { data, error } = await supabase
        .from('yorumlar')
        .select(`
          *,
          kullanici:kullanici_profilleri(*),
          gorseller:yorum_gorselleri(*)
        `)
        .eq('urun_id', urunId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setYorumlar(data || []);
    } catch (error) {
      console.error('Yorumlar yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  return { yorumlar, yukleniyor, yorumlariYenile: yorumlariGetir };
}