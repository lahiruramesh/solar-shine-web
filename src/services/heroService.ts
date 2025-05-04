
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/types/payload-types';
import { uploadFileToStorage } from './serviceUtils';

export async function fetchHeroSection(): Promise<HeroSection> {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .limit(1)
    .single();
  
  if (error) {
    console.error('Error fetching hero section:', error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle || '',
    backgroundImage: data.background_image,
    ctaText: data.cta_text,
    ctaLink: data.cta_link
  };
}

export async function updateHeroSection(formData: FormData): Promise<boolean> {
  try {
    // Ensure we have the required title field
    const title = formData.get('title');
    
    if (!title || typeof title !== 'string') {
      console.error('Title is required and must be a string');
      return false;
    }
    
    // Create the update data object with the validated title
    const updateData: { 
      title: string; 
      subtitle: string; 
      cta_text: string; 
      cta_link: string;
      background_image?: string;
    } = {
      title: title,
      subtitle: formData.get('subtitle') as string || '',
      cta_text: formData.get('ctaText') as string || '',
      cta_link: formData.get('ctaLink') as string || ''
    };
    
    // Handle background image upload
    const backgroundImage = formData.get('backgroundImage');
    if (backgroundImage && backgroundImage instanceof File && backgroundImage.size > 0) {
      const imageUrl = await uploadFileToStorage(backgroundImage, 'hero_background', 'content_images');
      if (imageUrl) {
        updateData.background_image = imageUrl;
      }
    }
    
    const idValue = formData.get('id');
    const id = idValue ? String(idValue) : null;
    
    if (id) {
      // Update existing hero section
      const { error } = await supabase
        .from('hero_sections')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating hero section:', error);
        return false;
      }
    } else {
      // Create new hero section
      const { error } = await supabase
        .from('hero_sections')
        .insert(updateData);
      
      if (error) {
        console.error('Error creating hero section:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateHeroSection:', error);
    return false;
  }
}
