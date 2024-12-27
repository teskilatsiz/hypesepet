import React, { useState } from 'react';
import { AramaFiltre } from '../components/arama/AramaFiltre';
import { KategoriNav } from '../components/kategori/KategoriNav';
import { UrunListesi } from '../components/urun/UrunListesi';
import { useUrunler } from '../lib/hooks/useUrunler';

function AnaSayfa() {
  const [aramaMetni, setAramaMetni] = useState('');
  const [secilenKategori, setSecilenKategori] = useState('');
  const { urunler, yukleniyor } = useUrunler({ aramaMetni, kategoriId: secilenKategori });

  return (
    <div className="container mx-auto px-4">
      <AramaFiltre 
        aramaMetni={aramaMetni} 
        onAramaChange={setAramaMetni} 
      />
      
      <KategoriNav 
        secilenKategori={secilenKategori} 
        onKategoriChange={setSecilenKategori} 
      />

      <UrunListesi urunler={urunler} yukleniyor={yukleniyor} />
    </div>
  );
}

export default AnaSayfa;