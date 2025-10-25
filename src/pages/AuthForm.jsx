import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Eye Icon Component
const EyeIcon = ({ visible }) => (
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.964 9.964 0 014.031.84M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c5 0 9 4 9 7 0 1.18-.293 2.29-.805 3.286M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
);

// Message Component
const Message = ({ message, type, onClose }) => (
  <div className={`p-4 mb-4 rounded-lg shadow-md flex items-center justify-between animate-slide-in ${
    type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
    type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
    'bg-blue-100 text-blue-700 border border-blue-300'
  }`}>
    <div className="flex items-center">
      <span className={`mr-3 ${
        type === 'error' ? 'text-red-500' :
        type === 'success' ? 'text-green-500' : 'text-blue-500'
      }`}>
        {type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
      </span>
      <span className="text-sm font-medium">{message}</span>
    </div>
    <button
      onClick={onClose}
      className="ml-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      aria-label="Close message"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ strength }) => {
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600'];

  return (
    <div className="mt-2">
      <div className="flex items-center mb-1">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
            style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      <p className="text-xs text-gray-600 font-medium">
        {strengthLabels[strength]}
      </p>
    </div>
  );
};

const AuthForm = () => {
  // Navigation hook
  const navigate = useNavigate();
  
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [activeForm, setActiveForm] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [messages, setMessages] = useState([]);
  const [pendingVerification, setPendingVerification] = useState(null);
  
  // Form data states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Captcha state
  const [captcha, setCaptcha] = useState({ question: '', answer: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [signupCaptchaInput, setSignupCaptchaInput] = useState('');
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Password visibility
  const [passwordVisible, setPasswordVisible] = useState({
    login: false,
    signup: false,
    confirm: false
  });

  // API configuration
  const API_BASE_URL = 'http://localhost:5000/api';
  const SERVER_ORIGIN = (() => {
    try { 
      return new URL(API_BASE_URL).origin; 
    } catch (e) { 
      return 'http://localhost:5000'; 
    }
  })();
  const HEALTH_ENDPOINT = `${SERVER_ORIGIN}/health`;

  // Generate Captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2} = ?`,
      answer: num1 + num2
    };
  };

  // Initialize component
  useEffect(() => {
    setCaptcha(generateCaptcha());

    // Check for remembered user
    try {
      const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser') || 'null');
      if (rememberedUser) {
        setLoginData({
          email: rememberedUser.email,
          password: rememberedUser.password || ''
        });
        setRememberMe(true);
      }
    } catch (e) {
      // Ignore parse errors
      console.warn('Error parsing remembered user:', e);
    }
  }, []);

  // Toggle Password Visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Check Password Strength
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    setPasswordStrength(strength);
    return strength;
  };

  // Generate Strong Password
  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    setSignupData(prev => ({
      ...prev,
      password,
      confirmPassword: password
    }));

    checkPasswordStrength(password);
    showMessage('Strong password generated!', 'success');
  };

  // Show Message
  const showMessage = (message, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, 5000);
  };

  // API call function
  const apiCall = async (endpoint, method = 'GET', data = null, timeoutMs = 8000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      };
      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
      clearTimeout(timer);

      // Safely parse response
      let payload = null;
      const contentType = res.headers.get('content-type') || '';
      
      try {
        if (contentType.includes('application/json')) {
          payload = await res.json();
        } else {
          payload = await res.text();
        }
      } catch (parseErr) {
        // Fallback if parsing fails
        try { 
          payload = await res.text(); 
        } catch (e) { 
          payload = null; 
        }
      }

      if (!res.ok) {
        // Build error message
        const bodyMsg = typeof payload === 'string' ? payload : (payload?.error || payload?.message);
        const msg = bodyMsg || `${res.status} ${res.statusText}` || `Request failed: ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.payload = payload;
        console.error('API Error:', res.status, msg, payload);
        throw err;
      }

      return payload;
    } catch (err) {
      clearTimeout(timer);
      console.error('API call error:', err);

      if (err.name === 'AbortError') {
        showMessage('Request timed out. Backend may be slow or unreachable.', 'error');
      } else if (err instanceof TypeError) {
        // Network/CORS error - attempt health check
        try {
          const healthRes = await fetch(HEALTH_ENDPOINT, { 
            method: 'GET',
            signal: controller.signal 
          });
          if (!healthRes.ok) throw new Error('Health check failed');
          showMessage('Network error while calling API (possible CORS). Check browser console and backend CORS.', 'error');
        } catch (healthErr) {
          showMessage('Cannot reach backend. Is the server running?', 'error');
        }
      } else {
        // Show server-provided message
        const serverMsg = err.payload && typeof err.payload === 'string'
          ? err.payload
          : (err.payload && typeof err.payload === 'object' ? (err.payload.error || err.payload.message) : err.message);
        showMessage(`Server error (${err.status || 'error'}): ${serverMsg || err.message}`, 'error');
      }

      throw err;
    }
  };

  // Form Handlers
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    // Check captcha
    if (parseInt(captchaInput, 10) !== captcha.answer) {
      showMessage('Incorrect captcha answer!', 'error');
      setCaptcha(generateCaptcha());
      setCaptchaInput('');
      return;
    }

    try {
      const result = await apiCall('/auth/login', 'POST', {
        email: loginData.email,
        password: loginData.password
      });

      const { user, token } = result;
      
      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: loginData.email
        }));
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('rememberedUser');
        sessionStorage.setItem('authToken', token);
      }

      setCurrentUser(user);
      showMessage('Login successful! Redirecting to home page...', 'success');

      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      // Error handled in apiCall
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Check captcha
    if (parseInt(signupCaptchaInput, 10) !== captcha.answer) {
      showMessage('Incorrect captcha answer!', 'error');
      setCaptcha(generateCaptcha());
      setSignupCaptchaInput('');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      showMessage('Passwords do not match!', 'error');
      return;
    }

    if (checkPasswordStrength(signupData.password) < 3) {
      showMessage('Password is too weak! Please use a stronger password.', 'error');
      return;
    }

    if (!termsAccepted) {
      showMessage('Please accept the terms and conditions', 'error');
      return;
    }

    try {
      const result = await apiCall('/auth/register', 'POST', {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      });

      setPendingVerification({ email: signupData.email });
      setShowVerification(true);

      showMessage('Account created! Please check your email for verification code.', 'success');
    } catch (error) {
      // Error handled in apiCall
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!pendingVerification?.email) {
      showMessage('No pending verification found. Please register or request a code first.', 'error');
      return;
    }

    const emailToVerify = pendingVerification.email;

    try {
      await apiCall('/auth/verify-email', 'POST', {
        email: emailToVerify,
        code: verificationCode
      });

      setShowVerification(false);
      setPendingVerification(null);
      setVerificationCode('');
      showMessage('Email verified successfully! Redirecting to login...', 'success');

      setTimeout(() => {
        setActiveForm('login');
        setLoginData(prev => ({ ...prev, email: emailToVerify || prev.email }));
      }, 1500);
    } catch (error) {
      // Error handled in apiCall
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiCall('/auth/forgot-password', 'POST', {
        email: forgotEmail
      });

      showMessage('Password reset link sent to your email!', 'success');
      setShowForgotPassword(false);
      setForgotEmail('');
    } catch (error) {
      // Error handled in apiCall
    }
  };

  const resendVerificationCode = async () => {
    if (!pendingVerification?.email) {
      showMessage('No email to resend code to. Please register first.', 'error');
      return;
    }
    try {
      await apiCall('/auth/send-verification', 'POST', { 
        email: pendingVerification.email 
      });
      showMessage('Verification code resent to your email!', 'success');
    } catch (error) {
      // Error handled in apiCall
    }
  };

  // Render Login Form
  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
          placeholder="Enter your email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible.login ? "text" : "password"}
            id="password"
            className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 pr-12"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded"
            onClick={() => togglePasswordVisibility('login')}
            aria-label={passwordVisible.login ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={passwordVisible.login} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <button
          type="button"
          className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </button>
      </div>

      <div>
        <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
          Security Check: {captcha.question}
        </label>
        <input
          type="number"
          id="captcha"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
          placeholder="Enter the answer"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Sign In
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            onClick={() => setActiveForm('signup')}
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );

  // Render Signup Form
  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
          placeholder="Enter your full name"
          value={signupData.name}
          onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
          placeholder="Enter your email"
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
          <button
            type="button"
            className="ml-2 text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            onClick={generatePassword}
          >
            Generate Strong Password
          </button>
        </label>
        <div className="relative">
          <input
            type={passwordVisible.signup ? "text" : "password"}
            id="signup-password"
            className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 pr-12"
            placeholder="Create a strong password"
            value={signupData.password}
            onChange={(e) => {
              setSignupData({ ...signupData, password: e.target.value });
              checkPasswordStrength(e.target.value);
            }}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded"
            onClick={() => togglePasswordVisibility('signup')}
            aria-label={passwordVisible.signup ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={passwordVisible.signup} />
          </button>
        </div>

        {signupData.password && (
          <PasswordStrength strength={passwordStrength} />
        )}
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={passwordVisible.confirm ? "text" : "password"}
            id="confirm-password"
            className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200 pr-12"
            placeholder="Confirm your password"
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded"
            onClick={() => togglePasswordVisibility('confirm')}
            aria-label={passwordVisible.confirm ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={passwordVisible.confirm} />
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="signup-captcha" className="block text-sm font-medium text-gray-700 mb-1">
          Security Check: {captcha.question}
        </label>
        <input
          type="number"
          id="signup-captcha"
          className="w-full px-4 py-3 bg-white bg-opacity-90 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
          placeholder="Enter the answer"
          value={signupCaptchaInput}
          onChange={(e) => setSignupCaptchaInput(e.target.value)}
          required
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          id="terms"
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded mt-1"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          required
        />
        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
          I agree to the <a href="#" className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200">Terms and Conditions</a>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Create Account
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            onClick={() => setActiveForm('login')}
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );

  // Render Forgot Password Modal
  const renderForgotPasswordModal = () => (
    <Modal
      isOpen={showForgotPassword}
      onClose={() => setShowForgotPassword(false)}
      title="Reset Password"
    >
      <p className="text-gray-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="forgot-email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          Send Reset Link
        </button>
      </form>
    </Modal>
  );

  // Render Verification Modal
  const renderVerificationModal = () => (
    <Modal
      isOpen={showVerification}
      onClose={() => {
        setShowVerification(false);
        setPendingVerification(null);
      }}
      title="Verify Your Email"
    >
      <p className="text-gray-600 mb-6">
        We've sent a verification code to <strong className="text-purple-600">{pendingVerification?.email}</strong>.
        Please enter the code below to verify your email address.
      </p>

      <form onSubmit={handleVerificationSubmit} className="space-y-4">
        <div>
          <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-1">
            Verification Code
          </label>
          <input
            type="text"
            id="verification-code"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition duration-200"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          Verify Email
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
            onClick={resendVerificationCode}
          >
            Resend Code
          </button>
        </p>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-600 p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Auth Form Container */}
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 animate-fade-in border border-white border-opacity-30">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {activeForm === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 mt-2">
              {activeForm === 'login'
                ? 'Sign in to continue to your account'
                : 'Sign up to get started'}
            </p>
          </div>

          {/* Render the appropriate form */}
          {activeForm === 'login' ? renderLoginForm() : renderSignupForm()}
        </div>

        {/* Modals */}
        {renderForgotPasswordModal()}
        {renderVerificationModal()}

        {/* Success/Error Messages */}
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
          {messages.map(msg => (
            <Message
              key={msg.id}
              message={msg.message}
              type={msg.type}
              onClose={() => setMessages(prev => prev.filter(m => m.id !== msg.id))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;





