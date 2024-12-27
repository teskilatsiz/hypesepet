// Görsel önizleme state'i ekle
const [seciliOnizlemeGorsel, setSeciliOnizlemeGorsel] = useState<string | null>(null);

// Görsel galerisi bölümünde
<div className="aspect-square rounded-lg overflow-hidden mb-4 cursor-pointer" 
     onClick={() => setSeciliOnizlemeGorsel(urun.gorsel_urls[seciliGorsel])}>
  <img
    src={urun.gorsel_urls[seciliGorsel]}
    alt={urun.baslik}
    className="w-full h-full object-cover"
  />
</div>

{/* Görsel önizleme modalı */}
{seciliOnizlemeGorsel && (
  <GorselOnizleme
    gorselUrl={seciliOnizlemeGorsel}
    onClose={() => setSeciliOnizlemeGorsel(null)}
  />
)}