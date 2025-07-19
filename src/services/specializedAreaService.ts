import { databases, storage, DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { SpecializedArea } from '@/types/payload-types';

export async function fetchSpecializedAreas(): Promise<SpecializedArea[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SPECIALIZED_AREAS, [
      Query.orderDesc('$createdAt')
    ]);

    const areas = response.documents.map(doc => {
      const imageUrl = doc.image ? (storage.getFilePreview(STORAGE_BUCKET_ID, doc.image) as any).href : '';
      return {
        ...doc,
        $id: doc.$id,
        image: imageUrl,
      } as unknown as SpecializedArea;
    });

    return areas;
  } catch (error) {
    console.error('Error fetching specialized areas:', error);
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

export async function addSpecializedArea(formData: FormData): Promise<boolean> {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        if (!title) {
            console.error('Title is required.');
            return false;
        }

        const data: { title: string; description: string; image?: string } = {
            title,
            description,
        };

        const imageFile = formData.get('image') as File | null;
        const imageId = await handleImageData(imageFile);
        if (imageId) {
            data.image = imageId;
        }

        await databases.createDocument(DATABASE_ID, COLLECTIONS.SPECIALIZED_AREAS, ID.unique(), data);
        return true;
    } catch (error) {
        console.error('Error adding specialized area:', error);
        return false;
    }
}

export async function updateSpecializedArea(formData: FormData): Promise<boolean> {
  try {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    if (!id || !title) {
      console.error('ID and Title are required.');
      return false;
    }

    const data: { title: string; description: string; image?: string } = {
      title,
      description,
    };

    const imageFile = formData.get('image') as File | null;
    const imageId = await handleImageData(imageFile);
    if (imageId) {
        data.image = imageId;
    }

    await databases.updateDocument(DATABASE_ID, COLLECTIONS.SPECIALIZED_AREAS, id, data);
    return true;
  } catch (error) {
    console.error('Error updating specialized area:', error);
    return false;
  }
}

export async function deleteSpecializedArea(id: string): Promise<boolean> {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SPECIALIZED_AREAS, id);
    return true;
  } catch (error) {
    console.error('Error deleting specialized area:', error);
    return false;
  }
}
