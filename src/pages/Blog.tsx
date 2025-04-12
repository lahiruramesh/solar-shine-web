
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from "@/components/ui/input";
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// In a real implementation, these would come from PayloadCMS
const blogData = {
  title: "Solar Energy Insights & News",
  subtitle: "Stay updated with the latest trends, technologies, and news in the solar energy industry.",
  categories: ["All", "Technology", "Sustainability", "Industry News", "Tips & Guides"],
  featuredPosts: [
    {
      id: 1,
      title: "The Future of Solar Energy in Sri Lanka",
      excerpt: "Exploring the potential and growth opportunities for solar power in the Sri Lankan energy landscape. How government policies and technological advancements are shaping the future.",
      date: "2023-05-15",
      author: "Dinesh Silva",
      category: "Industry News",
      image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "future-of-solar-energy-sri-lanka",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Solar vs. Traditional Energy: A Cost Comparison",
      excerpt: "A detailed analysis of the economic benefits of switching to solar energy for residential properties in different regions of Sri Lanka.",
      date: "2023-04-22",
      author: "Priya Jayawardena",
      category: "Tips & Guides",
      image: "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "solar-vs-traditional-energy",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Maintenance Tips for Your Solar Panels",
      excerpt: "Essential maintenance practices to ensure optimal performance and longevity of your solar panel installation during different weather conditions.",
      date: "2023-04-08",
      author: "Asanka Perera",
      category: "Tips & Guides",
      image: "https://images.unsplash.com/photo-1595437287698-7b3a5b9c0be3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "maintenance-tips-solar-panels",
      readTime: "4 min read"
    },
    {
      id: 4,
      title: "New Solar Technology Breakthroughs in 2023",
      excerpt: "Highlighting the latest innovations in solar panel efficiency, smart home integration, and storage solutions revolutionizing the industry.",
      date: "2023-03-30",
      author: "Kavinda Fernando",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1559302995-f8d7c1e648e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "solar-technology-breakthroughs-2023",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "Going Off-Grid: Is It Right for You?",
      excerpt: "The pros and cons of disconnecting from the traditional power grid and relying solely on solar energy for your household needs.",
      date: "2023-03-12",
      author: "Malini Gunawardena",
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1507213246912-03af53d3fce5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "going-off-grid-considerations",
      readTime: "8 min read"
    },
    {
      id: 6,
      title: "How Businesses Can Benefit from Solar Energy",
      excerpt: "Case studies and strategies for commercial enterprises looking to reduce operational costs and enhance sustainability through solar power.",
      date: "2023-02-28",
      author: "Ranil Dissanayake",
      category: "Industry News",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      slug: "business-benefits-solar-energy",
      readTime: "5 min read"
    }
  ]
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPosts = blogData.featuredPosts.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-brand-light to-white">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">{blogData.title}</h1>
            <p className="text-center text-xl text-brand-gray max-w-3xl mx-auto mb-12">
              {blogData.subtitle}
            </p>
            
            {/* Search and Filter */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray h-5 w-5" />
                <Input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="pl-10 py-6 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {blogData.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors text-sm ${
                    activeCategory === category
                      ? "bg-primary text-black"
                      : "bg-white border border-gray-200 hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Blog Posts Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article 
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden h-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between text-sm text-brand-gray mb-3">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Tag size={14} className="mr-1" />
                        <span>{post.category}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                      <a href={`/blog/${post.slug}`}>{post.title}</a>
                    </h3>
                    <p className="text-brand-gray mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <User size={14} className="mr-1 text-brand-gray" />
                        <span className="text-sm text-brand-gray">{post.author}</span>
                      </div>
                      <span className="text-sm text-brand-gray">{post.readTime}</span>
                    </div>
                    <a 
                      href={`/blog/${post.slug}`} 
                      className="text-primary font-medium hover:underline flex items-center mt-4"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-brand-gray">No articles found. Try a different search or category.</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-brand-dark text-white">
          <div className="container-custom max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-8 text-white/80">
              Subscribe to our newsletter to receive the latest news, updates, and insights on solar energy.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow bg-white/10 border-0 placeholder:text-white/60 text-white"
                required
              />
              <button 
                type="submit" 
                className="bg-primary text-black px-6 py-2 rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Blog;
