

// ContactUs.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import './ContactUs.css';
import Navbar from './Navbar';

const ContactUs = () => {
  // Navigation state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethods: ['email'],
    newsletter: false
  });

  // File upload state
  const [files, setFiles] = useState([]);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioChunks, setAudioChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', content: 'Hi! How can I help you today?' }
  ]);

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle contact method changes
  const handleContactMethodChange = (method) => {
    setFormData(prev => {
      const methods = [...prev.contactMethods];
      if (methods.includes(method)) {
        return {
          ...prev,
          contactMethods: methods.filter(m => m !== method)
        };
      } else {
        return {
          ...prev,
          contactMethods: [...methods, method]
        };
      }
    });
  };

  // Form navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Form validation
  const validateStep = (step) => {
    let isValid = true;
    const newErrors = { ...formErrors };

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Please enter your name';
        isValid = false;
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Please enter your email';
        isValid = false;
      } else if (!isValidEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.subject) {
        newErrors.subject = 'Please select a subject';
        isValid = false;
      }
      if (!formData.message.trim()) {
        newErrors.message = 'Please enter your message';
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // File upload handling
  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setAudioChunks(audioBlob);
        console.log('Voice message recorded:', audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store timer reference to clear later
      mediaRecorderRef.current.timer = timer;

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(mediaRecorderRef.current.timer);
    }
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      // Simulate form submission
      setTimeout(() => {
        setShowSuccessModal(true);

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          contactMethods: ['email'],
          newsletter: false
        });
        setFiles([]);
        setCurrentStep(1);
        setRecordingTime(0);
      }, 2000);
    }
  };

  // Chat functionality
  const sendMessage = () => {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (message) {
      // Add user message
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', content: message }
      ]);

      input.value = '';

      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { sender: 'bot', content: 'Thank you for your message! Our team will get back to you shortly.' }
        ]);
      }, 1000);
    }
  };

  // FAQ functionality
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // Filter FAQs based on search
  const filteredFaqs = [
    {
      question: 'How quickly do you respond to messages?',
      answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please use our live chat feature.'
    },
    {
      question: 'What file types can I upload?',
      answer: 'You can upload PDF, DOC, DOCX, JPG, PNG, and ZIP files up to 10MB in size.'
    },
    {
      question: 'Do you offer international support?',
      answer: 'Yes! We support customers worldwide with multilingual assistance available in English, Spanish, French, and German.'
    }
  ].filter(faq =>
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
  );

  // Format recording time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Apply dark mode class on component mount and when darkMode changes
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className={`contact-us-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Navigation */}

      <Navbar />

      <div className="pt-16">
        <div className="contact-us-container">
          <div className="contact-header">
            <h1>Get in Touch</h1>
            <p>We'd love to hear from you. Reach out to us with any questions or comments.</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <div className="info-item">
                <div className="icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="details">
                  <h3>Address</h3>
                  <p>123 Business Avenue, Suite 100<br />San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon"><i className="fas fa-phone"></i></div>
                <div className="details">
                  <h3>Phone</h3>
                  <p>(+92) 3230-112464 <br />(+92) 3230-112464</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon"><i className="fas fa-envelope"></i></div>
                <div className="details">
                  <h3>Email</h3>
                  <p>m.daniyalkhan490@gmail.com <br /> ItxMDK@proton.me</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon"><i className="fas fa-clock"></i></div>
                <div className="details">
                  <h3>Business Hours</h3>
                  <p>Mon–Fri: 9am–5pm<br />Sat: 10am–2pm<br />Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <div className="form-progress">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`progress-step ${step === currentStep ? 'active' : step < currentStep ? 'completed' : ''}`}
                    data-step={step}
                  >
                    <div className="step-number">{step}</div>
                    <div className="step-label">
                      {step === 1 && 'Basic Info'}
                      {step === 2 && 'Message'}
                      {step === 3 && 'Options'}
                    </div>
                  </div>
                ))}
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(currentStep - 1) * 50}%` }}></div>
                </div>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="form-step" data-step="1">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${formErrors.name ? 'error' : ''}`}
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${formErrors.email ? 'error' : ''}`}
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Message Details */}
                {currentStep === 2 && (
                  <div className="form-step" data-step="2">
                    <div className="form-group">
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject"
                        name="subject"
                        className={`form-control ${formErrors.subject ? 'error' : ''}`}
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales Question</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                      {formErrors.subject && <span className="error-message">{formErrors.subject}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        className={`form-control ${formErrors.message ? 'error' : ''}`}
                        rows="5"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                      {formErrors.message && <span className="error-message">{formErrors.message}</span>}
                    </div>

                    <div className="form-group">
                      <label>Attach Files (Optional)</label>
                      <div
                        className="file-upload"
                        id="fileUpload"
                        onClick={() => document.getElementById('fileInput').click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Drag & drop files here or click to browse</p>
                        <p className="file-types">Supported: PDF, DOC, DOCX, JPG, PNG, ZIP (Max 10MB)</p>
                        <input
                          type="file"
                          id="fileInput"
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                      </div>
                      {files.length > 0 && (
                        <div className="file-list">
                          {files.map((file, index) => (
                            <div key={index} className="file-item">
                              <div className="file-info">
                                <i className="fas fa-file"></i>
                                <div className="file-details">
                                  <span className="file-name">{file.name}</span>
                                  <span className="file-size">{formatFileSize(file.size)}</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="file-remove"
                                onClick={() => removeFile(index)}
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Options */}
                {currentStep === 3 && (
                  <div className="form-step" data-step="3">
                    <div className="form-group">
                      <label>Voice Message (Optional)</label>
                      <div className="voice-recorder">
                        <button
                          type="button"
                          className={`record-btn ${isRecording ? 'recording' : ''}`}
                          onClick={isRecording ? stopRecording : startRecording}
                        >
                          <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
                        </button>
                        <div className="voice-recorder-info">
                          <p>{isRecording ? 'Recording in progress...' : 'Record a voice message'}</p>
                          <p className="recording-hint">{isRecording ? 'Click stop to finish recording' : 'Click to start recording'}</p>
                        </div>
                        {recordingTime > 0 && (
                          <div className="recording-time">{formatTime(recordingTime)}</div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Preferred Contact Method</label>
                      <div className="contact-methods">
                        {['email', 'phone', 'chat'].map(method => (
                          <label key={method} className="contact-method">
                            <input
                              type="checkbox"
                              checked={formData.contactMethods.includes(method)}
                              onChange={() => handleContactMethodChange(method)}
                              value={method}
                            />
                            <span className="checkmark"></span>
                            <span className="method-text">{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="form-group newsletter-group">
                      <label className="newsletter-label">
                        <input
                          type="checkbox"
                          id="newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleInputChange}
                        />
                        <span className="checkmark"></span>
                        Subscribe to our newsletter for updates
                      </label>
                    </div>
                  </div>
                )}

                <div className="form-navigation">
                  {currentStep > 1 && (
                    <button type="button" className="btn btn-secondary" onClick={prevStep}>
                      <i className="fas fa-arrow-left"></i> Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                      Next <i className="fas fa-arrow-right"></i>
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-submit">
                      <i className="fas fa-paper-plane"></i> Send Message
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
            </div>
            <div className="faq-list">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    {faq.question}
                    <i className={`fas ${activeFaq === index ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                  </div>
                  {activeFaq === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="map-container">
            <h2>Find Us Here</h2>
            <div className="google-map">
              <iframe
                title="Company Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.14245968236!2d-122.43760000000003!3d37.75769999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1652831967215!5m2!1sen!2sus"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      <div className="chat-widget">
        <div className={`chat-window ${showChat ? 'active' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div>
                <span>Support Team</span>
                <p>We'll reply as soon as we can</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setShowChat(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.content}
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input type="text" id="chatInput" placeholder="Type your message..." />
            <button onClick={sendMessage} className="chat-send">
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        <div className="chat-bubble" onClick={() => setShowChat(true)}>
          <i className="fas fa-comments"></i>
          <span className="chat-notification"></span>
        </div>
      </div>

      {/* Success Modal */}
      <div className={`modal ${showSuccessModal ? 'active' : ''}`}>
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}></div>
        <div className="modal-content">
          <div className="success-icon">
            <i className="fas fa-check"></i>
          </div>
          <h2>Message Sent Successfully!</h2>
          <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
          <button onClick={() => setShowSuccessModal(false)} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;