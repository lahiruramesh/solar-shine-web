
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/types/payload-types';
import { uploadFileToStorage, getImageWithCacheBusting } from './serviceUtils';

export async function fetchHeroSection(): Promise<HeroSection> {
  try {
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
      backgroundImage: getImageWithCacheBusting(data.background_image || ''),
      ctaText: data.cta_text || '',
      ctaLink: data.cta_link || ''
    };
  } catch (error) {
    console.error('Error in fetchHeroSection:', error);
    throw error;
  }
}

export async function updateHeroSection(formData: FormData): Promise<boolean> {
  try {
    // Extract and validate the title field
    const titleValue = formData.get('title');
    
    if (!titleValue || typeof titleValue !== 'string') {
      console.error('Title is required and must be a string');
      return false;
    }
    
    // Extract other string fields with validation
    const subtitleValue = formData.get('subtitle');
    const ctaTextValue = formData.get('ctaText');
    const ctaLinkValue = formData.get('ctaLink');
    
    const subtitle = subtitleValue && typeof subtitleValue === 'string' ? subtitleValue : '';
    const ctaText = ctaTextValue && typeof ctaTextValue === 'string' ? ctaTextValue : '';
    const ctaLink = ctaLinkValue && typeof ctaLinkValue === 'string' ? ctaLinkValue : '';
    
    // Create the update data object with the validated title
    const updateData: { 
      title: string; 
      subtitle: string; 
      cta_text: string; 
      cta_link: string;
      background_image?: string;
    } = {
      title: titleValue,
      subtitle: subtitle,
      cta_text: ctaText,
      cta_link: ctaLink
    };
    
    // Handle background image upload
    const backgroundImage = formData.get('backgroundImage');
    if (backgroundImage && backgroundImage instanceof File && backgroundImage.size > 0) {
      const imageUrl = await uploadFileToStorage(backgroundImage, 'hero_background', 'content_images');
      if (imageUrl) {
        updateData.background_image = imageUrl;
      }
    }
    
    // Extract and validate the ID
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
