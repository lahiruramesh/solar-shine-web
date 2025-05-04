
import { supabase } from '@/integrations/supabase/client';
import { ServiceCard } from '@/types/payload-types';

export async function fetchServiceCards(): Promise<ServiceCard[]> {
  const { data, error } = await supabase
    .from('service_cards')
    .select('*');
  
  if (error) {
    console.error('Error fetching service cards:', error);
    throw error;
  }
  
  return data.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    icon: card.icon
  }));
}

export async function updateServiceCard(serviceCard: ServiceCard): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_cards')
      .update({
        title: serviceCard.title,
        description: serviceCard.description,
        icon: serviceCard.icon,
        updated_at: new Date().toISOString()
      })
      .eq('id', serviceCard.id);
    
    if (error) {
      console.error('Error updating service card:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateServiceCard:', error);
    return false;
  }
}

export async function addServiceCard(serviceCard: { title: string; description: string; icon: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_cards')
      .insert({
        title: serviceCard.title,
        description: serviceCard.description,
        icon: serviceCard.icon
      });
    
    if (error) {
      console.error('Error adding service card:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addServiceCard:', error);
    return false;
  }
}

export async function deleteServiceCard(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_cards')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting service card:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteServiceCard:', error);
    return false;
  }
}
