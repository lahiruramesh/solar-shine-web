
import React from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types/payload-types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  return (
    <section className="section bg-brand-light">
      <div className="container-custom">
        <h2 className="section-title">What Our Clients Say</h2>
        <p className="section-subtitle">
          Hear from businesses and homeowners who have experienced the benefits of our solar solutions.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Quote className="absolute top-6 right-6 text-primary/20" size={40} />
              <p className="text-brand-gray mb-6 relative z-10">{testimonial.text}</p>
              <div className="mt-auto">
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-brand-gray">{testimonial.position || 'Client'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
