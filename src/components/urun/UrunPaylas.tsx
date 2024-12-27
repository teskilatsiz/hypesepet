import React, { useState } from 'react';
import { Share2, Copy, Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UrunPaylasProps {
  urunId: string;
  baslik: string;
}

export function UrunPaylas({ urunId, baslik }: UrunPaylasProps) {
  const [paylasMenuAcik, setPaylasMenuAcik] = useState(false);
  const url = `${window.location.origin}/urun/${urunId}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedBaslik = encodeURIComponent(baslik);

  const paylasBaglantilari = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedBaslik}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedBaslik}%20${encodedUrl}`,
  };

  function baglantiKopyala() {
    navigator.clipboard.writeText(url);
    toast.success('Bağlantı kopyalandı');
    setPaylasMenuAcik(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setPaylasMenuAcik(!paylasMenuAcik)}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <Share2 className="h-6 w-6" />
      </button>

      {paylasMenuAcik && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="py-2">
            <a
              href={paylasBaglantilari.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <Twitter className="h-5 w-5 mr-3 text-blue-400" />
              <span>Twitter</span>
            </a>
            
            <a
              href={paylasBaglantilari.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <Facebook className="h-5 w-5 mr-3 text-blue-600" />
              <span>Facebook</span>
            </a>
            
            <a
              href={paylasBaglantilari.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <MessageCircle className="h-5 w-5 mr-3 text-green-500" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={baglantiKopyala}
              className="w-full flex items-center px-4 py-2 hover:bg-gray-100"
            >
              <Copy className="h-5 w-5 mr-3 text-gray-500" />
              <span>Bağlantıyı Kopyala</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}