import React from 'react';
import { Search } from 'lucide-react';

interface AramaFiltreProps {
  aramaMetni: string;
  onAramaChange: (value: string) => void;
}

export function AramaFiltre({ aramaMetni, onAramaChange }: AramaFiltreProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={aramaMetni}
          onChange={(e) => onAramaChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
    </div>
  );
}