import React from 'react';
import { MapPin, Package, User, Calendar, MessageCircle, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils/formatters';
import { UrunPaylas } from './UrunPaylas';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useAuth } from '../../lib/hooks/useAuth';
import toast from 'react-hot-toast';

interface UrunBilgileriDetayProps {
  urun: any;
}

export function UrunBilgileriDetay({ urun }: UrunBilgileriDetayProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMesajGonder = () => {
    if (!user) {
      toast.error('Mesaj göndermek için giriş yapmalısınız');
      navigate('/giris');
      return;
    }
    navigate('/mesajlar');
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-4">{urun.baslik}</h1>
        <UrunPaylas urunId={urun.id} baslik={urun.baslik} />
      </div>

      <p className="text-3xl font-bold text-red-500 mb-6">
        {formatCurrency(urun.fiyat)}
      </p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleMesajGonder}
          className="flex-1 bg-[#ff4747] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#ff3333] transition-colors"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Mesaj Gönder</span>
        </button>
        
        {urun.satici?.telefon && (
          <a
            href={`tel:${urun.satici.telefon}`}
            className="flex-1 bg-[#ff4747] text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#ff3333] transition-colors"
          >
            <Phone className="h-5 w-5" />
            <span>Ara</span>
          </a>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{urun.konum.il}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Package className="h-5 w-5 mr-2" />
          <span>{urun.durum}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          <span>
            {format(new Date(urun.created_at), 'd MMMM yyyy', { locale: tr })}
          </span>
        </div>

        <Link
          to={`/profil/${urun.satici.id}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <User className="h-5 w-5 mr-2" />
          <span>
            {urun.satici.ad} {urun.satici.soyad}
          </span>
        </Link>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Açıklama</h2>
        <p className="text-gray-600 whitespace-pre-line">{urun.aciklama}</p>
      </div>
    </div>
  );
}