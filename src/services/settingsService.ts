import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { GlobalSettings } from '@/types/payload-types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'global_settings'; // As per appwrite.json

export async function fetchGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1)
    ]);
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        siteName: doc.site_title,
        logo: doc.logo_url, // Assuming you have a field for the logo URL
        primaryColor: doc.primary_color,
        secondaryColor: doc.secondary_color,
        contactEmail: doc.contact_email,
        contactPhone: doc.contact_phone,
      } as GlobalSettings;
    }
    return null;
  } catch (error) {
    console.error('Error fetching global settings:', error);
    throw error;
  }
}

export async function updateGlobalSettings(documentId: string, data: Partial<GlobalSettings>): Promise<boolean> {
    try {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, data as any);
        return true;
    } catch (error) {
        console.error('Error updating global settings:', error);
        return false;
    }
}
