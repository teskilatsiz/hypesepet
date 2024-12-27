import { useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface YorumBegenme {
  yorumId: string;
  begenildi: boolean;
}

export function useYorum() {
  const { user } = useAuth();
  const [yukleniyor, setYukleniyor] = useState(false);

  async function yorumBegen({ yorumId, begenildi }: YorumBegenme) {
    if (!user) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    setYukleniyor(true);
    try {
      if (begenildi) {
        await supabase
          .from('yorum_begeniler')
          .delete()
          .eq('yorum_id', yorumId)
          .eq('kullanici_id', user.id);
      } else {
        await supabase
          .from('yorum_begeniler')
          .insert({
            yorum_id: yorumId,
            kullanici_id: user.id
          });
      }
    } catch (error) {
      console.error('Yorum beğenme işlemi sırasında hata:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setYukleniyor(false);
    }
  }

  return {
    yorumBegen,
    yukleniyor
  };
}