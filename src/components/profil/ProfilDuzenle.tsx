import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Camera, Mail, Phone, MapPin, User } from 'lucide-react';
import { KonumSecici } from '../KonumSecici';
import toast from 'react-hot-toast';

export function ProfilDuzenle({ profil, onGuncelle }) {
  const [form, setForm] = useState({
    ad: profil.ad || '',
    soyad: profil.soyad || '',
    kullanici_adi: profil.kullanici_adi || '',
    telefon: profil.telefon || '',
    konum: profil.konum || null
  });
  const [yukleniyor, setYukleniyor] = useState(false);
  const [avatarYukleniyor, setAvatarYukleniyor] = useState(false);

  async function profilGuncelle(e) {
    e.preventDefault();
    setYukleniyor(true);

    try {
      const { error } = await supabase
        .from('kullanici_profilleri')
        .update(form)
        .eq('id', profil.id);

      if (error) throw error;

      toast.success('Profil güncellendi');
      onGuncelle();
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      toast.error('Profil güncellenemedi');
    } finally {
      setYukleniyor(false);
    }
  }

  async function avatarYukle(e) {
    const dosya = e.target.files[0];
    if (!dosya) return;

    setAvatarYukleniyor(true);
    try {
      const dosyaAdi = `${profil.id}-${Date.now()}`;
      const { error: yukleHata } = await supabase.storage
        .from('profil-resimleri')
        .upload(dosyaAdi, dosya);

      if (yukleHata) throw yukleHata;

      const { data: url } = supabase.storage
        .from('profil-resimleri')
        .getPublicUrl(dosyaAdi);

      const { error: guncelleHata } = await supabase
        .from('kullanici_profilleri')
        .update({ avatar_url: url.publicUrl })
        .eq('id', profil.id);

      if (guncelleHata) throw guncelleHata;

      toast.success('Profil fotoğrafı güncellendi');
      onGuncelle();
    } catch (error) {
      console.error('Avatar yüklenirken hata:', error);
      toast.error('Profil fotoğrafı yüklenemedi');
    } finally {
      setAvatarYukleniyor(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Profili Düzenle</h2>

      <div className="mb-8 flex justify-center">
        <div className="relative">
          <img
            src={profil.avatar_url || 'https://via.placeholder.com/150'}
            alt={profil.ad}
            className="w-32 h-32 rounded-full object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full cursor-pointer hover:bg-red-600">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={avatarYukle}
              disabled={avatarYukleniyor}
            />
            <Camera className="h-5 w-5" />
          </label>
        </div>
      </div>

      <form onSubmit={profilGuncelle} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
            <div className="relative">
              <input
                type="text"
                value={form.ad}
                onChange={(e) => setForm({...form, ad: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
            <div className="relative">
              <input
                type="text"
                value={form.soyad}
                onChange={(e) => setForm({...form, soyad: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
          <div className="relative">
            <input
              type="text"
              value={form.kullanici_adi}
              onChange={(e) => setForm({...form, kullanici_adi: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
          <div className="relative">
            <input
              type="tel"
              value={form.telefon}
              onChange={(e) => setForm({...form, telefon: e.target.value})}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
          <KonumSecici
            konum={form.konum}
            onChange={(konum) => setForm({...form, konum})}
          />
        </div>

        <button
          type="submit"
          disabled={yukleniyor}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {yukleniyor ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </form>
    </div>
  );
}