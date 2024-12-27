import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HataLimiti } from './components/ortak/HataLimiti';
import Navbar from './components/Navbar';
import AnaSayfa from './pages/AnaSayfa';
import UrunDetay from './pages/UrunDetay';
import Profil from './pages/Profil';
import UrunEkle from './pages/UrunEkle';
import Mesajlar from './pages/Mesajlar';
import Bildirimler from './pages/Bildirimler';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import { toastConfig } from './lib/constants/toastStyles';

function App() {
  return (
    <HataLimiti>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<AnaSayfa />} />
              <Route path="/urun/:id" element={<UrunDetay />} />
              <Route path="/profil/:id" element={<Profil />} />
              <Route path="/urun-ekle" element={<UrunEkle />} />
              <Route path="/mesajlar" element={<Mesajlar />} />
              <Route path="/bildirimler" element={<Bildirimler />} />
              <Route path="/giris" element={<Giris />} />
              <Route path="/kayit" element={<Kayit />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Toaster position={toastConfig.position} toastOptions={toastConfig} />
        </div>
      </Router>
    </HataLimiti>
  );
}

export default App;