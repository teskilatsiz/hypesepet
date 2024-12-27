import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Bell, MessageCircle, User, Plus } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { useBildirimler } from '../lib/hooks/useBildirimler';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { okunmamisBildirimSayisi } = useBildirimler();

  async function cikisYap() {
    try {
      await supabase.auth.signOut();
      toast.success('Başarıyla çıkış yapıldı');
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
      toast.error('Çıkış yapılamadı');
    }
  }

  return (
    <nav className="bg-[#ff4747] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            HypeSepet
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/urun-ekle" 
                  className="bg-white text-[#ff4747] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors md:flex md:items-center hidden"
                >
                  <span>Ürün Sat</span>
                </Link>

                <Link 
                  to="/urun-ekle"
                  className="hover:text-gray-200 md:hidden"
                >
                  <Plus className="h-6 w-6" />
                </Link>
                
                <Link to="/bildirimler" className="relative hover:text-gray-200">
                  <Bell className="h-6 w-6" />
                  {okunmamisBildirimSayisi > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-[#ff4747] text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      {okunmamisBildirimSayisi}
                    </span>
                  )}
                </Link>

                <Link to="/mesajlar" className="hover:text-gray-200">
                  <MessageCircle className="h-6 w-6" />
                </Link>

                <Link to={`/profil/${user.id}`} className="hover:text-gray-200">
                  <User className="h-6 w-6" />
                </Link>

                <button
                  onClick={cikisYap}
                  className="hover:text-gray-200"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </>
            ) : (
              <Link to="/giris" className="hover:text-gray-200 flex items-center space-x-1">
                <User className="h-6 w-6" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}