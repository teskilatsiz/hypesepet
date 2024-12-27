import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { KonumSecici } from '../components/KonumSecici';

function Kayit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    sifre: '',
    ad: '',
    soyad: '',
    kullaniciAdi: '',
    telefon: '',
    konum: null
  });
  const [yukleniyor, setYukleniyor] = useState(false);

  async function kayitOl(e) {
    e.preventDefault();
    setYukleniyor(true);

    try {
      // Auth kaydı
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.sifre
      });

      if (authError) throw authError;

      // Profil oluştur
      const { error: profilError } = await supabase
        .from('kullanici_profilleri')
        .insert({
          id: auth.user.id,
          ad: form.ad,
          soyad: form.soyad,
          kullanici_adi: form.kullaniciAdi,
          telefon: form.telefon,
          konum: form.konum
        });

      if (profilError) throw profilError;

      toast.success('Kayıt başarılı! Giriş yapabilirsiniz.');
      navigate('/giris');
    } catch (error) {
      console.error('Kayıt olurken hata:', error);
      toast.error('Kayıt başarısız oldu');
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h1>
        
        <form onSubmit={kayitOl} className="space-y-4">
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
                value={form.kullaniciAdi}
                onChange={(e) => setForm({...form, kullaniciAdi: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
            <div className="relative">
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <div className="relative">
              <input
                type="password"
                value={form.sifre}
                onChange={(e) => setForm({...form, sifre: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                required
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
            {yukleniyor ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <button
            onClick={() => navigate('/giris')}
            className="text-red-500 hover:text-red-600"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}

export default Kayit;