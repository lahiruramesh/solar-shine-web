
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavbarEditor from './content-editors/NavbarEditor';
import FooterEditor from './content-editors/FooterEditor';
import HeroEditor from './content-editors/HeroEditor';
import ServicesEditor from './content-editors/ServicesEditor';
import ProjectsEditor from './content-editors/ProjectsEditor';
import TestimonialsEditor from './content-editors/TestimonialsEditor';
import AboutEditor from './content-editors/AboutEditor';

const ContentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('navigation');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>Edit website content for different sections and pages.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-6">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="navigation">
            <NavbarEditor />
          </TabsContent>
          
          <TabsContent value="footer">
            <FooterEditor />
          </TabsContent>
          
          <TabsContent value="home">
            <HeroEditor />
          </TabsContent>
          
          <TabsContent value="about">
            <AboutEditor />
          </TabsContent>
          
          <TabsContent value="services">
            <ServicesEditor />
          </TabsContent>
          
          <TabsContent value="projects">
            <ProjectsEditor />
          </TabsContent>
          
          <TabsContent value="testimonials">
            <TestimonialsEditor />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentSection;
