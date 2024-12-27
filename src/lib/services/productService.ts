import { supabase } from '../supabase';
import { handleSupabaseError } from '../utils/errorHandler';

export async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('urunler')
      .select(`
        *,
        satici:kullanici_profilleri(*),
        kategori:kategoriler(*)
      `)
      .eq('satildi', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error);
  }
}