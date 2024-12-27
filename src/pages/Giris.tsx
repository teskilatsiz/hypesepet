import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

function Giris() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  async function girisYap(e) {
    e.preventDefault();
    setYukleniyor(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: sifre
      });

      if (error) throw error;

      toast.success('Başarıyla giriş yapıldı');
      navigate('/');
    } catch (error) {
      console.error('Giriş yapılırken hata:', error);
      toast.error('Giriş yapılamadı');
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>
        
        <form onSubmit={girisYap} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type="password"
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={yukleniyor}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <button
            onClick={() => navigate('/kayit')}
            className="text-red-500 hover:text-red-600"
          >
            Kayıt Ol
          </button>
        </p>
      </div>
    </div>
  );
}

export default Giris;