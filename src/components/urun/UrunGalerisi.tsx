import React, { useState } from 'react';
import { GorselOnizleme } from '../GorselOnizleme';

interface UrunGalerisiProps {
  gorseller: string[];
  baslik: string;
}

export function UrunGalerisi({ gorseller, baslik }: UrunGalerisiProps) {
  const [seciliGorsel, setSeciliGorsel] = useState(0);
  const [onizlemeGorsel, setOnizlemeGorsel] = useState<string | null>(null);

  return (
    <div>
      <div 
        className="aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer" 
        onClick={() => setOnizlemeGorsel(gorseller[seciliGorsel])}
      >
        <img
          src={gorseller[seciliGorsel]}
          alt={baslik}
          className="w-full h-full object-cover"
        />
      </div>

      {gorseller.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {gorseller.map((gorsel, index) => (
            <button
              key={index}
              onClick={() => setSeciliGorsel(index)}
              className={`aspect-square rounded-lg overflow-hidden border-2 ${
                index === seciliGorsel ? 'border-red-500' : 'border-transparent'
              }`}
            >
              <img
                src={gorsel}
                alt={`${baslik} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {onizlemeGorsel && (
        <GorselOnizleme
          gorselUrl={onizlemeGorsel}
          onClose={() => setOnizlemeGorsel(null)}
        />
      )}
    </div>
  );
}