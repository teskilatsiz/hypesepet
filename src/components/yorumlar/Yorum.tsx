import React, { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Reply, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { YorumFormu } from './YorumFormu';
import { useAuth } from '../../lib/hooks/useAuth';
import { GorselOnizleme } from '../GorselOnizleme';

interface YorumProps {
  yorum: any;
  yanitlar: any[];
  seviye?: number;
}

export function Yorum({ yorum, yanitlar, seviye = 0 }: YorumProps) {
  const { user } = useAuth();
  const [yanitFormuGoster, setYanitFormuGoster] = useState(false);
  const [seciliOnizlemeGorsel, setSeciliOnizlemeGorsel] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${seviye > 0 ? 'ml-8 border-l-2 pl-4' : ''}`}
    >
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start space-x-3">
          <img
            src={yorum.kullanici.avatar_url || 'https://via.placeholder.com/40'}
            alt={yorum.kullanici.ad}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                {yorum.kullanici.ad} {yorum.kullanici.soyad}
              </h3>
              <span className="text-sm text-gray-500">
                {format(new Date(yorum.created_at), 'dd MMMM yyyy', { locale: tr })}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{yorum.icerik}</p>
            
            {yorum.gorseller && yorum.gorseller.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {yorum.gorseller.map((gorsel: any) => (
                  <img
                    key={gorsel.id}
                    src={gorsel.gorsel_url}
                    alt="Yorum görseli"
                    className="w-full h-24 object-cover rounded-lg cursor-pointer"
                    onClick={() => setSeciliOnizlemeGorsel(gorsel.gorsel_url)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4 text-sm">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                <ThumbsUp className="h-4 w-4" />
                <span>Beğen</span>
              </button>
              {user && (
                <button 
                  onClick={() => setYanitFormuGoster(!yanitFormuGoster)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                >
                  <Reply className="h-4 w-4" />
                  <span>Yanıtla</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {yanitFormuGoster && (
        <div className="mt-4 ml-8">
          <YorumFormu 
            urunId={yorum.urun_id}
            ustYorumId={yorum.id}
            onBasari={() => setYanitFormuGoster(false)}
          />
        </div>
      )}

      {yanitlar?.length > 0 && (
        <div className="mt-4 space-y-4">
          {yanitlar.map(yanit => (
            <Yorum
              key={yanit.id}
              yorum={yanit}
              yanitlar={[]}
              seviye={seviye + 1}
            />
          ))}
        </div>
      )}

      {seciliOnizlemeGorsel && (
        <GorselOnizleme
          gorselUrl={seciliOnizlemeGorsel}
          onClose={() => setSeciliOnizlemeGorsel(null)}
        />
      )}
    </motion.div>
  );
}