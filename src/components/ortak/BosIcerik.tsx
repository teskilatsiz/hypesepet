import React from 'react';

interface BosIcerikProps {
  baslik: string;
  mesaj: string;
  ikon?: React.ReactNode;
}

export function BosIcerik({ baslik, mesaj, ikon }: BosIcerikProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {ikon}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{baslik}</h3>
      <p className="text-sm text-gray-500">{mesaj}</p>
    </div>
  );
}

export default BosIcerik;