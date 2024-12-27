import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface YorumGonderData {
  urunId: string;
  ustYorumId?: string;
  icerik: string;
  gorseller: File[];
}

export function useYorumFormu() {
  const { user } = useAuth();
  const [yukleniyor, setYukleniyor] = useState(false);

  async function yorumGonder({ urunId, ustYorumId, icerik, gorseller }: YorumGonderData) {
    if (!user) {
      toast.error('Yorum yapabilmek için giriş yapmalısınız');
      return;
    }

    setYukleniyor(true);

    try {
      const { data: yorum, error: yorumHata } = await supabase
        .from('yorumlar')
        .insert({
          urun_id: urunId,
          kullanici_id: user.id,
          ust_yorum_id: ustYorumId,
          icerik
        })
        .select()
        .single();

      if (yorumHata) throw yorumHata;

      if (gorseller.length > 0) {
        const gorselPromises = gorseller.map(async (gorsel) => {
          const dosyaAdi = `${Date.now()}-${gorsel.name}`;
          const { error: yukleHata } = await supabase.storage
            .from('yorum-gorselleri')
            .upload(dosyaAdi, gorsel);

          if (yukleHata) throw yukleHata;

          const { data: url } = supabase.storage
            .from('yorum-gorselleri')
            .getPublicUrl(dosyaAdi);

          return supabase
            .from('yorum_gorselleri')
            .insert({
              yorum_id: yorum.id,
              gorsel_url: url.publicUrl
            });
        });

        await Promise.all(gorselPromises);
      }

      toast.success(ustYorumId ? 'Yanıtınız eklendi' : 'Yorumunuz eklendi');
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error);
      toast.error('Yorum gönderilemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  return { yorumGonder, yukleniyor };
}