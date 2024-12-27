import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import { KonumSecici } from '../KonumSecici';
import { useKategoriler } from '../../lib/hooks/useKategoriler';
import { useGorselYukle } from '../../lib/hooks/useGorselYukle';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/hooks/useAuth';

const DURUM_SECENEKLERI = ['Yeni', 'Yeni Gibi', 'İyi', 'Normal'];

export function UrunFormu({ onSubmit, baslangicDegerler = {} }) {
  const { user } = useAuth();
  const { kategoriler } = useKategoriler();
  const { gorselYukle, yukleniyor: gorselYukleniyor } = useGorselYukle();
  
  const [form, setForm] = useState({
    baslik: '',
    aciklama: '',
    fiyat: '',
    kategori_id: '',
    durum: 'Yeni',
    konum: null,
    gorsel_urls: [],
    ...baslangicDegerler
  });

  const anaKategoriler = kategoriler.filter(k => !k.ust_kategori_id);
  const altKategoriler = kategoriler.filter(k => k.ust_kategori_id);
  const secilenAnaKategori = form.kategori_id ? 
    kategoriler.find(k => k.id === form.kategori_id)?.ust_kategori_id || form.kategori_id : 
    '';

  const filtreliAltKategoriler = altKategoriler.filter(k => k.ust_kategori_id === secilenAnaKategori);

  async function formGonder(e) {
    e.preventDefault();
    if (form.gorsel_urls.length === 0) {
      alert('En az bir görsel eklemelisiniz');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('urunler')
        .insert({
          ...form,
          satici_id: user.id,
          fiyat: parseFloat(form.fiyat)
        })
        .select()
        .single();

      if (error) throw error;
      onSubmit(data);
    } catch (error) {
      console.error('Ürün eklenirken hata:', error);
      throw error;
    }
  }

  async function gorselEkle(e) {
    const dosya = e.target.files[0];
    if (!dosya) return;

    try {
      const url = await gorselYukle(dosya);
      setForm(prev => ({
        ...prev,
        gorsel_urls: [...prev.gorsel_urls, url]
      }));
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error);
    }
  }

  function gorselKaldir(index) {
    setForm(prev => ({
      ...prev,
      gorsel_urls: prev.gorsel_urls.filter((_, i) => i !== index)
    }));
  }

  return (
    <form onSubmit={formGonder} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Başlık
          </label>
          <input
            type="text"
            value={form.baslik}
            onChange={e => setForm({...form, baslik: e.target.value})}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fiyat (TL)
          </label>
          <input
            type="number"
            value={form.fiyat}
            onChange={e => setForm({...form, fiyat: e.target.value})}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Açıklama
        </label>
        <textarea
          value={form.aciklama}
          onChange={e => setForm({...form, aciklama: e.target.value})}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ana Kategori
          </label>
          <select
            value={secilenAnaKategori}
            onChange={e => {
              const yeniAnaKategoriId = e.target.value;
              setForm(prev => ({
                ...prev,
                kategori_id: yeniAnaKategoriId
              }));
            }}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Ana kategori seçin</option>
            {anaKategoriler.map(kategori => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.ad}
              </option>
            ))}
          </select>
        </div>

        {secilenAnaKategori && filtreliAltKategoriler.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alt Kategori
            </label>
            <select
              value={form.kategori_id}
              onChange={e => setForm({...form, kategori_id: e.target.value})}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Alt kategori seçin</option>
              {filtreliAltKategoriler.map(kategori => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.ad}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ürün Durumu
          </label>
          <select
            value={form.durum}
            onChange={e => setForm({...form, durum: e.target.value})}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            {DURUM_SECENEKLERI.map(durum => (
              <option key={durum} value={durum}>
                {durum}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Konum
        </label>
        <KonumSecici
          konum={form.konum}
          onChange={konum => setForm({...form, konum})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Görseller
        </label>
        <div className="grid grid-cols-4 gap-4">
          {form.gorsel_urls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Ürün görseli ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => gorselKaldir(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {form.gorsel_urls.length < 8 && (
            <label className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={gorselEkle}
                disabled={gorselYukleniyor}
              />
              <div className="text-center p-4">
                <Camera className="h-8 w-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-500">Görsel Ekle</span>
              </div>
            </label>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={gorselYukleniyor}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        Ürünü Yayınla
      </button>
    </form>
  );
}