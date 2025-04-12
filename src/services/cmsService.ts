
import { supabase } from '@/integrations/supabase/client';
import { 
  HeroSection, 
  ServiceCard, 
  Project, 
  Testimonial, 
  BlogPost,
  GlobalSettings
} from '@/types/payload-types';

export async function fetchHeroSection(): Promise<HeroSection> {
  const { data, error } = await supabase
    .from('hero_sections')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching hero section:', error);
    throw error;
  }
  
  // Provide default placeholder image if none exists
  return {
    title: data.title,
    subtitle: data.subtitle,
    backgroundImage: data.background_image || 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    ctaText: data.cta_text,
    ctaLink: data.cta_link
  };
}

export async function fetchServiceCards(): Promise<ServiceCard[]> {
  const { data, error } = await supabase
    .from('service_cards')
    .select('*');
  
  if (error) {
    console.error('Error fetching service cards:', error);
    throw error;
  }
  
  return data.map(card => ({
    id: card.id,
    title: card.title,
    description: card.description,
    icon: card.icon || 'zap' // Default icon if none provided
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*');
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
  
  return data.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category as 'Residential' | 'Commercial' | 'Industrial',
    description: project.description,
    image: project.image || 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Default placeholder
    client: project.client,
    completionDate: project.completion_date
  }));
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*');
  
  if (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
  
  return data.map(testimonial => ({
    id: testimonial.id,
    text: testimonial.text,
    author: testimonial.author,
    position: testimonial.position || ''
  }));
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*');
  
  if (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
  
  return data.map(post => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    author: post.author,
    publishDate: post.publish_date,
    coverImage: post.cover_image || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', // Default placeholder
    slug: post.slug
  }));
}

export async function fetchGlobalSettings(): Promise<GlobalSettings> {
  const { data, error } = await supabase
    .from('global_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching global settings:', error);
    throw error;
  }
  
  return {
    siteName: data.site_name,
    logo: data.logo || '/logo.svg', // Default logo if missing
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone
  };
}
