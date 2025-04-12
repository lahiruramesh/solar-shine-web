
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Placeholder for logo from CMS
const PLACEHOLDER_LOGO = "/placeholder.svg";

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

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container-custom mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="z-50">
          <img src={PLACEHOLDER_LOGO} alt="Solar Services Logo" className="h-10 md:h-12" />
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
          className={`fixed inset-0 bg-white p-6 transition-transform transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
