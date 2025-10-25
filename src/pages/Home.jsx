



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Navigation is now handled by Navbar component */}
      <Navbar isScrolled={isScrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* Enhanced Hero Section with Animation */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-slate-900/50"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-teal-400/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Transform Your{' '}
              <span className="bg-gradient-to-r from-teal-400 via-purple-400 to-teal-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Digital Presence
              </span>{' '}
              with AI
            </h1>
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              We deliver cutting-edge AI-powered solutions that drive growth, 
              enhance engagement, and transform businesses for the digital age.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-200">
              <Link 
                to="/services" 
                className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transform"
              >
                <span className="flex items-center justify-center">
                  🚀 Explore Our Services
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </Link>
              <Link 
                to="/contact" 
                className="group px-8 py-4 bg-transparent border-2 border-teal-400 text-teal-400 font-semibold rounded-xl hover:bg-teal-400/10 transition-all duration-300 hover:scale-105 transform"
              >
                <span className="flex items-center justify-center">
                  💬 Get Free Consultation
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <div className="relative">
        <div className="absolute top-20 left-10 w-4 h-4 bg-teal-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-teal-300 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Enhanced Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* About Section with Interactive Cards */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">MDK Agency</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We blend artificial intelligence with human creativity to craft digital 
              experiences that drive real business results and create lasting impact.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <div className="group p-6 bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold mb-3 text-teal-400">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To democratize AI technology and make it accessible to businesses of all sizes, 
                  empowering them to compete in the digital landscape with innovative, data-driven solutions.
                </p>
              </div>
              
              <div className="group p-6 bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-slate-700 hover:border-purple-400 transition-all duration-300 hover:scale-105">
                <h3 className="text-2xl font-bold mb-3 text-purple-400">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  A future where every business can leverage AI to enhance creativity, 
                  streamline operations, and create meaningful connections with their audience.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="AI-powered digital workspace"
                className="rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-teal-400 to-purple-400 rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-4xl">🤖</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section with Hover Effects */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose MDK Agency?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the perfect fusion of cutting-edge technology and creative excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI-Powered Solutions', desc: 'Leverage cutting-edge AI for content generation and automated marketing.' },
              { icon: '🎨', title: 'Creative Excellence', desc: 'Talented designers ensuring projects exceed aesthetic expectations.' },
              { icon: '📊', title: 'Data-Driven Results', desc: 'Strategies backed by comprehensive data analysis for maximum ROI.' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Streamlined processes delivering high-quality results faster.' },
              { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security protecting your data and assets.' },
              { icon: '🌐', title: 'Global Reach', desc: 'AI-powered localization for effective international expansion.' }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-slate-800/30 rounded-2xl backdrop-blur-sm border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/10"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Stats Section */}
        <section className="py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'Projects Completed', suffix: '' },
              { number: '98', label: 'Client Satisfaction', suffix: '%' },
              { number: '50+', label: 'AI Models Deployed', suffix: '' },
              { number: '24/7', label: 'Support Available', suffix: '' }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 bg-gradient-to-br from-slate-800/40 to-purple-900/20 rounded-2xl backdrop-blur-sm border border-slate-700 hover:border-teal-400 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                  {stat.number}<span className="text-purple-400">{stat.suffix}</span>
                </div>
                <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20">
          <div className="relative bg-gradient-to-r from-teal-500/10 via-purple-500/10 to-slate-900/50 p-12 rounded-3xl border border-slate-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-purple-500/5"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"></div>
            
            <div className="relative text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Join hundreds of successful businesses that have transformed their digital 
                presence with our AI-powered solutions. Let's create something extraordinary together.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/contact" 
                  className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all duration-300 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 transform"
                >
                  🚀 Start Your Project
                </Link>
                <Link 
                  to="/services" 
                  className="group px-8 py-4 bg-transparent border-2 border-teal-400 text-teal-400 font-semibold rounded-xl hover:bg-teal-400/10 transition-all duration-300 hover:scale-105 transform"
                >
                  📋 View Case Studies
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative bg-slate-900 border-t border-slate-800 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-slate-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                MDK Agency
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Transforming businesses with innovative AI-powered digital solutions 
                that drive growth and create lasting impact.
              </p>
            </div>
            
            {[
              {
                title: 'Quick Links',
                links: ['Home', 'About', 'Services', 'Portfolio', 'Contact']
              },
              {
                title: 'Services',
                links: ['AI Solutions', 'Web Development', 'Digital Marketing', 'Creative Design', 'Data Analytics']
              },
              {
                title: 'Connect',
                links: ['LinkedIn', 'Twitter', 'GitHub', 'Dribbble', 'Instagram']
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-200 hover:pl-2 block">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-gray-500">
              © {new Date().getFullYear()} MDK Agency. All rights reserved. | 
              <span className="text-teal-400 ml-1">Building the Future with AI</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;



