
export interface GlobalSettings {
  siteName: string;
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
}

export interface HeroSection {
  id?: string;
  title: string;
  subtitle: string | null;
  backgroundImage: string | null;
  ctaText: string | null;
  ctaLink: string | null;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
}

export interface SpecializedArea {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
}

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  description: string | null;
  image: string | null;
  client: string | null;
  completionDate: string | null;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  position: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  publishDate: string | null;
  coverImage: string | null;
  slug: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  order: number;
}

export interface SocialLink {
  id: string;
  name: string;
  icon: string;
  url: string;
}

export interface FooterLink {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
}

export interface AboutContent {
  id:string;
  title: string;
  subtitle: string;
  content: string;
  mainImage: string | null;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  imageOne: string | null;
  imageTwo: string | null;
}
