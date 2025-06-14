
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sun, Building, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

// In a real implementation, this would come from PayloadCMS
const projectsData = {
  title: "Our Solar Projects",
  subtitle: "Explore our portfolio of successfully completed solar installations across Sri Lanka.",
  categories: ["All", "Residential", "Commercial", "Industrial"],
  featuredProjects: [
    {
      id: 1,
      title: "Colombo Commercial Complex",
      category: "Commercial",
      description: "A 250kW solar panel installation on a commercial building in Colombo, reducing carbon emissions by 320 tons annually.",
      image: "https://images.unsplash.com/photo-1566093097221-ac2335b09e70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Metro Business Center",
      completionDate: "2023-01-15",
    },
    {
      id: 2,
      title: "Kandy Residential Estate",
      category: "Residential",
      description: "Solar power solutions for a 35-unit residential complex, providing clean energy to the entire community.",
      image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Highland Properties",
      completionDate: "2022-11-10",
    },
    {
      id: 3,
      title: "Galle Manufacturing Plant",
      category: "Industrial",
      description: "A large-scale 500kW installation for a manufacturing facility, covering 60% of their energy needs.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Southern Industries Ltd",
      completionDate: "2023-03-22",
    },
    {
      id: 4,
      title: "Negombo Beach Resort",
      category: "Commercial",
      description: "Solar panels and water heating systems for an eco-friendly beach resort, resulting in 40% energy cost reduction.",
      image: "https://images.unsplash.com/photo-1548525839-25b0883e860f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Ocean View Resorts",
      completionDate: "2022-12-05",
    },
    {
      id: 5,
      title: "Jaffna Community Solar Farm",
      category: "Industrial",
      description: "A community-based solar farm providing sustainable electricity to over 200 households.",
      image: "https://images.unsplash.com/photo-1593412323862-085d50278f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Northern Development Trust",
      completionDate: "2023-02-18",
    },
    {
      id: 6,
      title: "Nuwara Eliya Mountain Villa",
      category: "Residential",
      description: "Off-grid solar solution for a luxury mountain villa, complete with battery storage system.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      client: "Highland Retreats",
      completionDate: "2023-04-30",
    }
  ]
};

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredProjects, setFilteredProjects] = useState(projectsData.featuredProjects);
  
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredProjects(projectsData.featuredProjects);
    } else {
      setFilteredProjects(
        projectsData.featuredProjects.filter(project => project.category === activeCategory)
      );
    }
  }, [activeCategory]);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Residential":
        return <Home className="h-5 w-5 text-primary" />;
      case "Commercial":
        return <Building className="h-5 w-5 text-primary" />;
      case "Industrial":
        return <Sun className="h-5 w-5 text-primary" />;
      default:
        return <Sun className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-brand-light to-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">{projectsData.title}</h1>
            <p className="text-center text-xl text-brand-gray max-w-3xl mx-auto mb-12">
              {projectsData.subtitle}
            </p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {projectsData.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-black"
                      : "bg-white border border-gray-200 hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(project.category)}
                        <span className="text-sm font-medium text-brand-gray">
                          {project.category}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-brand-gray">Client:</span>
                          <span className="font-medium">{project.client}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <span className="text-brand-gray">Completed:</span>
                          <span className="font-medium">
                            {new Date(project.completionDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short'
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <a 
                        href={`/projects/${project.id}`}
                        className="text-primary font-medium hover:underline flex items-center"
                      >
                        View Details
                        <ArrowRight size={16} className="ml-1" />
                      </a>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-brand-gray">No projects found in this category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-primary">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-black">Ready to Start Your Solar Journey?</h2>
            <p className="text-lg mb-8 text-brand-black/80 max-w-2xl mx-auto">
              Contact us today to discuss how we can help you transition to clean, renewable solar energy.
            </p>
            <a 
              href="/contact" 
              className="bg-brand-black text-white px-8 py-3 rounded-md inline-block hover:bg-brand-black/90 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Projects;
