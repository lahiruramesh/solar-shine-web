import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { CompanyInfo, SocialLink, FooterLink } from '@/types/payload-types';

// Company Info Functions
export async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMPANY_INFO, [Query.limit(1)]);
    return response.documents.length > 0 ? response.documents[0] as unknown as CompanyInfo : null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  try {
    const { $id, ...data } = info;
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.COMPANY_INFO, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
}

// Social Links Functions
export async function fetchSocialLinks(): Promise<SocialLink[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SOCIAL_LINKS, [Query.orderAsc('order')]);
    return response.documents as unknown as SocialLink[];
  } catch (error) {
    console.error('Error fetching social links:', error);
    return [];
  }
}

export async function updateSocialLink(link: SocialLink): Promise<boolean> {
  try {
    const { $id, ...data } = link;
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.SOCIAL_LINKS, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating social link:', error);
    return false;
  }
}

export async function addSocialLink(link: Omit<SocialLink, '$id'>): Promise<boolean> {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.SOCIAL_LINKS, ID.unique(), link);
      return true;
    } catch (error) {
      console.error('Error adding social link:', error);
      return false;
    }
  }
  
  export async function deleteSocialLink(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.SOCIAL_LINKS, id);
      return true;
    } catch (error) {
      console.error('Error deleting social link:', error);
      return false;
    }
  }

// Footer Links Functions
export async function fetchFooterLinks(): Promise<FooterLink[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.FOOTER_LINKS, [Query.orderAsc('order')]);
    return response.documents as unknown as FooterLink[];
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return [];
  }
}

export async function updateFooterLink(link: FooterLink): Promise<boolean> {
  try {
    const { $id, ...data } = link;
    await databases.updateDocument(DATABASE_ID, COLLECTIONS.FOOTER_LINKS, $id, data);
    return true;
  } catch (error) {
    console.error('Error updating footer link:', error);
    return false;
  }
}

export async function addFooterLink(link: Omit<FooterLink, '$id'>): Promise<boolean> {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTIONS.FOOTER_LINKS, ID.unique(), link);
      return true;
    } catch (error) {
      console.error('Error adding footer link:', error);
      return false;
    }
  }
  
  export async function deleteFooterLink(id: string): Promise<boolean> {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.FOOTER_LINKS, id);
      return true;
    } catch (error) {
      console.error('Error deleting footer link:', error);
      return false;
    }
  }

// Alias for backward compatibility
export const fetchFooterData = fetchCompanyInfo;
