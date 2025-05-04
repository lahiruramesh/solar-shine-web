
import { supabase } from '@/integrations/supabase/client';

/**
 * Upload a file to Supabase storage
 * 
 * @param file The file to upload
 * @param prefix A prefix for the file name
 * @param bucketName The bucket name
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToStorage(
  file: File,
  prefix: string = 'file',
  bucketName: string = 'content_images'
): Promise<string | null> {
  try {
    if (!file || file.size === 0) {
      return null;
    }
    
    const fileName = `${prefix}_${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (uploadError) {
      console.error(`Error uploading file ${prefix}:`, uploadError);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error in uploadFileToStorage:`, error);
    return null;
  }
}

/**
 * Process form data with multiple image files
 * 
 * @param formData FormData object
 * @param imageFields Array of image field configurations
 * @returns Object with processed form data and uploaded image URLs
 */
export async function processFormDataWithImages(
  formData: FormData,
  imageFields: Array<{ formKey: string; dbKey: string; prefix?: string }>
): Promise<Record<string, any>> {
  const result: Record<string, any> = {};
  
  // Process regular form fields
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      result[key] = value;
    }
  }
  
  // Process image fields
  for (const field of imageFields) {
    const image = formData.get(field.formKey);
    
    if (image && image instanceof File && image.size > 0) {
      const imageUrl = await uploadFileToStorage(
        image, 
        field.prefix || field.formKey,
        'content_images'
      );
      
      if (imageUrl) {
        result[field.dbKey] = imageUrl;
      }
    }
  }
  
  return result;
}

/**
 * Create a URL-friendly slug from text
 * 
 * @param text The text to slugify
 * @returns A URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
