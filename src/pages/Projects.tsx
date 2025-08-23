import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sun, Building, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchProjects } from '@/services/projectService';
import { Project } from '@/types/payload-types';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        console.log('Fetched projects:', fetchedProjects);

        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);

        // Extract unique categories and filter out any invalid ones
        const validCategories = ['Residential', 'Commercial', 'Industrial'];
        const projectCategories = ['All', ...new Set(
          fetchedProjects
            .map(p => p.category)
            .filter(category => category && validCategories.includes(category))
        )];

        console.log('Available categories:', projectCategories);
        setCategories(projectCategories);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    console.log('Filtering projects by category:', activeCategory);
    console.log('Available projects:', projects);

    if (activeCategory === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.category === activeCategory);
      console.log(`Filtered projects for ${activeCategory}:`, filtered);
      setFilteredProjects(filtered);
    }
  }, [activeCategory, projects]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
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
      <main className="pt-20 bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Solar Projects</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our portfolio of successfully completed solar installations across various sectors.
            </p>
          </motion.div>
        </section>

        {/* Filter and Projects Grid */}
        <section className="py-16 px-4">
          <div className="container-custom">
            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-2 mb-12">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  layout
                >
                  <Card className="overflow-hidden h-full flex flex-col group">
                    <CardHeader className="p-0">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Failed to load project image:', project.image_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                        {getCategoryIcon(project.category || '')}
                        <span>{project.category}</span>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <button className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Learn More <ArrowRight className="h-4 w-4" />
                      </button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProjectsPage;
