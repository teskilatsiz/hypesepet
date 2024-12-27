import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useAuth } from './useAuth';
import { showToast } from '../utils/toast';

export function useBildirimler() {
  const { user } = useAuth();
  const [bildirimler, setBildirimler] = useState([]);
  const [okunmamisBildirimSayisi, setOkunmamisBildirimSayisi] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    if (user) {
      bildirimleriGetir();
      bildirimleriDinle();
    }
  }, [user]);

  async function bildirimleriGetir() {
    try {
      const { data, error } = await supabase
        .from('bildirimler')
        .select('*')
        .eq('kullanici_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBildirimler(data);
      setOkunmamisBildirimSayisi(data.filter(b => !b.okundu).length);
    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      showToast.error('Bildirimler yüklenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  function bildirimleriDinle() {
    const subscription = supabase
      .channel('bildirimler')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bildirimler',
        filter: `kullanici_id=eq.${user.id}`
      }, (payload) => {
        setBildirimler(prev => [payload.new, ...prev]);
        setOkunmamisBildirimSayisi(prev => prev + 1);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  async function bildirimOku(bildirimId: string) {
    try {
      const { error } = await supabase
        .from('bildirimler')
        .update({ okundu: true })
        .eq('id', bildirimId);

      if (error) throw error;
      
      setBildirimler(prev => 
        prev.map(b => b.id === bildirimId ? { ...b, okundu: true } : b)
      );
      setOkunmamisBildirimSayisi(prev => prev - 1);
      showToast.success('Bildirim okundu olarak işaretlendi');
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error);
      showToast.error('Bildirim işaretlenemedi');
    }
  }

  return {
    bildirimler,
    okunmamisBildirimSayisi,
    yukleniyor,
    bildirimOku
  };
}