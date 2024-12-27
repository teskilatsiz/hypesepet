import { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useUrunDuzenle(urunId: string) {
  const { user } = useAuth();
  const [yukleniyor, setYukleniyor] = useState(false);

  async function urunGuncelle(yeniVeriler: any) {
    if (!user) {
      toast.error('Bu işlem için giriş yapmalısınız');
      return;
    }

    setYukleniyor(true);
    try {
      // Eski verileri al
      const { data: eskiUrun } = await supabase
        .from('urunler')
        .select('*')
        .eq('id', urunId)
        .single();

      // Değişiklikleri kaydet
      const { error: guncelleHata } = await supabase
        .from('urunler')
        .update(yeniVeriler)
        .eq('id', urunId);

      if (guncelleHata) throw guncelleHata;

      // Değişiklik geçmişini kaydet
      const { error: gecmisHata } = await supabase
        .from('urun_duzenlemeleri')
        .insert({
          urun_id: urunId,
          duzenleyen_id: user.id,
          degisiklikler: {
            eski: eskiUrun,
            yeni: yeniVeriler
          }
        });

      if (gecmisHata) throw gecmisHata;

      toast.success('Ürün başarıyla güncellendi');
      return true;
    } catch (error) {
      console.error('Ürün güncellenirken hata:', error);
      toast.error('Ürün güncellenemedi');
      return false;
    } finally {
      setYukleniyor(false);
    }
  }

  return { urunGuncelle, yukleniyor };
}