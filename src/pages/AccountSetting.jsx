


import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Profile = () => {
  // State for user data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    profilePhoto: null,
    notifications: {
      email: true,
      push: false,
      marketing: true,
      security: true
    },
    profileVisibility: "Public",
    shareAnalytics: true,
    shareThirdParty: false,
    twoFactorEnabled: false,
    connectedAccounts: []
  });

  // State for active section
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const fileInputRef = useRef(null);
  const sidebarRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-button')) {
        setIsSidebarOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Initialize user data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setUserData(prevData => ({
        ...prevData,
        ...parsedData,
        notifications: { ...prevData.notifications, ...parsedData.notifications }
      }));
    }
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsMenuOpen(!isSidebarOpen);
  };

  // Close sidebar when a link is clicked
  const handleSidebarLinkClick = () => {
    setIsSidebarOpen(false);
    setIsMenuOpen(false);
  };

  // Save user data to localStorage
  const saveUserData = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      showNotification('Your changes have been saved successfully!', 'success');
    }, 1000);
  };

  // Show notification
  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle notification toggle changes
  const handleNotificationChange = (key) => {
    setUserData(prevData => ({
      ...prevData,
      notifications: {
        ...prevData.notifications,
        [key]: !prevData.notifications[key]
      }
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (key) => {
    setUserData(prevData => ({
      ...prevData,
      [key]: !prevData[key]
    }));
  };

  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('File size should be less than 5MB', 'error');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData(prevData => ({
          ...prevData,
          profilePhoto: event.target.result
        }));
        showNotification('Profile photo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showNotification('Password must be at least 8 characters long', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      showNotification('Password updated successfully!', 'success');
    }, 1000);
  };

  // Handle two-factor authentication toggle
  const handleTwoFactorToggle = () => {
    setUserData(prevData => ({
      ...prevData,
      twoFactorEnabled: !prevData.twoFactorEnabled
    }));
    showNotification(
      `Two-factor authentication ${!userData.twoFactorEnabled ? 'enabled' : 'disabled'}`,
      'success'
    );
  };

  // Handle connected account toggle
  const handleAccountToggle = (accountId) => {
    setUserData(prevData => {
      const isConnected = prevData.connectedAccounts.includes(accountId);
      const updatedAccounts = isConnected
        ? prevData.connectedAccounts.filter(id => id !== accountId)
        : [...prevData.connectedAccounts, accountId];
      
      return {
        ...prevData,
        connectedAccounts: updatedAccounts
      };
    });

    const isConnected = userData.connectedAccounts.includes(accountId);
    showNotification(
      `${accountId.charAt(0).toUpperCase() + accountId.slice(1)} account ${isConnected ? 'disconnected' : 'connected'}`,
      'success'
    );
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsLoading(true);
      // Simulate account deletion
      setTimeout(() => {
        setIsLoading(false);
        localStorage.removeItem('userData');
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bio: "",
          profilePhoto: null,
          notifications: {
            email: false,
            push: false,
            marketing: false,
            security: false
          },
          profileVisibility: "Private",
          shareAnalytics: false,
          shareThirdParty: false,
          twoFactorEnabled: false,
          connectedAccounts: []
        });
        showNotification('Account deleted successfully', 'success');
      }, 2000);
    }
  };

  // Download user data
  const handleDownloadData = () => {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-data.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Data downloaded successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
           
      <Navbar isScrolled={isScrolled} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {/* Slide-out Sidebar for Mobile */}
      <div className={`fixed inset-0 z-50 transition-transform duration-300 ease-in-out md:hidden ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleSidebar}
        ></div>
        
        {/* Sidebar Content */}
        <div 
          ref={sidebarRef}
          className="relative w-80 h-full bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl overflow-y-auto"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700">
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
                onClick={toggleSidebar}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* User Info Section */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-400 truncate">{userData.email}</p>
                <Link 
                  to="/profile" 
                  className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
                  onClick={handleSidebarLinkClick}
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4">
            <nav className="space-y-2">
              {[
                { path: '/', label: 'Home', icon: 'home' },
                { path: '/about', label: 'About', icon: 'info-circle' },
                { path: '/services', label: 'Services', icon: 'cog' },
                { path: '/portfolio', label: 'Portfolio', icon: 'briefcase' },
                { path: '/contact', label: 'Contact', icon: 'envelope' },
                { path: '/authform', label: 'Login/SignUp', icon: 'user', special: true },
                { path: '/profile', label: 'Profile', icon: 'user-cog', special: true }
              ].map((item) => (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={handleSidebarLinkClick}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 group ${
                    item.special 
                      ? item.path === '/authform' 
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <i className={`fas fa-${item.icon} mr-3 text-lg w-5 text-center group-hover:scale-110 transition-transform`}></i>
                  <span>{item.label}</span>
                  {item.special && (
                    <i className="fas fa-chevron-right ml-auto text-sm opacity-70"></i>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="flex items-center w-full px-4 py-3 text-left rounded-xl text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors group">
                <i className="fas fa-cog mr-3 text-lg w-5 text-center group-hover:scale-110 transition-transform"></i>
                <span>Settings</span>
              </button>
              <button className="flex items-center w-full px-4 py-3 text-left rounded-xl text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors group">
                <i className="fas fa-question-circle mr-3 text-lg w-5 text-center group-hover:scale-110 transition-transform"></i>
                <span>Help & Support</span>
              </button>
              <button className="flex items-center w-full px-4 py-3 text-left rounded-xl text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors group">
                <i className="fas fa-sign-out-alt mr-3 text-lg w-5 text-center group-hover:scale-110 transition-transform"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700 mt-auto">
            <div className="text-center text-gray-400 text-sm">
              <p>© 2024 MDK Agency. All rights reserved.</p>
              <div className="flex justify-center space-x-4 mt-2">
                <a href="#" className="hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
            <span>Saving changes...</span>
          </div>
        </div>
      )}

      <div className="pt-24 flex flex-col md:flex-row max-w-7xl mx-auto px-4">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white/80 backdrop-blur-lg shadow-xl rounded-xl mb-4 md:mb-0 md:mr-6">
          <div className="p-6 border-b border-gray-200">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Account Settings
            </h4>
            <p className="text-gray-600 text-sm mt-1">Manage your account preferences</p>
          </div>
          
          <div className="p-4">
            <ul className="space-y-1">
              {[
                { id: 'profile', icon: 'user', label: 'Profile Information' },
                { id: 'password', icon: 'lock', label: 'Password & Security' },
                { id: 'notifications', icon: 'bell', label: 'Notifications' },
                { id: 'privacy', icon: 'shield-alt', label: 'Privacy & Data' },
                { id: 'two-factor', icon: 'key', label: 'Two-Factor Auth' },
                { id: 'connected', icon: 'link', label: 'Connected Accounts' }
              ].map((item) => (
                <li key={item.id}>
                  <button 
                    className={`w-full text-left flex items-center px-4 py-4 rounded-xl transition-all duration-200 group ${
                      activeSection === item.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <i className={`fas fa-${item.icon} mr-3 text-lg group-hover:scale-110 transition-transform`}></i>
                    <span className="font-medium">{item.label}</span>
                    {activeSection === item.id && (
                      <i className="fas fa-chevron-right ml-auto transform rotate-90"></i>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* User Summary */}
          <div className="p-4 mt-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">{userData.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {activeSection === 'profile' && 'Profile Information'}
                {activeSection === 'password' && 'Password & Security'}
                {activeSection === 'notifications' && 'Notification Preferences'}
                {activeSection === 'privacy' && 'Privacy & Data'}
                {activeSection === 'two-factor' && 'Two-Factor Authentication'}
                {activeSection === 'connected' && 'Connected Accounts'}
              </h2>
              <p className="text-gray-600">
                {activeSection === 'profile' && 'Update your personal information'}
                {activeSection === 'password' && 'Manage your password and security settings'}
                {activeSection === 'notifications' && 'Control how you receive notifications'}
                {activeSection === 'privacy' && 'Manage your privacy and data sharing preferences'}
                {activeSection === 'two-factor' && 'Add an extra layer of security to your account'}
                {activeSection === 'connected' && 'Manage your connected social accounts'}
              </p>
            </div>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center mt-4 md:mt-0"
              onClick={saveUserData}
              disabled={isLoading}
            >
              <i className="fas fa-save mr-2"></i>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Photo Section */}
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg overflow-hidden">
                      {userData.profilePhoto ? (
                        <img 
                          src={userData.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={triggerFileInput}
                      className="absolute -bottom-2 -right-2 bg-white text-indigo-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <i className="fas fa-camera"></i>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  <button 
                    onClick={triggerFileInput}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">JPG, PNG or GIF • Max 5MB</p>
                </div>

                {/* Profile Form */}
                <div className="lg:w-2/3">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          id="firstName" 
                          value={userData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          id="lastName" 
                          value={userData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          id="email" 
                          value={userData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input 
                          type="tel" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          id="phone" 
                          value={userData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        rows="4" 
                        id="bio"
                        value={userData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        maxLength="500"
                      ></textarea>
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {userData.bio.length}/500 characters
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Password & Security Section */}
          {activeSection === 'password' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Password & Security</h3>
                <p className="text-gray-600">Keep your account secure with a strong password and security settings.</p>
              </div>

              <div className="space-y-8">
                {/* Change Password */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-lock text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Change Password</h4>
                      <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                        <input 
                          type="password" 
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <i className="fas fa-info-circle mr-1"></i>
                        Password must be at least 8 characters long
                      </div>
                      <button 
                        type="submit"
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Security Settings */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-shield-alt text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Security Settings</h4>
                      <p className="text-sm text-gray-600">Manage your account security preferences</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <i className="fas fa-key text-green-600 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-600">Add an extra layer of security</div>
                        </div>
                      </div>
                      <button 
                        onClick={handleTwoFactorToggle}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          userData.twoFactorEnabled 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {userData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <i className="fas fa-history text-blue-600 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">Login History</div>
                          <div className="text-sm text-gray-600">View recent login activity</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold">
                        View History
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <i className="fas fa-mobile-alt text-purple-600 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">Trusted Devices</div>
                          <div className="text-sm text-gray-600">Manage your trusted devices</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Notification Preferences</h3>
                <p className="text-gray-600">Choose how you want to be notified about updates and activities.</p>
              </div>

              <div className="space-y-8">
                {/* Email Notifications */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-envelope text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Manage your email notification preferences</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Account Updates', description: 'Get notified about important account changes' },
                      { key: 'marketing', label: 'Marketing Emails', description: 'Receive promotional content and special offers' },
                      { key: 'security', label: 'Security Alerts', description: 'Important security notifications and alerts' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userData.notifications[item.key]}
                            onChange={() => handleNotificationChange(item.key)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-bell text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Control your push notification settings</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Enable Push Notifications</div>
                        <div className="text-sm text-gray-600">Receive notifications on your device</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={userData.notifications.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notification Schedule */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-clock text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Notification Schedule</h4>
                      <p className="text-sm text-gray-600">Set when you want to receive notifications</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quiet Hours Start</label>
                      <input 
                        type="time" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        defaultValue="22:00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quiet Hours End</label>
                      <input 
                        type="time" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        defaultValue="08:00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Data Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Privacy & Data</h3>
                <p className="text-gray-600">Control how your data is used and shared with third parties.</p>
              </div>

              <div className="space-y-8">
                {/* Profile Visibility */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-eye text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Control who can see your profile information</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Profile Visibility</div>
                        <div className="text-sm text-gray-600">Make your profile visible to other users</div>
                      </div>
                      <select 
                        value={userData.profileVisibility}
                        onChange={(e) => setUserData(prev => ({ ...prev, profileVisibility: e.target.value }))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Public">Public</option>
                        <option value="Private">Private</option>
                        <option value="Friends Only">Friends Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data Sharing */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-share-alt text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Data Sharing</h4>
                      <p className="text-sm text-gray-600">Control how your data is shared with third parties</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'shareAnalytics', label: 'Analytics Data', description: 'Help improve our services by sharing anonymous usage data' },
                      { key: 'shareThirdParty', label: 'Third-Party Sharing', description: 'Allow sharing data with trusted partners for better services' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={userData[item.key]}
                            onChange={() => handleCheckboxChange(item.key)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Management */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-database text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Data Management</h4>
                      <p className="text-sm text-gray-600">Manage your personal data and privacy settings</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Download Your Data</div>
                        <div className="text-sm text-gray-600">Get a copy of all your data</div>
                      </div>
                      <button 
                        onClick={handleDownloadData}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
                      >
                        Download
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">Delete Account</div>
                        <div className="text-sm text-gray-600">Permanently delete your account and all data</div>
                      </div>
                      <button 
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Two-Factor Authentication Section */}
          {activeSection === 'two-factor' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h3>
                <p className="text-gray-600">Add an extra layer of security to your account with 2FA.</p>
              </div>

              <div className="space-y-8">
                {/* Current Status */}
                <div className={`rounded-xl p-6 border ${userData.twoFactorEnabled ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'}`}>
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${userData.twoFactorEnabled ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <i className={`fas ${userData.twoFactorEnabled ? 'fa-check' : 'fa-exclamation-triangle'} text-white`}></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {userData.twoFactorEnabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {userData.twoFactorEnabled 
                          ? 'Your account is protected with an additional security layer' 
                          : 'Enable 2FA to add an extra layer of security to your account'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <i className="fas fa-info-circle mr-1"></i>
                      {userData.twoFactorEnabled 
                        ? 'You will be required to enter a verification code when signing in' 
                        : 'You will need to set up an authenticator app to enable 2FA'
                      }
                    </div>
                    <button 
                      onClick={handleTwoFactorToggle}
                      className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                        userData.twoFactorEnabled 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {userData.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  </div>
                </div>

                {/* Setup Instructions */}
                {!userData.twoFactorEnabled && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-mobile-alt text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Setup Instructions</h4>
                        <p className="text-sm text-gray-600">Follow these steps to enable two-factor authentication</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">1</div>
                        <div>
                          <div className="font-semibold text-gray-800">Download an Authenticator App</div>
                          <div className="text-sm text-gray-600">Install Google Authenticator, Authy, or similar app on your phone</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">2</div>
                        <div>
                          <div className="font-semibold text-gray-800">Scan QR Code</div>
                          <div className="text-sm text-gray-600">Use your authenticator app to scan the QR code we'll provide</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">3</div>
                        <div>
                          <div className="font-semibold text-gray-800">Enter Verification Code</div>
                          <div className="text-sm text-gray-600">Enter the 6-digit code from your authenticator app</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Backup Codes */}
                {userData.twoFactorEnabled && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-key text-white"></i>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Backup Codes</h4>
                        <p className="text-sm text-gray-600">Use these codes if you lose access to your authenticator app</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                        {['ABC123', 'DEF456', 'GHI789', 'JKL012', 'MNO345', 'PQR678', 'STU901', 'VWX234'].map((code, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-center">{code}</div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-semibold">
                        Download Codes
                      </button>
                      <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors font-semibold">
                        Regenerate Codes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Connected Accounts Section */}
          {activeSection === 'connected' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Connected Accounts</h3>
                <p className="text-gray-600">Manage your connected social media and third-party accounts.</p>
              </div>

              <div className="space-y-6">
                {/* Social Media Accounts */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-share-alt text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Social Media Accounts</h4>
                      <p className="text-sm text-gray-600">Connect your social media accounts for easy sign-in</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'google', name: 'Google', icon: 'fab fa-google', color: 'red', description: 'Sign in with Google' },
                      { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook', color: 'blue', description: 'Connect your Facebook account' },
                      { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter', color: 'blue', description: 'Connect your Twitter account' },
                      { id: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin', color: 'blue', description: 'Connect your LinkedIn account' },
                      { id: 'github', name: 'GitHub', icon: 'fab fa-github', color: 'gray', description: 'Connect your GitHub account' }
                    ].map((account) => {
                      const isConnected = userData.connectedAccounts.includes(account.id);
                      return (
                        <div key={account.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 bg-${account.color}-500 rounded-lg flex items-center justify-center mr-4`}>
                              <i className={`${account.icon} text-white`}></i>
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{account.name}</div>
                              <div className="text-sm text-gray-600">{account.description}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleAccountToggle(account.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              isConnected 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isConnected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Third-Party Services */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-plug text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Third-Party Services</h4>
                      <p className="text-sm text-gray-600">Manage integrations with external services</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'Stripe', description: 'Payment processing service', status: 'Connected' },
                      { name: 'Mailchimp', description: 'Email marketing platform', status: 'Not Connected' },
                      { name: 'Slack', description: 'Team communication tool', status: 'Not Connected' },
                      { name: 'Zapier', description: 'Automation platform', status: 'Connected' }
                    ].map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mr-4">
                            <i className="fas fa-cog text-white"></i>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{service.name}</div>
                            <div className="text-sm text-gray-600">{service.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            service.status === 'Connected' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {service.status}
                          </span>
                          <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Security */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-shield-alt text-white"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Account Security</h4>
                      <p className="text-sm text-gray-600">Review and manage your account security settings</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <i className="fas fa-key text-purple-600 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">Password Strength</div>
                          <div className="text-sm text-gray-600">Your password is strong</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-green-600">Strong</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div className="flex items-center">
                        <i className="fas fa-clock text-blue-600 mr-3"></i>
                        <div>
                          <div className="font-semibold text-gray-800">Last Password Change</div>
                          <div className="text-sm text-gray-600">30 days ago</div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;