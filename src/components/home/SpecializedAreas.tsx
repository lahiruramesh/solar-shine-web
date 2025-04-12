
import React from 'react';
import { motion } from 'framer-motion';

// In a real implementation, these would come from the CMS
const specializationData = {
  title: 'Areas We Specialize In',
  description: 'Our expert team provides sustainable solar solutions across residential, commercial, and industrial sectors throughout Sri Lanka, reducing energy costs while benefiting the environment.',
  images: [
    'https://images.unsplash.com/photo-1583302210488-fb8fe6eff6b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1588006173041-4cdc0f68e21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  ]
};

const SpecializedAreas: React.FC = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{specializationData.title}</h2>
            <p className="text-brand-gray text-lg">{specializationData.description}</p>
            <div className="mt-8">
              <a 
                href="/what-we-do" 
                className="btn-primary inline-block"
              >
                Learn More About Our Work
              </a>
            </div>
          </motion.div>

          {/* Overlapping Images */}
          <motion.div 
            className="relative h-[400px] md:h-[500px] mx-auto"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-4/5 h-4/5 z-10">
              <img 
                src={specializationData.images[0]} 
                alt="Solar installation worker" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-4/5 h-4/5 border-8 border-primary rounded-lg">
              <img 
                src={specializationData.images[1]} 
                alt="Solar panel installation" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SpecializedAreas;
