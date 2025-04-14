
export interface GlobalSettings {
  siteName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Industrial';
  description: string;
  image: string;
  client: string;
  completionDate: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  position: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  coverImage: string;
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
  id: string;
  title: string;
  subtitle: string;
  content: string;
  mainImage: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  imageOne: string;
  imageTwo: string;
}
