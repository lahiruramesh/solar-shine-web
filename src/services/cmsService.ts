
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
  
  return {
    title: data.title,
    subtitle: data.subtitle,
    backgroundImage: data.background_image,
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
    icon: card.icon
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
    image: project.image,
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
    position: testimonial.position
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
    coverImage: post.cover_image,
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
    logo: data.logo,
    primaryColor: data.primary_color,
    secondaryColor: data.secondary_color,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone
  };
}

// New functions for appointment management
export interface AppointmentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time_slot: string;
  message?: string;
  status: string;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time_slot: string;
  is_booked: boolean;
}

export async function fetchAppointments(): Promise<AppointmentData[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return data;
}

export async function fetchAvailableTimeSlots(date?: string): Promise<TimeSlot[]> {
  let query = supabase
    .from('available_time_slots')
    .select('*')
    .eq('is_booked', false);
  
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
  
  return data;
}

export async function addAvailableTimeSlot(date: string, timeSlot: string): Promise<boolean> {
  const { error } = await supabase
    .from('available_time_slots')
    .insert({ date, time_slot: timeSlot });
  
  if (error) {
    console.error('Error adding time slot:', error);
    return false;
  }
  
  return true;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
  
  return true;
}
