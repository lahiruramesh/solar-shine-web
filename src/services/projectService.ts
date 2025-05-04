
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/payload-types';
import { uploadFileToStorage } from './serviceUtils';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category as 'Residential' | 'Commercial' | 'Industrial',
    description: project.description,
    image: project.image,
    client: project.client,
    completionDate: project.completion_date
  }));
}

export async function updateProject(projectData: Project | FormData): Promise<boolean> {
  try {
    // Handle FormData case (with image)
    if (projectData instanceof FormData) {
      const projectId = projectData.get('id') as string;
      let imageUrl = '';
      
      // Handle image upload if present
      const projectImage = projectData.get('image');
      
      if (projectImage && projectImage instanceof File && projectImage.size > 0) {
        imageUrl = await uploadFileToStorage(projectImage, 'project', 'content_images') || '';
      }
      
      // Create update object
      const updateData: any = {
        title: projectData.get('title') as string,
        description: projectData.get('description') as string,
        category: projectData.get('category') as string,
        client: projectData.get('client') as string,
        completion_date: projectData.get('completionDate') as string
      };
      
      // Only add image field if we have a new image
      if (imageUrl) {
        updateData.image = imageUrl;
      }
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
      
      if (error) {
        console.error('Error updating project with image:', error);
        return false;
      }
    } else {
      // Handle regular project update without image
      const { error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          client: projectData.client,
          completion_date: projectData.completionDate
        })
        .eq('id', projectData.id);
      
      if (error) {
        console.error('Error updating project:', error);
        return false;
      }
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
