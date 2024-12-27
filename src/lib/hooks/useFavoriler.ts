import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useFavoriler(urunId: string) {
  const { user } = useAuth();
  const [favorideMi, setFavorideMi] = useState(false);
  const [favoriSayisi, setFavoriSayisi] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (urunId) {
      favoriDurumunuKontrolEt();
      favoriSayisiniGetir();
    }
  }, [urunId, user]);

  async function favoriDurumunuKontrolEt() {
    if (!user) {
      setYukleniyor(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('favori_urunler')
        .select('id')
        .eq('urun_id', urunId)
        .eq('kullanici_id', user.id)
        .single();

      setFavorideMi(!!data);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  async function favoriSayisiniGetir() {
    try {
      const { count } = await supabase
        .from('favori_urunler')
        .select('id', { count: 'exact' })
        .eq('urun_id', urunId);

      setFavoriSayisi(count || 0);
    } catch (error) {
      console.error('Favori sayısı alınırken hata:', error);
    }
  }

  async function favoriyeEkle() {
    if (!user) {
      toast.error('Favoriye eklemek için giriş yapmalısınız');
      return;
    }

    try {
      if (favorideMi) {
        await supabase
          .from('favori_urunler')
          .delete()
          .eq('urun_id', urunId)
          .eq('kullanici_id', user.id);

        setFavoriSayisi(prev => prev - 1);
        toast.success('Favorilerden kaldırıldı');
      } else {
        await supabase
          .from('favori_urunler')
          .insert({
            urun_id: urunId,
            kullanici_id: user.id
          });

        setFavoriSayisi(prev => prev + 1);
        toast.success('Favorilere eklendi');
      }
      setFavorideMi(!favorideMi);
    } catch (error) {
      console.error('Favori işlemi sırasında hata:', error);
      toast.error('Bir hata oluştu');
    }
  }

  return {
    favorideMi,
    favoriSayisi,
    yukleniyor,
    favoriyeEkle
  };
}