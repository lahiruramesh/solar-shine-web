
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// In a real project, these would come from the CMS
const heroData = {
  title: 'Powering a Sustainable Future',
  subtitle: 'Harnessing solar energy for a cleaner and brighter tomorrow across Sri Lanka.',
  cta: 'Book an Appointment',
  ctaLink: '/contact',
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
        <img 
          src={heroData.image} 
          alt="Solar Energy" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-20 pt-20 md:pt-0">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {heroData.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {heroData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-primary flex items-center gap-2 text-lg" asChild>
              <a href={heroData.ctaLink}>
                {heroData.cta}
                <ArrowRight size={18} />
              </a>
            </Button>
            <Button className="btn-outline border-white text-white hover:bg-white/20 flex items-center gap-2 text-lg" asChild>
              <a href="/services">
                Our Services
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
