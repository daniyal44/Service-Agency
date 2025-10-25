import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width >= 768 && width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Initial call
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close sidebar when clicking on a link
  const handleSidebarLinkClick = () => {
    setIsSidebarOpen(false);
    setIsMenuOpen(false);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const sidebarToggle = document.getElementById('sidebar-toggle');
      const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      
      if (isSidebarOpen && sidebar && !sidebar.contains(event.target) && 
          sidebarToggle && !sidebarToggle.contains(event.target) &&
          mobileMenuToggle && !mobileMenuToggle.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' }, // added
    { path: '/about', label: 'About', icon: '👥' },
    { path: '/services', label: 'Services', icon: '⚡' },
    { path: '/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/contact', label: 'Contact', icon: '📞' }
  ];

  const authItems = [
    { path: '/authform', label: 'Login/SignUp', icon: '🔐', gradient: 'from-teal-500 to-teal-600' },
    { path: '/profile', label: 'Profile', icon: '👤', gradient: 'from-green-500 to-green-600' }
  ];

  return (
    <div>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-xl py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Sidebar Toggle - Visible on all screens */}
            <div className="flex items-center">
              <button
                id="sidebar-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-800/50 transition-all duration-200"
                aria-label="Toggle sidebar"
              >
                <div className="w-6 h-6 relative">
                  <span className="absolute left-0 top-1 w-6 h-0.5 bg-current"></span>
                  <span className="absolute left-0 top-3 w-6 h-0.5 bg-current"></span>
                  <span className="absolute left-0 top-5 w-6 h-0.5 bg-current"></span>
                </div>
              </button>
              
              <div className="flex-shrink-0">
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200"
                >
                  <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                    MDK Agency
                  </span>
                </Link>
              </div>
            </div>
            
            {/* Desktop Navigation - Visible on lg screens and above */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-purple-800/50 transition-all duration-200 hover:scale-105 flex items-center"
                  >
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="flex space-x-2 ml-4">
                  {authItems.map((item) => (
                    <Link 
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r ${item.gradient} text-white hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-teal-500/25`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tablet Navigation - Visible on md screens (768px - 1023px) */}
            <div className="hidden md:flex lg:hidden items-center space-x-2">
              {authItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r ${item.gradient} text-white hover:scale-105 transition-all duration-200`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile menu button - Visible on small screens */}
            <div className="md:hidden flex items-center">
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-800/50 focus:outline-none transition-all duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <div className="w-6 h-6 relative">
                  <span className={`absolute left-0 top-1 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 top-3' : ''
                  }`}></span>
                  <span className={`absolute left-0 top-3 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}></span>
                  <span className={`absolute left-0 top-5 w-6 h-0.5 bg-current transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45 top-3' : ''
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation - Only for small screens */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-4 pt-2 pb-4 space-y-1 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
            {[...navItems, ...authItems].map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center ${
                  authItems.some(authItem => authItem.path === item.path) 
                    ? `bg-gradient-to-r ${item.gradient} text-white` 
                    : 'text-gray-300 hover:text-white hover:bg-purple-800/50'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay - Visible on all screens when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Enhanced Sidebar - Accessible on all screen sizes */}
      <div 
        id="sidebar"
        className={`fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-lg shadow-2xl z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="text-2xl font-bold text-white"
              onClick={handleSidebarLinkClick}
            >
              <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                MDK Agency
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-purple-800/50 transition-all duration-200"
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Screen size indicator (for demo purposes) */}
          <div className="mt-2 text-xs text-gray-400">
            Current view: {screenSize} screen
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              onClick={handleSidebarLinkClick}
              className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-800/50 transition-all duration-200 group"
            >
              <span className="text-lg mr-3 group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Sidebar Auth Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="space-y-2">
            {authItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={handleSidebarLinkClick}
                className={`flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r ${item.gradient} text-white font-medium hover:scale-105 transition-all duration-200`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Additional info for different screen sizes */}
          <div className="mt-4 text-center">
            <div className="text-xs text-gray-400">
              Sidebar accessible on all screen sizes
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {screenSize === 'mobile' && '📱 Mobile view'}
              {screenSize === 'tablet' && '📟 Tablet view'}
              {screenSize === 'desktop' && '💻 Desktop view'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

