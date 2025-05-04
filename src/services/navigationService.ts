
import { supabase } from '@/integrations/supabase/client';
import { NavigationItem } from '@/types/payload-types';

export async function fetchNavigationItems(): Promise<NavigationItem[]> {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching navigation items:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      path: item.path,
      order: item.order
    }));
  } catch (error) {
    console.error('Error in fetchNavigationItems:', error);
    return [];
  }
}

export async function updateNavigationItem(item: NavigationItem): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('navigation_items')
      .update({
        title: item.title,
        path: item.path,
        order: item.order
      })
      .eq('id', item.id);
    
    if (error) {
      console.error('Error updating navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateNavigationItem:', error);
    return false;
  }
}

export async function addNavigationItem(item: { title: string; path: string }): Promise<boolean> {
  try {
    // Get the current max order value
    const { data: orderData, error: orderError } = await supabase
      .from('navigation_items')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);
    
    if (orderError) {
      console.error('Error fetching navigation items for order:', orderError);
      return false;
    }
    
    const newOrder = (orderData && orderData.length > 0) ? orderData[0].order + 1 : 1;
    
    const { error } = await supabase
      .from('navigation_items')
      .insert({
        title: item.title,
        path: item.path,
        order: newOrder
      });
    
    if (error) {
      console.error('Error adding navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addNavigationItem:', error);
    return false;
  }
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteNavigationItem:', error);
    return false;
  }
}
