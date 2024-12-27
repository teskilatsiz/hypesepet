import React from 'react';
import { YukleniyorSpinner } from './YukleniyorSpinner';

interface ButonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'birincil' | 'ikincil' | 'cerceve';
  boyut?: 'kucuk' | 'orta' | 'buyuk';
  yukleniyor?: boolean;
  ikon?: React.ReactNode;
}

export function Buton({
  children,
  variant = 'birincil',
  boyut = 'orta',
  yukleniyor = false,
  ikon,
  className = '',
  disabled,
  ...props
}: ButonProps) {
  const temelStiller = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const varyantlar = {
    birincil: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    ikincil: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    cerceve: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
  };

  const boyutlar = {
    kucuk: 'px-3 py-1.5 text-sm',
    orta: 'px-4 py-2',
    buyuk: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${temelStiller} ${varyantlar[variant]} ${boyutlar[boyut]} ${className}`}
      disabled={yukleniyor || disabled}
      {...props}
    >
      {yukleniyor ? (
        <YukleniyorSpinner boyut="kucuk" />
      ) : (
        <>
          {ikon && <span className="mr-2">{ikon}</span>}
          {children}
        </>
      )}
    </button>
  );
}