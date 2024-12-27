import React from 'react';
import { MesajListesi } from '../components/mesajlar/MesajListesi';
import { MesajDetay } from '../components/mesajlar/MesajDetay';
import { useMesajlar } from '../lib/hooks/useMesajlar';

function Mesajlar() {
  const { seciliSohbet, seciliSohbetiGuncelle } = useMesajlar();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-12 min-h-[600px]">
          <div className="col-span-4 border-r">
            <MesajListesi
              seciliSohbet={seciliSohbet}
              onSohbetSec={seciliSohbetiGuncelle}
            />
          </div>
          <div className="col-span-8">
            {seciliSohbet ? (
              <MesajDetay sohbet={seciliSohbet} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Mesajlaşmak için bir sohbet seçin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mesajlar;