
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchSpecializedAreas } from '@/services/cmsService';
import { Skeleton } from '@/components/ui/skeleton';
import { getImageWithCacheBusting } from '@/services/serviceUtils';

const SpecializedAreas: React.FC = () => {
  const { data: areas, isLoading, error } = useQuery({
    queryKey: ['specializedAreas'],
    queryFn: fetchSpecializedAreas
  });
  
  // Default content in case of error or while loading
  const defaultTitle = "Our Specialized Areas";
  const defaultDescription = "We provide specialized solar solutions across different sectors, each tailored to specific energy requirements and environmental conditions.";
  
  // Use a placeholder if there's an error or no data
  const hasData = !isLoading && !error && areas && areas.length > 0;
  
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-brand-light">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {hasData && areas[0]?.title ? areas[0].title : defaultTitle}
          </h2>
          <p className="text-brand-gray max-w-3xl mx-auto">
            {hasData && areas[0]?.description ? areas[0].description : defaultDescription}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {isLoading ? (
            // Loading skeletons
            Array(3).fill(null).map((_, idx) => (
              <div key={`loading-${idx}`} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))
          ) : hasData ? (
            // Map through actual data
            areas.map((area, index) => (
              <motion.div
                key={area.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={area.image || 'https://images.unsplash.com/photo-1559081286-70366a286898?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={area.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                  <p className="text-brand-gray">{area.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback content
            <>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Residential Solar" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Residential Solar</h3>
                  <p className="text-brand-gray">Custom solar solutions for homeowners, designed to maximize energy savings while enhancing property value.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1553817684-776078ebc7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Commercial Solar" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Commercial Solar</h3>
                  <p className="text-brand-gray">Comprehensive solar energy systems for businesses and commercial properties, reducing operational costs.</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Industrial Solar" 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">Industrial Solar</h3>
                  <p className="text-brand-gray">Large-scale solar installations for industrial facilities, providing sustainable power for manufacturing operations.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpecializedAreas;
