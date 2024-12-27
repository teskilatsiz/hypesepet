import React from 'react';

interface YukleniyorSpinnerProps {
  boyut?: 'kucuk' | 'orta' | 'buyuk';
}

export function YukleniyorSpinner({ boyut = 'orta' }: YukleniyorSpinnerProps) {
  const boyutSiniflari = {
    kucuk: 'h-4 w-4',
    orta: 'h-8 w-8',
    buyuk: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-b-2 border-red-500 ${boyutSiniflari[boyut]}`}></div>
    </div>
  );
}

export default YukleniyorSpinner;