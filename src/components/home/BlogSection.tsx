
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

// In a real implementation, these would come from the CMS
const blogs = [
  {
    id: 1,
    title: 'The Future of Solar Energy in Sri Lanka',
    excerpt: 'Exploring the potential and growth opportunities for solar power in the Sri Lankan energy landscape.',
    date: '2023-04-15',
    author: 'Dinesh Silva',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'future-of-solar-energy-sri-lanka'
  },
  {
    id: 2,
    title: 'Solar vs. Traditional Energy: A Cost Comparison',
    excerpt: 'A detailed analysis of the economic benefits of switching to solar energy for residential properties.',
    date: '2023-03-22',
    author: 'Priya Jayawardena',
    image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'solar-vs-traditional-energy'
  },
  {
    id: 3,
    title: 'Maintenance Tips for Your Solar Panels',
    excerpt: 'Essential maintenance practices to ensure optimal performance and longevity of your solar panel installation.',
    date: '2023-02-08',
    author: 'Asanka Perera',
    image: 'https://images.unsplash.com/photo-1595437287698-7b3a5b9c0be3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    slug: 'maintenance-tips-solar-panels'
  }
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const BlogSection: React.FC = () => {
  return (
    <section className="section bg-brand-light">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Latest from Our Blog</h2>
          <a href="/blog" className="hidden md:flex items-center text-primary font-medium hover:underline">
            View All Articles
            <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover hover:scale-110 transition duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-brand-gray mb-3">
                  <div className="flex items-center mr-4">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={14} className="mr-1" />
                    <span>{blog.author}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-brand-gray mb-4 line-clamp-2">{blog.excerpt}</p>
                <a 
                  href={`/blog/${blog.slug}`} 
                  className="text-primary font-medium hover:underline flex items-center"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
        
        <div className="text-center mt-8 md:hidden">
          <a href="/blog" className="btn-outline inline-block">
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
