
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
    // Validate and extract required fields
    const titleValue = formData.get('title');
    const subtitleValue = formData.get('subtitle');
    const contentValue = formData.get('content');
    const missionTitleValue = formData.get('missionTitle');
    const missionDescriptionValue = formData.get('missionDescription');
    const visionTitleValue = formData.get('visionTitle');
    const visionDescriptionValue = formData.get('visionDescription');
    
    // Convert to strings and validate
    const title = titleValue && typeof titleValue === 'string' ? titleValue : null;
    const subtitle = subtitleValue && typeof subtitleValue === 'string' ? subtitleValue : null;
    const content = contentValue && typeof contentValue === 'string' ? contentValue : null;
    const missionTitle = missionTitleValue && typeof missionTitleValue === 'string' ? missionTitleValue : null;
    const missionDescription = missionDescriptionValue && typeof missionDescriptionValue === 'string' ? missionDescriptionValue : null;
    const visionTitle = visionTitleValue && typeof visionTitleValue === 'string' ? visionTitleValue : null;
    const visionDescription = visionDescriptionValue && typeof visionDescriptionValue === 'string' ? visionDescriptionValue : null;
    
    // Check if required fields exist and are strings
    if (!title || !subtitle || !content || !missionTitle || !missionDescription || !visionTitle || !visionDescription) {
      console.error('Required fields are missing or invalid');
      return false;
    }
    
    // Create update data object with required fields
    const updateData = {
      title,
      subtitle,
      content,
      mission_title: missionTitle,
      mission_description: missionDescription,
      vision_title: visionTitle,
      vision_description: visionDescription
    };
    
    // Handle image uploads
    const imageFields = [
      { formKey: 'mainImage', dbKey: 'main_image' },
      { formKey: 'imageOne', dbKey: 'image_one' },
      { formKey: 'imageTwo', dbKey: 'image_two' }
    ];
    
    for (const field of imageFields) {
      const imageValue = formData.get(field.formKey);
      
      if (imageValue && imageValue instanceof File && imageValue.size > 0) {
        const imageUrl = await uploadFileToStorage(imageValue, `about_${field.formKey}`, 'content_images');
        if (imageUrl) {
          updateData[field.dbKey] = imageUrl;
        }
      }
    }
    
    // Check if this is a create or update operation
    const idValue = formData.get('id');
    const id = idValue ? String(idValue) : null;
    
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
