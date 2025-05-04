
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/types/payload-types';
import { uploadFileToStorage } from './serviceUtils';

export async function fetchHeroSection(): Promise<HeroSection> {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching hero section:', error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    backgroundImage: data.background_image,
    ctaText: data.cta_text,
    ctaLink: data.cta_link
  };
}

export async function updateHeroSection(formData: FormData): Promise<boolean> {
  try {
    let backgroundImageUrl = '';
    const backgroundImage = formData.get('backgroundImage');
    
    if (backgroundImage && backgroundImage instanceof File && backgroundImage.size > 0) {
      backgroundImageUrl = await uploadFileToStorage(backgroundImage, 'hero', 'content_images') || '';
    }
    
    const { error } = await supabase
      .from('hero_sections')
      .update({
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        cta_text: formData.get('ctaText') as string,
        cta_link: formData.get('ctaLink') as string,
        ...(backgroundImageUrl && { background_image: backgroundImageUrl })
      })
      .eq('id', formData.get('id') as string);
    
    if (error) {
      console.error('Error updating hero section:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateHeroSection:', error);
    return false;
  }
}
