import React, { useState } from 'react';
import { useKategoriler } from '../../lib/hooks/useKategoriler';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

interface KategoriNavProps {
  secilenKategori: string;
  onKategoriChange: (kategoriId: string) => void;
}

export function KategoriNav({ secilenKategori, onKategoriChange }: KategoriNavProps) {
  const { kategoriler, yukleniyor } = useKategoriler();
  const [acikModal, setAcikModal] = useState<string | null>(null);

  if (yukleniyor) return null;

  const anaKategoriler = kategoriler.filter(k => !k.ust_kategori_id);
  const altKategoriler = kategoriler.filter(k => k.ust_kategori_id);

  const getAltKategoriler = (anaKategoriId: string) => {
    return altKategoriler.filter(k => k.ust_kategori_id === anaKategoriId);
  };

  return (
    <div className="mb-6 -mx-4 px-4 sticky top-16 bg-white z-10 shadow-sm">
      <div className="overflow-x-auto">
        <div className="flex space-x-2 py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              onKategoriChange('');
              setAcikModal(null);
            }}
            className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap ${
              secilenKategori === '' ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Tümü
          </motion.button>

          {anaKategoriler.map((kategori) => {
            const altKategoriler = getAltKategoriler(kategori.id);
            const aktif = secilenKategori === kategori.id || 
                         altKategoriler.some(alt => alt.id === secilenKategori);

            return (
              <div key={kategori.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (altKategoriler.length > 0) {
                      setAcikModal(acikModal === kategori.id ? null : kategori.id);
                    } else {
                      onKategoriChange(kategori.id);
                      setAcikModal(null);
                    }
                  }}
                  className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap flex items-center space-x-1 ${
                    aktif ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span>{kategori.ad}</span>
                  {altKategoriler.length > 0 && (
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      acikModal === kategori.id ? 'rotate-180' : ''
                    }`} />
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {acikModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={() => setAcikModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setAcikModal(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-xl font-bold mb-4">
                {anaKategoriler.find(k => k.id === acikModal)?.ad} Kategorileri
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {getAltKategoriler(acikModal).map((altKategori) => (
                  <button
                    key={altKategori.id}
                    onClick={() => {
                      onKategoriChange(altKategori.id);
                      setAcikModal(null);
                    }}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      secilenKategori === altKategori.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {altKategori.ad}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}