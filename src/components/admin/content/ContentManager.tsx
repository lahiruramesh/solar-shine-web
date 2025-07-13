import React from 'react';
import { HeroSectionManager } from './HeroSectionManager';
import { ServicesManager } from './ServicesManager';
import { ProjectsManager } from './ProjectsManager';
import { BlogManager } from './BlogManager';
import { TestimonialsManager } from './TestimonialsManager';
import { SpecializedAreasManager } from './SpecializedAreasManager';
import { AboutContentManager } from './AboutContentManager';

interface ContentManagerProps {
  activeSection: string;
}

export const ContentManager: React.FC<ContentManagerProps> = ({ activeSection }) => {
  const renderContent = () => {
    switch (activeSection) {
      case 'hero':
        return <HeroSectionManager />;
      case 'services':
        return <ServicesManager />;
      case 'projects':
        return <ProjectsManager />;
      case 'blog':
        return <BlogManager />;
      case 'specialized-areas':
        return <SpecializedAreasManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'about':
        return <AboutContentManager />;
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Select a section from the sidebar to manage content.
          </div>
        );
    }
  };

  return <div>{renderContent()}</div>;
};
