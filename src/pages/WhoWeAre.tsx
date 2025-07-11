
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, Clock, Shield, Smile } from 'lucide-react';
import { fetchAboutContent } from '@/services/cmsService';
import { Skeleton } from '@/components/ui/skeleton';
import SEOHead from '@/components/common/SEOHead';

const WhoWeAre: React.FC = () => {
  const { data: aboutContent, isLoading, error } = useQuery({
    queryKey: ['aboutContent'],
    queryFn: fetchAboutContent
  });

  // Show error toast if data fetch fails
  React.useEffect(() => {
    if (error) toast.error("Failed to load about page content");
  }, [error]);

  // Default data for fallback
  const whoWeAreData = {
    heroSection: {
      title: "Who We Are",
      subtitle: "A leading solar energy provider committed to powering a sustainable future across Sri Lanka",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
    },
    mission: {
      title: "Our Mission",
      description: "To accelerate the adoption of clean, renewable solar energy solutions that reduce environmental impact and energy costs while improving energy security and independence for our clients."
    },
    vision: {
      title: "Our Vision",
      description: "To be the leading solar energy provider in Sri Lanka, driving the nation towards a sustainable energy future through innovation, excellence, and customer-focused solutions."
    },
    values: [
      {
        title: "Excellence",
        description: "We are committed to delivering the highest quality solar solutions with precision and care.",
        icon: Award
      },
      {
        title: "Sustainability",
        description: "Environmental responsibility is at the heart of everything we do.",
        icon: Shield
      },
      {
        title: "Customer Focus",
        description: "We prioritize understanding and meeting our customers' unique energy needs.",
        icon: Smile
      },
      {
        title: "Innovation",
        description: "We continuously seek new technologies and approaches to improve our solutions.",
        icon: CheckCircle
      },
      {
        title: "Reliability",
        description: "Our clients can depend on our systems to perform consistently for decades.",
        icon: Clock
      },
      {
        title: "Teamwork",
        description: "We collaborate effectively, both internally and with our clients, to achieve shared goals.",
        icon: Users
      }
    ],
    team: {
      title: "Our Leadership Team",
      description: "Meet the experienced professionals who guide our company's vision and operations.",
      members: [
        {
          name: "Sunil Perera",
          position: "Founder & CEO",
          bio: "With over 20 years in renewable energy, Sunil founded our company with a vision of making solar accessible to all Sri Lankans.",
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Amali Fernando",
          position: "Technical Director",
          bio: "Amali is an electrical engineer with specialized expertise in renewable energy systems and grid integration.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
          name: "Rajan Mendis",
          position: "Operations Manager",
          bio: "Rajan ensures that our installation and maintenance processes run smoothly and efficiently.",
          image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
      ]
    },
    history: {
      title: "Our Journey",
      description: "Since our founding in 2010, we've grown from a small team with a big vision to become one of Sri Lanka's most trusted solar providers.",
      milestones: [
        {
          year: "2010",
          title: "Company Founded",
          description: "Started with a small team focused on residential solar installations."
        },
        {
          year: "2014",
          title: "Commercial Expansion",
          description: "Began offering solutions for commercial properties and expanded our team."
        },
        {
          year: "2017",
          title: "Industrial Solutions",
          description: "Launched dedicated industrial division for large-scale projects."
        },
        {
          year: "2020",
          title: "10-Year Anniversary",
          description: "Celebrated a decade of service with over 5,000 successful installations."
        },
        {
          year: "2023",
          title: "Innovation Hub",
          description: "Opened our renewable energy innovation center to develop new solutions."
        }
      ]
    }
  };

  const displayData = aboutContent || whoWeAreData;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-4 w-3/4 max-w-md mb-2" />
          <Skeleton className="h-4 w-2/3 max-w-md" />
        </div>
      );
    }

    return (
      <>
        {/* Mission & Vision */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div 
                className="bg-brand-light p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  {aboutContent?.missionTitle || whoWeAreData.mission.title}
                </h2>
                <p className="text-lg text-brand-gray">
                  {aboutContent?.missionDescription || whoWeAreData.mission.description}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-primary p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-4">
                  {aboutContent?.visionTitle || whoWeAreData.vision.title}
                </h2>
                <p className="text-lg text-brand-black/80">
                  {aboutContent?.visionDescription || whoWeAreData.vision.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 px-4 bg-brand-light">
          <div className="container-custom">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Core Values</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whoWeAreData.values.map((value, index) => (
                <motion.div 
                  key={value.title}
                  className="bg-white p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    <value.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-brand-gray">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{whoWeAreData.team.title}</h2>
              <p className="text-xl text-brand-gray max-w-3xl mx-auto">
                {whoWeAreData.team.description}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {whoWeAreData.team.members.map((member, index) => (
                <motion.div 
                  key={member.name}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="mb-4 relative">
                    <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-primary">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.position}</p>
                  <p className="text-brand-gray">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company History */}
        <section className="py-20 px-4 bg-brand-dark text-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{whoWeAreData.history.title}</h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                {whoWeAreData.history.description}
              </p>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
              
              <div className="space-y-12">
                {whoWeAreData.history.milestones.map((milestone, index) => (
                  <motion.div 
                    key={milestone.year}
                    className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-brand-dark z-10"></div>
                    
                    {/* Content */}
                    <div className="w-full md:w-5/12 bg-brand-black/50 p-6 rounded-lg">
                      <div className="font-bold text-primary text-xl mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-white/80">{milestone.description}</p>
                    </div>
                    
                    <div className="w-full md:w-5/12"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  };

  return (
    <>
      <SEOHead pagePath="/who-we-are" />
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 z-10" />
            <img 
              src={aboutContent?.mainImage || whoWeAreData.heroSection.image} 
              alt="Solar team" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container-custom relative z-20 text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {aboutContent?.title || whoWeAreData.heroSection.title}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {aboutContent?.subtitle || whoWeAreData.heroSection.subtitle}
            </p>
          </div>
        </section>

        {renderContent()}

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Work With Us?</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              Join us in our mission to create a more sustainable future through solar energy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-brand-black text-white px-8 py-3 rounded-md inline-block hover:bg-brand-black/90 transition-colors"
              >
                Contact Us
              </a>
              <a 
                href="/projects" 
                className="bg-transparent border-2 border-brand-black text-brand-black px-8 py-3 rounded-md inline-block hover:bg-brand-black/10 transition-colors"
              >
                View Our Projects
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WhoWeAre;
