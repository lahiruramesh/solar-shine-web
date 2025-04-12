
import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/payload-types';

interface BlogSectionProps {
  posts: BlogPost[];
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="section-title text-left">Latest Insights</h2>
            <p className="section-subtitle text-left max-w-xl">
              Stay updated with the latest news and trends in solar energy.
            </p>
          </div>
          <a 
            href="/blog" 
            className="btn-secondary mt-4 md:mt-0 group"
          >
            View All Articles
            <ArrowRight className="ml-2 transition group-hover:translate-x-1" size={18} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-brand-gray mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-brand-gray mb-4 line-clamp-3">{post.excerpt}</p>
                <a 
                  href={`/blog/${post.slug}`} 
                  className="text-primary font-medium hover:underline flex items-center"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
