import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../lib/utils/formatters';
import { UrunBilgileri } from './UrunBilgileri';
import { UrunGorsel } from './UrunGorsel';

interface UrunKartProps {
  urun: {
    id: string;
    baslik: string;
    fiyat: number;
    gorsel_urls: string[];
    konum: { il: string };
    durum: string;
  };
}

export function UrunKart({ urun }: UrunKartProps) {
  return (
    <Link
      to={`/urun/${urun.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <UrunGorsel gorselUrl={urun.gorsel_urls[0]} baslik={urun.baslik} />
      <UrunBilgileri urun={urun} />
    </Link>
  );
}