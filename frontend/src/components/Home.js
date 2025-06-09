import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Menu, ChevronDown, Calendar, UserPlus, Zap, Hammer, Wind,
  ShieldCheck, IndianRupee, MousePointerClick, TrendingUp
} from 'lucide-react';

// Navbar Component

// Home Component
const Home = () => {
  const smoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="font-sans text-gray-800 leading-relaxed overflow-x-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 20s ease-in-out infinite; }
        .animate-slideInUp { animation: slideInUp 1s ease-out forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        
        .grain-pattern {
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="50" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
        }
        
        .text-shadow { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); }
      `}</style>

      {/* Navbar */}

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white relative overflow-hidden">
        <div className="grain-pattern absolute inset-0 animate-float"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slideInUp text-shadow">
              🛠️ Get Trusted Local Services at Your Fingertips
            </h1>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-95 animate-slideInUp animation-delay-200">
              Book verified service providers like plumbers, electricians, and more in just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slideInUp animation-delay-400">
              <button className="py-3 px-8 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-gradient-to-r from-red-400 to-orange-500 text-white hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                <Calendar />
                Book a Service
              </button>
              <button className="py-3 px-8 rounded-full font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg bg-white/20 text-white border-2 border-white/30 hover:-translate-y-1 hover:scale-105 hover:shadow-xl">
                <UserPlus />
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-blue-500 text-center mb-6">👤 For Customers</h3>
              <div className="space-y-5">
                {[
                  { step: '1', title: 'Choose a Service', desc: 'Browse our wide range of local services' },
                  { step: '2', title: 'Book Instantly', desc: 'Select your preferred time and provider' },
                  { step: '3', title: 'Get the Job Done!', desc: 'Sit back while professionals handle your needs' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:scale-[1.02] group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-600 group-hover:text-white/90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl transition-all hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-blue-500 text-center mb-6">🔧 For Providers</h3>
              <div className="space-y-5">
                {[
                  { step: '1', title: 'Register', desc: 'Sign up and showcase your skills' },
                  { step: '2', title: 'Get Jobs Automatically', desc: 'Receive bookings based on your expertise' },
                  { step: '3', title: 'Earn Your Salary Monthly', desc: 'Get paid fairly for your quality work' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:scale-[1.02] group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      <p className="text-gray-600 group-hover:text-white/90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Wrench, title: 'Plumbing', desc: 'Expert plumbers for all your water and pipe-related issues', price: '₹250' },
              { icon: Zap, title: 'Electrical', desc: 'Certified electricians for safe and reliable electrical work', price: '₹300' },
              { icon: Hammer, title: 'Carpentry', desc: 'Skilled carpenters for furniture and woodwork solutions', price: '₹400' },
              { icon: Wind, title: 'AC Repair', desc: 'Professional AC technicians for cooling system maintenance', price: '₹350' }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-xl transition-all duration-300 border-2 border-transparent hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/30">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600">
                  <service.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <div className="text-xl font-bold text-blue-500">From {service.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: ShieldCheck, title: 'Verified Providers', desc: 'All our service providers are thoroughly vetted and verified' },
              { icon: IndianRupee, title: 'Fair Pricing', desc: 'Transparent pricing with no hidden costs or surprises' },
              { icon: MousePointerClick, title: 'Easy Booking', desc: 'Book services in just a few clicks with our intuitive platform' },
              { icon: TrendingUp, title: 'Performance-Based Earnings', desc: 'Providers earn more based on their quality and customer ratings' }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white/20">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/90">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Rajesh Kumar', role: 'Customer', initial: 'R', quote: 'Amazing service! Found a reliable plumber within minutes and the job was done perfectly. Highly recommended!' },
              { name: 'Amit Sharma', role: 'Electrician', initial: 'A', quote: 'As a service provider, this platform has helped me grow my business significantly. Fair pay and steady work!' },
              { name: 'Priya Patel', role: 'Customer', initial: 'P', quote: 'The booking process is so simple and the quality of service providers is excellent. Will use again!' }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="italic text-gray-600 mb-6">
                  "{testimonial.quote}"
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-r from-blue-500 to-purple-600">
                    {testimonial.initial}
                  </div>
                  <div>
                    <strong className="block">{testimonial.name}</strong>
                    <span className="text-gray-500 text-sm">{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="pt-16 pb-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-500">About Us</h3>
              <p className="text-gray-400">
                Local Service Connect bridges the gap between customers and skilled service providers, ensuring quality work and fair compensation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-500">Contact Info</h3>
              <a href="mailto:info@localserviceconnect.com" className="block text-gray-400 hover:text-white mb-2">
                info@localserviceconnect.com
              </a>
              <a href="tel:+911234567890" className="block text-gray-400 hover:text-white mb-2">
                +91 123-456-7890
              </a>
              <p className="text-gray-400">Ahmedabad, Gujarat, India</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-500">Quick Links</h3>
              <button onClick={() => smoothScroll('services')} className="block text-gray-400 hover:text-white mb-2 text-left">
                Services
              </button>
              <button onClick={() => smoothScroll('how-it-works')} className="block text-gray-400 hover:text-white mb-2 text-left">
                How It Works
              </button>
              <a href="#privacy" className="block text-gray-400 hover:text-white mb-2">Privacy Policy</a>
              <a href="#terms" className="block text-gray-400 hover:text-white mb-2">Terms & Conditions</a>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-500">Follow Us</h3>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Facebook</a>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Twitter</a>
              <a href="#" className="block text-gray-400 hover:text-white mb-2">Instagram</a>
              <a href="#" className="block text-gray-400 hover:text-white">LinkedIn</a>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>&copy; 2025 Local Service Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;