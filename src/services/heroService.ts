
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/types/payload-types';
import { processFormDataWithImages } from './serviceUtils';

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
      backgroundImage: data.background_image || '', // Return clean URL, cache busting is handled on display
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
    const processedData = await processFormDataWithImages(formData, [
      { formKey: 'backgroundImage', dbKey: 'background_image', prefix: 'hero_background' }
    ]);
    
    const { id, title, subtitle, ctaText, ctaLink, background_image } = processedData;

    if (!title || typeof title !== 'string') {
      console.error('Title is required and must be a string');
      return false;
    }

    const dbData: {
      title: string;
      subtitle: string;
      cta_text: string;
      cta_link: string;
      background_image?: string;
    } = {
      title,
      subtitle: subtitle || '',
      cta_text: ctaText || '',
      cta_link: ctaLink || '',
    };
    
    if (background_image) {
      dbData.background_image = background_image as string;
    }
    
    if (id) {
      // Update existing hero section
      const { error } = await supabase
        .from('hero_sections')
        .update(dbData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating hero section:', error);
        return false;
      }
    } else {
      // Create new hero section
      const { error } = await supabase
        .from('hero_sections')
        .insert(dbData);
      
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

