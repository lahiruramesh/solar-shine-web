
import { supabase } from '@/integrations/supabase/client';
import { 
  HeroSection, 
  ServiceCard, 
  Project, 
  Testimonial, 
  BlogPost,
  GlobalSettings
} from '@/types/payload-types';

// This service will handle all CMS data fetching operations
// In a real implementation, these functions would fetch data from Supabase tables

export async function fetchHeroSection(): Promise<HeroSection> {
  // In a real implementation, you would fetch this from a Supabase table
  // For example: const { data, error } = await supabase.from('hero_sections').select('*').single();
  
  // For now, we return mock data
  return {
    title: 'Powering a Sustainable Future',
    subtitle: 'Harnessing solar energy for a cleaner and brighter tomorrow across Sri Lanka.',
    backgroundImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Book an Appointment',
    ctaLink: '/contact'
  };
}

export async function fetchServiceCards(): Promise<ServiceCard[]> {
  // In a real implementation, you would fetch this from a Supabase table
  return [
    {
      id: '1',
      title: 'Solar Panel Installation',
      description: 'Professional installation of high-efficiency solar panels for residential and commercial properties.',
      icon: 'solar-panel'
    },
    {
      id: '2',
      title: 'Energy Consultation',
      description: 'Expert advice on energy optimization and solar solutions tailored to your specific needs.',
      icon: 'lightbulb'
    },
    {
      id: '3',
      title: 'Maintenance Services',
      description: 'Regular maintenance and repair services to ensure your solar system operates at peak efficiency.',
      icon: 'tool'
    }
  ];
}

export async function fetchProjects(): Promise<Project[]> {
  // In a real implementation, you would fetch this from a Supabase table
  return [
    {
      id: '1',
      title: 'Luxury Villa Solar Installation',
      category: 'Residential',
      description: 'Complete solar power solution for a luxury beachfront villa in Galle.',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      client: 'Private Homeowner',
      completionDate: '2023-05-15'
    },
    {
      id: '2',
      title: 'Office Complex Energy Solution',
      category: 'Commercial',
      description: 'Comprehensive solar installation for a modern office complex in Colombo.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      client: 'Colombo Business Center',
      completionDate: '2023-03-10'
    },
    {
      id: '3',
      title: 'Manufacturing Plant Power Grid',
      category: 'Industrial',
      description: 'Large-scale solar power system for a manufacturing plant in Kandy.',
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      client: 'Sri Lanka Manufacturing Co.',
      completionDate: '2022-11-20'
    }
  ];
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  // In a real implementation, you would fetch this from a Supabase table
  return [
    {
      id: '1',
      text: 'The solar installation has reduced our energy costs by over 60%. The team was professional and completed the project ahead of schedule.',
      author: 'Priya Mendis',
      position: 'Homeowner, Colombo'
    },
    {
      id: '2',
      text: 'As a business owner, switching to solar has been one of the best decisions we\'ve made. The ROI has been remarkable and the service was excellent.',
      author: 'Rajiv Perera',
      position: 'CEO, Kandy Textiles'
    },
    {
      id: '3',
      text: 'The consultation service provided valuable insights that helped us optimize our energy usage. Highly recommended for any business.',
      author: 'Amali Fernando',
      position: 'Operations Manager, Galle Resort'
    }
  ];
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  // In a real implementation, you would fetch this from a Supabase table
  return [
    {
      id: '1',
      title: 'The Future of Solar Energy in Sri Lanka',
      excerpt: 'Exploring how solar power is transforming Sri Lanka\'s energy landscape.',
      content: 'Full content would go here...',
      author: 'Nimal Jayawardena',
      publishDate: '2023-06-15',
      coverImage: 'https://images.unsplash.com/photo-1566093097221-ac2335b08c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      slug: 'future-of-solar-energy-sri-lanka'
    },
    {
      id: '2',
      title: 'Solar Panel Maintenance Tips',
      excerpt: 'Essential maintenance practices to extend the life of your solar installation.',
      content: 'Full content would go here...',
      author: 'Kumari Silva',
      publishDate: '2023-05-22',
      coverImage: 'https://images.unsplash.com/photo-1585957191571-909d19d11587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      slug: 'solar-panel-maintenance-tips'
    },
    {
      id: '3',
      title: 'Cost Benefits of Solar Energy for Businesses',
      excerpt: 'How commercial solar installations can improve your bottom line.',
      content: 'Full content would go here...',
      author: 'Asela Gunasekara',
      publishDate: '2023-04-10',
      coverImage: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      slug: 'cost-benefits-solar-energy-businesses'
    }
  ];
}

export async function fetchGlobalSettings(): Promise<GlobalSettings> {
  // In a real implementation, you would fetch this from a Supabase table
  return {
    siteName: 'Solar Services',
    logo: '/logo.svg',
    primaryColor: '#f97316',
    secondaryColor: '#0ea5e9',
    contactEmail: 'info@solarservices.com',
    contactPhone: '+94 11 234 5678'
  };
}
