import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { fetchBlogPostBySlug } from '@/services/blogService';
import { BlogPost } from '@/types/payload-types';
import { Loader2, Calendar, User, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('No post slug provided.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedPost = await fetchBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('Blog post not found.');
        }
      } catch (err) {
        setError('Failed to fetch blog post.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="py-12 sm:py-16 text-center">
          <div className="container-custom">
            <h1 className="text-2xl font-bold text-red-600">{error}</h1>
            <Link to="/blog" className="mt-4 inline-flex items-center text-brand-blue hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return null; // Should be handled by error state
  }

  return (
    <div className="bg-white">
      <Header />
      <main className="py-12 sm:py-16">
        <div className="container-custom max-w-4xl mx-auto">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <Link to="/blog" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-brand-blue transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all posts
              </Link>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(post.publishDate)}</span>
              </div>
              {post.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>

            {post.featured_image && (
              <motion.div 
                className="mb-8 rounded-xl overflow-hidden shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <img 
                  src={post.featured_image} 
                  alt={post.title} 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
            )}

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
