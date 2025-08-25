'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faFire, 
  faStar, 
  faClock,
  faSearch,
  faBars,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: '/',
      label: 'Home',
      icon: faHome,
      active: pathname === '/'
    },
    {
      href: '/popular',
      label: 'Popular',
      icon: faFire,
      active: pathname === '/popular'
    },
    {
      href: '/top-rated',
      label: 'Top Rated',
      icon: faStar,
      active: pathname === '/top-rated'
    },
    {
      href: '/upcoming',
      label: 'Upcoming',
      icon: faClock,
      active: pathname === '/upcoming'
    },
    {
      href: '/search',
      label: 'Search',
      icon: faSearch,
      active: pathname === '/search'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out
                  ${link.active 
                    ? 'text-blue-400 bg-blue-400/10 border border-blue-400/20' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                  }
                `}
              >
                <FontAwesomeIcon icon={link.icon} className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-slate-300 hover:text-white p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faTimes : faBars} 
                className="w-5 h-5" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`
        md:hidden transition-all duration-300 ease-in-out overflow-hidden
        ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/95 backdrop-blur-sm border-t border-slate-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                ${link.active 
                  ? 'text-blue-400 bg-blue-400/10 border-l-4 border-blue-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }
              `}
            >
              <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;