
import { supabase } from '@/integrations/supabase/client';
import { CompanyInfo, SocialLink, FooterLink } from '@/types/payload-types';

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

// Alias for backward compatibility
export const fetchFooterData = fetchCompanyInfo;
