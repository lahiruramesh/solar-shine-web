
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuoteIcon } from 'lucide-react';

// In a real implementation, these would come from the CMS
const testimonials = [
  {
    id: 1,
    text: "Working with this solar company has been a remarkable experience. Their team's professionalism and expertise made the entire installation process smooth. Our energy bills have significantly reduced, and we're proud to be contributing to a greener Sri Lanka.",
    author: "Lakshmi Perera",
    position: "Homeowner, Colombo"
  },
  {
    id: 2,
    text: "As a business owner, I was concerned about the transition to solar energy, but their team provided excellent consultation and a tailored solution for our commercial needs. The installation was completed on schedule, and the results have exceeded our expectations.",
    author: "Rajan Mendis",
    position: "Business Owner, Kandy"
  },
  {
    id: 3,
    text: "The solar panels installed by this team have been operating flawlessly for over two years now. Their maintenance service is prompt, and the support team is always ready to assist. I highly recommend their services to anyone looking for reliable solar solutions.",
    author: "Amali Fernando",
    position: "Property Manager, Galle"
  }
];

const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrent(index);
  };

  return (
    <section className="section bg-white py-20">
      <div className="container-custom max-w-4xl mx-auto">
        <h2 className="section-title">What Our Clients Say</h2>
        
        <div className="mt-12 relative h-[300px] md:h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[current].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute w-full"
            >
              <div className="bg-brand-light rounded-xl p-8 text-center relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary rounded-full p-3">
                  <QuoteIcon className="text-white" size={24} />
                </div>
                <p className="text-lg text-brand-dark mt-4 italic">"{testimonials[current].text}"</p>
                <div className="mt-6">
                  <p className="font-bold text-lg">{testimonials[current].author}</p>
                  <p className="text-brand-gray">{testimonials[current].position}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Dots navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                current === index ? 'bg-primary' : 'bg-gray-300'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
