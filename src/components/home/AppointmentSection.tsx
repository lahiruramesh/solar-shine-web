import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { fetchAvailableTimeSlots, createAppointment } from '@/services/appointmentService';
import { cn } from '@/lib/utils';

const AppointmentSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<{ $id: string, time_slot: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    timeSlot: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch available time slots when a date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setIsLoading(true);
      try {
      // const slots = await fetchAvailableTimeSlots(format(selectedDate, 'MM/dd/yyyy'));
        const slots = [
          {
            $id: "68a7278d0016cd1bafb6",
            date: "2025-08-24T01:04:00Z",
            is_booked: false,
            time_slot: "10:00 AM - 11:00 AM",
          },
          {
            $id: "68a726be00296c3b8386",
            date: "2025-08-24T03:03:00Z",
            is_booked: false,
            time_slot: "11:00 AM - 12:00 PM",
          },
          {
            $id: "68a72603003912078341",
            date: "2025-08-21T12:57:00Z",
            is_booked: true,
            time_slot: "12:00 PM - 01:00 PM",
          },
        ];
        setAvailableTimeSlots(slots.map(s => ({ $id: s.$id, time_slot: s.time_slot })));
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to fetch available time slots');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.service || !selectedDate || !formData.timeSlot) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const appointmentData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time_slot: formData.timeSlot,
        message: formData.message,
      };

      await createAppointment(appointmentData);

      setFormData({
        name: '',
        phone: '',
        email: '',
        service: '',
        timeSlot: '',
        message: ''
      });
      setSelectedDate(undefined);

      toast.success('Appointment booked successfully! We will contact you shortly.');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="appointment-section" className="section bg-brand-dark text-white">
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
          <form onSubmit={handleSubmit}>
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
                    value={formData.name}
                    onChange={handleInputChange}
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
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                  value={formData.service}
                  onChange={handleInputChange}
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-10 pr-4 py-6 h-auto justify-start text-left font-normal border border-gray-300 rounded-md",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Select a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Preferred Time */}
              <div className="form-group">
                <label htmlFor="timeSlot" className="block text-sm font-medium mb-2">Preferred Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-gray-400" />
                  </div>
                  <select
                    id="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={!selectedDate || isLoading || availableTimeSlots.length === 0}
                  >
                    <option value="">
                      {isLoading
                        ? 'Loading time slots...'
                        : !selectedDate
                          ? 'Select a date first'
                          : availableTimeSlots.length === 0
                            ? 'No available slots for this date'
                            : 'Select a time'}
                    </option>
                    {availableTimeSlots.map(slot => (
                      <option key={slot.$id} value={slot.$id}>
                        {slot.time_slot}
                      </option>
                    ))}
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
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Tell us about your project or any specific requirements..."
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                className="w-full bg-primary text-black hover:bg-primary/90 py-3"
                type="submit"
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
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
