
import { supabase } from '@/integrations/supabase/client';
import { AboutContent } from '@/types/payload-types';
import { uploadFileToStorage } from './serviceUtils';

export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      mainImage: data.main_image,
      missionTitle: data.mission_title,
      missionDescription: data.mission_description,
      visionTitle: data.vision_title,
      visionDescription: data.vision_description,
      imageOne: data.image_one,
      imageTwo: data.image_two
    };
  } catch (error) {
    console.error('Error in fetchAboutContent:', error);
    throw error;
  }
}

export async function updateAboutContent(formData: FormData): Promise<boolean> {
  try {
    const updateData: any = {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      content: formData.get('content') as string,
      mission_title: formData.get('missionTitle') as string,
      mission_description: formData.get('missionDescription') as string,
      vision_title: formData.get('visionTitle') as string,
      vision_description: formData.get('visionDescription') as string
    };
    
    const imageFields = [
      { formKey: 'mainImage', dbKey: 'main_image' },
      { formKey: 'imageOne', dbKey: 'image_one' },
      { formKey: 'imageTwo', dbKey: 'image_two' }
    ];
    
    for (const field of imageFields) {
      const image = formData.get(field.formKey);
      
      if (image && image instanceof File && image.size > 0) {
        const imageUrl = await uploadFileToStorage(image, `about_${field.formKey}`, 'content_images');
        if (imageUrl) {
          updateData[field.dbKey] = imageUrl;
        }
      }
    }
    
    // Check if this is a create or update operation
    const id = formData.get('id');
    
    if (id) {
      // Update existing record
      const { error } = await supabase
        .from('about_content')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating about content:', error);
        return false;
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('about_content')
        .insert(updateData);
      
      if (error) {
        console.error('Error creating about content:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAboutContent:', error);
    return false;
  }
}
