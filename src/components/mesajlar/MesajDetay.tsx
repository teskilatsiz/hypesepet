import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Send, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMesajDetay } from '../../lib/hooks/useMesajDetay';

export function MesajDetay({ sohbet }) {
  const mesajlarRef = useRef(null);
  const { 
    mesajlar, 
    yeniMesaj, 
    setYeniMesaj, 
    mesajGonder,
    yukleniyor 
  } = useMesajDetay(sohbet?.id);

  useEffect(() => {
    if (mesajlarRef.current) {
      mesajlarRef.current.scrollTop = mesajlarRef.current.scrollHeight;
    }
  }, [mesajlar]);

  if (!sohbet) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={sohbet.diger_kullanici?.avatar_url || 'https://via.placeholder.com/40'}
            alt={sohbet.diger_kullanici?.ad}
            className="w-10 h-10 rounded-full"
          />
          <div>
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
      </div>

      <div 
        ref={mesajlarRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {yukleniyor ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          mesajlar.map((mesaj) => (
            <motion.div
              key={mesaj.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${mesaj.gonderen_id === sohbet.diger_kullanici?.id ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  mesaj.gonderen_id === sohbet.diger_kullanici?.id
                    ? 'bg-gray-100'
                    : 'bg-red-500 text-white'
                }`}
              >
                <p>{mesaj.icerik}</p>
                <div className={`text-xs mt-1 ${
                  mesaj.gonderen_id === sohbet.diger_kullanici?.id
                    ? 'text-gray-500'
                    : 'text-red-100'
                }`}>
                  {format(new Date(mesaj.created_at), 'HH:mm', { locale: tr })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={mesajGonder} className="flex space-x-2">
          <input
            type="text"
            value={yeniMesaj}
            onChange={(e) => setYeniMesaj(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}