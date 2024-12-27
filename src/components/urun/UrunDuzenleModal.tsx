import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UrunFormu } from './UrunFormu';
import { useUrunDuzenle } from '../../lib/hooks/useUrunDuzenle';

interface UrunDuzenleModalProps {
  urun: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function UrunDuzenleModal({ urun, onClose, onSuccess }: UrunDuzenleModalProps) {
  const { urunGuncelle, yukleniyor } = useUrunDuzenle(urun.id);
  const [guncelleniyor, setGuncelleniyor] = useState(false);

  async function formGonder(yeniVeriler) {
    setGuncelleniyor(true);
    try {
      const basarili = await urunGuncelle(yeniVeriler);
      if (basarili) {
        onSuccess();
        onClose();
      }
    } finally {
      setGuncelleniyor(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50"></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-4xl">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold">Ürünü Düzenle</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            <UrunFormu
              baslangicDegerler={urun}
              onSubmit={formGonder}
              yukleniyor={guncelleniyor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}