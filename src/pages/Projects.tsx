import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sun, Building, Home, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProjects } from '@/services/projectService';
import { Project } from '@/types/payload-types';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', name: 'All', color: 'bg-gray-100 text-gray-800', order: 0 },
    { id: 'residential', name: 'Residential', color: 'bg-blue-100 text-blue-800', order: 1 },
    { id: 'commercial', name: 'Commercial', color: 'bg-green-100 text-green-800', order: 2 },
    { id: 'industrial', name: 'Industrial', color: 'bg-purple-100 text-purple-800', order: 3 },
  ].sort((a, b) => a.order - b.order));
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const fetchedProjects = await fetchProjects();
        console.log('Fetched projects:', fetchedProjects);

        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);

        // Extract unique categories from projects and merge with default categories
        const projectCategories = fetchedProjects.map(p => p.category).filter(Boolean);
        const uniqueProjectCategories = [...new Set(projectCategories)];

        console.log('Project categories found:', projectCategories);
        console.log('Unique project categories:', uniqueProjectCategories);

        // Add any new categories found in projects
        const newCategories = uniqueProjectCategories
          .filter(catName => !categories.some(c => c.name === catName))
          .map((catName, index) => ({
            id: catName.toLowerCase().replace(/\s+/g, '-'),
            name: catName,
            color: getCategoryColor(catName),
            order: categories.length + index
          }));

        if (newCategories.length > 0) {
          console.log('Adding new categories:', newCategories);
          setCategories(prev => [...prev, ...newCategories]);
        }

        // Sort categories by order after adding new ones
        setCategories(prev => {
          const allCategories = [...prev, ...newCategories];
          return allCategories.sort((a, b) => a.order - b.order);
        });

        console.log('Available categories:', categories.map(c => c.name));
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    loadProjects();
  }, []);

  const getCategoryColor = (categoryName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Residential': 'bg-blue-100 text-blue-800',
      'Commercial': 'bg-green-100 text-green-800',
      'Industrial': 'bg-purple-100 text-purple-800',
      'Community': 'bg-orange-100 text-orange-800',
      'Agricultural': 'bg-yellow-100 text-yellow-800',
      'Educational': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Government': 'bg-indigo-100 text-indigo-800',
      'Uncategorized': 'bg-gray-100 text-gray-600'
    };
    return colorMap[categoryName] || 'bg-gray-100 text-gray-800';
  };

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

  // Ensure categories are always sorted by order
  useEffect(() => {
    setCategories(prev => [...prev].sort((a, b) => a.order - b.order));
  }, [categories.length]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Residential":
        return <Home className="h-5 w-5 text-primary" />;
      case "Commercial":
        return <Building className="h-5 w-5 text-primary" />;
      case "Industrial":
        return <Sun className="h-5 w-5 text-primary" />;
      case "Uncategorized":
        return <Building className="h-5 w-5 text-gray-500" />;
      default:
        return <Building className="h-5 w-5 text-primary" />;
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
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Filter by Category</h2>
              </div>
              <div className="flex justify-center flex-wrap gap-3">
                {categories.map(category => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.name)}
                    className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${activeCategory === category.name
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-102'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Projects Count */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-primary">{filteredProjects.length}</span>
                {filteredProjects.length === 1 ? ' project' : ' projects'}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </p>
            </div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              {filteredProjects.length > 0 ? (
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.$id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      layout
                      className="group"
                    >
                      <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300">
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
                          <div className="flex items-center gap-2 mb-3">
                            {getCategoryIcon(project.category || 'Uncategorized')}
                            <Badge className={getCategoryColor(project.category || 'Uncategorized')}>
                              {project.category || 'Uncategorized'}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          <CardDescription className="text-gray-600">
                            {project.description}
                          </CardDescription>
                        </CardContent>
                        <CardFooter className="p-6 pt-0">
                          <button className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                            Learn More <ArrowRight className="h-4 w-4" />
                          </button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Building className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
                  <p className="text-gray-500">
                    {activeCategory !== 'All'
                      ? `No projects found in the "${activeCategory}" category.`
                      : 'No projects available at the moment.'
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProjectsPage;
