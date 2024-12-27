import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export function useMesajDetay(sohbetId?: string) {
  const { user } = useAuth();
  const [mesajlar, setMesajlar] = useState([]);
  const [yeniMesaj, setYeniMesaj] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (!sohbetId || !user) return;
    
    mesajlariGetir();
    const subscription = mesajlariDinle();
    
    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [sohbetId, user]);

  async function mesajlariGetir() {
    if (!sohbetId || !user) return;

    try {
      const { data, error } = await supabase
        .from('mesajlar')
        .select('*')
        .eq('sohbet_id', sohbetId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMesajlar(data || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      toast.error('Mesajlar yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  function mesajlariDinle() {
    if (!sohbetId || !user) return null;

    return supabase
      .channel(`mesajlar:${sohbetId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'mesajlar',
        filter: `sohbet_id=eq.${sohbetId}`
      }, (payload) => {
        setMesajlar((prev) => [...prev, payload.new]);
      })
      .subscribe();
  }

  async function mesajGonder(e: React.FormEvent) {
    e.preventDefault();
    if (!sohbetId || !user || !yeniMesaj.trim()) return;

    try {
      const { data: sohbet, error: sohbetHata } = await supabase
        .from('sohbetler')
        .select('*')
        .eq('id', sohbetId)
        .single();

      if (sohbetHata) throw sohbetHata;

      const { error: mesajHata } = await supabase
        .from('mesajlar')
        .insert({
          sohbet_id: sohbetId,
          gonderen_id: user.id,
          alici_id: sohbet.kullanici_id === user.id ? sohbet.diger_kullanici_id : sohbet.kullanici_id,
          icerik: yeniMesaj.trim()
        });

      if (mesajHata) throw mesajHata;
      setYeniMesaj('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      toast.error('Mesaj gönderilemedi');
    }
  }

  return {
    mesajlar,
    yeniMesaj,
    setYeniMesaj,
    mesajGonder,
    yukleniyor
  };
}