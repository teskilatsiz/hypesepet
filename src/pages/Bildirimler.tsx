import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { MessageCircle, Package, Star, Bell, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../lib/services/notificationService';
import { YukleniyorSpinner } from '../components/ortak/YukleniyorSpinner';
import { BosIcerik } from '../components/ortak/BosIcerik';
import toast from 'react-hot-toast';

const bildirimIkonlari = {
  mesaj: MessageCircle,
  urun: Package,
  degerlendirme: Star,
  default: Bell
};

function Bildirimler() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bildirimler, setBildirimler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    bildirimleriGetir();
  }, [user]);

  async function bildirimleriGetir() {
    if (!user) return;
    
    try {
      setYukleniyor(true);
      const data = await getNotifications(user.id);
      setBildirimler(data);
    } catch (error) {
      toast.error('Bildirimler yüklenirken bir hata oluştu');
      console.error('Bildirimler yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  async function handleNotificationClick(bildirim) {
    try {
      await markNotificationAsRead(bildirim.id);
      setBildirimler(prev =>
        prev.map(b => b.id === bildirim.id ? { ...b, okundu: true } : b)
      );

      // Mesaj bildirimi ise mesajlar sayfasına yönlendir
      if (bildirim.tip === 'mesaj' && bildirim.veri?.sohbet_id) {
        navigate(`/mesajlar?sohbet=${bildirim.veri.sohbet_id}`);
      }
    } catch (error) {
      console.error('Bildirim okundu işaretlenirken hata:', error);
    }
  }

  async function tumBildirimleriOkunduYap() {
    if (!user) return;

    try {
      await markAllNotificationsAsRead(user.id);
      setBildirimler(prev => prev.map(b => ({ ...b, okundu: true })));
      toast.success('Tüm bildirimler okundu olarak işaretlendi');
    } catch (error) {
      toast.error('Bildirimler işaretlenirken bir hata oluştu');
      console.error('Bildirimler işaretlenirken hata:', error);
    }
  }

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center h-64">
        <YukleniyorSpinner boyut="buyuk" />
      </div>
    );
  }

  if (bildirimler.length === 0) {
    return (
      <BosIcerik
        baslik="Henüz bildiriminiz yok"
        mesaj="Yeni bildirimleriniz burada görünecek"
        ikon={<Bell className="h-16 w-16 text-gray-400" />}
      />
    );
  }

  const okunmamisBildirimSayisi = bildirimler.filter(b => !b.okundu).length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bildirimler</h1>
        {okunmamisBildirimSayisi > 0 && (
          <button
            onClick={tumBildirimleriOkunduYap}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Check className="h-5 w-5" />
            <span>Tümünü Okundu İşaretle</span>
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {bildirimler.map((bildirim) => {
          const Icon = bildirimIkonlari[bildirim.tip] || bildirimIkonlari.default;
          
          return (
            <motion.div
              key={bildirim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-colors
                ${!bildirim.okundu ? 'border-l-4 border-red-500' : ''}`}
              onClick={() => handleNotificationClick(bildirim)}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Icon className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{bildirim.baslik}</h3>
                  <p className="text-gray-600 text-sm">{bildirim.icerik}</p>
                  <span className="text-xs text-gray-500">
                    {format(new Date(bildirim.created_at), 'dd MMMM yyyy HH:mm', { locale: tr })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default Bildirimler;