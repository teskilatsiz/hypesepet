import React from 'react';
import { X } from 'lucide-react';

interface GorselOnizlemeProps {
  gorselUrl: string;
  onClose: () => void;
}

export function GorselOnizleme({ gorselUrl, onClose }: GorselOnizlemeProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={gorselUrl}
          alt="Görsel önizleme"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
}