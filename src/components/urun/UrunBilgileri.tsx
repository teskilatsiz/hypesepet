import React from 'react';
import { formatCurrency } from '../../lib/utils/formatters';

interface UrunBilgileriProps {
  urun: {
    baslik: string;
    fiyat: number;
    konum: { il: string };
    durum: string;
  };
}

export function UrunBilgileri({ urun }: UrunBilgileriProps) {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{urun.baslik}</h3>
      <p className="text-red-500 font-bold">{formatCurrency(urun.fiyat)}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-500">{urun.konum.il}</span>
        <span className="text-sm text-gray-500">{urun.durum}</span>
      </div>
    </div>
  );
}