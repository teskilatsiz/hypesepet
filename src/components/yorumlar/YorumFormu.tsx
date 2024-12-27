import React, { useState } from 'react';
import { Image as ImageIcon, Send } from 'lucide-react';
import { useYorumFormu } from '../../lib/hooks/useYorumFormu';
import { Buton } from '../ortak/Buton';
import { useAuth } from '../../lib/hooks/useAuth';

interface YorumFormuProps {
  urunId: string;
  ustYorumId?: string;
  onBasari?: () => void;
}

export function YorumFormu({ urunId, ustYorumId, onBasari }: YorumFormuProps) {
  const { user } = useAuth();
  const [icerik, setIcerik] = useState('');
  const [gorseller, setGorseller] = useState<File[]>([]);
  const [onizlemeUrller, setOnizlemeUrller] = useState<string[]>([]);
  const { yorumGonder, yukleniyor } = useYorumFormu();

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-gray-600">Yorum yapabilmek için giriş yapmalısınız</p>
      </div>
    );
  }

  const handleGorselSecimi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dosyalar = Array.from(e.target.files || []);
    setGorseller(dosyalar);
    
    // Önizleme URL'lerini oluştur
    const yeniUrller = dosyalar.map(dosya => URL.createObjectURL(dosya));
    setOnizlemeUrller(yeniUrller);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!icerik.trim()) return;

    await yorumGonder({
      urunId,
      ustYorumId,
      icerik: icerik.trim(),
      gorseller
    });

    setIcerik('');
    setGorseller([]);
    setOnizlemeUrller([]);
    onBasari?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-4">
      <textarea
        value={icerik}
        onChange={(e) => setIcerik(e.target.value)}
        placeholder="Yorumunuzu yazın..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        rows={3}
      />
      
      {onizlemeUrller.length > 0 && (
        <div className="flex gap-2 mt-3">
          {onizlemeUrller.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Önizleme ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleGorselSecimi}
            />
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <ImageIcon className="h-5 w-5" />
              <span>Görsel Ekle</span>
            </div>
          </label>
          {gorseller.length > 0 && (
            <span className="text-sm text-gray-500">
              {gorseller.length} görsel seçildi
            </span>
          )}
        </div>
        
        <Buton
          type="submit"
          disabled={yukleniyor || !icerik.trim()}
          yukleniyor={yukleniyor}
          ikon={<Send className="h-4 w-4" />}
        >
          Gönder
        </Buton>
      </div>
    </form>
  );
}