import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

// --- added: interactive 3D tilt card component ---
const TiltCard = ({ children, className = "", intensity = 20 }) => {
  const ref = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * intensity; // rotateX
    const ry = (px - 0.5) * -intensity; // rotateY

    animRef.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      el.style.boxShadow = `${-ry * 0.6}px ${rx * 0.6}px 30px rgba(16,24,40,0.12)`;
    });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(animRef.current);
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
    el.style.boxShadow = `0 10px 30px rgba(16,24,40,0.06)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`transform-gpu transition-transform duration-300 will-change-transform ${className}`}
      style={{
        transformStyle: "preserve-3d",
        borderRadius: "12px",
        backgroundClip: "padding-box",
      }}
    >
      {children}
    </div>
  );
};

// --- added: floating badge (animated metrics) ---
const FloatingBadge = ({ value, label, color = "indigo" }) => (
  <div className="relative w-40 h-28">
    <div className={`absolute -top-4 left-2 animate-float-${color}`}>
      <div className={`bg-${color}-600 text-white px-4 py-2 rounded-xl shadow-lg font-semibold`}>
        <div className="text-2xl">{value}</div>
        <div className="text-xs opacity-90">{label}</div>
      </div>
    </div>
  </div>
);

function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // small scroll listener to change navbar state (improves UX)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-['Inter'] text-gray-800 leading-relaxed">
      {/* Navigation */}
      <Navbar isScrolled={isScrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Enhanced Hero Section with animated 3D card + floating badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col-reverse md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Trusted by 10,000+ Businesses Worldwide
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            MDK Agency combines AI, design, and strategy to accelerate growth. From prototypes to production — we build measurable value.
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <FloatingBadge value="10k+" label="Happy Clients" color="indigo" />
            <FloatingBadge value="98%" label="Avg. Success" color="green" />
            <FloatingBadge value="24/7" label="Support" color="purple" />
          </div>

          <div className="flex gap-4">
            <Link to="/contact" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition">
              Start a Project
            </Link>
            <Link to="/services" className="inline-block bg-transparent text-indigo-600 px-6 py-3 rounded-md font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition">
              View Services
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <TiltCard className="w-full max-w-md">
            <div className="rounded-xl overflow-hidden bg-white p-6 shadow-xl border border-gray-100">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
                  alt="Innovative workspace with technology"
                  className="w-full h-full object-cover"
                  style={{ transform: "translateZ(20px)" }}
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
                  <h3 className="text-sm font-semibold">AI Strategy + Design</h3>
                  <p className="text-xs text-gray-600">From roadmap to execution, tailored for your business.</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-indigo-600">+300%</div>
                  <div className="text-xs text-gray-500">Avg. ROI</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">24h</div>
                  <div className="text-xs text-gray-500">Rapid Prototypes</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">50+</div>
                  <div className="text-xs text-gray-500">Integrations</div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Trust Indicators Section (kept, improved visuals) */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why 10,000+ Businesses Trust MDK Agency
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* ...existing cards but wrapped in TiltCard for interactivity */}
            <TiltCard className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Recognition</h3>
              <p className="text-gray-600">
                Winner of "Best AI Agency 2023" and multiple innovation awards.
              </p>
            </TiltCard>

            <TiltCard className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise Security</h3>
              <p className="text-gray-600">
                SOC 2 Type II & ISO 27001 — secure by design.
              </p>
            </TiltCard>

            <TiltCard className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5-Star Reviews</h3>
              <p className="text-gray-600">
                4.9/5 average rating across 2,500+ verified reviews.
              </p>
            </TiltCard>

            <TiltCard className="bg-white p-6 rounded-xl text-center shadow-sm border border-gray-200 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fortune 500 Clients</h3>
              <p className="text-gray-600">
                Trusted by leading enterprises across industries.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Why Choose MDK Agency?
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Discover what makes us the preferred choice for digital transformation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Innovation</h3>
              <p className="text-gray-600">
                We leverage cutting-edge artificial intelligence to deliver solutions that are 10x faster and more accurate than traditional methods.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning-Fast Delivery</h3>
              <p className="text-gray-600">
                Get your projects delivered in record time. Our streamlined processes enable us to deliver results 3x faster than industry standards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cost-Effective Solutions</h3>
              <p className="text-gray-600">
                Save up to 60% on your digital projects with our efficient AI-powered processes while maintaining premium quality standards.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600">
                Our clients see an average 300% increase in ROI within the first 6 months. We deliver measurable business growth.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Expertise</h3>
              <p className="text-gray-600">
                With teams across 15 countries and 24/7 support, we provide seamless service regardless of your timezone.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-indigo-600 hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Continuous Innovation</h3>
              <p className="text-gray-600">
                We invest 20% of our revenue in R&D, ensuring our clients always have access to the latest technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section id="mission" className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            Our Mission & Vision
          </h2>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-lg space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">Our Mission</h3>
              <p className="text-gray-600">
                We democratize advanced AI and design for every business — delivering measurable growth with human-centered solutions.
              </p>

              <h3 className="text-2xl font-semibold text-gray-900">Our Vision</h3>
              <p className="text-gray-600">
                To empower 1M businesses by 2030 with responsible, scalable AI that amplifies human creativity.
              </p>

              <div className="mt-4 flex gap-3">
                <Link to="/case-studies" className="text-indigo-600 font-semibold hover:underline">Explore Case Studies</Link>
                <Link to="/careers" className="text-gray-600 hover:underline">Join Our Team</Link>
              </div>
            </div>

            <div className="flex-1">
              <TiltCard className="overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Abstract representation of innovation"
                  className="w-full h-80 object-cover rounded-xl shadow-md"
                />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Client Success Stories
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Real results from real clients who trust MDK Agency
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                  alt="Client" 
                  className="w-14 h-14 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">CEO, TechStart Inc.</p>
                </div>
              </div>
              <div className="text-gray-600 italic mb-6">
                "MDK Agency transformed our digital presence completely. Our website traffic increased by 400% and our conversion rate improved by 250% in just 3 months. The AI-powered approach was game-changing."
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">+400% Traffic</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">+250% Conversions</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" 
                  alt="Client" 
                  className="w-14 h-14 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Marketing Director, GlobalCorp</p>
                </div>
              </div>
              <div className="text-gray-600 italic mb-6">
                "The AI-generated content strategy delivered results we never thought possible. Our engagement rates skyrocketed and we saved 70% on content creation costs while improving quality."
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">+300% Engagement</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">70% Cost Savings</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="flex items-center mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" 
                  alt="Client" 
                  className="w-14 h-14 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Emily Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Founder, CreativeStudio</p>
                </div>
              </div>
              <div className="text-gray-600 italic mb-6">
                "The 24-hour CV service was a lifesaver! I got a professional, ATS-optimized resume that helped me land my dream job. The quality exceeded my expectations."
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">24h Delivery</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">Dream Job Landed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            150+ world-class professionals dedicated to your success
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-6">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Alex Johnson - CEO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alex Johnson</h3>
              <p className="text-indigo-600 font-semibold mb-4">CEO & Founder</p>
              <p className="text-gray-600 mb-6">
                Former Google AI researcher with 15+ years in machine learning. Led digital transformation for 500+ companies.
              </p>
              <div className="flex justify-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Stanford PhD</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Ex-Google</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-6">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Maria Chen - CTO"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maria Chen</h3>
              <p className="text-indigo-600 font-semibold mb-4">Chief Technology Officer</p>
              <p className="text-gray-600 mb-6">
                AI specialist with 20+ years experience. Built AI systems serving 10M+ users. MIT graduate with 50+ patents.
              </p>
              <div className="flex justify-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">MIT Graduate</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">50+ Patents</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 hover:shadow-md transition-transform duration-300">
              <div className="w-36 h-36 rounded-full overflow-hidden mx-auto mb-6">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="David Kim - Lead Designer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">David Kim</h3>
              <p className="text-indigo-600 font-semibold mb-4">Lead Designer</p>
              <p className="text-gray-600 mb-6">
                Creative director with 12+ years experience. Designed award-winning interfaces for Apple, Tesla, and Netflix.
              </p>
              <div className="flex justify-center gap-2">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Apple Designer</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">Award Winner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation First</h3>
              <p className="text-gray-600">
                We constantly push boundaries and embrace cutting-edge technology to deliver solutions that exceed expectations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Client Partnership</h3>
              <p className="text-gray-600">
                We don't just work for you; we work with you. Every project is a partnership built on trust and shared success.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Speed & Quality</h3>
              <p className="text-gray-600">
                We believe speed and quality aren't mutually exclusive. Our AI-powered processes deliver exceptional results fast.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl text-center shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Impact</h3>
              <p className="text-gray-600">
                We're committed to making technology accessible worldwide, helping businesses compete in the global digital economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join 10,000+ Successful Businesses?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let's transform your digital presence together. Get started with a free consultation and see why businesses worldwide trust MDK Agency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="bg-white text-indigo-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors border-2 border-white">
              Start Your Project
            </Link>
            <Link to="/services" className="bg-transparent text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors border-2 border-white">
              View Our Services
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 MDK Agency. Trusted by 10,000+ businesses worldwide. Transforming digital futures, one project at a time.</p>
        </div>
      </footer>

      {/* Inline styles and keyframes for floating badges and subtle animations */}
      <style>{`
        @keyframes float-indigo {
          0% { transform: translateY(0) translateX(0) rotateZ(-1deg); }
          50% { transform: translateY(-8px) translateX(4px) rotateZ(1deg); }
          100% { transform: translateY(0) translateX(0) rotateZ(-1deg); }
        }
        @keyframes float-green {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-6px) translateX(-4px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes float-purple {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(2px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float-indigo { animation: float-indigo 4.2s ease-in-out infinite; }
        .animate-float-green { animation: float-green 3.6s ease-in-out infinite; }
        .animate-float-purple { animation: float-purple 4.8s ease-in-out infinite; }

        /* small utilities to support dynamic color classes when not using Tailwind JIT inlined names */
        .bg-indigo-600 { background-color: #4f46e5; }
        .bg-green-600 { background-color: #16a34a; }
        .bg-purple-600 { background-color: #7c3aed; }
        .text-indigo-600 { color: #4f46e5; }
        .text-green-600 { color: #16a34a; }
        .text-purple-600 { color: #7c3aed; }

        /* ensure TiltCard children keep smooth shadows */
        .transform-gpu { will-change: transform; }
      `}</style>
    </div>
  );
}

export default About;






























