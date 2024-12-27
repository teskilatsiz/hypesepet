import React from 'react';

interface UrunGorselProps {
  gorselUrl: string;
  baslik: string;
}

export function UrunGorsel({ gorselUrl, baslik }: UrunGorselProps) {
  return (
    <div className="aspect-square">
      <img
        src={gorselUrl}
        alt={baslik}
        className="w-full h-full object-cover"
      />
    </div>
  );
}