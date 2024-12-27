import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface ProfilUrunlerProps {
  urunler: any[];
}

export function ProfilUrunler({ urunler }: ProfilUrunlerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {urunler.map((urun) => (
        <Link
          key={urun.id}
          to={`/urun/${urun.id}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={urun.gorsel_urls[0]}
              alt={urun.baslik}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{urun.baslik}</h3>
              <p className="text-red-500 font-bold mt-1">{urun.fiyat} TL</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}