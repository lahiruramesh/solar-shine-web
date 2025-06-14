import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/payload-types';
import { uploadFileToStorage, getImageWithCacheBusting } from './serviceUtils';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category as 'Residential' | 'Commercial' | 'Industrial',
    description: project.description,
    image: project.image ? getImageWithCacheBusting(project.image) : project.image,
    client: project.client,
    completionDate: project.completion_date
  }));
}

export async function updateProject(formData: FormData): Promise<boolean> {
  try {
    const projectId = formData.get('id') as string;
    if (!projectId) {
      console.error('Project ID is required for update');
      return false;
    }

    const updateData: { [key: string]: any } = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      client: formData.get('client') as string,
      completion_date: formData.get('completionDate') as string
    };
    
    const projectImage = formData.get('image');
    if (projectImage && projectImage instanceof File && projectImage.size > 0) {
      const imageUrl = await uploadFileToStorage(projectImage, 'project', 'content_images');
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }
    
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', projectId);
    
    if (error) {
      console.error('Error updating project:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProject:', error);
    return false;
  }
}

export async function addProject(formData: FormData): Promise<boolean> {
  try {
    const projectImage = formData.get('image');
    let imageUrl = '';
    
    if (projectImage && projectImage instanceof File && projectImage.size > 0) {
      imageUrl = await uploadFileToStorage(projectImage, 'project', 'content_images') || '';
    }
    
    if (!imageUrl) {
      console.error('Failed to upload project image');
      return false;
    }
    
    const { error } = await supabase
      .from('projects')
      .insert({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        client: formData.get('client') as string,
        completion_date: formData.get('completionDate') as string,
        image: imageUrl
      });
    
    if (error) {
      console.error('Error adding project:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addProject:', error);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting project:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    return false;
  }
}
