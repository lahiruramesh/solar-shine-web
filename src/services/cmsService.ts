import { supabase } from '@/integrations/supabase/client';
import { 
  HeroSection, 
  ServiceCard, 
  Project, 
  Testimonial, 
  BlogPost,
  GlobalSettings,
  NavigationItem,
  CompanyInfo,
  SocialLink,
  FooterLink,
  AboutContent
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

export async function fetchNavigationItems(): Promise<NavigationItem[]> {
  const { data, error } = await supabase
    .rpc('get_navigation_items')
    .select('id, title, path, order');
  
  if (error) {
    console.error('Error fetching navigation items:', error);
    throw error;
  }
  
  return data || [];
}

export async function updateNavigationItem(item: NavigationItem): Promise<boolean> {
  const { error } = await supabase
    .rpc('update_navigation_item', {
      item_id: item.id,
      item_title: item.title,
      item_path: item.path,
      item_order: item.order
    });
  
  if (error) {
    console.error('Error updating navigation item:', error);
    return false;
  }
  
  return true;
}

export async function addNavigationItem(item: { title: string; path: string }): Promise<boolean> {
  const { data: navItems, error: fetchError } = await supabase
    .rpc('get_max_navigation_order');
  
  if (fetchError) {
    console.error('Error fetching navigation items for order:', fetchError);
    return false;
  }
  
  const newOrder = navItems && navItems.length > 0 ? navItems[0].max_order + 1 : 1;
  
  const { error } = await supabase
    .rpc('add_navigation_item', {
      item_title: item.title,
      item_path: item.path,
      item_order: newOrder
    });
  
  if (error) {
    console.error('Error adding navigation item:', error);
    return false;
  }
  
  return true;
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .rpc('delete_navigation_item', {
      item_id: id
    });
  
  if (error) {
    console.error('Error deleting navigation item:', error);
    return false;
  }
  
  return true;
}

export async function fetchFooterData(): Promise<CompanyInfo> {
  const { data, error } = await supabase
    .rpc('get_company_info')
    .single();
  
  if (error) {
    console.error('Error fetching company info:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    address: data.address,
    email: data.email,
    phone: data.phone
  };
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  const { error } = await supabase
    .rpc('update_company_info', {
      company_id: info.id,
      company_name: info.name,
      company_description: info.description,
      company_address: info.address,
      company_email: info.email,
      company_phone: info.phone
    });
  
  if (error) {
    console.error('Error updating company info:', error);
    return false;
  }
  
  return true;
}

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .rpc('get_social_links');
  
  if (error) {
    console.error('Error fetching social links:', error);
    throw error;
  }
  
  return data || [];
}

export async function updateSocialLink(link: SocialLink): Promise<boolean> {
  const { error } = await supabase
    .rpc('update_social_link', {
      link_id: link.id,
      link_name: link.name,
      link_icon: link.icon,
      link_url: link.url
    });
  
  if (error) {
    console.error('Error updating social link:', error);
    return false;
  }
  
  return true;
}

export async function addSocialLink(link: { name: string; icon: string; url: string }): Promise<boolean> {
  const { error } = await supabase
    .rpc('add_social_link', {
      link_name: link.name,
      link_icon: link.icon,
      link_url: link.url
    });
  
  if (error) {
    console.error('Error adding social link:', error);
    return false;
  }
  
  return true;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  const { error } = await supabase
    .rpc('delete_social_link', {
      link_id: id
    });
  
  if (error) {
    console.error('Error deleting social link:', error);
    return false;
  }
  
  return true;
}

export async function fetchFooterLinks(): Promise<FooterLink[]> {
  const { data, error } = await supabase
    .rpc('get_footer_links');
  
  if (error) {
    console.error('Error fetching footer links:', error);
    throw error;
  }
  
  return data || [];
}

export async function updateFooterLink(link: FooterLink): Promise<boolean> {
  const { error } = await supabase
    .rpc('update_footer_link', {
      link_id: link.id,
      link_name: link.name,
      link_url: link.url,
      link_category: link.category
    });
  
  if (error) {
    console.error('Error updating footer link:', error);
    return false;
  }
  
  return true;
}

export async function addFooterLink(link: { name: string; url: string; category: string }): Promise<boolean> {
  const { error } = await supabase
    .rpc('add_footer_link', {
      link_name: link.name,
      link_url: link.url,
      link_category: link.category
    });
  
  if (error) {
    console.error('Error adding footer link:', error);
    return false;
  }
  
  return true;
}

export async function deleteFooterLink(id: string): Promise<boolean> {
  const { error } = await supabase
    .rpc('delete_footer_link', {
      link_id: id
    });
  
  if (error) {
    console.error('Error deleting footer link:', error);
    return false;
  }
  
  return true;
}

export async function updateHeroSection(formData: FormData): Promise<boolean> {
  let backgroundImageUrl = '';
  const backgroundImage = formData.get('backgroundImage') as File;
  
  if (backgroundImage && backgroundImage.size > 0) {
    const fileName = `hero_${Date.now()}_${backgroundImage.name.replace(/\s/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, backgroundImage);
    
    if (uploadError) {
      console.error('Error uploading hero background image:', uploadError);
      return false;
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    backgroundImageUrl = urlData.publicUrl;
  }
  
  const { error } = await supabase
    .from('hero_sections')
    .update({
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      cta_text: formData.get('ctaText') as string,
      cta_link: formData.get('ctaLink') as string,
      ...(backgroundImageUrl && { background_image: backgroundImageUrl })
    })
    .eq('id', formData.get('id') as string);
  
  if (error) {
    console.error('Error updating hero section:', error);
    return false;
  }
  
  return true;
}

export async function updateServiceCard(service: ServiceCard): Promise<boolean> {
  const { error } = await supabase
    .from('service_cards')
    .update({
      title: service.title,
      description: service.description,
      icon: service.icon
    })
    .eq('id', service.id);
  
  if (error) {
    console.error('Error updating service card:', error);
    return false;
  }
  
  return true;
}

export async function addServiceCard(service: { title: string; description: string; icon: string }): Promise<boolean> {
  const { error } = await supabase
    .from('service_cards')
    .insert(service);
  
  if (error) {
    console.error('Error adding service card:', error);
    return false;
  }
  
  return true;
}

export async function deleteServiceCard(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('service_cards')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service card:', error);
    return false;
  }
  
  return true;
}

export async function updateProject(project: Project): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .update({
      title: project.title,
      description: project.description,
      category: project.category,
      client: project.client,
      completion_date: project.completionDate
    })
    .eq('id', project.id);
  
  if (error) {
    console.error('Error updating project:', error);
    return false;
  }
  
  return true;
}

export async function addProject(formData: FormData): Promise<boolean> {
  let imageUrl = '';
  const projectImage = formData.get('image') as File;
  
  if (projectImage && projectImage.size > 0) {
    const fileName = `project_${Date.now()}_${projectImage.name.replace(/\s/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, projectImage);
    
    if (uploadError) {
      console.error('Error uploading project image:', uploadError);
      return false;
    }
    
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    imageUrl = urlData.publicUrl;
  }
  
  if (!imageUrl) {
    console.error('Failed to upload project image');
    return false;
  }
  
  const { error } = await supabase
    .from('projects')
    .insert({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      client: formData.get('client') as string,
      completion_date: formData.get('completionDate') as string,
      image: imageUrl
    });
  
  if (error) {
    console.error('Error adding project:', error);
    return false;
  }
  
  return true;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  
  return true;
}

export async function updateTestimonial(testimonial: Testimonial): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .update({
      text: testimonial.text,
      author: testimonial.author,
      position: testimonial.position
    })
    .eq('id', testimonial.id);
  
  if (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }
  
  return true;
}

export async function addTestimonial(testimonial: { text: string; author: string; position: string }): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .insert(testimonial);
  
  if (error) {
    console.error('Error adding testimonial:', error);
    return false;
  }
  
  return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }
  
  return true;
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

export async function fetchAboutContent(): Promise<AboutContent> {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching about content:', error);
    throw error;
  }
  
  return data;
}

export async function updateAboutContent(formData: FormData): Promise<boolean> {
  const updateData: any = {
    title: formData.get('title') as string,
    subtitle: formData.get('subtitle') as string,
    content: formData.get('content') as string,
    mission_title: formData.get('missionTitle') as string,
    mission_description: formData.get('missionDescription') as string,
    vision_title: formData.get('visionTitle') as string,
    vision_description: formData.get('visionDescription') as string
  };
  
  const imageFields = [
    { formKey: 'mainImage', dbKey: 'main_image' },
    { formKey: 'imageOne', dbKey: 'image_one' },
    { formKey: 'imageTwo', dbKey: 'image_two' }
  ];
  
  for (const field of imageFields) {
    const image = formData.get(field.formKey) as File;
    
    if (image && image.size > 0) {
      const fileName = `about_${field.formKey}_${Date.now()}_${image.name.replace(/\s/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, image);
      
      if (uploadError) {
        console.error(`Error uploading ${field.formKey}:`, uploadError);
        continue;
      }
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      updateData[field.dbKey] = urlData.publicUrl;
    }
  }
  
  const { error } = await supabase
    .from('about_content')
    .update(updateData)
    .eq('id', formData.get('id') as string);
  
  if (error) {
    console.error('Error updating about content:', error);
    return false;
  }
  
  return true;
}
