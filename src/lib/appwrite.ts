import { Client, Databases, Storage, Permission, Role, ID, Query, Account } from "appwrite";

const endpoint =  import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const storageBucketId = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

if (!endpoint || !projectId) {
  throw new Error("Appwrite endpoint or project ID is not defined in environment variables.");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

// For Node.js environments, Account might not be directly accessible
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs
export const DATABASE_ID = databaseId || 'main';
export const STORAGE_BUCKET_ID = storageBucketId || 'media';

// Collection IDs
export const COLLECTIONS = {
  GLOBAL_SETTINGS: 'global_settings',
  HERO_SECTION: 'hero_section',
  SERVICE_CARDS: 'service_cards',
  SPECIALIZED_AREAS: 'specialized_areas',
  PROJECTS: 'projects',
  TESTIMONIALS: 'testimonials',
  BLOG_POSTS: 'blog_posts',
  NAVIGATION_ITEMS: 'navigation_items',
  SOCIAL_LINKS: 'social_links',
  FOOTER_LINKS: 'footer_links',
  COMPANY_INFO: 'company_info',
  ABOUT_CONTENT: 'about_content',
  APPOINTMENTS: 'appointments',
  AVAILABLE_TIME_SLOTS: 'available_time_slots',
  SEO_SETTINGS: 'seo_settings',
  PAGE_SEO: 'page_seo',
};

export { client, account, databases, storage, Permission, Role, ID, Query };