import { supabase } from '../supabase';
import { handleSupabaseError } from '../utils/errorHandler';

export async function getNotifications(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bildirimler')
      .select('*')
      .eq('kullanici_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    handleSupabaseError(error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('bildirimler')
      .update({ okundu: true })
      .eq('id', notificationId);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    const { error } = await supabase
      .from('bildirimler')
      .update({ okundu: true })
      .eq('kullanici_id', userId)
      .eq('okundu', false);

    if (error) throw error;
  } catch (error) {
    handleSupabaseError(error);
  }
}