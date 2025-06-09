import React, { useState, useEffect } from 'react';
import { 
  User, Settings, Home, ClipboardList, Clock, CheckCircle, 
  Star, History, Search, MapPin, Calendar, CreditCard, 
  MessageSquare, Menu, X, LogOut, Info, Phone, Mail
} from 'lucide-react';
import axios from 'axios';

const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Cityville'
  });
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [newBooking, setNewBooking] = useState({
    serviceId: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  });
  const [review, setReview] = useState({
    bookingId: '',
    rating: 0,
    comment: ''
  });

  // Fetch services and bookings on component mount
  useEffect(() => {
    // Mock API calls
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await axios.post('http://localhost:8000/api/service/get-services');
        console.log(servicesResponse.data)
        
        setServices(servicesResponse.data);
        console.log(services)
        // Fetch user bookings
        // const bookingsResponse = await axios.get('http://localhost:8000/api/bookings');
        // setBookings(bookingsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/bookings', newBooking);
      setBookings([...bookings, response.data]);
      setSelectedService(null);
      alert('Booking created successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reviews', review);
      // Update booking status to reviewed
      const updatedBookings = bookings.map(booking => 
        booking.id === review.bookingId ? {...booking, reviewed: true} : booking
      );
      setBookings(updatedBookings);
      setReview({ bookingId: '', rating: 0, comment: '' });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Review error:', error);
      alert('Failed to submit review');
    }
  };

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Upcoming Bookings
        </h2>
        <div className="space-y-4">
          {bookings.filter(b => b.status === 'accepted').slice(0, 3).map(booking => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{booking.serviceName}</h3>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {booking.date} at {booking.time}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {booking.address}
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {booking.status}
                </span>
              </div>
              <div className="mt-3 flex justify-end">
                <button 
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  onClick={() => setActiveTab('bookings')}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
          {bookings.filter(b => b.status === 'accepted').length === 0 && (
            <p className="text-gray-500 italic">No upcoming bookings</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Actions
        </h2>
        <div className="space-y-3">
          <button 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium text-left flex items-center gap-3 hover:from-blue-600 hover:to-purple-700 transition-all"
            onClick={() => setActiveTab('services')}
          >
            <ClipboardList className="w-5 h-5" />
            Browse Services
          </button>
          <button 
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-lg font-medium text-left flex items-center gap-3 hover:from-green-600 hover:to-teal-700 transition-all"
            onClick={() => setActiveTab('history')}
          >
            <History className="w-5 h-5" />
            View History
          </button>
          <button 
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium text-left flex items-center gap-3 hover:from-purple-600 hover:to-pink-700 transition-all"
            onClick={() => setActiveTab('profile')}
          >
            <User className="w-5 h-5" />
            Update Profile
          </button>
        </div>

        {/* Account Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Account Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed Bookings:</span>
              <span className="font-medium">{bookings.filter(b => b.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Reviews:</span>
              <span className="font-medium">{bookings.filter(b => b.status === 'completed' && !b.reviewed).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Loyalty Points:</span>
              <span className="font-medium">1,250</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div>
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.data.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-800">{service.name}</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  ${service.price}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{service.description}</p>
              <div className="mt-4 flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">{service.rating}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm text-gray-500">{service.completedJobs} jobs</span>
              </div>
            </div>
            <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                onClick={() => setSelectedService(service)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div>
      <div className="flex overflow-x-auto mb-6 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'accepted' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Service</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Provider</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{booking.serviceName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{booking.providerName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {booking.providerRating}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-900">{booking.date}</div>
                  <div className="text-sm text-gray-500">{booking.time}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium">${booking.amount}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => {
                      if (booking.status === 'completed' && !booking.reviewed) {
                        setReview({...review, bookingId: booking.id});
                        setActiveTab('review');
                      } else {
                        // View booking details
                      }
                    }}
                  >
                    {booking.status === 'completed' && !booking.reviewed ? 'Add Review' : 'View Details'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24" />
            <h2 className="mt-4 text-xl font-bold text-gray-800">{userData.name}</h2>
            <p className="text-gray-600">Premium Member</p>
            
            <div className="mt-6 w-full">
              <div className="flex items-center p-3 border-b border-gray-100">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center p-3 border-b border-gray-100">
                <Phone className="w-5 h-5 text-gray-500 mr-3" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-start p-3">
                <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                <span>{userData.address}</span>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
              Edit Profile
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Account Security</h3>
          <div className="space-y-4">
            <button className="w-full text-left flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span>Change Password</span>
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full text-left flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span>Payment Methods</span>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full text-left flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <span>Notification Settings</span>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4">Update Profile Information</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => setUserData({...userData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={userData.address}
                onChange={(e) => setUserData({...userData, address: e.target.value})}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            
            <div className="pt-4">
              <button 
                type="button"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="font-bold text-gray-800 mb-4">Loyalty Program</h3>
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-5 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm">Your Points</div>
                <div className="text-2xl font-bold">1,250</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Next Tier</div>
                <div className="text-xl font-bold">Gold (2,000 pts)</div>
              </div>
            </div>
            <div className="mt-4 w-full bg-yellow-200 rounded-full h-2.5">
              <div className="bg-white h-2.5 rounded-full" style={{width: '62.5%'}}></div>
            </div>
            <div className="mt-2 text-xs flex justify-between">
              <span>Silver Tier</span>
              <span>750 pts to Gold</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-700 mb-3">Rewards</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-600">$10 OFF</div>
                <p className="text-sm text-gray-600 mt-1">Any service over $100</p>
                <div className="mt-3 text-xs text-gray-500">500 points</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-600">Free Cleaning</div>
                <p className="text-sm text-gray-600 mt-1">Basic home cleaning</p>
                <div className="mt-3 text-xs text-gray-500">1,500 points</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-blue-600">Priority Booking</div>
                <p className="text-sm text-gray-600 mt-1">Jump the queue</p>
                <div className="mt-3 text-xs text-gray-500">2,000 points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookingForm = () => (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Book {selectedService?.name}</h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setSelectedService(null)}
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <form onSubmit={handleBookingSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="font-medium">{selectedService?.name}</div>
              <div className="text-gray-600 mt-1">${selectedService?.price}</div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={newBooking.date}
              onChange={(e) => setNewBooking({...newBooking, date: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <select
              value={newBooking.time}
              onChange={(e) => setNewBooking({...newBooking, time: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a time</option>
              <option value="9:00 AM">9:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="1:00 PM">1:00 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="5:00 PM">5:00 PM</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
            <input
              type="text"
              value={newBooking.address}
              onChange={(e) => setNewBooking({...newBooking, address: e.target.value})}
              placeholder="Enter service address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
          <textarea
            value={newBooking.notes}
            onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
            placeholder="Any special requirements or notes for the provider"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );

  const renderReviewForm = () => {
    const booking = bookings.find(b => b.id === review.bookingId);
    
    return (
      <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Rate Your Experience</h2>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setReview({...review, bookingId: ''})}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div className="ml-4">
              <h3 className="font-bold">{booking?.serviceName}</h3>
              <p className="text-gray-600">{booking?.providerName}</p>
              <p className="text-sm text-gray-500 mt-1">
                {booking?.date} • {booking?.time}
              </p>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleReviewSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Service Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({...review, rating: star})}
                  className="text-2xl focus:outline-none"
                >
                  {star <= review.rating ? 
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" /> : 
                    <Star className="w-8 h-8 text-gray-300" />
                  }
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea
              value={review.comment}
              onChange={(e) => setReview({...review, comment: e.target.value})}
              placeholder="Share details of your experience with this provider"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderHistory = () => (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Booking History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Service</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Provider</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.filter(b => b.status === 'completed').map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{booking.serviceName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div>{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                      <div className="ml-2 font-medium">{booking.providerName}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">${booking.amount}</div>
                    <div className="text-sm text-gray-500">{booking.paymentMethod}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {booking.reviewed ? (
                        <>
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="ml-1 font-medium">{booking.userRating}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Not reviewed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4">Payment Methods</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                <div>
                  <div className="font-medium">Visa ending in 1234</div>
                  <div className="text-sm text-gray-500">Expires 12/2025</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="w-6 h-6 text-purple-500 mr-3" />
                <div>
                  <div className="font-medium">Mastercard ending in 5678</div>
                  <div className="text-sm text-gray-500">Expires 08/2024</div>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Edit
              </button>
            </div>
            
            <button className="w-full text-center text-blue-600 font-medium py-3 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50">
              + Add Payment Method
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-4">Service Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Preferred Service Time</span>
              <span className="font-medium">Afternoon (1-5 PM)</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Communication Preference</span>
              <span className="font-medium">Text Message</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Auto-booking Confirmations</span>
              <span className="font-medium">Enabled</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Promotional Emails</span>
              <span className="font-medium">Disabled</span>
            </div>
            
            <button className="w-full mt-4 bg-gray-100 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-200">
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileMenu(false)}></div>
          <div className="relative bg-white w-64 h-full shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div>
                  <div className="font-bold">{userData.name}</div>
                  <div className="text-sm text-gray-500">Customer</div>
                </div>
              </div>
            </div>
            <nav className="p-4">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Home },
                { id: 'services', label: 'Services', icon: ClipboardList },
                { id: 'bookings', label: 'Bookings', icon: Clock },
                { id: 'history', label: 'History', icon: History },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left ${
                    activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowMobileMenu(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 text-left">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-md z-30">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
            <div>
              <div className="font-bold text-lg">{userData.name}</div>
              <div className="text-sm text-gray-500">Customer</div>
            </div>
          </div>
        </div>
        <nav className="p-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'services', label: 'Services', icon: ClipboardList },
            { id: 'bookings', label: 'Bookings', icon: Clock },
            { id: 'history', label: 'History', icon: History },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left ${
                activeTab === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 text-left mt-10">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-4 text-gray-500"
                onClick={() => setShowMobileMenu(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 capitalize">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'services' && 'Services'}
                {activeTab === 'bookings' && 'Bookings'}
                {activeTab === 'profile' && 'Profile'}
                {activeTab === 'history' && 'History'}
                {selectedService && 'Book Service'}
                {review.bookingId && 'Leave a Review'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 lg:w-10 lg:h-10" />
                <span className="hidden md:block font-medium">{userData.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:px-6 lg:px-8 py-8">
          {selectedService && renderBookingForm()}
          {review.bookingId && renderReviewForm()}
          {!selectedService && !review.bookingId && (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'services' && renderServices()}
              {activeTab === 'bookings' && renderBookings()}
              {activeTab === 'profile' && renderProfile()}
              {activeTab === 'history' && renderHistory()}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

// Mock icons for demonstration
const Bell = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const Zap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;

export default CustomerDashboard;