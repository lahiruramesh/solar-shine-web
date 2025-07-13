import { databases, storage } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { AboutContent } from '@/types/payload-types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_ABOUT_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;

function mapDocToAboutContent(doc: any): AboutContent {
    const getImageUrl = (id?: string) => id ? (storage.getFilePreview(BUCKET_ID, id) as any).href : undefined;

    return {
        $id: doc.$id,
        title: doc.title,
        subtitle: doc.subtitle,
        content: doc.content,
        mission_statement: doc.mission_statement,
        vision_statement: doc.vision_statement,
        main_image: getImageUrl(doc.main_image_id),
        main_image_id: doc.main_image_id,
        image_one: getImageUrl(doc.image_one_id),
        image_one_id: doc.image_one_id,
        image_two: getImageUrl(doc.image_two_id),
        image_two_id: doc.image_two_id,
        team_members: doc.team_members ? JSON.parse(doc.team_members) : []
    };
}

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1)
    ]);
    if (response.documents.length > 0) {
      return mapDocToAboutContent(response.documents[0]);
    }
    return null;
  } catch (error) {
    console.error('Error fetching about content:', error);
    throw error;
  }
}

export async function updateAboutContent(documentId: string, data: Partial<Omit<AboutContent, '$id' | 'main_image' | 'image_one' | 'image_two'>>): Promise<AboutContent> {
  try {
    const dataToUpdate = { ...data };
    if (dataToUpdate.team_members) {
        dataToUpdate.team_members = JSON.stringify(dataToUpdate.team_members) as any;
    }

    const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, dataToUpdate as any);
    return mapDocToAboutContent(response);
  } catch (error) {
    console.error('Error updating about content:', error);
    throw error;
  }
}

export async function uploadAboutImage(imageFile: File): Promise<string> {
    const fileResponse = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
    return fileResponse.$id;
}
