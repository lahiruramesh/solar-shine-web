import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { createAppointment, AppointmentData } from '@/services/appointmentService';

// In a real implementation, this would come from PayloadCMS
const contactData = {
  title: "Contact Us",
  subtitle: "Get in touch with our team for any inquiries about our solar services and solutions.",
  mainOffice: {
    address: "123 Solar Street, Colombo 05, Sri Lanka",
    phone: "+94 11 234 5678",
    email: "info@solarcompany.com",
    hours: "Monday - Friday: 8:30 AM - 5:30 PM"
  },
  locations: [
    {
      city: "Colombo",
      address: "123 Solar Street, Colombo 05",
      phone: "+94 11 234 5678"
    },
    {
      city: "Kandy",
      address: "45 Hill Road, Kandy",
      phone: "+94 81 234 5678"
    },
    {
      city: "Galle",
      address: "78 Beach Road, Galle",
      phone: "+94 91 234 5678"
    }
  ],
  formTitle: "Send Us a Message",
  formSubtitle: "Fill out the form below and our team will get back to you within 24 hours.",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585869027!2d79.7861542!3d6.9218374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1681631456018!5m2!1sen!2sus"
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  service: z.string().min(1, { message: "Please select a service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type FormValues = z.infer<typeof formSchema>;

const Contact: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const appointmentData: Omit<AppointmentData, '$id' | '$createdAt' | 'status'> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        service: data.service,
        message: data.message,
        date: new Date().toISOString(), // Or a selected date
        time_slot: 'not-specified', // Or a selected time slot
      };
      await createAppointment(appointmentData);
      alert("Thank you for your message! We will contact you soon.");
      form.reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      alert("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-brand-light to-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{contactData.title}</h1>
              <p className="text-xl text-brand-gray max-w-3xl mx-auto mb-12">
                {contactData.subtitle}
              </p>
            </motion.div>

            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Phone className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Phone</h3>
                    <p className="text-brand-gray">{contactData.mainOffice.phone}</p>
                    <a href={`tel:${contactData.mainOffice.phone}`} className="text-primary mt-2 hover:underline">
                      Call us
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Mail className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Email</h3>
                    <p className="text-brand-gray">{contactData.mainOffice.email}</p>
                    <a href={`mailto:${contactData.mainOffice.email}`} className="text-primary mt-2 hover:underline">
                      Email us
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <MapPin className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Address</h3>
                    <p className="text-brand-gray">{contactData.mainOffice.address}</p>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary mt-2 hover:underline"
                    >
                      Get directions
                    </a>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Clock className="text-primary" size={28} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Working Hours</h3>
                    <p className="text-brand-gray">{contactData.mainOffice.hours}</p>
                    <p className="text-brand-gray mt-1">Weekends: By appointment</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form and Map Section */}
        <section className="py-16 px-4">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-2">{contactData.formTitle}</h2>
                <p className="text-brand-gray mb-8">{contactData.formSubtitle}</p>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+94 XX XXX XXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="service"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Interested In</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="">Select a service</option>
                                <option value="residential">Residential Solar</option>
                                <option value="commercial">Commercial Solar</option>
                                <option value="industrial">Industrial Solar</option>
                                <option value="maintenance">Maintenance & Support</option>
                                <option value="consultation">Energy Consultation</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Please provide details about your project or inquiry..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <button
                      type="submit"
                      className="bg-primary text-black px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-all flex items-center"
                    >
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </button>
                  </form>
                </Form>
              </motion.div>
              
              {/* Map */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-2">Our Locations</h2>
                <p className="text-brand-gray mb-8">Visit us at one of our offices across Sri Lanka.</p>
                
                <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
                  <iframe 
                    src={contactData.mapEmbedUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Company office locations"
                  ></iframe>
                </div>
                
                <div className="mt-8 grid gap-4">
                  {contactData.locations.map((location, index) => (
                    <div key={index} className="flex items-start p-3 border-l-4 border-primary">
                      <div>
                        <h3 className="font-bold">{location.city} Office</h3>
                        <p className="text-brand-gray mb-1">{location.address}</p>
                        <p className="text-brand-gray">{location.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-brand-light">
          <div className="container-custom max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-brand-gray">
                Find answers to common questions about our solar services.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">What areas do you service in Sri Lanka?</h3>
                <p className="text-brand-gray">
                  We provide solar installation and services across all major regions of Sri Lanka, including Colombo, Kandy, Galle, Jaffna, and surrounding areas.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">How quickly can you install a residential solar system?</h3>
                <p className="text-brand-gray">
                  Typically, the installation process takes 2-3 days for residential systems, but the entire process from initial consultation to activation can take 2-4 weeks, depending on permitting and approval processes.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">Do you offer financing options for solar installations?</h3>
                <p className="text-brand-gray">
                  Yes, we offer various financing options to make solar accessible, including partnerships with local banks, leasing arrangements, and power purchase agreements for commercial clients.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">What maintenance do solar panels require?</h3>
                <p className="text-brand-gray">
                  Solar panels generally require minimal maintenance. Regular cleaning to remove dust and debris, and an annual inspection by our technicians is typically sufficient to ensure optimal performance.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
