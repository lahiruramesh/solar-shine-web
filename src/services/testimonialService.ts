
import { supabase } from '@/integrations/supabase/client';
import { Testimonial } from '@/types/payload-types';

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
