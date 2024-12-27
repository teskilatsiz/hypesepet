import React from 'react';
import { UrunKart } from './UrunKart';

interface UrunListesiProps {
  urunler: any[];
}

export function UrunListesi({ urunler }: UrunListesiProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {urunler.map((urun) => (
        <UrunKart key={urun.id} urun={urun} />
      ))}
    </div>
  );
}