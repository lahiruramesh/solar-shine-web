import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Project } from '@/types/payload-types';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS, [
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(doc => {
      console.log('Raw project doc:', doc);
      console.log('Image URL from DB:', doc.image_url);
      
      // Handle image URL construction
      let imageUrl: string | undefined;
      
      if (doc.image_url) {
        // Check if it's already a full URL or just a file ID
        if (doc.image_url.startsWith('http')) {
          // It's already a full URL, use it as is
          imageUrl = doc.image_url;
          console.log('Using existing URL:', imageUrl);
        } else {
          // It's a file ID, construct the full URL
          try {
            const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '685bcfb7001103824569';
            imageUrl = `https://fra.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${doc.image_url}/view?project=${projectId}`;
            console.log('Constructed URL:', imageUrl);
          } catch (error) {
            console.warn('Failed to construct image URL:', error);
          }
        }
      }
      
      const result = {
        ...doc,
        $id: doc.$id,
        image_url: imageUrl,
        completion_date: doc.completion_date || doc.completionDate || '',
      } as Project;
      
      console.log('Final project object:', result);
      return result;
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

async function handleImageData(imageFile: File | null): Promise<string | undefined> {
    if (imageFile && imageFile.size > 0) {
        const fileResponse = await storage.createFile(STORAGE_BUCKET_ID, ID.unique(), imageFile);
        return fileResponse.$id;
    }
    return undefined;
}

function getProjectData(formData: FormData) {
    return {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        client: formData.get('client') as string,
        completionDate: formData.get('completionDate') as string,
    };
}

export async function addProject(formData: FormData): Promise<boolean> {
    try {
        const data = getProjectData(formData);

        if (!data.title) {
            console.error('Title is required.');
            return false;
        }

        const imageFile = formData.get('image') as File | null;
        const imageId = await handleImageData(imageFile);
        if (imageId) {
            (data as any).image_url = imageId;
        }

        await databases.createDocument(DATABASE_ID, COLLECTIONS.PROJECTS, ID.unique(), data);
        return true;
    } catch (error) {
        console.error('Error adding project:', error);
        return false;
    }
}

export async function updateProject(formData: FormData): Promise<boolean> {
  try {
    const id = formData.get('id') as string;
    if (!id) {
        console.error('Project ID is required for update');
        return false;
    }
    
    const data = getProjectData(formData);

    if (!data.title) {
      console.error('Title is required.');
      return false;
    }

    const imageFile = formData.get('image') as File | null;
    const imageId = await handleImageData(imageFile);
    if (imageId) {
        (data as any).image_url = imageId;
    }

    await databases.updateDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id, data);
    return true;
  } catch (error) {
    console.error('Error updating project:', error);
    return false;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PROJECTS, id);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}
