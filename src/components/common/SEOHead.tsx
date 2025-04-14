
import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { fetchSEOData } from '@/services/seoService';

interface SEOHeadProps {
  pagePath: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  pagePath,
  fallbackTitle = 'Solar Shine - Sustainable Solar Solutions',
  fallbackDescription = 'High-quality solar solutions for residential and commercial properties.',
}) => {
  const { data: seoData, isLoading } = useQuery({
    queryKey: ['seo', pagePath],
    queryFn: () => fetchSEOData(pagePath)
  });

  const title = seoData?.title || fallbackTitle;
  const description = seoData?.description || fallbackDescription;
  const keywords = seoData?.keywords || '';
  const ogImage = seoData?.ogImage || '';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEOHead;
