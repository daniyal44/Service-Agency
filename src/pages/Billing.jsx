import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Spinner({ className = '' }) {
  return (
    <svg className={`animate-spin h-5 w-5 ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// Credit Card Icons Component
function CreditCardIcons() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">VISA</span>
      </div>
      <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">MC</span>
      </div>
      <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">AM</span>
      </div>
      <div className="w-8 h-5 bg-orange-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">JCB</span>
      </div>
    </div>
  );
}

// CVC Icon Component
function CVCIcon() {
  return (
    <div className="w-6 h-4 bg-gray-200 rounded border-2 border-gray-300 relative">
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-400 rounded-sm"></div>
      <div className="absolute top-1 left-1 w-1 h-1 bg-gray-400 rounded-full"></div>
    </div>
  );
}

function Toasts({ toasts, remove }) {
  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className={`max-w-sm w-full px-4 py-3 rounded shadow-lg ${t.type === 'error' ? 'bg-red-600 text-white' : 'bg-white text-gray-800'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1 mr-2">
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm">{t.message}</div>
            </div>
            <button onClick={() => remove(t.id)} className="ml-2 text-sm opacity-80">✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Billing() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(1);

  // Payment form state
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiration: '',
    cvc: '',
    country: 'United States',
    zip: ''
  });

  const [errors, setErrors] = useState({});
  const [cardType, setCardType] = useState('');

  const API_BASE = window._API_BASE || '';
  const DEFAULT_API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
  const BASE = API_BASE || DEFAULT_API_BASE;
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const ordRes = await fetch(`${BASE}/api/orders/${orderId}`);
        
        if (!ordRes.ok) {
          const t = await ordRes.text().catch(() => '<no body>');
          console.error('Order fetch failed', ordRes.status, t);
          setLoadError(`Order fetch failed: ${ordRes.status} — ${t}`);
        }
        
        const ordJson = await ordRes.json().catch(() => null);
        if (!mounted) return;
        
        if (ordJson && ordJson.ok) {
          setOrder(ordJson.order);
        } else {
          setOrder(null);
          pushToast('Error', ordJson?.error || 'Unable to load order', 'error');
          if (!loadError && ordJson && !ordJson.ok) setLoadError(ordJson.error || JSON.stringify(ordJson));
        }
      } catch (err) {
        console.error(err);
        pushToast('Error', 'Failed to load order', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [orderId, API_BASE]);

  function pushToast(title, message, type = 'info') {
    const id = toastId.current++;
    setToasts((t) => [...t, { id, title, message, type }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 6000);
  }

  function removeToast(id) {
    setToasts((t) => t.filter(x => x.id !== id));
  }

  function formatMoney(amount, currency = 'USD') {
    try {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
    } catch (e) {
      return `${currency} ${amount}`;
    }
  }

  // Credit card validation
  function detectCardType(number) {
    const cleanNumber = number.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6/.test(cleanNumber)) return 'discover';
    return 'unknown';
  }

  function formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  }

  function formatExpiration(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  }

  function validateForm() {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Card number validation
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Expiration validation
    if (!formData.expiration) {
      newErrors.expiration = 'Expiration date is required';
    } else {
      const [month, year] = formData.expiration.split(' / ');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (!month || !year || month < 1 || month > 12) {
        newErrors.expiration = 'Please enter a valid expiration date';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiration = 'Card has expired';
      }
    }

    // CVC validation
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'Please enter a valid CVC';
    }

    // ZIP validation
    if (!formData.zip) {
      newErrors.zip = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleInputChange(field, value) {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const cardType = detectCardType(value);
      setCardType(cardType);
    } else if (field === 'expiration') {
      formattedValue = formatExpiration(value);
    } else if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (field === 'zip') {
      formattedValue = value.replace(/\D/g, '').substring(0, 10);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }

  async function handlePaymentSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      pushToast('Validation Error', 'Please fix the errors in the form', 'error');
      return;
    }

    setProcessing(true);
    pushToast('Processing', 'Processing your payment...', 'info');

    try {
      // First, create a payment session using the existing API structure
      const sessionRes = await fetch(`${BASE}/api/payments/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderId, 
          methodId: 'card', // Use card as default method
          returnUrl: window.location.href,
          paymentData: {
            email: formData.email,
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            expiration: formData.expiration,
            cvc: formData.cvc,
            country: formData.country,
            zip: formData.zip
          }
        })
      });

      const sessionJson = await sessionRes.json();
      
      if (!sessionJson || !sessionJson.ok) {
        pushToast('Payment Failed', sessionJson?.error || sessionJson?.message || 'Failed to create payment session', 'error');
        setProcessing(false);
        return;
      }

      // For development/testing, simulate payment confirmation
      if (sessionJson.provider === 'dev' || !sessionJson.provider) {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Confirm the payment
        const confirmRes = await fetch(`${BASE}/api/payments/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderId, 
            paymentSessionId: sessionJson.paymentSessionId || 'dev-session'
          })
        });

        const confirmJson = await confirmRes.json();
        
        if (confirmJson?.ok && confirmJson?.paid) {
          // Send order confirmation email
          await sendOrderConfirmationEmail();
          
          pushToast('Success', 'Payment successful! Order confirmation sent to your email.', 'info');
          setTimeout(() => navigate('/services'), 2000);
        } else {
          pushToast('Payment Failed', confirmJson?.error || 'Payment not completed. Please retry.', 'error');
        }
      } else {
        // Handle external payment providers
        const providerUrl = sessionJson.url || sessionJson.paymentUrl || sessionJson.payment_url;
        if (providerUrl) {
          window.open(providerUrl, '_blank');
          pushToast('Continue', 'Payment provider opened in new tab. Complete payment there.', 'info');
        } else {
          pushToast('Action', 'Please complete the payment using the provider flow.', 'info');
        }
      }
      
    } catch (err) {
      console.error(err);
      const msg = err && err.message ? `Payment error: ${err.message}` : 'Payment could not be processed';
      pushToast('Error', msg, 'error');
    } finally {
      setProcessing(false);
    }
  }

  async function sendOrderConfirmationEmail() {
    try {
      const emailRes = await fetch(`${BASE}/api/orders/${orderId}/send-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          orderDetails: {
            orderId: order._id,
            total: order.total,
            currency: order.currency || 'USD',
            items: order.items || [],
            deliveryTime: order.deliveryTime || '2-3 business days'
          }
        })
      });

      if (emailRes.ok) {
        console.log('Order confirmation email sent successfully');
      } else {
        console.warn('Failed to send confirmation email, but payment was successful');
      }
    } catch (err) {
      console.warn('Email service unavailable, but payment was successful:', err);
    }
  }

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <Spinner className="text-gray-600" />
        <div className="mt-2 text-gray-600">Loading order...</div>
      </div>
    </div>
  );

  if (!order) return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="text-lg font-semibold">Order not found</h3>
        <p className="text-sm text-gray-600">We couldn't find the order. It may have been cancelled or expired.</p>
        <div className="mt-4">
          <button onClick={() => navigate('/services')} className="px-4 py-2 bg-blue-600 text-white rounded">Back to services</button>
        </div>
      </div>
      {loadError && (
        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
          <h4 className="font-semibold text-red-700">Error details</h4>
          <pre className="text-sm text-red-700 whitespace-pre-wrap">{loadError}</pre>
          <div className="text-xs text-gray-500 mt-2">Tip: make sure your backend is running and set window._API_BASE or VITE_API_BASE to the backend URL (e.g. http://localhost:4000)</div>
        </div>
      )}
      <Toasts toasts={toasts} remove={removeToast} />
    </div>
  );

  const totalFormatted = formatMoney(order.total, order.currency || 'USD');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toasts toasts={toasts} remove={removeToast} />
      
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Checkout Page</h1>
            <p className="text-gray-600 mt-2">Payment Form</p>
            <p className="text-sm text-gray-500">Collect credit card payments</p>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Order #{String(order._id).slice(-8)}</div>
                <div className="font-semibold text-gray-900">Service Order</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-bold text-gray-900">{totalFormatted}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email address"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Card Number Field */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Card number
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  placeholder="1234 1234 1234 1234"
                  className={`w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CreditCardIcons />
                </div>
              </div>
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>

            {/* Expiration and CVC Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration
                </label>
                <input
                  type="text"
                  id="expiration"
                  value={formData.expiration}
                  onChange={(e) => handleInputChange('expiration', e.target.value)}
                  placeholder="MM / YY"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.expiration ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.expiration && <p className="mt-1 text-sm text-red-600">{errors.expiration}</p>}
              </div>

              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">
                  CVC
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cvc"
                    value={formData.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value)}
                    placeholder="CVC"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.cvc ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <CVCIcon />
                  </div>
                </div>
                {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
              </div>
            </div>

            {/* Country and ZIP Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP
                </label>
                <input
                  type="text"
                  id="zip"
                  value={formData.zip}
                  onChange={(e) => handleInputChange('zip', e.target.value)}
                  placeholder="12345"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.zip ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {processing ? (
                <>
                  <Spinner className="text-white" />
                  Processing...
                </>
              ) : (
                `Pay ${totalFormatted}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

