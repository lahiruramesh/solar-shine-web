
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage, getImageWithCacheBusting } from './serviceUtils';
import { SpecializedArea } from '@/types/payload-types';

export async function fetchSpecializedAreas(): Promise<SpecializedArea[]> {
  const { data, error } = await supabase
    .from('specialized_areas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching specialized areas:', error);
    throw error;
  }

  return data.map(area => ({
    ...area,
    image: area.image ? getImageWithCacheBusting(area.image) : null,
  }));
}

export async function updateSpecializedArea(formData: FormData): Promise<boolean> {
  try {
    const areaId = formData.get('id') as string;
    if (!areaId) {
      console.error('Area ID is required for update');
      return false;
    }

    const updateData: { [key: string]: any } = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    };

    const imageFile = formData.get('image');
    if (imageFile instanceof File && imageFile.size > 0) {
      const imageUrl = await uploadFileToStorage(imageFile, 'area', 'content_images');
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    const { error } = await supabase
      .from('specialized_areas')
      .update(updateData)
      .eq('id', areaId);

    if (error) {
      console.error('Error updating area:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateSpecializedArea:', error);
    return false;
  }
}

export async function addSpecializedArea(formData: FormData): Promise<boolean> {
  try {
    const imageFile = formData.get('image');
    let imageUrl: string | null = null;
    
    if (imageFile instanceof File && imageFile.size > 0) {
      imageUrl = await uploadFileToStorage(imageFile, 'area', 'content_images');
    }

    if (!imageUrl) {
      console.error('Image upload failed or no image provided');
      return false;
    }
    
    const insertData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: imageUrl,
    };

    const { error } = await supabase
      .from('specialized_areas')
      .insert(insertData);

    if (error) {
      console.error('Error adding area:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addSpecializedArea:', error);
    return false;
  }
}


export async function deleteSpecializedArea(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('specialized_areas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting area:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteSpecializedArea:', error);
    return false;
  }
}
