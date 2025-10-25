import React, { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

// Large static data moved out of the component so it's not recreated on every render
const serviceCategories = { 
  design: [
    { id: 1, title: "Logo Design", price: 30, img: "https://images.unsplash.com/photo-1498075702571-ecb018f3752d?q=80&w=878&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 4.8, reviews: 88, desc: "Professional logo design with multiple concepts" },
    { id: 2, title: "Business Card Design", price: 25, img: "https://images.unsplash.com/photo-1718670013921-2f144aba173a?q=80&w=760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 4.7, reviews: 45, desc: "Elegant business card designs" },
    { id: 3, title: "Brochure Design", price: 50, img: "https://images.unsplash.com/photo-1695634281181-b2357af34c61?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", rating: 4.6, reviews: 32, desc: "Professional brochure layouts" },
    { id: 4, title: "Poster Design", price: 35, img: "https://images.unsplash.com/photo-1580130857334-2f9b6d01d99d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHBvc3RlcnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 67, desc: "Eye-catching poster designs" },
    { id: 5, title: "Flyer Design", price: 20, img: "https://images.unsplash.com/photo-1610187308631-a07fc95e19d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzR8fEZseWVyJTIwRGVzaWdufGVufDB8fDB8fHww", rating: 4.4, reviews: 89, desc: "Marketing flyer designs" },
    { id: 6, title: "Book Cover Design", price: 60, img: "https://images.unsplash.com/photo-1722706731906-2163a06f3022?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Qm9vayUyMENvdmVyJTIwRGVzaWdufGVufDB8fDB8fHww", rating: 4.9, reviews: 23, desc: "Captivating book cover designs" },
    { id: 7, title: "Packaging Design", price: 75, img: "https://images.unsplash.com/photo-1610963349673-3d94501d569a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFBhY2thZ2luZyUyMERlc2lnbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.7, reviews: 41, desc: "Product packaging solutions" },
    { id: 8, title: "T-Shirt Design", price: 25, img: "https://images.unsplash.com/photo-1621951753163-ee63e7fc147e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fFQtU2hpcnQlMjBEZXNpZ258ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 56, desc: "Custom t-shirt graphics" },
    { id: 9, title: "Social Media Kit", price: 45, img: "https://images.unsplash.com/photo-1548245795-6d0c74f043f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fFNvY2lhbCUyME1lZGlhJTIwS2l0fGVufDB8fDB8fHww", rating: 4.8, reviews: 78, desc: "Complete social media graphics" },
    { id: 10, title: "Infographic Design", price: 55, img: "https://plus.unsplash.com/premium_photo-1714618987778-fce5e686abe8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SW5mb2dyYXBoaWMlMjBEZXNpZ258ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 34, desc: "Data visualization graphics" }
  ],
  digital: [
    { id: 11, title: "Website Design", price: 400, img: "https://images.unsplash.com/photo-1688733720228-4f7a18681c4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHdlYiUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.9, reviews: 14, desc: "Responsive website design" },
    { id: 12, title: "WordPress Development", price: 300, img: "https://images.unsplash.com/photo-1586856635346-78823330b49f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8V29yZFByZXNzJTIwRGV2ZWxvcG1lbnR8ZW58MHx8MHx8fDA%3D", rating: 4.8, reviews: 56, desc: "Custom WordPress sites" },
    { id: 13, title: "E-commerce Store", price: 600, img: "https://images.unsplash.com/photo-1688561807403-ba262590f86f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RS1jb21tZXJjZSUyMFN0b3JlfGVufDB8fDB8fHww", rating: 4.7, reviews: 42, desc: "Online store development" },
    { id: 14, title: "Mobile App Design", price: 500, img: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TW9iaWxlJTIwQXBwJTIwRGVzaWdufGVufDB8fDB8fHww", rating: 4.6, reviews: 38, desc: "UI/UX app design" },
    { id: 15, title: "Landing Page", price: 150, img: "https://i.postimg.cc/xTDrpXnK/Landing-page.png", rating: 4.5, reviews: 67, desc: "High-converting landing pages" },
    { id: 16, title: "Email Template", price: 40, img: "https://i.postimg.cc/qMQcQcDG/Email-template.png", rating: 4.4, reviews: 29, desc: "Responsive email templates" },
    { id: 17, title: "Web App Development", price: 800, img: "https://i.postimg.cc/mZPhKYrY/Web-development-app.png", rating: 4.9, reviews: 19, desc: "Custom web applications" },
    { id: 18, title: "API Integration", price: 200, img: "https://i.postimg.cc/qq4b6Jgf/API-integration.png", rating: 4.7, reviews: 31, desc: "Third-party API integration" },
    { id: 19, title: "Database Design", price: 180, img: "https://i.postimg.cc/nrW3Rv0M/Database-Design.png", rating: 4.6, reviews: 22, desc: "Database architecture" },
    { id: 20, title: "Cloud Setup", price: 120, img: "https://i.postimg.cc/L4ZRSNF1/Cloud-Setup.png", rating: 4.5, reviews: 45, desc: "Cloud infrastructure setup" }
  ],
  marketing: [
    { id: 21, title: "SEO Optimization", price: 120, img: "https://plus.unsplash.com/premium_photo-1683288537199-3a102f1a3959?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U0VPJTIwT3B0aW1pemF0aW9ufGVufDB8fDB8fHww", rating: 4.5, reviews: 18, desc: "Search engine optimization" },
    { id: 22, title: "Social Media Marketing", price: 80, img: "https://i.postimg.cc/XY86xYTB/Social-Media-Marketing.png", rating: 4.6, reviews: 73, desc: "Social media campaign management" },
    { id: 23, title: "Content Writing", price: 25, img: "https://plus.unsplash.com/premium_photo-1678871482507-304592cf41de?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Q29udGVudCUyMFdyaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.7, reviews: 89, desc: "Professional content creation" },
    { id: 24, title: "Google Ads Management", price: 100, img: "https://images.unsplash.com/photo-1648134859177-525771773915?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwQWRzJTIwTWFuYWdlbWVudHxlbnwwfHwwfHx8MA%3D%3D", rating: 4.4, reviews: 52, desc: "PPC campaign management" },
    { id: 25, title: "Email Marketing", price: 60, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEVtYWlsJTIwTWFya2V0aW5nfGVufDB8fDB8fHww", rating: 4.5, reviews: 41, desc: "Email campaign setup" },
    { id: 26, title: "Marketing Strategy", price: 150, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWFya2V0aW5nJTIwU3RyYXRlZ3l8ZW58MHx8MHx8fDA%3D", rating: 4.8, reviews: 27, desc: "Comprehensive marketing plan" },
    { id: 27, title: "Influencer Marketing", price: 200, img: "https://plus.unsplash.com/premium_photo-1664474596708-e87823ae1c6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEluZmx1ZW5jZXIlMjBNYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.3, reviews: 34, desc: "Influencer collaboration" },
    { id: 28, title: "Video Marketing", price: 90, img: "https://images.unsplash.com/photo-1528109966604-5a6a4a964e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VmlkZW8lMjBNYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 28, desc: "Promotional video creation" },
    { id: 29, title: "Brand Strategy", price: 180, img: "https://plus.unsplash.com/premium_photo-1661578375477-7cfff3200518?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8QnJhbmQlMjBTdHJhdGVneXxlbnwwfHwwfHx8MA%3D%3D", rating: 4.7, reviews: 19, desc: "Brand development plan" },
    { id: 30, title: "Market Research", price: 70, img: "https://images.unsplash.com/photo-1599658880436-c61792e70672?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fE1hcmtldCUyMFJlc2VhcmNofGVufDB8fDB8fHww", rating: 4.5, reviews: 36, desc: "Industry analysis" }
  ],
  video: [
    { id: 31, title: "Video Editing", price: 60, img: "https://plus.unsplash.com/premium_photo-1679079456083-9f288e224e96?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VmlkZW8lMjBFZGl0aW5nfGVufDB8fDB8fHww", rating: 4.8, reviews: 41, desc: "Professional video editing" },
    { id: 32, title: "Motion Graphics", price: 85, img: "https://images.unsplash.com/photo-1628494391268-c9935bc384d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TW90aW9uJTIwR3JhcGhpY3N8ZW58MHx8MHx8fDA%3D", rating: 4.7, reviews: 33, desc: "Animated graphics creation" },
    { id: 33, title: "YouTube Intro", price: 40, img: "https://i.postimg.cc/MTrKY2sZ/You-Tube-Intro.png", rating: 4.6, reviews: 67, desc: "Custom YouTube introductions" },
    { id: 34, title: "Explainer Video", price: 120, img: "https://i.postimg.cc/6Q34dXw0/Explainer-Video.png", rating: 4.5, reviews: 42, desc: "Animated explainer videos" },
    { id: 35, title: "Video Ads", price: 75, img: "https://images.unsplash.com/photo-1497015289639-54688650d173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VmlkZW8lMjBBZHN8ZW58MHx8MHx8fDA%3D", rating: 4.9, reviews: 24, desc: "Old video enhancement" },
    { id: 37, title: "Color Grading", price: 45, img: "https://images.unsplash.com/photo-1591866497533-403d44694fa1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q29sb3IlMjBHcmFkaW5nfGVufDB8fDB8fHww", rating: 4.7, reviews: 29, desc: "Professional color correction" },
    { id: 38, title: "Audio Enhancement", price: 30, img: "https://images.unsplash.com/photo-1720962158812-d16549f1e5a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEF1ZGlvJTIwRW5oYW5jZW1lbnR8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 51, desc: "Sound quality improvement" },
    { id: 39, title: "Subtitles/Captions", price: 20, img: "https://i.postimg.cc/9Qz2J7j2/Subtitles-Captions.png", rating: 4.5, reviews: 73, desc: "Video captioning services" },
    { id: 40, title: "Video Compression", price: 15, img: "https://images.unsplash.com/photo-1596266738213-ac2eb977c10c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fFRlc3QlMjBQcmVwYXJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.4, reviews: 38, desc: "Commercial video advertisements" },
    { id: 36, title: "Video Restoration", price: 50, img: "https://images.unsplash.com/photo-1561118642-b80e6ff9543a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fFZpZGVvJTIwUmVzdG9yYXRpb258ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 46, desc: "File size optimization" }
  ],
  writing: [
    { id: 41, title: "Blog Writing", price: 20, img: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmxvZyUyMFdyaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.7, reviews: 94, desc: "Engaging blog content" },
    { id: 42, title: "Article Writing", price: 25, img: "https://images.unsplash.com/photo-1560092269-eaeb3c5e74ba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fEFydGljbGUlMjBXcml0aW5nfGVufDB8fDB8fHww", rating: 4.6, reviews: 78, desc: "Well-researched articles" },
    { id: 43, title: "Copywriting", price: 35, img: "https://images.unsplash.com/photo-1548943995-56fbe6e5a13e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29weXdyaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.8, reviews: 63, desc: "Persuasive sales copy" },
    { id: 44, title: "Technical Writing", price: 45, img: "https://images.unsplash.com/photo-1735893066935-2b7995bab10d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fFRlY2huaWNhbCUyMFdyaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 42, desc: "Technical documentation" },
    { id: 45, title: "Script Writing", price: 50, img: "https://plus.unsplash.com/premium_photo-1661476105431-a1cfb8d4cbb2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFNjcmlwdCUyMFdyaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 37, desc: "Video and audio scripts" },
    { id: 46, title: "Proofreading", price: 15, img: "https://plus.unsplash.com/premium_photo-1668198395296-035ad11ab16b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJvb2ZyZWFkaW5nfGVufDB8fDB8fHww", rating: 4.9, reviews: 89, desc: "Error correction service" },
    { id: 47, title: "Translation", price: 30, img: "https://i.postimg.cc/7YBdY3B3/Translation.png", rating: 4.7, reviews: 56, desc: "Multi-language translation" },
    { id: 48, title: "Resume Writing", price: 40, img: "https://i.postimg.cc/ZK8VBTsJ/Resume-Writing.png", rating: 4.6, reviews: 71, desc: "Professional resume creation" },
    { id: 49, title: "Ebook Writing", price: 200, img: "https://images.unsplash.com/photo-1559719958-c89479895abd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEVib29rJTIwV3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 28, desc: "Complete ebook development" },
    { id: 50, title: "Product Descriptions", price: 18, img: "https://i.postimg.cc/W1MGYXcr/Product-Descriptions.png", rating: 4.4, reviews: 65, desc: "Compelling product text" }
  ],
  business: [
    { id: 51, title: "Business Plan", price: 150, img: "https://plus.unsplash.com/premium_photo-1726862702421-deae8b4d75f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGJ1c2luZXNzJTIwcGxhbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.8, reviews: 34, desc: "Comprehensive business planning" },
    { id: 52, title: "Financial Analysis", price: 120, img: "https://images.unsplash.com/photo-1518186233392-c232efbf2373?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEZpbmFuY2lhbCUyMEFuYWx5c2lzfGVufDB8fDB8fHww", rating: 4.7, reviews: 27, desc: "Financial performance review" },
    { id: 53, title: "Market Analysis", price: 100, img: "https://plus.unsplash.com/premium_photo-1664476845274-27c2dabdd7f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TWFya2V0JTIwQW5hbHlzaXN8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 41, desc: "Industry market research" },
    { id: 54, title: "Legal Consultation", price: 80, img: "https://plus.unsplash.com/premium_photo-1695449439526-9cebdbfa1a2c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TGVnYWwlMjBDb25zdWx0YXRpb258ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 23, desc: "Business legal advice" },
    { id: 55, title: "Tax Preparation", price: 60, img: "https://plus.unsplash.com/premium_photo-1726736600942-c5a43e934615?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fFRheCUyMFByZXBhcmF0aW9ufGVufDB8fDB8fHww", rating: 4.4, reviews: 58, desc: "Tax filing service" },
    { id: 56, title: "Virtual Assistant", price: 25, img: "https://i.postimg.cc/y8fxvZrK/Virtual-Assistant.png", rating: 4.3, reviews: 72, desc: "Administrative support" },
    { id: 57, title: "Data Entry", price: 15, img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGF0YSUyMEVudHJ5fGVufDB8fDB8fHww", rating: 4.2, reviews: 89, desc: "Accurate data processing" },
    { id: 58, title: "CRM Setup", price: 90, img: "https://images.unsplash.com/photo-1713463084491-6be1bd8e557a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q1JNJTIwU2V0dXB8ZW58MHx8MHx8fDA%3D", rating: 4.7, reviews: 31, desc: "Customer relationship management" },
    { id: 59, title: "Project Management", price: 70, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fFByb2plY3QlMjBNYW5hZ2VtZW50fGVufDB8fDB8fHww", rating: 4.6, reviews: 44, desc: "Project coordination" },
    { id: 60, title: "Business Consulting", price: 110, img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGJ1c2luZXNzJTIwY29uc3VsdGluZ3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 39, desc: "Strategic business advice" }
  ],
  ai: [
    { id: 61, title: "AI Image Generation", price: 10, img: "https://plus.unsplash.com/premium_photo-1682689380442-da3bcf63e76f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEFJJTIwSW1hZ2UlMjBHZW5lcmF0aW9ufGVufDB8fDB8fHww", rating: 4.4, reviews: 9, desc: "Custom AI-generated images" },
    { id: 62, title: "AI Video Creation", price: 100, img: "https://images.unsplash.com/photo-1652090504210-438ea92793a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEFJJTIwVmlkZW8lMjBDcmVhdGlvbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.3, reviews: 12, desc: "AI-powered video production" },
    { id: 63, title: "Chatbot Development", price: 200, img: "https://plus.unsplash.com/premium_photo-1726666269043-fb16e54646d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2hhdGJvdCUyMERldmVsb3BtZW50fGVufDB8fDB8fHww", rating: 4.6, reviews: 25, desc: "AI chatbot implementation" },
    { id: 64, title: "Machine Learning", price: 300, img: "https://plus.unsplash.com/premium_photo-1682124651258-410b25fa9dc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TWFjaGluZSUyMExlYXJuaW5nfGVufDB8fDB8fHww", rating: 4.7, reviews: 18, desc: "ML model development" },
    { id: 65, title: "Data Analysis", price: 80, img: "https://plus.unsplash.com/premium_photo-1681487767138-ddf2d67b35c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8RGF0YSUyMEFuYWx5c2lzfGVufDB8fDB8fHww", rating: 4.5, reviews: 33, desc: "AI-powered data insights" },
    { id: 66, title: "AI Content Writing", price: 25, img: "https://i.postimg.cc/7hN3YNwQ/AI-Content-Writing.png", rating: 4.4, reviews: 47, desc: "AI-assisted content creation" },
    { id: 67, title: "Voice Synthesis", price: 45, img: "https://images.unsplash.com/photo-1602858776915-d8b0bbf847a5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Vm9pY2UlMjBTeW50aGVzaXN8ZW58MHx8MHx8fDA%3D", rating: 4.3, reviews: 21, desc: "AI voice generation" },
    { id: 68, title: "Predictive Analytics", price: 120, img: "https://plus.unsplash.com/premium_photo-1683141154082-324d296f3c66?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UHJlZGljdGl2ZSUyMEFuYWx5dGljc3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.8, reviews: 14, desc: "Future trend forecasting" },
    { id: 69, title: "AI Optimization", price: 90, img: "https://plus.unsplash.com/premium_photo-1733266868412-cfc2ac17b497?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QUklMjBPcHRpbWl6YXRpb258ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 29, desc: "Process automation" },
    { id: 70, title: "Neural Networks", price: 250, img: "https://images.unsplash.com/photo-1597733336794-12d05021d510?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TmV1cmFsJTIwTmV0d29ya3N8ZW58MHx8MHx8fDA%3D", rating: 4.9, reviews: 11, desc: "Advanced AI solutions" }
  ],
  music: [
    { id: 71, title: "Music Production", price: 150, img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TXVzaWMlMjBQcm9kdWN0aW9ufGVufDB8fDB8fHww", rating: 4.7, reviews: 36, desc: "Professional music creation" },
    { id: 72, title: "Audio Mixing", price: 60, img: "https://images.unsplash.com/photo-1703117387553-5d406704d157?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8QXVkaW8lMjBNaXhpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 42, desc: "Sound mixing and mastering" },
    { id: 73, title: "Jingle Creation", price: 80, img: "https://images.unsplash.com/photo-1672202119135-96a8ff5d2da0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SmluZ2xlJTIwQ3JlYXRpb258ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 28, desc: "Custom advertising jingles" },
    { id: 74, title: "Sound Design", price: 70, img: "https://images.unsplash.com/photo-1649456674221-12b66d8a6fa8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8U291bmQlMjBEZXNpZ258ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 33, desc: "Custom sound effects" },
    { id: 75, title: "Voice Over", price: 40, img: "https://plus.unsplash.com/premium_photo-1661963459095-3a67407ba90c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fFZvaWNlJTIwT3ZlcnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.8, reviews: 57, desc: "Professional voice recording" },
    { id: 76, title: "Podcast Editing", price: 55, img: "https://plus.unsplash.com/premium_photo-1679079455733-3f80a3b82f01?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UG9kY2FzdCUyMEVkaXRpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.7, reviews: 39, desc: "Podcast production" },
    { id: 77, title: "Audio Restoration", price: 35, img: "https://plus.unsplash.com/premium_photo-1726862534242-cf2cb9b93182?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEF1ZGlvJTIwUmVzdG9yYXRpb258ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 24, desc: "Audio quality enhancement" },
    { id: 78, title: "Music Licensing", price: 100, img: "https://images.unsplash.com/photo-1668455337129-9a7ecab73629?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TXVzaWMlMjBMaWNlbnNpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 19, desc: "Royalty-free music" },
    { id: 79, title: "Audio Book Production", price: 120, img: "https://images.unsplash.com/photo-1711394222928-f73cab7eeaf0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEF1ZGlvJTIwQm9vayUyMFByb2R1Y3Rpb258ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 26, desc: "Complete audiobook creation" },
    { id: 80, title: "Beat Making", price: 50, img: "https://plus.unsplash.com/premium_photo-1680955436037-00aae832309f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fEJlYXQlMjBNYWtpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.3, reviews: 48, desc: "Custom music beats" }
  ],
  photography: [
    { id: 81, title: "Product Photography", price: 45, img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UHJvZHVjdCUyMFBob3RvZ3JhcGh5fGVufDB8fDB8fHww", rating: 4.8, reviews: 63, desc: "Professional product shots" },
    { id: 82, title: "Photo Editing", price: 20, img: "https://images.unsplash.com/photo-1502209877429-d7c6df9eb3f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFBob3RvJTIwRWRpdGluZ3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.7, reviews: 78, desc: "Image enhancement" },
    { id: 83, title: "Portrait Photography", price: 60, img: "https://images.unsplash.com/photo-1606122017369-d782bbb78f32?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFBvcnRyYWl0JTIwUGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 42, desc: "Professional portraits" },
    { id: 84, title: "Real Estate Photos", price: 75, img: "https://plus.unsplash.com/premium_photo-1746387628298-af5695a3f935?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UmVhbCUyMEVzdGF0ZSUyMFBob3Rvc3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 37, desc: "Property photography" },
    { id: 85, title: "Food Photography", price: 55, img: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEZvb2QlMjBQaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D", rating: 4.4, reviews: 51, desc: "Culinary photography" },
    { id: 86, title: "Photo Restoration", price: 30, img: "https://plus.unsplash.com/premium_photo-1698362819146-bb3233129fda?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8UGhvdG8lMjBSZXN0b3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.9, reviews: 29, desc: "Old photo repair" },
    { id: 87, title: "Drone Photography", price: 90, img: "https://images.unsplash.com/photo-1613688570481-820ec84316f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RHJvbmUlMjBQaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D", rating: 4.7, reviews: 34, desc: "Aerial photography" },
    { id: 88, title: "Event Photography", price: 100, img: "https://images.unsplash.com/photo-1714583174225-0e0649aca03d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8RXZlbnQlMjBQaG90b2dyYXBofGVufDB8fDB8fHww", rating: 4.6, reviews: 45, desc: "Event coverage" },
    { id: 89, title: "Fashion Photography", price: 80, img: "https://images.unsplash.com/photo-1658747708841-c3c206129a33?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTIzfHxGYXNoaW9uJTIwUGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D", rating: 4.5, reviews: 38, desc: "Fashion shoot" },
    { id: 90, title: "360° Photography", price: 120, img: "https://plus.unsplash.com/premium_photo-1737200670657-6074902f3da0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fDM2MCVDMiVCMCUyMFBob3RvZ3JhcGh5fGVufDB8fDB8fHww", rating: 4.4, reviews: 22, desc: "Immersive photography" }
  ],
  consulting: [
    { id: 91, title: "Career Coaching", price: 65, img: "https://images.unsplash.com/photo-1742210605500-96e27795b574?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTQxfHxDYXJlZXIlMjBDb2FjaGluZ3xlbnwwfHwwfHx8MA%3D%3D", rating: 4.8, reviews: 41, desc: "Professional career guidance" },
    { id: 92, title: "Life Coaching", price: 55, img: "https://images.unsplash.com/photo-1651341272987-732bfb176539?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8TGlmZSUyMENvYWNoaW5nfGVufDB8fDB8fHww", rating: 4.7, reviews: 36, desc: "Personal development" },
    { id: 93, title: "Health Coaching", price: 70, img: "https://images.unsplash.com/photo-1639511204522-9e40a68d98d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoJTIwY29hY2hpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.6, reviews: 29, desc: "Wellness guidance" },
    { id: 94, title: "Financial Advice", price: 85, img: "https://plus.unsplash.com/premium_photo-1664304226547-178005375184?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RmluYW5jaWFsJTIwQWR2aWNlfGVufDB8fDB8fHww", rating: 4.5, reviews: 33, desc: "Financial planning" },
    { id: 95, title: "Relationship Coaching", price: 60, img: "https://plus.unsplash.com/premium_photo-1722859294725-90a2fa80501f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8UmVsYXRpb25zaGlwJTIwQ29hY2hpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 27, desc: "Relationship guidance" },
    { id: 96, title: "Business Coaching", price: 95, img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEJ1c2luZXNzJTIwQ29hY2hpbmd8ZW58MHx8MHx8fDA%3D", rating: 4.3, reviews: 31, desc: "Business mentorship" },
    { id: 97, title: "Nutrition Planning", price: 45, img: "https://plus.unsplash.com/premium_photo-1700141385404-4fbedbdc65a1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fE51dHJpdGlvbiUyMFBsYW5uaW5nfGVufDB8fDB8fHww", rating: 4.7, reviews: 44, desc: "Dietary guidance" },
    { id: 98, title: "Fitness Training", price: 50, img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Rml0bmVzcyUyMFRyYWluaW5nfGVufDB8fDB8fHww", rating: 4.6, reviews: 52, desc: "Exercise programs" },
    { id: 99, title: "Meditation Guidance", price: 35, img: "https://images.unsplash.com/photo-1759149784785-cc01f70e88ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWVkaXRhdGlvbiUyMEd1aWRhbmNlfGVufDB8fDB8fHww", rating: 4.5, reviews: 38, desc: "Mindfulness training" },
    { id: 100, title: "Time Management", price: 40, img: "https://images.unsplash.com/photo-1518281361980-b26bfd556770?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGltZSUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D", rating: 4.4, reviews: 46, desc: "Productivity coaching" }
  ],
  education: [
    { id: 101, title: "Tutoring", price: 30, img: "https://i.postimg.cc/sXFRfj0J/Tutoring.png", rating: 4.8, reviews: 67, desc: "Academic tutoring" },
    { id: 102, title: "Online Course", price: 150, img: "https://images.unsplash.com/photo-1588702547981-5f8fed370e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fE9ubGluZSUyMENvdXJzZXxlbnwwfHwwfHx8MA%3D%3D", rating: 4.7, reviews: 42, desc: "Course development" },
    { id: 103, title: "Language Lessons", price: 25, img: "https://images.unsplash.com/photo-1628130418598-1a49759201f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGFuZ3VhZ2UlMjBMZXNzb25zfGVufDB8fDB8fHww", rating: 4.6, reviews: 58, desc: "Language instruction" },
    { id: 104, title: "Test Preparation", price: 45, img: "https://images.unsplash.com/photo-1596266738213-ac2eb977c10c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fFRlc3QlMjBQcmVwYXJhdGlvbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 39, desc: "Exam preparation" },
    { id: 105, title: "Homework Help", price: 20, img: "https://images.unsplash.com/photo-1758687126375-e2c1683219e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SG9tZXdvcmslMjBIZWxwfGVufDB8fDB8fHww", rating: 4.4, reviews: 73, desc: "Academic assistance" },
    { id: 106, title: "Research Assistance", price: 35, img: "https://plus.unsplash.com/premium_photo-1702599139775-b7afcd5d39f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFJlc2VhcmNoJTIwQXNzaXN0YW5jZXxlbnwwfHwwfHx8MA%3D%3D", rating: 4.3, reviews: 28, desc: "Research support" },
    { id: 107, title: "Study Materials", price: 15, img: "https://images.unsplash.com/photo-1691458593726-bf55569be467?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjN8fFN0dWR5JTIwTWF0ZXJpYWxzfGVufDB8fDB8fHww", rating: 4.7, reviews: 51, desc: "Educational resources" },
    { id: 108, title: "Workshop Development", price: 80, img: "https://images.unsplash.com/photo-1732539539294-4cc2f38fac9e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8V29ya3Nob3AlMjBEZXZlbG9wbWVudHxlbnwwfHwwfHx8MA%3D%3D", rating: 4.6, reviews: 34, desc: "Training workshops" },
    { id: 109, title: "Curriculum Design", price: 120, img: "https://plus.unsplash.com/premium_photo-1661638627188-0c16c7299707?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Q3VycmljdWx1bSUyMERlc2lnbnxlbnwwfHwwfHx8MA%3D%3D", rating: 4.5, reviews: 26, desc: "Educational planning" },
    { id: 110, title: "Skill Assessment", price: 40, img: "https://images.unsplash.com/photo-1758518730327-98070967caab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2tpbGwlMjBBc3Nlc3NtZW50fGVufDB8fDB8fHww", rating: 4.4, reviews: 32, desc: "Competency evaluation" }
  ]
};

// Flatten all services for search
const allServices = Object.values(serviceCategories).flat();

// Enhanced payment methods
const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: "💳" },
  { id: "paypal", name: "PayPal", icon: "🔵" },
  { id: "bank", name: "Bank Transfer", icon: "🏦" },
  { id: "crypto", name: "Cryptocurrency", icon: "₿" },
  { id: "applepay", name: "Apple Pay", icon: "🍎" },
  { id: "googlepay", name: "Google Pay", icon: "📱" },
  { id: "alipay", name: "Alipay", icon: "💰" },
  { id: "wechatpay", name: "WeChat Pay", icon: "💬" }
];

// 100+ currency options (sample)
const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar", rate: 1 },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.85 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.73 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 110 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 1.25 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 1.35 },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.92 },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 6.45 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 74 },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", rate: 73 }
];

// Country options
const countries = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" }
];

// Simple fallback image (data URI)
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20'>Image unavailable</text></svg>`
);

// Image component with fallback and lazy loading
function ImageWithFallback({ src, alt, className = '', googleQuery, ...rest }) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_IMAGE);
  const triedGoogleRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    setCurrentSrc(src || FALLBACK_IMAGE);
    return () => { isMountedRef.current = false; };
  }, [src]);

  // Fetch first image result from Google Custom Search (requires API key + CX in env)
  async function fetchGoogleImage(q) {
    const key = import.meta.env.VITE_GOOGLE_API_KEY;
    const cx = import.meta.env.VITE_GOOGLE_CX;
    if (!key || !cx || !q) return null;
    try {
      const res = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&searchType=image&q=${encodeURIComponent(q)}&num=1`
      );
      const json = await res.json();
      return json?.items?.[0]?.link || null;
    } catch (err) {
      // don't leak to user; keep fallback
      console.error('Google image fetch error:', err);
      return null;
    }
  }

  const handleError = async () => {
    // avoid multiple attempts per mount
    if (triedGoogleRef.current) {
      if (isMountedRef.current) setCurrentSrc(FALLBACK_IMAGE);
      return;
    }
    triedGoogleRef.current = true;

    // try Google image only if API configured
    const query = googleQuery || alt || '';
    const googleUrl = await fetchGoogleImage(query);
    if (googleUrl && isMountedRef.current) {
      setCurrentSrc(googleUrl);
    } else if (isMountedRef.current) {
      setCurrentSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...rest}
    />
  );
}

export default function Services() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [services] = useState(allServices);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [cart, setCart] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [reviews, setReviews] = useState({});
  const [sortBy, setSortBy] = useState("popular");
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  function handleSearchChange(e) {
    setQuery(e.target.value);
  }

  const filteredServices = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filtered = services.filter(s => {
      const matchesQuery = q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        Object.keys(serviceCategories).some(cat =>
          cat.includes(q) && serviceCategories[cat].includes(s)
        );
      const matchesRating = s.rating >= minRating;
      const matchesPrice = s.price <= maxPrice;
      const matchesCategory = selectedCategory === "all" ||
        Object.keys(serviceCategories).some(cat =>
          cat === selectedCategory && serviceCategories[cat].includes(s)
        );
      return matchesQuery && matchesRating && matchesPrice && matchesCategory;
    });

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    return filtered;
  }, [services, query, minRating, maxPrice, selectedCategory, sortBy]);

  function convertPrice(price, fromCurrency = "USD", toCurrency) {
    // return numeric string formatted to 2 decimals
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    const result = (Number(price || 0) * toRate / fromRate);
    return result.toFixed(2);
  }

  function getCurrencySymbol() {
    return currencies.find(c => c.code === selectedCurrency)?.symbol || "$";
  }

  function pushToast(message, type = "info", ttl = 3000) {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ttl);
  }

  function addToCart(service) {
    setCart(prev => [...prev, service]);
    pushToast(`${service.title} added to order`, "success");
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function placeOrder() {
    if (cart.length === 0) {
      pushToast("Please add at least one service to place an order.", "warning");
      return;
    }
    setShowCheckout(true);
  }

  // Confirm payment: create order on backend and redirect user to billing/payment page.
  async function confirmPayment() {
    if (cart.length === 0) {
      pushToast('Your cart is empty.', 'warning');
      return;
    }

    const lineItems = cart.map(item => ({ sku: item.id || item.title, title: item.title, price: item.price, qty: 1 }));

    try {
      pushToast('Creating order and redirecting to payment...', 'info', 3000);
      const API_BASE = window._API_BASE || '';
      const DEFAULT_API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
      const BASE = API_BASE || DEFAULT_API_BASE;
      const res = await fetch(`${BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestToken: null, lineItems, currency: selectedCurrency, metadata: { paymentMethod } })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Order creation failed:', res.status, errorText);
        pushToast(`Failed to create order (${res.status}): ${errorText}`, 'warning', 6000);
        return;
      }
      
      const json = await res.json();
      if (!json || !json.ok) {
        console.error('Order creation failed:', json);
        pushToast((json && (json.error || json.message)) || 'Failed to create order', 'warning', 6000);
        return;
      }

      const redirectUrl = json.redirectUrl || `/billing/${json.orderId}`;
      setShowCheckout(false);
      navigate(redirectUrl);
    } catch (err) {
      console.error('Error creating order:', err);
      const msg = err && err.message ? `Error creating order: ${err.message}` : 'Error creating order. Please try again.';
      pushToast(msg, 'warning', 6000);
    }
  }

  function openServiceDetail(service) {
    setSelectedService(service);
  }

  function leaveReview(serviceId, name, rating, text) {
    setReviews(prev => {
      const list = prev[serviceId] ? [...prev[serviceId]] : [];
      list.unshift({ name, rating, text, date: new Date().toISOString() });
      return { ...prev, [serviceId]: list };
    });
  }

  function renderStars(rating) {
    if (!rating || rating <= 0) return <span className="text-sm text-slate-400">No ratings</span>;
    const full = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < full; i++) stars.push('★');
    while (stars.length < 5) stars.push('☆');
    return <span className="text-yellow-500">{stars.join('')}</span>;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 text-slate-900 pt-20 p-6">
       
        <header className="max-w-7xl mx-auto mb-8">
          
          <div className="text-center mb-8">
        
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Professional Services Marketplace
            </h1>
            <p className="mt-3 text-lg text-slate-600">Discover 100+ professional services with secure payments and global support</p>
          </div>

          {/* Enhanced Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <input
                  value={query}
                  onChange={handleSearchChange}
                  placeholder="Search services, keywords, categories..."
                  className="w-full p-3 pr-10 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  🔍
                </button>
              </div>

              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                {Object.keys(serviceCategories).map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)} ({serviceCategories[cat].length})
                  </option>
                ))}

              </select>

              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex gap-2">
                <select 
                  value={selectedCurrency}
                  onChange={e => setSelectedCurrency(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol})
                    </option>
                  ))}
                </select>

                <select 
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                >
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating: {minRating}+</label>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="0.5"
                  value={minRating} 
                  onChange={e => setMinRating(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Price: {getCurrencySymbol()}{convertPrice(maxPrice, "USD", selectedCurrency)}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  step="10"
                  value={maxPrice} 
                  onChange={e => setMaxPrice(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-end">
                <span className="text-sm text-gray-600">
                  Showing {filteredServices.length} of {services.length} services
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Services Grid */}
          <section className="lg:col-span-3">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
              {["all", ...Object.keys(serviceCategories)].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category === "all" ? "All Services" : category.charAt(0).toUpperCase() + category.slice(1)}
                  {category !== "all" && ` (${serviceCategories[category].length})`}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <article key={service.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <ImageWithFallback
                      src={service.img}
                      alt={service.title}
                      googleQuery={`${service.title} ${service.desc || ''}`}
                      className="h-48 w-full object-cover rounded-xl mb-4"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {getCurrencySymbol()}{convertPrice(service.price, "USD", selectedCurrency)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {Object.keys(serviceCategories).find(cat => 
                        serviceCategories[cat].includes(service)
                      )}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{service.desc}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      {renderStars(service.rating)}
                      <span className="text-sm text-gray-500 ml-1">({service.reviews})</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openServiceDetail(service)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Details
                      </button>
                      <button 
                        onClick={() => addToCart(service)}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Enhanced Sidebar */}
          <aside className="lg:col-span-1 space-y-6 sticky top-6 h-fit">
            {/* Shopping Cart */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🛒 Your Order
                {cart.length > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </h3>
              
              <div className="space-y-3 max-h-64 overflow-auto">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    Your cart is empty
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500">
                          {getCurrencySymbol()}{convertPrice(item.price, "USD", selectedCurrency)}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Total:</span>
                    <span>
                      {getCurrencySymbol()}
                      {convertPrice(
                        cart.reduce((sum, item) => sum + item.price, 0),
                        "USD",
                        selectedCurrency
                      )}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Method</label>
                      <select 
                        value={paymentMethod}
                        onChange={e => setPaymentMethod(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
                      >
                        {paymentMethods.map(method => (
                          <option key={method.id} value={method.id}>
                            {method.icon} {method.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={placeOrder}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all font-semibold"
                    >
                      💳 Place Order
                    </button>
                    
                    <button 
                      onClick={() => { setCart([]); pushToast('Cart cleared', 'info'); }}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold mb-3">💳 Accepted Payments</h4>
              <div className="grid grid-cols-4 gap-3">
                {paymentMethods.map(method => (
                  <div key={method.id} className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-xs text-gray-600">{method.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
              <h4 className="font-semibold mb-3">📊 Marketplace Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Services:</span>
                  <span className="font-semibold">110+</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-semibold">10</span>
                </div>
                <div className="flex justify-between">
                  <span>Countries:</span>
                  <span className="font-semibold">50+</span>
                </div>
                <div className="flex justify-between">
                  <span>Currencies:</span>
                  <span className="font-semibold">100+</span>
                </div>
              </div>
            </div>
          </aside>
        </main>

        {/* Enhanced Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Secure Checkout</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2 max-h-40 overflow-auto">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.title}</span>
                        <span>{getCurrencySymbol()}{convertPrice(item.price, "USD", selectedCurrency)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>
                      {getCurrencySymbol()}
                      {convertPrice(
                        cart.reduce((sum, item) => sum + item.price, 0),
                        "USD",
                        selectedCurrency
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select 
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      {paymentMethods.map(method => (
                        <option key={method.id} value={method.id}>
                          {method.icon} {method.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmPayment}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all font-semibold"
                    >
                      Confirm Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Service Detail Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold">{selectedService.title}</h2>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <ImageWithFallback
                  src={selectedService.img}
                  alt={selectedService.title}
                  googleQuery={`${selectedService.title} ${selectedService.desc || ''}`}
                  className="w-full h-64 object-cover rounded-xl"
                />
                
                <div>
                  <p className="text-gray-600 mb-4">{selectedService.desc}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Price:</span>
                      <span className="text-lg font-semibold">
                        {getCurrencySymbol()}
                        {convertPrice(selectedService.price, "USD", selectedCurrency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rating:</span>
                      <span className="flex items-center gap-1">
                        {renderStars(selectedService.rating)} ({selectedService.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                        {Object.keys(serviceCategories).find(cat => 
                          serviceCategories[cat].includes(selectedService)
                        )}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(selectedService);
                      setSelectedService(null);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold mb-4"
                  >
                    Add to Cart - {getCurrencySymbol()}
                    {convertPrice(selectedService.price, "USD", selectedCurrency)}
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-6">
                <h4 className="font-semibold mb-4">Customer Reviews</h4>
                <ReviewForm 
                  onSubmit={(name, rating, text) => {
                    leaveReview(selectedService.id, name, rating, text);
                    pushToast('Thanks for your review!', 'success');
                  }} 
                />
                
                <div className="mt-4 space-y-3">
                  {(reviews[selectedService.id] || []).map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{review.name}</span>
                        <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <footer className="max-w-7xl mx-auto mt-12 text-center text-sm text-gray-600">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <p>© {new Date().getFullYear()} MDK Agency — Professional Services Marketplace</p>
            <div className="flex justify-center gap-6 mt-2">
              <a href="#" className="hover:text-purple-600 transition-colors">Terms</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Contact</a>
              <a href="#" className="hover:text-purple-600 transition-colors">Support</a>
            </div>
          </div>
        </footer>
        {/* Toast container */}
        <div aria-live="polite" className="fixed bottom-6 right-6 z-50 space-y-2">
          {toasts.map(t => (
            <div key={t.id} className={`px-4 py-2 rounded-lg shadow-lg text-sm ${t.type === 'success' ? 'bg-green-500 text-white' : t.type === 'warning' ? 'bg-yellow-400 text-black' : 'bg-gray-800 text-white'}`}>
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ReviewForm Component
function ReviewForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !text) {
      // inline simple validation, keep minimal UX logic here
      alert('Please add your name and review text');
      return;
    }
    onSubmit(name, rating, text);
    setName(''); setRating(5); setText('');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
      <h5 className="font-medium mb-3">Write a Review</h5>
      <div className="space-y-3">
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="Your name" 
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Rating:</span>
          <select 
            value={rating} 
            onChange={e => setRating(Number(e.target.value))} 
            className="p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>
                {num} - {num === 5 ? 'Excellent' : num === 4 ? 'Good' : num === 3 ? 'Average' : num === 2 ? 'Poor' : 'Bad'}
              </option>
            ))}
          </select>
        </div>
        
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Your review experience..." 
          rows="3"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        
        <button 
          type="submit" 
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
}

