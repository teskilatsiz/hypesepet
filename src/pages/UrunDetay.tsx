import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UrunGalerisi } from '../components/urun/UrunGalerisi';
import { UrunBilgileriDetay } from '../components/urun/UrunBilgileriDetay';
import { YorumListesi } from '../components/yorumlar/YorumListesi';
import { YorumFormu } from '../components/yorumlar/YorumFormu';
import { YukleniyorSpinner } from '../components/ortak/YukleniyorSpinner';
import { useUrunDetay } from '../lib/hooks/useUrunDetay';

function UrunDetay() {
  const { id } = useParams();
  const { urun, yukleniyor } = useUrunDetay(id);

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center h-64">
        <YukleniyorSpinner />
      </div>
    );
  }

  if (!urun) return null;

  return (
    <div className="max-w-[1200px] mx-auto bg-white p-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sol: Görsel Galerisi */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <UrunGalerisi gorseller={urun.gorsel_urls} baslik={urun.baslik} />
          </div>
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div className="lg:col-span-7">
          <UrunBilgileriDetay urun={urun} />
        </div>
      </div>

      {/* Yorumlar Bölümü */}
      <div className="border-t mt-8">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-6">Yorumlar</h2>
          <YorumFormu urunId={urun.id} />
          <div className="mt-8">
            <YorumListesi urunId={urun.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UrunDetay;