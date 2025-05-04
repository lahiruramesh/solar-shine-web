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

// Hero Section Functions
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
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    backgroundImage: data.background_image,
    ctaText: data.cta_text,
    ctaLink: data.cta_link
  };
}

// Service Cards Functions
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

// Projects Functions
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

// Testimonials Functions
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

// Blog Posts Functions
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('publish_date', { ascending: false });
  
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

// Global Settings Functions
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

// Appointments Functions
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
  
  return data || [];
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
  
  return data || [];
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

// Navigation Functions
export async function fetchNavigationItems(): Promise<NavigationItem[]> {
  try {
    const { data, error } = await supabase
      .from('navigation_items')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('Error fetching navigation items:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      path: item.path,
      order: item.order
    }));
  } catch (error) {
    console.error('Error in fetchNavigationItems:', error);
    return [];
  }
}

export async function updateNavigationItem(item: NavigationItem): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('navigation_items')
      .update({
        title: item.title,
        path: item.path,
        order: item.order
      })
      .eq('id', item.id);
    
    if (error) {
      console.error('Error updating navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateNavigationItem:', error);
    return false;
  }
}

export async function addNavigationItem(item: { title: string; path: string }): Promise<boolean> {
  try {
    // Get the current max order value
    const { data: orderData, error: orderError } = await supabase
      .from('navigation_items')
      .select('order')
      .order('order', { ascending: false })
      .limit(1);
    
    if (orderError) {
      console.error('Error fetching navigation items for order:', orderError);
      return false;
    }
    
    const newOrder = (orderData && orderData.length > 0) ? orderData[0].order + 1 : 1;
    
    const { error } = await supabase
      .from('navigation_items')
      .insert({
        title: item.title,
        path: item.path,
        order: newOrder
      });
    
    if (error) {
      console.error('Error adding navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addNavigationItem:', error);
    return false;
  }
}

export async function deleteNavigationItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting navigation item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteNavigationItem:', error);
    return false;
  }
}

// Footer/Company Info Functions
export async function fetchFooterData(): Promise<CompanyInfo> {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
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
  } catch (error) {
    console.error('Error in fetchFooterData:', error);
    throw error;
  }
}

export async function fetchCompanyInfo(): Promise<CompanyInfo> {
  try {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .limit(1)
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
  } catch (error) {
    console.error('Error in fetchCompanyInfo:', error);
    throw error;
  }
}

export async function updateCompanyInfo(info: CompanyInfo): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('company_info')
      .update({
        name: info.name,
        description: info.description,
        address: info.address,
        email: info.email,
        phone: info.phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', info.id);
    
    if (error) {
      console.error('Error updating company info:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCompanyInfo:', error);
    return false;
  }
}

// Social Links Functions
export async function fetchSocialLinks(): Promise<SocialLink[]> {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*');
    
    if (error) {
      console.error('Error fetching social links:', error);
      throw error;
    }
    
    return (data || []).map(link => ({
      id: link.id,
      name: link.name,
      icon: link.icon,
      url: link.url
    }));
  } catch (error) {
    console.error('Error in fetchSocialLinks:', error);
    return [];
  }
}

export async function updateSocialLink(link: SocialLink): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('social_links')
      .update({
        name: link.name,
        icon: link.icon,
        url: link.url,
        updated_at: new Date().toISOString()
      })
      .eq('id', link.id);
    
    if (error) {
      console.error('Error updating social link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateSocialLink:', error);
    return false;
  }
}

export async function addSocialLink(link: { name: string; icon: string; url: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('social_links')
      .insert({
        name: link.name,
        icon: link.icon,
        url: link.url
      });
    
    if (error) {
      console.error('Error adding social link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addSocialLink:', error);
    return false;
  }
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting social link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteSocialLink:', error);
    return false;
  }
}

// Footer Links Functions
export async function fetchFooterLinks(): Promise<FooterLink[]> {
  try {
    const { data, error } = await supabase
      .from('footer_links')
      .select('*');
    
    if (error) {
      console.error('Error fetching footer links:', error);
      throw error;
    }
    
    return (data || []).map(link => ({
      id: link.id,
      name: link.name,
      url: link.url,
      category: link.category
    }));
  } catch (error) {
    console.error('Error in fetchFooterLinks:', error);
    return [];
  }
}

export async function updateFooterLink(link: FooterLink): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('footer_links')
      .update({
        name: link.name,
        url: link.url,
        category: link.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', link.id);
    
    if (error) {
      console.error('Error updating footer link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateFooterLink:', error);
    return false;
  }
}

export async function addFooterLink(link: { name: string; url: string; category: string }): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('footer_links')
      .insert({
        name: link.name,
        url: link.url,
        category: link.category
      });
    
    if (error) {
      console.error('Error adding footer link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in addFooterLink:', error);
    return false;
  }
}

export async function deleteFooterLink(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('footer_links')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting footer link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFooterLink:', error);
    return false;
  }
}

// Hero Section Update
export async function updateHeroSection(formData: FormData): Promise<boolean> {
  try {
    let backgroundImageUrl = '';
    const backgroundImage = formData.get('backgroundImage') as File;
    
    if (backgroundImage && backgroundImage instanceof File && backgroundImage.size > 0) {
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
  } catch (error) {
    console.error('Error in updateHeroSection:', error);
    return false;
  }
}

// Service Cards CRUD
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

// Projects CRUD
export async function updateProject(projectData: Project | FormData): Promise<boolean> {
  try {
    // Handle FormData case (with image)
    if (projectData instanceof FormData) {
      const projectId = projectData.get('id') as string;
      let imageUrl = '';
      
      // Handle image upload if present
      const projectImage = projectData.get('image') as File;
      
      if (projectImage && projectImage instanceof File && projectImage.size > 0) {
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
      
      // Create update object
      const updateData: any = {
        title: projectData.get('title') as string,
        description: projectData.get('description') as string,
        category: projectData.get('category') as string,
        client: projectData.get('client') as string,
        completion_date: projectData.get('completionDate') as string
      };
      
      // Only add image field if we have a new image
      if (imageUrl) {
        updateData.image = imageUrl;
      }
      
      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);
      
      if (error) {
        console.error('Error updating project with image:', error);
        return false;
      }
    } else {
      // Handle regular project update without image
      const { error } = await supabase
        .from('projects')
        .update({
          title: projectData.title,
          description: projectData.description,
          category: projectData.category,
          client: projectData.client,
          completion_date: projectData.completionDate
        })
        .eq('id', projectData.id);
      
      if (error) {
        console.error('Error updating project:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateProject:', error);
    return false;
  }
}

export async function addProject(formData: FormData): Promise<boolean> {
  let imageUrl = '';
  const projectImage = formData.get('image') as File;
  
  if (projectImage && projectImage instanceof File && projectImage.size > 0) {
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

// Testimonials CRUD
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

// About Content Functions
export async function fetchAboutContent(): Promise<AboutContent> {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching about content:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
      mainImage: data.main_image,
      missionTitle: data.mission_title,
      missionDescription: data.mission_description,
      visionTitle: data.vision_title,
      visionDescription: data.vision_description,
      imageOne: data.image_one,
      imageTwo: data.image_two
    };
  } catch (error) {
    console.error('Error in fetchAboutContent:', error);
    throw error;
  }
}

export async function updateAboutContent(formData: FormData): Promise<boolean> {
  try {
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
      const image = formData.get(field.formKey);
      
      if (image && image instanceof File && image.size > 0) {
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
    
    // Check if this is a create or update operation
    const id = formData.get('id');
    
    if (id) {
      // Update existing record
      const { error } = await supabase
        .from('about_content')
        .update(updateData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating about content:', error);
        return false;
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('about_content')
        .insert(updateData);
      
      if (error) {
        console.error('Error creating about content:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAboutContent:', error);
    return false;
  }
}

// Blog Posts CRUD functions
export async function createBlogPost(formData: FormData): Promise<string | null> {
  try {
    let coverImageUrl = '';
    const coverImage = formData.get('coverImage') as File;
    
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const fileName = `blog_${Date.now()}_${coverImage.name.replace(/\s/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, coverImage);
      
      if (uploadError) {
        console.error('Error uploading blog cover image:', uploadError);
        return null;
      }
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      coverImageUrl = urlData.publicUrl;
    }
    
    const title = formData.get('title') as string;
    const slug = createSlug(title);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: title,
        excerpt: formData.get('excerpt') as string,
        content: formData.get('content') as string,
        author: formData.get('author') as string,
        publish_date: formData.get('publishDate') as string,
        cover_image: coverImageUrl,
        slug: slug
      })
      .select();
    
    if (error) {
      console.error('Error creating blog post:', error);
      return null;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    return null;
  }
}

export async function updateBlogPost(id: string, formData: FormData): Promise<boolean> {
  try {
    const updateData: any = {
      title: formData.get('title') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      author: formData.get('author') as string,
      publish_date: formData.get('publishDate') as string
    };
    
    // If title changed, update slug
    const title = formData.get('title') as string;
    const originalTitle = formData.get('originalTitle') as string;
    if (title !== originalTitle) {
      updateData.slug = createSlug(title);
    }
    
    const coverImage = formData.get('coverImage') as File;
    if (coverImage && coverImage instanceof File && coverImage.size > 0) {
      const fileName = `blog_${Date.now()}_${coverImage.name.replace(/\s/g, '_')}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, coverImage);
      
      if (uploadError) {
        console.error('Error uploading blog cover image:', uploadError);
        return false;
      }
      
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      
      updateData.cover_image = urlData.publicUrl;
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating blog post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    return false;
  }
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    return false;
  }
}

// Helper function to create URL-friendly slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
