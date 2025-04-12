
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';

const AppointmentSection: React.FC = () => {
  return (
    <section className="section bg-brand-dark text-white">
      <div className="container-custom">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book an Appointment</h2>
          <p className="text-white/80 mb-8">
            Schedule a free consultation with our solar experts to discuss your energy needs and discover the best solar solutions for your property.
          </p>
        </motion.div>

        <motion.div 
          className="bg-white text-brand-dark rounded-xl p-6 md:p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="form-group">
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="form-group">
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your email address"
                    required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div className="form-group">
                <label htmlFor="service" className="block text-sm font-medium mb-2">Service Interested In</label>
                <select
                  id="service"
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
                  required
                >
                  <option value="">Select a service</option>
                  <option value="residential">Residential Solar Installation</option>
                  <option value="commercial">Commercial Solar Solutions</option>
                  <option value="maintenance">Maintenance & Repair</option>
                  <option value="consultation">Energy Consultation</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div className="form-group">
                <label htmlFor="date" className="block text-sm font-medium mb-2">Preferred Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div className="form-group">
                <label htmlFor="time" className="block text-sm font-medium mb-2">Preferred Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="time"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a time</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 3PM)</option>
                    <option value="evening">Evening (3PM - 6PM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="form-group mt-6">
              <label htmlFor="message" className="block text-sm font-medium mb-2">Additional Information</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <MessageSquare size={18} className="text-gray-400" />
                </div>
                <textarea
                  id="message"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your project or any specific requirements..."
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button className="w-full bg-primary text-black hover:bg-primary/90 py-3" type="submit">
                Book Appointment
              </Button>
              <p className="text-xs text-center text-brand-gray mt-2">
                We'll get back to you within 24 hours to confirm your appointment.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default AppointmentSection;
