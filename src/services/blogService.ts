
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/payload-types';
import { uploadFileToStorage, createSlug } from './serviceUtils';

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('publish_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
  
  return data.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    publishDate: post.publish_date,
    coverImage: post.cover_image,
    slug: post.slug
  }));
}

export async function createBlogPost(formData: FormData): Promise<string | null> {
  try {
    const coverImage = formData.get('coverImage');
    let coverImageUrl = '';
    
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      coverImageUrl = await uploadFileToStorage(coverImage, 'blog', 'content_images') || '';
    }
    
    const title = formData.get('title') as string;
    const slug = createSlug(title);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: title,
        excerpt: formData.get('excerpt') as string,
        content: formData.get('content') as string,
        author: formData.get('author') as string,
        publish_date: formData.get('publishDate') as string,
        cover_image: coverImageUrl,
        slug: slug
      })
      .select();
    
    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    return null;
  }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<boolean> {
  try {
    const updateData: any = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      publish_date: formData.get('publishDate') as string
    };
    
    // If title changed, update slug
    const title = formData.get('title') as string;
    const originalTitle = formData.get('originalTitle') as string;
    if (title !== originalTitle) {
      updateData.slug = createSlug(title);
    }
    
    const coverImage = formData.get('coverImage');
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const imageUrl = await uploadFileToStorage(coverImage, 'blog', 'content_images');
      if (imageUrl) {
        updateData.cover_image = imageUrl;
      }
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating blog post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
}
