import { useState } from 'react';

export function useMesajlar() {
  const [seciliSohbet, setSeciliSohbet] = useState(null);

  function seciliSohbetiGuncelle(sohbet) {
    setSeciliSohbet(sohbet);
  }

  return {
    seciliSohbet,
    seciliSohbetiGuncelle
  };
}