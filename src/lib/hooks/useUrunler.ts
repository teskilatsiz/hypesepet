import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface UseUrunlerParams {
  aramaMetni?: string;
  kategoriId?: string;
}

export function useUrunler({ aramaMetni = '', kategoriId = '' }: UseUrunlerParams = {}) {
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    urunleriGetir();
  }, [aramaMetni, kategoriId]);

  async function urunleriGetir() {
    try {
      setYukleniyor(true);
      let query = supabase
        .from('urunler')
        .select(`
          *,
          satici:kullanici_profilleri(*),
          kategori:kategoriler(*)
        `)
        .eq('satildi', false)
        .order('created_at', { ascending: false });

      if (aramaMetni) {
        query = query.ilike('baslik', `%${aramaMetni}%`);
      }

      if (kategoriId) {
        query = query.eq('kategori_id', kategoriId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUrunler(data || []);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  return { urunler, yukleniyor };
}