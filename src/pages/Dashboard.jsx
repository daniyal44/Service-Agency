import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Dynamic import for Chart.js to handle potential loading issues
let Chart;
try {
  Chart = require('chart.js/auto').default;
} catch (error) {
  console.warn('Chart.js not available, charts will be disabled');
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Admin login form state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [chartsLoaded, setChartsLoaded] = useState(false);
  
  // Enhanced activities data
  const [activities, setActivities] = useState([
    {
      id: '#1234',
      name: 'Wireless Headphones',
      image: 'https://picsum.photos/seed/product1/40/40',
      category: 'Electronics',
      price: '$89.99',
      status: 'Active',
      date: '2024-01-15',
      sales: 45,
      revenue: '$4,049.55'
    },
    {
      id: '#1235',
      name: 'Smart Watch',
      image: 'https://picsum.photos/seed/product2/40/40',
      category: 'Electronics',
      price: '$199.99',
      status: 'Pending',
      date: '2024-01-14',
      sales: 23,
      revenue: '$4,599.77'
    },
    {
      id: '#1236',
      name: 'Laptop Stand',
      image: 'https://picsum.photos/seed/product3/40/40',
      category: 'Accessories',
      price: '$49.99',
      status: 'Active',
      date: '2024-01-13',
      sales: 67,
      revenue: '$3,349.33'
    }
  ]);

  // System metrics
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 2543,
    activeUsers: 1892,
    totalRevenue: 45231,
    totalOrders: 1234,
    conversionRate: 3.24,
    avgOrderValue: 36.67,
    systemUptime: 99.9,
    serverLoad: 45
  });

  // Recent users data
  const [recentUsers, setRecentUsers] = useState([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'User', status: 'Active', lastLogin: '4 hours ago' },
    { id: 3, name: 'Mike Wilson', email: 'mike@example.com', role: 'User', status: 'Inactive', lastLogin: '2 days ago' }
  ]);

  // System alerts
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Server load is high (85%)', time: '5 minutes ago' },
    { id: 2, type: 'info', message: 'New user registration', time: '10 minutes ago' },
    { id: 3, type: 'success', message: 'Backup completed successfully', time: '1 hour ago' }
  ]);

  const revenueChartRef = useRef(null);
  const userChartRef = useRef(null);
  const revenueChartInstance = useRef(null);
  const userChartInstance = useRef(null);

  // Admin login handler
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin') {
        setIsAdmin(true);
        setShowAdminLogin(false);
        localStorage.setItem('adminToken', 'authenticated');
        setToastMessage('Admin login successful!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setLoginError('Invalid admin credentials. Username and password should be "admin".');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    }
  };

  // Admin logout handler
  const handleAdminLogout = () => {
    try {
      setIsAdmin(false);
      setShowAdminLogin(true);
      localStorage.removeItem('adminToken');
      setAdminCredentials({ username: '', password: '' });
      setToastMessage('Admin logged out successfully.');
      setToastType('info');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Logout error:', error);
      setToastMessage('Logout failed. Please refresh the page.');
          setToastType('error');
          setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Admin authentication check
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if admin is already logged in
        const adminToken = localStorage.getItem('adminToken');
        if (adminToken === 'authenticated') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Check if user is logged in and has admin role from regular auth
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (userData) {
          try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser.role === 'admin' || parsedUser.role === 'Admin') {
            setIsAdmin(true);
              setLoading(false);
            return;
          }
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
        }
        }

        // If no admin access, show login form
        setShowAdminLogin(true);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setShowAdminLogin(true);
        setLoading(false);
      }
    };

    // Add a small delay to ensure proper initialization
    const authTimer = setTimeout(checkAdminAccess, 100);
    return () => clearTimeout(authTimer);
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    // Add a small delay to ensure DOM elements are ready
    const initializeCharts = () => {
    if (revenueChartRef.current && userChartRef.current) {
      // Destroy existing charts if they exist
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (userChartInstance.current) {
        userChartInstance.current.destroy();
      }

      // Create new charts
        try {
          if (!Chart) {
            console.warn('Chart.js not available, skipping chart initialization');
            return;
          }
          
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue',
            data: [30000, 35000, 32000, 40000, 38000, 45231],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
              },
          plugins: {
            legend: {
              display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(59, 130, 246, 0.8)',
                  borderWidth: 1
            }
          },
          scales: {
            y: {
              beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  },
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }
        }
      });

      userChartInstance.current = new Chart(userChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Users',
            data: [1200, 1900, 1500, 2100, 2300, 1800, 1400],
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
              },
          plugins: {
            legend: {
              display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(34, 197, 94, 0.8)',
                  borderWidth: 1
            }
          },
          scales: {
            y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
            }
          }
        }
      });
        } catch (error) {
          console.error('Chart initialization error:', error);
    }
      }
      setChartsLoaded(true);
    };

    // Use setTimeout to ensure DOM is ready
    const chartTimer = setTimeout(initializeCharts, 100);
    
    return () => {
      clearTimeout(chartTimer);
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (userChartInstance.current) {
        userChartInstance.current.destroy();
      }
    };
  }, [isAdmin]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    try {
    // Get form data
    const formData = new FormData(e.target);
    const productName = formData.get('product-name');
    const category = formData.get('category');
    const price = formData.get('price');
    const quantity = formData.get('quantity');
    const supplier = formData.get('supplier');
    const status = formData.get('status');
    const description = formData.get('description');
      
      // Validate required fields
      if (!productName || !price) {
        setToastMessage('Please fill in all required fields.');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }
    
    // Add new activity
    const newActivity = {
      id: `#${Math.floor(Math.random() * 9000) + 1000}`,
        name: productName,
      image: `https://picsum.photos/seed/${Date.now()}/40/40`,
      category: category || 'Uncategorized',
        price: `$${parseFloat(price).toFixed(2)}`,
      status: status || 'Active',
      date: new Date().toISOString().split('T')[0],
      sales: 0,
      revenue: '$0.00',
        quantity: parseInt(quantity) || 0,
      supplier: supplier || 'Unknown',
      description: description || ''
    };
    
      setActivities(prevActivities => [newActivity, ...prevActivities]);
    
    // Show success toast
    setToastMessage('Product added successfully!');
    setToastType('success');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
    
    // Reset form
    e.target.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setToastMessage('Error adding product. Please try again.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const resetForm = (e) => {
    e.preventDefault();
    const form = e.target.closest('form');
    if (form) {
      form.reset();
      setToastMessage('Form reset successfully!');
      setToastType('info');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Admin login form
  if (showAdminLogin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-shield-alt text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
              <p className="text-gray-600">Enter admin credentials to access the dashboard</p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter admin username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                    <p className="text-red-700 text-sm">{loginError}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login as Admin
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-blue-500 mr-3 mt-1"></i>
                <div>
                  <p className="text-sm font-semibold text-blue-800 mb-1">Demo Credentials:</p>
                  <p className="text-sm text-blue-700">Username: <code className="bg-blue-100 px-2 py-1 rounded">admin</code></p>
                  <p className="text-sm text-blue-700">Password: <code className="bg-blue-100 px-2 py-1 rounded">admin</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Access denied screen (fallback)
  if (!isAdmin && !showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-shield-alt text-red-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this dashboard.</p>
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Enhanced Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl fixed h-full z-10 border-r border-slate-700 hidden lg:block">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-chart-line text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AdminPro</h1>
              <p className="text-xs text-slate-400">Management Dashboard</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6 px-4">
          {[
            { icon: 'fas fa-home', label: 'Dashboard', active: true, count: null },
            { icon: 'fas fa-chart-bar', label: 'Analytics', active: false, count: null },
            { icon: 'fas fa-users', label: 'Users', active: false, count: systemMetrics.totalUsers },
            { icon: 'fas fa-box', label: 'Products', active: false, count: activities.length },
            { icon: 'fas fa-shopping-cart', label: 'Orders', active: false, count: systemMetrics.totalOrders },
            { icon: 'fas fa-plus-circle', label: 'Add Entry', active: false, count: null },
            { icon: 'fas fa-bell', label: 'Notifications', active: false, count: alerts.length },
            { icon: 'fas fa-shield-alt', label: 'Security', active: false, count: null },
            { icon: 'fas fa-cog', label: 'Settings', active: false, count: null }
          ].map((item, index) => (
            <a 
              key={index}
              href={`#${item.label.toLowerCase()}`} 
              className={`sidebar-item flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                item.active 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <div className="flex items-center">
                <i className={`${item.icon} w-5 mr-3`}></i>
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.active ? 'bg-blue-500 text-white' : 'bg-slate-600 text-slate-300'
                }`}>
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-slate-400">Administrator</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white transition-colors">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Enhanced Header */}
        <header className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-8 py-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button onClick={toggleNotifications} className="relative p-2 text-gray-600 hover:text-gray-800">
                  <i className="fas fa-bell text-xl"></i>
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 ${showNotifications ? '' : 'hidden'}`}>
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="notification-item p-4 hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">New user registered</p>
                          <p className="text-xs text-gray-600">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="notification-item p-4 hover:bg-gray-50 border-b border-gray-100">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Payment received</p>
                          <p className="text-xs text-gray-600">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Admin Logout Button */}
              <button 
                onClick={handleAdminLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                title="Logout Admin"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
              
              {/* Dark Mode Toggle */}
              <button onClick={toggleDarkMode} className="p-2 text-gray-600 hover:text-gray-800">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-xl`}></i>
              </button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className="p-8">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group card bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-blue-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-bold uppercase tracking-wide">Total Revenue</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">${systemMetrics.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-700 mt-2 flex items-center font-semibold">
                    <i className="fas fa-arrow-up mr-2 text-green-600"></i> 
                    <span className="bg-green-100 px-2 py-1 rounded-full text-xs">+12.5%</span>
                    <span className="ml-2 text-gray-600">from last month</span>
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-dollar-sign text-white text-3xl"></i>
                </div>
              </div>
            </div>
            
            <div className="group card bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-green-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-bold uppercase tracking-wide">Active Users</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{systemMetrics.activeUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-700 mt-2 flex items-center font-semibold">
                    <i className="fas fa-arrow-up mr-2 text-green-600"></i> 
                    <span className="bg-green-100 px-2 py-1 rounded-full text-xs">+8.2%</span>
                    <span className="ml-2 text-gray-600">from last week</span>
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-users text-white text-3xl"></i>
                </div>
              </div>
            </div>
            
            <div className="group card bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-purple-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-bold uppercase tracking-wide">Total Orders</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{systemMetrics.totalOrders.toLocaleString()}</p>
                  <p className="text-sm text-red-700 mt-2 flex items-center font-semibold">
                    <i className="fas fa-arrow-down mr-2 text-red-600"></i> 
                    <span className="bg-red-100 px-2 py-1 rounded-full text-xs">-3.1%</span>
                    <span className="ml-2 text-gray-600">from last month</span>
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-shopping-cart text-white text-3xl"></i>
                </div>
              </div>
            </div>
            
            <div className="group card bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-orange-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-700 font-bold uppercase tracking-wide">Conversion Rate</p>
                  <p className="text-4xl font-black text-gray-900 mt-2">{systemMetrics.conversionRate}%</p>
                  <p className="text-sm text-green-700 mt-2 flex items-center font-semibold">
                    <i className="fas fa-arrow-up mr-2 text-green-600"></i> 
                    <span className="bg-green-100 px-2 py-1 rounded-full text-xs">+1.8%</span>
                    <span className="ml-2 text-gray-600">from last week</span>
                  </p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-chart-line text-white text-3xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="group card bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-indigo-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700 font-bold uppercase tracking-wide">Avg Order Value</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">${systemMetrics.avgOrderValue}</p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Per transaction</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-receipt text-white text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div className="group card bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-teal-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-teal-700 font-bold uppercase tracking-wide">System Uptime</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{systemMetrics.systemUptime}%</p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Last 30 days</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-server text-white text-2xl"></i>
                </div>
              </div>
            </div>
            
            <div className="group card bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 rounded-3xl shadow-xl hover:shadow-2xl p-6 border border-pink-300 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-700 font-bold uppercase tracking-wide">Server Load</p>
                  <p className="text-3xl font-black text-gray-900 mt-2">{systemMetrics.serverLoad}%</p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">Current load</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700 rounded-3xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                  <i className="fas fa-microchip text-white text-2xl"></i>
                </div>
              </div>
            </div>
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Revenue Overview</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                </div>
              </div>
              <div className="h-80 relative">
                <canvas ref={revenueChartRef} className="w-full h-full"></canvas>
                {!chartsLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading chart...</p>
                    </div>
                  </div>
                )}
                {!Chart && chartsLoaded && (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl">
                    <div className="text-center">
                      <i className="fas fa-chart-line text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600">Chart visualization not available</p>
                      <p className="text-sm text-gray-500">Revenue: $45,231</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">User Activity</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Daily Active Users</span>
                </div>
              </div>
              <div className="h-80 relative">
                <canvas ref={userChartRef} className="w-full h-full"></canvas>
                {!chartsLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading chart...</p>
                    </div>
                  </div>
                )}
                {!Chart && chartsLoaded && (
                  <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl">
                    <div className="text-center">
                      <i className="fas fa-users text-4xl text-gray-400 mb-4"></i>
                      <p className="text-gray-600">Chart visualization not available</p>
                      <p className="text-sm text-gray-500">Active Users: 1,892</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Admin Form Section */}
          <div id="admin-form-section" className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">Add New Entry</h3>
                <p className="text-gray-600 mt-2">Create and manage new products in your inventory</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-plus text-white text-2xl"></i>
              </div>
            </div>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-tag mr-2 text-blue-500"></i>Product Name
                </label>
                <input 
                  name="product-name" 
                  type="text" 
                  required 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg" 
                  placeholder="Enter product name" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-folder mr-2 text-purple-500"></i>Category
                </label>
                <select 
                  name="category" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 text-lg"
                >
                  <option value="">Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="food">Food & Beverage</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-dollar-sign mr-2 text-green-500"></i>Price ($)
                </label>
                <input 
                  name="price" 
                  type="number" 
                  required 
                  min="0" 
                  step="0.01" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-lg" 
                  placeholder="0.00" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-boxes mr-2 text-orange-500"></i>Stock Quantity
                </label>
                <input 
                  name="quantity" 
                  type="number" 
                  required 
                  min="0" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 text-lg" 
                  placeholder="0" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-truck mr-2 text-indigo-500"></i>Supplier
                </label>
                <input 
                  name="supplier" 
                  type="text" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-lg" 
                  placeholder="Enter supplier name" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-toggle-on mr-2 text-teal-500"></i>Status
                </label>
                <select 
                  name="status" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200 text-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-bold text-gray-800 mb-3">
                  <i className="fas fa-align-left mr-2 text-pink-500"></i>Description
                </label>
                <textarea 
                  name="description" 
                  rows="4" 
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 text-lg resize-none" 
                  placeholder="Enter product description"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-6 pt-6">
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-lg"
                >
                  <i className="fas fa-undo mr-2"></i>Reset
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-bold text-lg shadow-xl hover:shadow-2xl"
                >
                  <i className="fas fa-save mr-2"></i>Save Entry
                </button>
              </div>
            </form>
          </div>
          
          {/* Enhanced Recent Activity Table */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">Recent Activity</h3>
                <p className="text-gray-600 mt-2 flex items-center">
                  <i className="fas fa-clock mr-2 text-blue-500"></i>
                  Latest products and system activities
                </p>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-xl hover:shadow-2xl flex items-center">
                <i className="fas fa-plus mr-2"></i>
                Add Product
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr className="text-left text-sm font-bold text-gray-800">
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-hashtag mr-2 text-blue-500"></i>ID
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-box mr-2 text-green-500"></i>Product
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-folder mr-2 text-purple-500"></i>Category
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-dollar-sign mr-2 text-green-500"></i>Price
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-chart-line mr-2 text-orange-500"></i>Sales
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-money-bill-wave mr-2 text-green-500"></i>Revenue
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-toggle-on mr-2 text-teal-500"></i>Status
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-calendar mr-2 text-indigo-500"></i>Date
                    </th>
                    <th className="px-6 py-4 border-b border-gray-200">
                      <i className="fas fa-cogs mr-2 text-gray-500"></i>Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group">
                      <td className="px-6 py-6">
                        <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          {activity.id}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <img src={activity.image} alt="Product" className="w-16 h-16 rounded-2xl mr-4 shadow-lg border-2 border-gray-200" />
                          <div>
                            <span className="text-lg font-bold text-gray-800">{activity.name}</span>
                            {activity.supplier && (
                              <p className="text-sm text-gray-500 mt-1">
                                <i className="fas fa-truck mr-1"></i>by {activity.supplier}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full border border-purple-300">
                          {activity.category}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-lg font-black text-gray-900">{activity.price}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-lg font-bold text-orange-600">{activity.sales}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-lg font-bold text-green-600">{activity.revenue}</span>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-2 text-sm font-bold rounded-full border ${
                          activity.status === 'Active' 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
                            : activity.status === 'Pending'
                            ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
                            : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-medium text-gray-600">{activity.date}</span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-3">
                          <button className="p-3 text-blue-600 hover:bg-blue-100 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl" title="Edit">
                            <i className="fas fa-edit text-lg"></i>
                          </button>
                          <button className="p-3 text-green-600 hover:bg-green-100 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl" title="View">
                            <i className="fas fa-eye text-lg"></i>
                          </button>
                          <button className="p-3 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl" title="Delete">
                            <i className="fas fa-trash text-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Alerts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">System Alerts</h3>
                  <p className="text-gray-600 mt-1">Monitor system health and notifications</p>
                </div>
                <span className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-sm font-bold rounded-full border border-red-300">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {alerts.length} Active
                </span>
              </div>
              
              <div className="space-y-6">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-6 rounded-2xl border-l-4 shadow-lg hover:shadow-xl transition-all duration-200 ${
                    alert.type === 'warning' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-400' :
                    alert.type === 'error' ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-400' :
                    alert.type === 'success' ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-400' :
                    'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400'
                  }`}>
                    <div className="flex items-start">
                      <div className={`w-4 h-4 rounded-full mt-1 mr-4 shadow-lg ${
                        alert.type === 'warning' ? 'bg-yellow-500' :
                        alert.type === 'error' ? 'bg-red-500' :
                        alert.type === 'success' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800">{alert.message}</p>
                        <p className="text-sm text-gray-600 mt-2 flex items-center">
                          <i className="fas fa-clock mr-2"></i>{alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Recent Users</h3>
                  <p className="text-gray-600 mt-1">Latest user registrations and activity</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  View All <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
              
              <div className="space-y-6">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-bold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <i className="fas fa-envelope mr-2 text-blue-500"></i>{user.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <i className="fas fa-user-tag mr-1"></i>{user.role}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 text-sm font-bold rounded-full border ${
                        user.status === 'Active' 
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300'
                      }`}>
                        <i className={`fas ${user.status === 'Active' ? 'fa-check-circle' : 'fa-pause-circle'} mr-1`}></i>
                        {user.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-2 flex items-center justify-end">
                        <i className="fas fa-clock mr-2 text-gray-400"></i>{user.lastLogin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Enhanced Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-300 transform ${
        showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 ${
          toastType === 'success' ? 'bg-green-500 text-white' :
          toastType === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          <i className={`fas ${
            toastType === 'success' ? 'fa-check-circle' :
            toastType === 'error' ? 'fa-exclamation-circle' :
            'fa-info-circle'
          } text-xl`}></i>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;