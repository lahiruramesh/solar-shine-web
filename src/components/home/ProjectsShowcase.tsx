
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// In a real implementation, these would come from the CMS
const projects = [
  {
    id: 1,
    title: 'ResidentialPlus Solar Installation',
    location: 'Colombo, Sri Lanka',
    description: 'A comprehensive solar power system for a luxury residential complex, providing clean energy for 50+ households.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/projects/residential-plus'
  },
  {
    id: 2,
    title: 'Commercial Mall Energy Solution',
    location: 'Kandy, Sri Lanka',
    description: 'Solar panel installation for a large shopping mall, reducing energy costs by 40% and providing sustainable power.',
    image: 'https://images.unsplash.com/photo-1611365892117-00d770df8a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/projects/commercial-mall'
  },
  {
    id: 3,
    title: 'Industrial Solar Farm',
    location: 'Galle, Sri Lanka',
    description: 'Large-scale solar farm development that powers multiple facilities in an industrial zone with renewable energy.',
    image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/projects/industrial-farm'
  },
  {
    id: 4,
    title: 'Agricultural Solar Integration',
    location: 'Anuradhapura, Sri Lanka',
    description: 'Solar power integration with agricultural systems, providing sustainable energy for irrigation and farming operations.',
    image: 'https://images.unsplash.com/photo-1591271955631-2e277e40e395?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '/projects/agricultural-solar'
  }
];

const ProjectsShowcase: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="section bg-brand-light relative overflow-hidden">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Our Featured Projects</h2>
            <p className="text-brand-gray mt-2">Explore our successful solar installations across Sri Lanka</p>
          </div>
          
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Project Cards Horizontal Scroll */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              className="min-w-[300px] md:min-w-[400px] bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 snap-center"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: project.id * 0.1 }}
            >
              <div className="h-48 md:h-60 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                <p className="text-primary text-sm font-medium mb-3">{project.location}</p>
                <p className="text-brand-gray mb-4 line-clamp-2">{project.description}</p>
                <a 
                  href={project.link} 
                  className="text-brand-black font-medium hover:text-primary transition-colors"
                >
                  View Project Details
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/projects" className="btn-outline inline-block">
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;
