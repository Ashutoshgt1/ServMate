import React, { useState ,useEffect} from 'react';
import { 
  Wrench, Eye, EyeOff, Phone, Lock, AlertCircle, LogIn, 
  CheckCircle // Added missing import
} from 'lucide-react';
import axios from "axios";
import { Link , useNavigate} from 'react-router-dom';

const CustomerLogin = () => {




      const navigate = useNavigate(); // Initialize navigate


     
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/customers/login", {
        phone: formData.phone.trim(),
        password: formData.password
      },{withCredentials:true});
            localStorage.setItem("accessToken", response.data.data.accessToken);


      if (response.data.success) {
        setIsSuccess(true);
        // Store token/user data here (localStorage/context)
        
        // Redirect after delay
        setTimeout(() => navigate("/customer/dashboard"), 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Successful!</h2>
          <p className="text-gray-600 mb-6">
            Welcome back to Local Service Connect!
          </p>
          <button onClick={() => navigate("/customer/dashboard")} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-25 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 text-white mb-4">
          <Wrench className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Local Service Connect</h1>
        </div>
        <p className="text-white/90 text-lg">Your trusted local services partner</p>
      </div>

      {/* Login Form */}
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.phone ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    errors.password ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </div>
              )}
            </button>

            {errors.submit && (
              <p className="text-sm text-red-500 text-center flex items-center justify-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.submit}
              </p>
            )}
          </form>

          {/* Registration Link */}
          <div className="text-center pt-6 border-t border-gray-200 mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;