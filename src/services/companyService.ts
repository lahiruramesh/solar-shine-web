import { databases } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { CompanyInfo, SocialLink, FooterLink } from '@/types/payload-types';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const COMPANY_INFO_COLLECTION_ID = 'company_info';
const SOCIAL_LINKS_COLLECTION_ID = 'social_links';
const FOOTER_LINKS_COLLECTION_ID = 'footer_links';

// Company Info Functions
export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COMPANY_INFO_COLLECTION_ID, [Query.limit(1)]);
    return response.documents.length > 0 ? response.documents[0] as unknown as CompanyInfo : null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  try {
    const { $id, ...data } = info;
    await databases.updateDocument(DATABASE_ID, COMPANY_INFO_COLLECTION_ID, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
}

// Social Links Functions
export async function fetchSocialLinks(): Promise<SocialLink[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, SOCIAL_LINKS_COLLECTION_ID, [Query.orderAsc('order')]);
    return response.documents as unknown as SocialLink[];
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
}

export async function updateSocialLink(link: SocialLink): Promise<boolean> {
  try {
    const { $id, ...data } = link;
    await databases.updateDocument(DATABASE_ID, SOCIAL_LINKS_COLLECTION_ID, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating social link:', error);
    return false;
  }
}

export async function addSocialLink(link: Omit<SocialLink, '$id'>): Promise<boolean> {
    try {
      await databases.createDocument(DATABASE_ID, SOCIAL_LINKS_COLLECTION_ID, ID.unique(), link);
      return true;
    } catch (error) {
      console.error('Error adding social link:', error);
      return false;
    }
  }
  
  export async function deleteSocialLink(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, SOCIAL_LINKS_COLLECTION_ID, id);
      return true;
    } catch (error) {
      console.error('Error deleting social link:', error);
      return false;
    }
  }

// Footer Links Functions
export async function fetchFooterLinks(): Promise<FooterLink[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, FOOTER_LINKS_COLLECTION_ID, [Query.orderAsc('order')]);
    return response.documents as unknown as FooterLink[];
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return [];
  }
}

export async function updateFooterLink(link: FooterLink): Promise<boolean> {
  try {
    const { $id, ...data } = link;
    await databases.updateDocument(DATABASE_ID, FOOTER_LINKS_COLLECTION_ID, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating footer link:', error);
    return false;
  }
}

export async function addFooterLink(link: Omit<FooterLink, '$id'>): Promise<boolean> {
    try {
      await databases.createDocument(DATABASE_ID, FOOTER_LINKS_COLLECTION_ID, ID.unique(), link);
      return true;
    } catch (error) {
      console.error('Error adding footer link:', error);
      return false;
    }
  }
  
  export async function deleteFooterLink(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, FOOTER_LINKS_COLLECTION_ID, id);
      return true;
    } catch (error) {
      console.error('Error deleting footer link:', error);
      return false;
    }
  }

// Alias for backward compatibility
export const fetchFooterData = fetchCompanyInfo;
