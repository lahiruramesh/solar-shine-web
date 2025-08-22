
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe, Youtube, MessageCircle, Share2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanyInfo } from '@/services/companyService';
import { fetchGlobalSettings } from '@/services/settingsService';
import { socialLinkService } from '@/services/appwriteService';

const Footer: React.FC = () => {
  // Fetch company info from database
  const { data: companyInfo } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: fetchCompanyInfo,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch global settings for contact information
  const { data: globalSettings } = useQuery({
    queryKey: ['globalSettings'],
    queryFn: fetchGlobalSettings,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch social links from database
  const { data: socialLinks = [], isLoading: socialLinksLoading, error: socialLinksError } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      try {
        const result = await socialLinkService.getAll();
        console.log('Footer: Social links fetched:', result);
        // Sort by order field to ensure correct display sequence
        return result.sort((a, b) => (a.order || 1) - (b.order || 1));
      } catch (error) {
        console.error('Footer: Error fetching social links:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Log social links data for debugging
  React.useEffect(() => {
    console.log('Footer: Current social links:', socialLinks);
    console.log('Footer: Social links loading:', socialLinksLoading);
    console.log('Footer: Social links error:', socialLinksError);
  }, [socialLinks, socialLinksLoading, socialLinksError]);

  // Fallback company info if database is empty
  const fallbackCompanyInfo = {
    name: 'Solar Services Company',
    description: 'Leading provider of renewable energy solutions in Sri Lanka.',
  };

  // Use database data or fallback
  const company = companyInfo || fallbackCompanyInfo;

  // Use global settings for contact info, with fallbacks
  const contactInfo = {
    address: globalSettings?.address || '123 Solar Street, Colombo, Sri Lanka',
    email: globalSettings?.contact_email || 'info@solarservices.com',
    phone: globalSettings?.contact_phone || '+94 11 234 5678',
  };

  // Function to get the appropriate icon component based on the icon name
  const getSocialIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      youtube: Youtube,
      tiktok: MessageCircle,
      pinterest: Share2,
      snapchat: MessageCircle,
      whatsapp: MessageCircle,
      telegram: MessageCircle,
      discord: MessageCircle,
      reddit: Share2,
      github: Share2,
      twitch: MessageCircle,
      spotify: MessageCircle,
      apple: Share2,
      google: Share2,
      microsoft: Share2,
      amazon: Share2,
      netflix: MessageCircle,
    };
    return iconMap[iconName.toLowerCase()] || Globe;
  };

  // Only show social links section if there are links
  const hasSocialLinks = socialLinks && socialLinks.length > 0;

  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Services', url: '/services' },
    { name: 'Projects', url: '/projects' },
    { name: 'Blog', url: '/blog' },
    { name: 'Contact', url: '/contact' },
  ];

  const services = [
    { name: 'Solar Panel Installation', url: '/services#installation' },
    { name: 'Energy Consultation', url: '/services#consultation' },
    { name: 'Maintenance', url: '/services#maintenance' },
    { name: 'System Design', url: '/services#design' },
  ];

  return (
    <footer className="bg-brand-dark text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              {companyInfo?.logo_url && (
                <img
                  src={companyInfo.logo_url}
                  alt={`${company.name} Logo`}
                  className="h-8 w-8 mr-3 object-contain"
                  onError={(e) => {
                    // If logo fails to load, hide it
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <h3 className="text-xl font-bold">{company.name}</h3>
            </div>
            <p className="mb-4">{company.description}</p>
            <div className="flex space-x-4">
              {socialLinksLoading && (
                <div className="text-sm text-gray-400">Loading social links...</div>
              )}
              {socialLinksError && (
                <div className="text-sm text-red-400">Error loading social links</div>
              )}
              {hasSocialLinks && socialLinks.map((social) => {
                const IconComponent = getSocialIcon(social.icon);
                return (
                  <a
                    key={social.$id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
              {!hasSocialLinks && !socialLinksLoading && !socialLinksError && (
                <div className="text-sm text-gray-400">No social links available</div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.url}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.url}
                    className="hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 shrink-0 text-primary" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-primary transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black py-4">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex space-x-4">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
