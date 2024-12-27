import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/hooks/useAuth';
import { Star, Package, MessageCircle, Settings, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProfilDuzenle } from '../components/profil/ProfilDuzenle';
import { ProfilUrunler } from '../components/profil/ProfilUrunler';
import toast from 'react-hot-toast';

export default function Profil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [duzenlemeModu, setDuzenlemeModu] = useState(false);
  const [mesajGonderiliyor, setMesajGonderiliyor] = useState(false);

  useEffect(() => {
    profilGetir();
  }, [id]);

  async function profilGetir() {
    try {
      const { data: profilData, error: profilError } = await supabase
        .from('kullanici_profilleri')
        .select('*')
        .eq('id', id)
        .single();

      if (profilError) throw profilError;
      setProfil(profilData);

      const { data: urunlerData, error: urunlerError } = await supabase
        .from('urunler')
        .select('*')
        .eq('satici_id', id)
        .order('created_at', { ascending: false });

      if (urunlerError) throw urunlerError;
      setUrunler(urunlerData);
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    } finally {
      setYukleniyor(false);
    }
  }

  async function mesajGonder() {
    if (!user) {
      toast.error('Mesaj göndermek için giriş yapmalısınız');
      navigate('/giris');
      return;
    }

    setMesajGonderiliyor(true);
    try {
      const { error } = await supabase
        .from('mesajlar')
        .insert({
          gonderen_id: user.id,
          alici_id: id,
          icerik: `Merhaba, ${profil.ad}!`
        });

      if (error) throw error;

      toast.success('Mesaj gönderildi');
      navigate('/mesajlar');
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      toast.error('Mesaj gönderilemedi');
    } finally {
      setMesajGonderiliyor(false);
    }
  }

  if (yukleniyor) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!profil) return null;

  const kendiProfili = user?.id === id;

  if (duzenlemeModu && kendiProfili) {
    return (
      <div className="max-w-4xl mx-auto">
        <ProfilDuzenle
          profil={profil}
          onGuncelle={() => {
            profilGetir();
            setDuzenlemeModu(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={profil.avatar_url || 'https://via.placeholder.com/100'}
                alt={profil.ad}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">
                  {profil.ad} {profil.soyad}
                </h1>
                <p className="text-gray-500">@{profil.kullanici_adi}</p>
                <div className="flex items-center mt-2 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1">{profil.degerlendirme_puani}</span>
                </div>
              </div>
            </div>

            {kendiProfili ? (
              <button
                onClick={() => setDuzenlemeModu(true)}
                className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-5 w-5" />
                <span>Profili Düzenle</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={mesajGonder}
                  disabled={mesajGonderiliyor}
                  className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{mesajGonderiliyor ? 'Gönderiliyor...' : 'Mesaj Gönder'}</span>
                </button>
                {profil.telefon && (
                  <a
                    href={`tel:${profil.telefon}`}
                    className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="h-5 w-5" />
                    <span>Ara</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Satışta Olan Ürünler
            </h2>

            <ProfilUrunler urunler={urunler} />
          </div>
        </div>
      </div>
    </div>
  );
}