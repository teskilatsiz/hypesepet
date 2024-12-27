import React from 'react';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMesajListesi } from '../../lib/hooks/useMesajListesi';
import { YukleniyorSpinner } from '../ortak/YukleniyorSpinner';
import { BosIcerik } from '../ortak/BosIcerik';

interface MesajListesiProps {
  seciliSohbet: any;
  onSohbetSec: (sohbet: any) => void;
}

export function MesajListesi({ seciliSohbet, onSohbetSec }: MesajListesiProps) {
  const { sohbetler, yukleniyor } = useMesajListesi();

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center h-64">
        <YukleniyorSpinner />
      </div>
    );
  }

  if (!sohbetler || sohbetler.length === 0) {
    return (
      <BosIcerik
        baslik="Henüz mesajınız yok"
        mesaj="Ürün sayfalarından satıcılarla iletişime geçebilirsiniz"
        ikon={<Package className="h-16 w-16 text-gray-400" />}
      />
    );
  }

  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Mesajlar</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-16rem)] md:h-[600px]">
        {sohbetler.map((sohbet) => (
          <motion.div
            key={sohbet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onSohbetSec(sohbet)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              seciliSohbet?.id === sohbet.id ? 'bg-red-50' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={sohbet.diger_kullanici?.avatar_url || 'https://via.placeholder.com/40'}
                alt={sohbet.diger_kullanici?.ad}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <h3 className="font-semibold">
                  {sohbet.diger_kullanici?.ad} {sohbet.diger_kullanici?.soyad}
                </h3>
                {sohbet.urun && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{sohbet.urun.baslik}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}