import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Project } from '@/types/payload-types';

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROJECTS, [
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(doc => {
      // Ensure the image URL is properly formatted
      const imageUrl = doc.image_url ? 
        (doc.image_url.startsWith('http') 
          ? doc.image_url 
          : `${import.meta.env.VITE_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${doc.image_url}/view?project=${import.meta.env.VITE_APPWRITE_PROJECT_ID}`)
        : '';
      
      return {
        ...doc,
        $id: doc.$id,
        image_url: imageUrl,
        completion_date: doc.completion_date || doc.completionDate || '',
      } as Project;
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
            (data as any).image = imageId;
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
        (data as any).image = imageId;
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
