
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Sun, BarChart3, Settings, Users, BadgeCheck, ArrowRight } from 'lucide-react';

// In a real implementation, these would come from PayloadCMS
const whatWeDoData = {
  hero: {
    title: "What We Do",
    subtitle: "Delivering comprehensive solar energy solutions tailored to your specific needs",
    image: "https://images.unsplash.com/photo-1611365892117-baa49276e05b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  },
  approach: {
    title: "Our Approach",
    description: "We believe in a comprehensive, consultative approach that ensures each solar solution is perfectly tailored to our clients' specific energy needs, property characteristics, and budget considerations.",
    steps: [
      {
        number: "01",
        title: "Consultation",
        description: "We begin with a thorough assessment of your energy needs, property layout, and budget to determine the most suitable solar solution."
      },
      {
        number: "02",
        title: "Custom Design",
        description: "Our technical team creates a customized solar system design optimized for your specific requirements and maximum efficiency."
      },
      {
        number: "03",
        title: "Quality Installation",
        description: "Our experienced installation team implements your solar system with precision, following the highest industry standards."
      },
      {
        number: "04",
        title: "Ongoing Support",
        description: "We provide regular maintenance, monitoring, and support to ensure your system continues to perform optimally for years."
      }
    ]
  },
  expertise: {
    title: "Our Expertise",
    description: "With years of experience in the solar industry, we've developed specialized expertise across various domains of solar energy implementation.",
    areas: [
      {
        title: "Solar Panel Installation",
        description: "Professional installation of high-efficiency solar panels for residential and commercial properties.",
        icon: Sun,
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "System Design & Optimization",
        description: "Custom system designs that maximize energy generation while considering aesthetic and space constraints.",
        icon: Settings,
        image: "https://images.unsplash.com/photo-1581092160607-ee22731c9b8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Performance Monitoring",
        description: "Advanced monitoring solutions that track system performance and identify optimization opportunities.",
        icon: BarChart3,
        image: "https://images.unsplash.com/photo-1605980413988-9dbeb137f3a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Training & Education",
        description: "Educational programs to help clients understand and maximize the benefits of their solar installations.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  benefits: {
    title: "Benefits of Working With Us",
    items: [
      "Expert team with years of industry experience",
      "Customized solutions tailored to your specific needs",
      "High-quality equipment from trusted manufacturers",
      "Comprehensive warranty and maintenance packages",
      "Dedicated customer support throughout the system's lifecycle",
      "Competitive pricing and flexible financing options"
    ]
  },
  impact: {
    title: "Our Environmental Impact",
    description: "Through our solar installations, we've helped our clients significantly reduce their carbon footprint while saving on energy costs.",
    stats: [
      {
        value: "5MW+",
        label: "Total Capacity Installed"
      },
      {
        value: "7,500+",
        label: "Tonnes of CO₂ Offset Annually"
      },
      {
        value: "3,000+",
        label: "Completed Installations"
      },
      {
        value: "60%",
        label: "Average Energy Bill Reduction"
      }
    ]
  }
};

const WhatWeDo: React.FC = () => {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
            <img 
              src={whatWeDoData.hero.image} 
              alt="Solar installation" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container-custom relative z-20 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{whatWeDoData.hero.title}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {whatWeDoData.hero.subtitle}
            </p>
          </div>
        </section>

        {/* Our Approach */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{whatWeDoData.approach.title}</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                {whatWeDoData.approach.description}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whatWeDoData.approach.steps.map((step, index) => (
                <motion.div 
                  key={step.number}
                  className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-primary mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-brand-gray">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Expertise */}
        <section className="py-20 px-4 bg-brand-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{whatWeDoData.expertise.title}</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                {whatWeDoData.expertise.description}
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {whatWeDoData.expertise.areas.map((area, index) => (
                <motion.div 
                  key={area.title}
                  className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="md:w-1/2 h-64 md:h-auto">
                    <img 
                      src={area.image} 
                      alt={area.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-6 flex flex-col justify-center">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                        <area.icon className="text-primary" size={24} />
                      </div>
                      <h3 className="text-xl font-bold">{area.title}</h3>
                    </div>
                    <p className="text-brand-gray mb-4">{area.description}</p>
                    <a 
                      href={`/services#${area.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-primary font-medium hover:underline flex items-center mt-auto self-start"
                    >
                      Learn More
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-8">{whatWeDoData.benefits.title}</h2>
                <ul className="space-y-4">
                  {whatWeDoData.benefits.items.map((benefit, index) => (
                    <li 
                      key={index} 
                      className="flex items-start"
                    >
                      <BadgeCheck className="h-6 w-6 text-primary flex-shrink-0 mr-2" />
                      <span className="text-brand-gray">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a 
                    href="/contact" 
                    className="btn-primary inline-block"
                  >
                    Contact Us to Learn More
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="bg-primary rounded-lg p-8"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-2xl font-bold mb-6">Our Environmental Impact</h3>
                <p className="mb-8">{whatWeDoData.impact.description}</p>
                
                <div className="grid grid-cols-2 gap-6">
                  {whatWeDoData.impact.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                      <div className="text-sm text-brand-black/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand-dark text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Harness the Power of Solar Energy?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-white/80">
              Contact us today to discuss how our solar solutions can benefit your home or business.
            </p>
            <a 
              href="/contact" 
              className="bg-primary text-black px-8 py-3 rounded-md inline-block hover:bg-primary/90 transition-colors"
            >
              Get a Free Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhatWeDo;
