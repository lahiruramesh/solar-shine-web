
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage } from './serviceUtils';

export async function fetchSpecializedAreas() {
  try {
    const { data, error } = await supabase
      .from('specialized_areas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching specialized areas:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchSpecializedAreas:', error);
    throw error;
  }
}

export async function updateSpecializedArea(formData: FormData) {
  try {
    const title = formData.get('title');
    const description = formData.get('description');
    
    // Validate required fields
    if (!title || typeof title !== 'string') {
      console.error('Title is required and must be a string');
      return false;
    }
    
    // Create update data object with validated fields
    const updateData: {
      title: string;
      description?: string;
      image?: string;
    } = {
      title: title,
      description: description && typeof description === 'string' ? description : ''
    };
    
    // Handle image upload
    const image = formData.get('image');
    if (image && image instanceof File && image.size > 0) {
      const imageUrl = await uploadFileToStorage(image, 'specialized_area', 'content_images');
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }
    
    const idValue = formData.get('id');
    const id = idValue ? String(idValue) : null;
    
    if (id) {
      // Update existing area
      const { error } = await supabase
        .from('specialized_areas')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating specialized area:', error);
        return false;
      }
    } else {
      // Create new area
      const { error } = await supabase
        .from('specialized_areas')
        .insert(updateData);
      
      if (error) {
        console.error('Error creating specialized area:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateSpecializedArea:', error);
    return false;
  }
}

export async function deleteSpecializedArea(id: string) {
  try {
    const { error } = await supabase
      .from('specialized_areas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting specialized area:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteSpecializedArea:', error);
    return false;
  }
}
