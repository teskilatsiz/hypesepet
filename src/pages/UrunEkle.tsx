import React from 'react';
import { UrunFormu } from '../components/urun/UrunFormu';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/hooks/useAuth';

function UrunEkle() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/giris');
    return null;
  }

  async function urunKaydet(urunData) {
    try {
      toast.success('Ürün başarıyla eklendi');
      navigate('/');
    } catch (error) {
      toast.error('Ürün eklenirken bir hata oluştu');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Yeni Ürün Ekle</h1>
        <UrunFormu onSubmit={urunKaydet} />
      </div>
    </div>
  );
}

export default UrunEkle;