import { databases, storage } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { BlogPost } from '@/types/payload-types';
import { createSlug } from '@/lib/utils';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_BLOG_POSTS_COLLECTION_ID;
const BUCKET_ID = import.meta.env.VITE_APPWRITE_IMAGES_BUCKET_ID;

function mapDocumentToBlogPost(doc: any): BlogPost {
  const imageUrl = doc.featured_image_id ? (storage.getFilePreview(BUCKET_ID, doc.featured_image_id) as any).href : undefined;
  return {
    ...doc,
    $id: doc.$id,
    featured_image: imageUrl,
    featured_image_id: doc.featured_image_id,
    publishDate: doc.publishDate ? new Date(doc.publishDate).toISOString() : undefined,
  } as unknown as BlogPost;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc('publishDate')
    ]);
    return response.documents.map(mapDocumentToBlogPost);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('slug', slug)
      ]);
      if (response.documents.length > 0) {
        return mapDocumentToBlogPost(response.documents[0]);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching blog post by slug ${slug}:`, error);
      throw error;
    }
  }

export async function uploadBlogImage(imageFile: File): Promise<string> {
    const fileResponse = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
    return fileResponse.$id;
}

export async function createBlogPost(postData: Partial<Omit<BlogPost, '$id' | 'featured_image'>>): Promise<string | null> {
    try {
        const dataToSave = {
            ...postData,
            slug: postData.slug || createSlug(postData.title!),
        };

        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), dataToSave);
        return response.$id;
    } catch (error) {
        console.error('Error creating blog post:', error);
        return null;
    }
}

export async function updateBlogPost(id: string, postData: Partial<Omit<BlogPost, '$id' | 'featured_image'>>): Promise<boolean> {
  try {
    const oldPost = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
    const oldImageId = oldPost.featured_image_id as string | undefined;

    // If a new image is being set, and it's different from the old one, delete the old one.
    if (postData.featured_image_id && postData.featured_image_id !== oldImageId && oldImageId) {
        await storage.deleteFile(BUCKET_ID, oldImageId);
    }

    const { title, slug, excerpt, content, author, publishDate, featured_image_id, categories, tags } = postData;
    const dataToUpdate = { title, slug, excerpt, content, author, publishDate, featured_image_id, categories, tags };
    
    // Appwrite expects null for empty optional fields, not undefined.
    for (const key in dataToUpdate) {
      if ((dataToUpdate as any)[key] === undefined) {
        (dataToUpdate as any)[key] = null;
      }
    }

    await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, dataToUpdate);
    return true;
  } catch (error) {
    console.error('Error updating blog post:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
    try {
        const post = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        if (post.featured_image_id) {
            await storage.deleteFile(BUCKET_ID, post.featured_image_id as string);
        }
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
        return true;
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return false;
    }
}
