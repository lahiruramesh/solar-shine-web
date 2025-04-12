
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sun, PieChart, BarChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceCard } from '@/types/payload-types';

// Map of icon names to Lucide React components
const iconMap: Record<string, React.ElementType> = {
  'solar-panel': Sun,
  'lightbulb': PieChart,
  'tool': BarChart,
  'zap': Zap,
};

interface ServiceCardsProps {
  services: ServiceCard[];
}

const ServiceCards: React.FC<ServiceCardsProps> = ({ services }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="section bg-brand-light">
      <div className="container-custom">
        <h2 className="section-title">Our Services</h2>
        <p className="section-subtitle">
          We provide comprehensive solar energy solutions to meet your renewable energy goals.
        </p>

        <div className="relative mt-12">
          {/* Navigation Buttons */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition md:-left-5 hidden md:block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition md:-right-5 hidden md:block"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Service Cards Container */}
          <div 
            ref={containerRef} 
            className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => {
              // Default to Sun icon if the icon string doesn't match any in our map
              const IconComponent = iconMap[service.icon] || Sun;
              const cardColor = index % 2 === 0 ? 'bg-primary' : 'bg-brand-black';
              
              return (
                <motion.div 
                  key={service.id}
                  className="min-w-[300px] max-w-[350px] bg-white rounded-lg shadow-lg p-6 flex flex-col h-[280px] snap-center"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`${cardColor} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-brand-gray flex-grow">{service.description}</p>
                  <a 
                    href={`/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-primary font-medium mt-4 flex items-center hover:underline"
                  >
                    Learn More
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
