export interface GlobalSettings {
  site_title: string;
  site_description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}

export interface HeroSection {
  $id?: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cta_text: string | null;
  cta_url: string | null;
  background_image: string | null;
}

export interface ServicesBanner {
  $id?: string;
  title: string;
  subtitle: string | null;
  background_image: string | null;
}

export interface ServiceCard {
  $id: string;
  title: string;
  description: string | null;
  link_url?: string;
  order_index?: number;
  // Additional fields to match hardcoded services
  image?: string | null;
  benefits?: string[];
  features?: string[]; // Store as formatted strings: "Name: Description"
  service_type?: 'main' | 'additional'; // To distinguish between main services and additional services
}

export interface SpecializedArea {
  $id: string;
  title: string;
  description: string | null;
  image: string | null;
  order: number | null;
}

export interface Project {
  $id: string;
  title: string;
  category: string; // Allow dynamic categories
  description: string | null;
  image_url: string | null;
  client: string | null;
  completion_date: string | null; // Match the field name used in Projects page
}

export interface Testimonial {
  $id: string;
  text: string;
  author: string;
  position: string | null;
  company?: string;
  rating?: number;
}

export interface BlogPost {
  $id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author?: string;
  publishDate?: string;
  published?: boolean;
  featured_image?: string; // URL for display
  featured_image_id?: string; // ID for storage
  categories?: string[];
  tags?: string[];
}

export interface NavigationItem {
  $id: string;
  title: string;
  path: string;
  order: number;
}

export interface SocialLink {
  $id: string;
  name: string;
  icon: string;
  url: string;
  order?: number;
}

export interface FooterLink {
  $id: string;
  name: string;
  url: string;
  category: string;
}

export interface CompanyInfo {
  $id: string;
  name: string;
  description: string;
  website?: string;
  logo_url?: string;
  businessHours?: string;
}

export interface AboutContent {
  $id:string;
  title: string;
  subtitle: string;
  content: string;
  mission_statement?: string;
  vision_statement?: string;
  main_image?: string;
  main_image_id?: string;
  image_one?: string;
  image_one_id?: string;
  image_two?: string;
  image_two_id?: string;
  team_members?: { name: string; position: string; bio: string; image_id?: string; image?: string }[];
}

export interface SEO {
  $id: string;
  title: string;
  description: string;
  keywords: string[];
  robots: string;
  canonical: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
}
