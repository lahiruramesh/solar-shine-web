
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { BadgeCheck, Home, Building, Factory, Sun, Battery, Wrench, Shield, BarChart3, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchServicesBanner } from '@/services/servicesBannerService';
import { fetchServiceCards } from '@/services/serviceCardService';
import { storage, STORAGE_BUCKET_ID } from '@/lib/appwrite';
import { ServicesBanner, ServiceCard } from '@/types/payload-types';

// Additional services remain unchanged
const additionalServices = [
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
];

const process = {
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
};

const Services: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<ServicesBanner | null>(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [services, setServices] = useState<ServiceCard[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  useEffect(() => {
    loadBannerData();
    loadServices();
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

  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      const services = await fetchServiceCards();
      // Sort services by order_index
      const sortedServices = services.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

      setServices(sortedServices);

      // Set the first service as active if available
      if (sortedServices.length > 0 && !activeService) {
        setActiveService(sortedServices[0].$id);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoadingServices(false);
    }
  };

  // Helper function to get icon component based on service icon
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      '🏠': Home,
      '🏢': Building,
      '🏭': Factory,
      '☀️': Sun,
      '🔋': Battery,
      '🔧': Wrench,
      '🛡️': Shield,
      '📊': BarChart3,
      '⚡': Zap
    };

    return iconMap[iconName] || Home; // Default to Home if icon not found
  };

  // Helper function to get image URL from Appwrite storage
  const getImageUrl = (imageId: string | null | undefined): string | null => {
    if (!imageId) return null;

    try {
      // If it's already a full URL, return it as is
      if (imageId.startsWith('http')) {
        return imageId;
      }

      // Get the direct file URL from Appwrite storage
      const fileUrl = storage.getFileView(STORAGE_BUCKET_ID, imageId);
      return (fileUrl as any).href || fileUrl.toString();
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  // Helper function to parse features from string format
  const parseFeatures = (features: string[]) => {
    return features.map(feature => {
      const colonIndex = feature.indexOf(':');
      if (colonIndex !== -1) {
        return {
          name: feature.substring(0, colonIndex).trim(),
          description: feature.substring(colonIndex + 1).trim()
        };
      }
      return {
        name: feature,
        description: ''
      };
    });
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
              {bannerData?.title || "Our Solar Services"}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {bannerData?.subtitle || "Comprehensive solar energy solutions for residential, commercial, and industrial clients"}
            </p>
          </div>
        </section>

        {/* Main Services */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                We provide comprehensive solar solutions tailored to different sectors, each with unique energy requirements and considerations.
              </p>
            </div>

            {isLoadingServices ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-brand-gray">Loading services...</p>
              </div>
            ) : services.length > 0 ? (
              <>
                {/* Service Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {services.map((service) => {
                    const IconComponent = getIconComponent(service.icon || '🏠');
                    return (
                      <button
                        key={service.$id}
                        onClick={() => setActiveService(service.$id)}
                        className={`px-6 py-3 rounded-full transition-colors flex items-center gap-2 ${activeService === service.$id
                          ? "bg-primary text-black"
                          : "bg-white border border-gray-200 hover:border-primary"
                          }`}
                      >
                        <IconComponent size={20} />
                        {service.title}
                      </button>
                    );
                  })}
                </div>

                {/* Active Service Content */}
                {services.map((service) => {
                  const IconComponent = getIconComponent(service.icon || '🏠');
                  const parsedFeatures = parseFeatures(service.features || []);

                  return (
                    <div
                      key={service.$id}
                      className={`${activeService === service.$id ? 'block' : 'hidden'}`}
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

                          {service.benefits && service.benefits.length > 0 && (
                            <>
                              <h4 className="text-xl font-bold mb-3">Key Benefits</h4>
                              <ul className="space-y-2 mb-6">
                                {service.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start">
                                    <BadgeCheck className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-1" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {parsedFeatures.length > 0 && (
                            <>
                              <h4 className="text-xl font-bold mb-3">Features</h4>
                              <div className="space-y-4">
                                {parsedFeatures.map((feature, index) => (
                                  <div key={index}>
                                    <h5 className="font-bold">{feature.name}</h5>
                                    {feature.description && (
                                      <p className="text-brand-gray">{feature.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

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
                          {service.image ? (
                            (() => {
                              const imageUrl = getImageUrl(service.image);
                              return imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={service.title}
                                  className="w-full h-full object-cover transition-opacity duration-300"
                                  onError={() => {
                                    // If image fails to load, show fallback
                                    console.error('Image failed to load for service:', service.title);
                                  }}
                                />
                              ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                  <IconComponent size={64} className="text-gray-400" />
                                </div>
                              );
                            })()
                          ) : (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                              <IconComponent size={64} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-brand-gray text-lg">No main services available at the moment.</p>
                <p className="text-brand-gray">Please check back later or contact us for more information.</p>
              </div>
            )}
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
              {additionalServices.map((service, index) => (
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{process.title}</h2>
              <p className="text-lg text-brand-gray max-w-3xl mx-auto">
                Our streamlined process ensures a smooth experience from initial consultation to system activation.
              </p>
            </div>

            <div className="relative">
              {/* Process line */}
              <div className="absolute left-[26px] top-0 h-full w-1 bg-gray-200 hidden md:block"></div>

              <div className="space-y-8">
                {process.steps.map((step, index) => (
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
