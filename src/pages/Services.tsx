
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { BadgeCheck, Home, Building, Factory, Sun, Battery, Wrench, Shield, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchServicesBanner } from '@/services/servicesBannerService';
import { ServicesBanner } from '@/types/payload-types';

// In a real implementation, these would come from PayloadCMS
const servicesData = {
  hero: {
    title: "Our Solar Services",
    subtitle: "Comprehensive solar energy solutions for residential, commercial, and industrial clients",
    image: "https://images.unsplash.com/photo-1548868598-2cf4c6b1e983?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  },
  mainServices: [
    {
      id: "residential",
      title: "Residential Solar",
      description: "Custom solar solutions for homes that reduce electricity bills and environmental impact.",
      icon: Home,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Reduce or eliminate electricity bills",
        "Increase home value",
        "Energy independence",
        "25+ year system lifespan",
        "Low maintenance requirements"
      ],
      features: [
        {
          name: "Rooftop Solar Panels",
          description: "High-efficiency panels designed to maximize energy production in limited space."
        },
        {
          name: "Battery Storage",
          description: "Store excess energy for use during nighttime or power outages."
        },
        {
          name: "Smart Monitoring",
          description: "Track your system's performance and energy production from your smartphone."
        }
      ]
    },
    {
      id: "commercial",
      title: "Commercial Solar",
      description: "Scalable solar solutions for businesses that reduce operational costs and enhance sustainability credentials.",
      icon: Building,
      image: "https://images.unsplash.com/photo-1605980413988-9dbeb137f3a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Significant reduction in operational costs",
        "Enhanced corporate sustainability",
        "Tax incentives and depreciation benefits",
        "Predictable energy costs",
        "Improved public image"
      ],
      features: [
        {
          name: "Rooftop & Carport Systems",
          description: "Utilize available space effectively with custom-designed installations."
        },
        {
          name: "Power Purchase Agreements",
          description: "Zero upfront cost options with predictable energy rates."
        },
        {
          name: "Commercial Energy Storage",
          description: "Reduce peak demand charges and ensure business continuity."
        }
      ]
    },
    {
      id: "industrial",
      title: "Industrial Solar",
      description: "Large-scale solar solutions for manufacturing and industrial facilities with high energy demands.",
      icon: Factory,
      image: "https://images.unsplash.com/photo-1562089339-a4c05b232349?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      benefits: [
        "Substantial reduction in energy costs",
        "Meet sustainability targets",
        "Reliable power for critical operations",
        "Reduced carbon footprint",
        "Protection against rising energy costs"
      ],
      features: [
        {
          name: "Ground-Mounted Systems",
          description: "Large-scale installations optimized for maximum energy production."
        },
        {
          name: "Custom Load Management",
          description: "Intelligent systems that align with production schedules and energy demands."
        },
        {
          name: "Microgrid Solutions",
          description: "Ensure operational continuity with integrated renewable energy systems."
        }
      ]
    }
  ],
  additionalServices: [
    {
      title: "Solar System Design",
      description: "Custom-designed solar systems that maximize energy production while considering aesthetic and space constraints.",
      icon: Sun
    },
    {
      title: "Battery Storage Solutions",
      description: "Advanced energy storage systems that provide power during outages and help manage energy consumption.",
      icon: Battery
    },
    {
      title: "Maintenance & Repairs",
      description: "Regular maintenance and prompt repairs to ensure your solar system operates at peak efficiency throughout its lifespan.",
      icon: Wrench
    },
    {
      title: "System Monitoring",
      description: "Real-time monitoring solutions that track performance and alert you to any issues requiring attention.",
      icon: BarChart3
    },
    {
      title: "Energy Efficiency Consulting",
      description: "Comprehensive assessments and recommendations to improve overall energy efficiency alongside solar installation.",
      icon: Zap
    },
    {
      title: "Warranty & Support",
      description: "Extended warranty options and ongoing customer support to give you peace of mind about your investment.",
      icon: Shield
    }
  ],
  process: {
    title: "Our Service Process",
    steps: [
      {
        number: "01",
        title: "Initial Consultation",
        description: "We discuss your energy needs, budget, and goals to determine the best approach for your solar project."
      },
      {
        number: "02",
        title: "Site Assessment",
        description: "Our technicians evaluate your property to assess solar potential, optimal panel placement, and any technical considerations."
      },
      {
        number: "03",
        title: "Custom Design",
        description: "We create a tailored system design that maximizes energy production and meets your specific requirements."
      },
      {
        number: "04",
        title: "Proposal & Agreement",
        description: "You receive a detailed proposal including system specifications, costs, financing options, and projected savings."
      },
      {
        number: "05",
        title: "Installation",
        description: "Our experienced team installs your solar system with minimal disruption to your home or business."
      },
      {
        number: "06",
        title: "Commissioning & Activation",
        description: "We perform thorough testing and coordinate with utilities to ensure your system is safely connected to the grid."
      },
      {
        number: "07",
        title: "Ongoing Support",
        description: "We provide monitoring, maintenance, and customer support throughout the life of your solar system."
      }
    ]
  }
};

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState(servicesData.mainServices[0].id);
  const [bannerData, setBannerData] = useState<ServicesBanner | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);

  useEffect(() => {
    loadBannerData();
  }, []);

  const loadBannerData = async () => {
    try {
      const data = await fetchServicesBanner();
      setBannerData(data);
    } catch (error) {
      console.error('Error loading services banner:', error);
    } finally {
      setIsLoadingBanner(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          {isLoadingBanner ? (
            <div className="absolute inset-0 z-0 bg-gray-200 animate-pulse" />
          ) : bannerData?.background_image ? (
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
              <img
                src={bannerData.background_image}
                alt="Solar services"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-green-600" />
          )}

          <div className="container-custom relative z-20 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {bannerData?.title || servicesData.hero.title}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {bannerData?.subtitle || servicesData.hero.subtitle}
            </p>


          </div>
        </section>

        {/* Main Services */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                We provide comprehensive solar solutions tailored to different sectors, each with unique energy requirements and considerations.
              </p>
            </div>

            {/* Service Tabs */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {servicesData.mainServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${activeService === service.id
                    ? "bg-primary text-black"
                    : "bg-white border border-gray-200 hover:border-primary"
                    }`}
                >
                  <service.icon size={20} />
                  {service.title}
                </button>
              ))}
            </div>

            {/* Active Service Content */}
            {servicesData.mainServices.map((service) => (
              <div
                key={service.id}
                className={`${activeService === service.id ? 'block' : 'hidden'}`}
              >
                <motion.div
                  className="grid md:grid-cols-2 gap-10 items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                    <p className="text-lg text-brand-gray mb-6">{service.description}</p>

                    <h4 className="text-xl font-bold mb-3">Key Benefits</h4>
                    <ul className="space-y-2 mb-6">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <BadgeCheck className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="text-xl font-bold mb-3">Features</h4>
                    <div className="space-y-4">
                      {service.features.map((feature, index) => (
                        <div key={index}>
                          <h5 className="font-bold">{feature.name}</h5>
                          <p className="text-brand-gray">{feature.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <a
                        href="/contact"
                        className="btn-primary inline-block"
                      >
                        Enquire About This Service
                      </a>
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 px-4 bg-brand-light">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Services</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                Beyond our core offerings, we provide these specialized services to enhance your solar experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesData.additionalServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <service.icon className="text-primary" size={24} />
                      </div>
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Process */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{servicesData.process.title}</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                Our streamlined process ensures a smooth experience from initial consultation to system activation.
              </p>
            </div>

            <div className="relative">
              {/* Process line */}
              <div className="absolute left-[26px] top-0 h-full w-1 bg-gray-200 hidden md:block"></div>

              <div className="space-y-8">
                {servicesData.process.steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    className="flex gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <div className="bg-primary text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 relative">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-brand-gray">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Contact us today for a free consultation and take the first step towards energy independence.
            </p>
            <a
              href="/contact"
              className="bg-brand-black text-white px-8 py-3 rounded-md inline-block hover:bg-brand-black/90 transition-colors"
            >
              Request a Free Quote
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Services;
