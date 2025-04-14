
import { supabase } from '@/integrations/supabase/client';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

/**
 * Fetches SEO data for a specific page
 * This function uses parameterized queries to prevent SQL injection
 */
export async function fetchSEOData(pagePath: string): Promise<SEOData | null> {
  if (!pagePath) {
    console.error('Invalid page path provided');
    return null;
  }
  
  try {
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
  } catch (error) {
    console.error('Unexpected error in fetchSEOData:', error);
    return null;
  }
}

/**
 * Updates SEO data for a specific page
 * This function validates input data and uses parameterized queries for security
 */
export async function updateSEOData(pagePath: string, seoData: Partial<SEOData>): Promise<boolean> {
  if (!pagePath || !seoData) {
    console.error('Invalid parameters for updateSEOData');
    return false;
  }
  
  // Validate input data to prevent malicious input
  const sanitizedData = {
    title: seoData.title?.trim(),
    description: seoData.description?.trim(),
    keywords: seoData.keywords?.trim(),
    ogImage: seoData.ogImage?.trim()
  };

  if (!sanitizedData.title || !sanitizedData.description) {
    console.error('Title and description are required');
    return false;
  }

  try {
    const { error } = await supabase
      .from('seo_settings')
      .update({
        title: sanitizedData.title,
        description: sanitizedData.description,
        keywords: sanitizedData.keywords,
        og_image: sanitizedData.ogImage,
        updated_at: new Date().toISOString() // Convert Date to string
      })
      .eq('page_path', pagePath);
    
    if (error) {
      console.error('Error updating SEO data:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error in updateSEOData:', error);
    return false;
  }
}
