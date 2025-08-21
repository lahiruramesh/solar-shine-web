import { databases, storage, DATABASE_ID, STORAGE_BUCKET_ID, COLLECTIONS, ID, Query } from '@/lib/appwrite';
import { CompanyInfo } from '@/types/payload-types';
import { prepareAppwriteData } from '@/lib/utils';

export const fetchCompanyInfo = async (): Promise<CompanyInfo | null> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.COMPANY_INFO,
      [Query.limit(1)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      return {
        $id: doc.$id,
        name: doc.name || '',
        description: doc.description || '',
        address: doc.address || '',
        email: doc.email || '',
        phone: doc.phone || '',
        website: doc.website || '',
        city: doc.city || '',
        state: doc.state || '',
        zipCode: doc.zipCode || '',
        country: doc.country || '',
        businessHours: doc.businessHours || '',
        facebook: doc.facebook || '',
        linkedin: doc.linkedin || '',
        additionalInfo: doc.additionalInfo || '',
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching company info:', error);
    return null;
  }
};

export const updateCompanyInfo = async (companyData: CompanyInfo): Promise<boolean> => {
  try {
    // Get the existing company info to check the ID
    const existingCompany = await fetchCompanyInfo();
    const id = existingCompany?.$id;

    // Prepare the data for Appwrite
    const dbData = prepareAppwriteData({
      name: companyData.name,
      description: companyData.description,
      address: companyData.address,
      email: companyData.email,
      phone: companyData.phone,
      website: companyData.website,
      city: companyData.city,
      state: companyData.state,
      zipCode: companyData.zipCode,
      country: companyData.country,
      businessHours: companyData.businessHours,
      facebook: companyData.facebook,
      linkedin: companyData.linkedin,
      additionalInfo: companyData.additionalInfo,
    });

    if (Object.keys(dbData).length === 0) {
      console.warn('No valid fields to update for company info');
      return false;
    }

    try {
      if (id) {
        // Update existing company info
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.COMPANY_INFO, id, dbData);
      } else {
        // Create new company info
        if (!dbData.name || !dbData.email) {
          console.error('Name and email are required for creating new company info');
          return false;
        }
        await databases.createDocument(DATABASE_ID, COLLECTIONS.COMPANY_INFO, ID.unique(), dbData);
      }
      return true;
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return false;
    }
  } catch (error) {
    console.error('Error updating company info:', error);
    return false;
  }
};

export const createCompanyInfo = async (companyData: Omit<CompanyInfo, '$id'>): Promise<CompanyInfo | null> => {
  try {
    const dbData = prepareAppwriteData({
      name: companyData.name,
      description: companyData.description,
      address: companyData.address,
      email: companyData.email,
      phone: companyData.phone,
      website: companyData.website,
      city: companyData.city,
      state: companyData.state,
      zipCode: companyData.zipCode,
      country: companyData.country,
      businessHours: companyData.businessHours,
      facebook: companyData.facebook,
      linkedin: companyData.linkedin,
      additionalInfo: companyData.additionalInfo,
    });

    if (!dbData.name || !dbData.email) {
      throw new Error('Name and email are required');
    }

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.COMPANY_INFO,
      ID.unique(),
      dbData
    );

    return {
      $id: response.$id,
      name: response.name || '',
      description: response.description || '',
      address: response.address || '',
      email: response.email || '',
      phone: response.phone || '',
      website: response.website || '',
      city: response.city || '',
      state: response.state || '',
      zipCode: response.zipCode || '',
      country: response.country || '',
      businessHours: response.businessHours || '',
      facebook: response.facebook || '',
      linkedin: response.linkedin || '',
      additionalInfo: response.additionalInfo || '',
    };
  } catch (error) {
    console.error('Error creating company info:', error);
    return null;
  }
};
