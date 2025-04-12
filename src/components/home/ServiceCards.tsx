
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sun, PieChart, BarChart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// In a real project, these would come from the CMS
const services = [
  {
    id: 1,
    title: 'Solar Panel Installation',
    description: 'Professional installation of high-efficiency solar panels for residential and commercial properties.',
    icon: Sun,
    color: 'bg-primary',
  },
  {
    id: 2,
    title: 'Energy Consultation',
    description: 'Expert advice on renewable energy solutions tailored to your specific needs and goals.',
    icon: PieChart,
    color: 'bg-brand-black',
  },
  {
    id: 3,
    title: 'System Maintenance',
    description: 'Regular maintenance and servicing to ensure optimal performance of your solar energy system.',
    icon: BarChart,
    color: 'bg-primary',
  },
  {
    id: 4,
    title: 'Power Optimization',
    description: 'Advanced solutions to maximize energy efficiency and reduce power consumption costs.',
    icon: Zap,
    color: 'bg-brand-black',
  },
];

const ServiceCards: React.FC = () => {
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
            {services.map((service) => (
              <motion.div 
                key={service.id}
                className="min-w-[300px] max-w-[350px] bg-white rounded-lg shadow-lg p-6 flex flex-col h-[280px] snap-center"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.id * 0.1 }}
              >
                <div className={`${service.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="text-white" size={28} />
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
