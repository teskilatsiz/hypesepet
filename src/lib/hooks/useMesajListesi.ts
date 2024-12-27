import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useMesajListesi() {
  const { user } = useAuth();
  const [sohbetler, setSohbetler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (!user) {
      setYukleniyor(false);
      return;
    }
    sohbetleriGetir();
  }, [user]);

  async function sohbetleriGetir() {
    try {
      const { data, error } = await supabase
        .from('sohbetler')
        .select(`
          *,
          diger_kullanici:kullanici_profilleri!sohbetler_diger_kullanici_id_fkey(*),
          urun:urunler(*),
          son_mesaj:mesajlar(*)
        `)
        .or(`kullanici_id.eq.${user?.id},diger_kullanici_id.eq.${user?.id}`)
        .order('guncelleme_zamani', { ascending: false });

      if (error) throw error;

      setSohbetler(data || []);
    } catch (error) {
      console.error('Sohbetler yüklenirken hata:', error);
      toast.error('Sohbetler yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  return { sohbetler, yukleniyor };
}