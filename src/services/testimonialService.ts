import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Testimonial } from '@/types/payload-types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_TESTIMONIALS_COLLECTION_ID;

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('$createdAt')
    ]);
    return response.documents.map(doc => ({
        $id: doc.$id,
        text: doc.text,
        author: doc.author,
        position: doc.position,
    })) as unknown as Testimonial[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
}

export async function updateTestimonial(testimonial: Testimonial): Promise<boolean> {
  try {
    const { $id, text, author, position } = testimonial;
    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, $id, { text, author, position });
    return true;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
}

export async function addTestimonial(testimonial: { text: string; author: string; position: string }): Promise<boolean> {
  try {
    await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), testimonial);
    return true;
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return false;
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
    return true;
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
}
