import { databases, storage, DATABASE_ID, STORAGE_BUCKET_ID, ID, Query } from '@/lib/appwrite';
import { HeroSection } from '@/types/payload-types';

const HERO_COLLECTION_ID = 'hero_section';

export async function fetchHeroSection(): Promise<HeroSection> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      HERO_COLLECTION_ID,
      [Query.limit(1)]
    );
    
    if (response.documents.length > 0) {
      const doc = response.documents[0];
      let imageUrl = '';
      if (doc.background_image) {
        imageUrl = storage.getFilePreview(STORAGE_BUCKET_ID, doc.background_image);
      }
      
      return {
        $id: doc.$id,
        title: doc.title,
        subtitle: doc.subtitle || '',
        backgroundImage: imageUrl,
        ctaText: doc.cta_text || '',
        ctaLink: doc.cta_url || ''
      };
    } else {
      // Return a default empty hero section if none exists
      return {
        title: '',
        subtitle: '',
        backgroundImage: '',
        ctaText: '',
        ctaLink: ''
      };
    }
  } catch (error) {
    console.error('Error fetching hero section:', error);
    throw error;
  }
}

export async function updateHeroSection(formData: FormData): Promise<boolean> {
  try {
    const id = formData.get('id') as string | null;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const ctaText = formData.get('ctaText') as string;
    const ctaLink = formData.get('ctaLink') as string;
    const backgroundImageFile = formData.get('backgroundImage') as File | null;

    if (!title) {
      console.error('Title is required');
      return false;
    }

    let backgroundImageId: string | undefined = undefined;

    if (backgroundImageFile && backgroundImageFile.size > 0) {
      // Upload new background image
      const fileResponse = await storage.createFile(
        STORAGE_BUCKET_ID,
        ID.unique(),
        backgroundImageFile
      );
      backgroundImageId = fileResponse.$id;
    }

    const dbData: {
      title: string;
      subtitle: string;
      cta_text: string;
      cta_url: string;
      background_image?: string;
    } = {
      title,
      subtitle: subtitle || '',
      cta_text: ctaText || '',
      cta_url: ctaLink || '',
    };

    if (backgroundImageId) {
      dbData.background_image = backgroundImageId;
    }

    if (id) {
      // Update existing hero section
      await databases.updateDocument(DATABASE_ID, HERO_COLLECTION_ID, id, dbData);
    } else {
      // Create new hero section
      await databases.createDocument(DATABASE_ID, HERO_COLLECTION_ID, ID.unique(), dbData);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateHeroSection:', error);
    return false;
  }
}

