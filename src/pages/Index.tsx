
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import SpecializedAreas from '@/components/home/SpecializedAreas';
import ProjectsShowcase from '@/components/home/ProjectsShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import AppointmentSection from '@/components/home/AppointmentSection';
import { HeroSection as HeroSectionType } from '@/types/payload-types';
import { fetchHeroSection } from '@/services/cmsService';

const Index: React.FC = () => {
  const [heroData, setHeroData] = useState<HeroSectionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const heroData = await fetchHeroSection();
        setHeroData(heroData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Header />
      <main>
        {heroData && <HeroSection data={heroData} />}
        <ServiceCards />
        <SpecializedAreas />
        <ProjectsShowcase />
        <TestimonialsSection />
        <BlogSection />
        <AppointmentSection />
      </main>
      <Footer />
    </>
  );
};

export default Index;
