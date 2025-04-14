
import { supabase } from '@/integrations/supabase/client';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

export async function fetchSEOData(pagePath: string): Promise<SEOData | null> {
  const { data, error } = await supabase
    .from('seo_settings')
    .select('*')
    .eq('page_path', pagePath)
    .single();
  
  if (error) {
    console.error('Error fetching SEO data:', error);
    return null;
  }
  
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    ogImage: data.og_image
  };
}

export async function updateSEOData(pagePath: string, seoData: Partial<SEOData>): Promise<boolean> {
  const { error } = await supabase
    .from('seo_settings')
    .update({
      title: seoData.title,
      description: seoData.description,
      keywords: seoData.keywords,
      og_image: seoData.ogImage,
      updated_at: new Date()
    })
    .eq('page_path', pagePath);
  
  if (error) {
    console.error('Error updating SEO data:', error);
    return false;
  }
  
  return true;
}
