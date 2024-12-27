import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { fetchWithRetry } from '../utils/fetchWithRetry';
import { showToast } from '../utils/toast';

export function useKategoriler() {
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState<Error | null>(null);

  useEffect(() => {
    kategorileriGetir();
  }, []);

  async function kategorileriGetir() {
    try {
      const data = await fetchWithRetry(async () => {
        const { data, error } = await supabase
          .from('kategoriler')
          .select('*')
          .order('ad', { ascending: true });

        if (error) throw error;
        return data;
      });

      setKategoriler(data || []);
      setHata(null);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      setHata(error as Error);
      showToast.error('Kategoriler yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setYukleniyor(false);
    }
  }

  return { 
    kategoriler, 
    yukleniyor, 
    hata,
    yenile: kategorileriGetir 
  };
}