import React, { useState, useEffect, useRef } from 'react';
import { 
  Wrench, Menu, ChevronDown, Calendar, UserPlus, Zap, Hammer, Wind,
  ShieldCheck, IndianRupee, MousePointerClick, TrendingUp, User
} from 'lucide-react';
import { Link,useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
   useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    // You might want to add an event listener for storage changes
    // to handle login/logout from other tabs
  
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className={`fixed top-0 w-full z-50 text-white py-4 backdrop-blur-md transition-all duration-300 ${
      isScrolled 
        ? 'bg-gradient-to-br from-blue-500/95 to-purple-600/95' 
        : 'bg-gradient-to-br from-blue-500 to-purple-600'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <Wrench />
            Local Service Connect
          </div>
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <button 
                onClick={() => smoothScroll('home')}
                className="py-2 px-4 rounded-lg hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                Home
              </button>
            </li>
            <li>
              <button 
                onClick={() => smoothScroll('services')}
                className="py-2 px-4 rounded-lg hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                Services
              </button>
            </li>
            <li>
              <button 
                onClick={() => smoothScroll('how-it-works')}
                className="py-2 px-4 rounded-lg hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                How It Works
              </button>
            </li>
            <li>
              <button 
                onClick={() => smoothScroll('contact')}
                className="py-2 px-4 rounded-lg hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                Contact Us
              </button>
            </li>
            
            {isLoggedIn ? (
              // Logged in state
              <li className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 bg-white/20 py-2 px-6 rounded-full hover:bg-white/30 hover:scale-105 transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <User size={20} /> My Account
                  <ChevronDown />
                </button>
                <div className={`absolute top-full right-0 bg-white min-w-[160px] shadow-xl rounded-xl mt-2 transition-all duration-300 ${
                  isDropdownOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <Link to="/dashboard" className="block py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="block py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1">
                    My Profile
                  </Link>
                  <Link to="/bookings" className="block py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1">
                    My Bookings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1"
                  >
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              // Not logged in state
              <li className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center gap-2 bg-white/20 py-2 px-6 rounded-full hover:bg-white/30 hover:scale-105 transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Login / Sign Up
                  <ChevronDown />
                </button>
                <div className={`absolute top-full right-0 bg-white min-w-[160px] shadow-xl rounded-xl mt-2 transition-all duration-300 ${
                  isDropdownOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-2'
                }`}>
                  <Link to="/customer/register" className="block py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1">
                    Register Customer
                  </Link>
                  <Link to="/customer/login" className="block py-3 px-4 text-gray-800 hover:bg-gray-100 rounded-lg m-1">
                    Login Customer
                  </Link>
                </div>
              </li>
            )}
          </ul>
          <button className="md:hidden text-white">
            <Menu />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;