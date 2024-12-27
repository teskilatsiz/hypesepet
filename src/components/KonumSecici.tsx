import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { iller } from '../lib/data/iller';

export function KonumSecici({ konum, onChange }) {
  const [acik, setAcik] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-left"
      >
        {konum ? `${konum.il}` : 'Konum seçin'}
      </button>
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      
      {acik && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {iller.map((il) => (
            <button
              key={il}
              type="button"
              onClick={() => {
                onChange({ il });
                setAcik(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {il}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}