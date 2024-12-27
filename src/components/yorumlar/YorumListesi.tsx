import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Yorum } from './Yorum';
import { useYorumlar } from '../../lib/hooks/useYorumlar';
import { YukleniyorSpinner } from '../ortak/YukleniyorSpinner';
import { BosIcerik } from '../ortak/BosIcerik';

interface YorumListesiProps {
  urunId: string;
}

export function YorumListesi({ urunId }: YorumListesiProps) {
  const { yorumlar, yukleniyor } = useYorumlar(urunId);

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center h-32">
        <YukleniyorSpinner />
      </div>
    );
  }

  if (yorumlar.length === 0) {
    return (
      <BosIcerik
        baslik="Henüz yorum yapılmamış"
        mesaj="Bu ürün için ilk yorumu siz yapın"
        ikon={<MessageCircle className="h-16 w-16 text-gray-400 mb-4" />}
      />
    );
  }

  const anaYorumlar = yorumlar.filter(yorum => !yorum.ust_yorum_id);

  return (
    <div className="space-y-6">
      {anaYorumlar.map(yorum => (
        <Yorum 
          key={yorum.id}
          yorum={yorum}
          yanitlar={yorumlar.filter(y => y.ust_yorum_id === yorum.id)}
        />
      ))}
    </div>
  );
}

export default YorumListesi;