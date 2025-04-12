
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import ServiceCards from '@/components/home/ServiceCards';
import SpecializedAreas from '@/components/home/SpecializedAreas';
import ProjectsShowcase from '@/components/home/ProjectsShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import AppointmentSection from '@/components/home/AppointmentSection';

const Index: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
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
