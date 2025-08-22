
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanyInfo } from '@/services/companyService';

// Fallback logo if no company logo is set
const FALLBACK_LOGO = "/placeholder.svg";

const menuItems = [
  { title: 'Home', path: '/' },
  { title: 'Who We Are', path: '/who-we-are' },
  { title: 'What We Do', path: '/what-we-do' },
  { title: 'Services', path: '/services' },
  { title: 'Projects', path: '/projects' },
  { title: 'Blog', path: '/blog' },
  { title: 'Contact Us', path: '/contact' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch company info to get the logo
  const { data: companyInfo } = useQuery({
    queryKey: ['companyInfo'],
    queryFn: fetchCompanyInfo,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Use company logo if available, otherwise fallback
  const logoUrl = companyInfo?.logo_url || FALLBACK_LOGO;
  const companyName = companyInfo?.name || 'Solar Services';

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="z-50">
          <img
            src={logoUrl}
            alt={`${companyName} Logo`}
            className="h-10 md:h-12 object-contain"
            onError={(e) => {
              // If company logo fails to load, fallback to placeholder
              const target = e.target as HTMLImageElement;
              target.src = FALLBACK_LOGO;
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="text-brand-dark hover:text-primary font-medium transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <Button className="btn-primary">Book Appointment</Button>
        </nav>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden z-50 text-brand-dark"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 bg-white p-6 transition-transform transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            } z-40 flex flex-col`}
        >
          <div className="mt-20 flex flex-col space-y-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="text-xl font-medium text-brand-dark hover:text-primary py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <Button className="btn-primary w-full mt-4" onClick={() => setIsMenuOpen(false)}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
