import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Input } from "@/components/ui/input";
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchBlogPosts } from '@/services/blogService';
import { BlogPost } from '@/types/payload-types';
import { Link } from 'react-router-dom';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Extract unique categories from posts, defaulting to "Uncategorized" if no categories
  const categories = ["All", ...Array.from(new Set(
    posts.map(p => {
      // If categories array exists and has items, use the first category
      if (p.categories && p.categories.length > 0) {
        return p.categories[0];
      }
      // Otherwise return "Uncategorized"
      return "Uncategorized";
    })
  ))];

  const filteredPosts = posts.filter(post => {
    // Check if the post matches the selected category
    const matchesCategory = 
      activeCategory === "All" || 
      // Check in categories array if it exists
      (post.categories && post.categories.includes(activeCategory)) ||
      // If no categories and "Uncategorized" is selected
      (!post.categories && activeCategory === "Uncategorized");
      
    // Check if the post matches the search query
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="py-12 sm:py-16">
        <div className="container-custom">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Solar Energy Insights & News
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Stay updated with the latest trends, technologies, and news in the solar energy industry.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mb-12 space-y-6">
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-12 pr-4 py-3 text-base rounded-full shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm sm:text-base font-medium rounded-full transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-brand-blue text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.$id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="h-56 overflow-hidden">
                      <img 
                        src={post.featured_image || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>
                          {post.categories && post.categories.length > 0 
                            ? post.categories[0] 
                            : "Uncategorized"}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 h-16 overflow-hidden">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 h-20 overflow-hidden">{post.excerpt}</p>
                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(post.publishDate)}</span>
                        </div>
                      </div>
                      <div className="mt-4 text-brand-blue font-semibold flex items-center group-hover:text-brand-orange">
                        Read More <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
