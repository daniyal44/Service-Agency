

import React, { useState, useEffect } from 'react';
import './Portfolio.css'; // You'll need to extract the CSS to a separate file

const Portfolio = () => {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const [isGoTopActive, setIsGoTopActive] = useState(false);
  const [isSkillsActive, setIsSkillsActive] = useState(false);
  const [isThemeActive, setIsThemeActive] = useState(false);
  const [theme, setTheme] = useState('dark-theme');

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsHeaderActive(true);
        setIsGoTopActive(true);
      } else {
        setIsHeaderActive(false);
        setIsGoTopActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    setTheme(savedTheme);
    setIsThemeActive(savedTheme === 'light-theme');
    // apply to body so CSS selectors like `body.light-theme` work
    try {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(savedTheme);
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  // Keep document.body class in sync when theme changes
  useEffect(() => {
    try {
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add(theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // Toggle mobile menu
  const toggleNav = () => {
    setIsNavActive(!isNavActive);
  };

  // Toggle skills section
  const toggleSkills = () => {
    setIsSkillsActive(!isSkillsActive);
  };

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
    setTheme(newTheme);
    setIsThemeActive(newTheme === 'light-theme');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className={theme}>
      <header className={`header ${isHeaderActive ? 'active' : ''}`} data-header>
        <div className="container">
          <h1 className="h1 logo">
            <a href="#">Muhammad Daniyal<span>.</span></a>
          </h1>

          <div className="navbar-actions">
            <select name="language" id="lang">
              <option value="en">En</option>
              <option value="es">Es</option>
            </select>
            <button
              type="button"
              className={`theme-btn ${isThemeActive ? "active" : ""}`}
              aria-pressed={isThemeActive}
              aria-label="Toggle theme"
              title={isThemeActive ? "Switch to Dark Theme" : "Switch to Light Theme"}
              onClick={toggleTheme}
            >
              <span className="icon" aria-hidden="true"></span>
            </button>

          </div>

          <button
            className={`nav-toggle-btn ${isNavActive ? 'active' : ''}`}
            aria-label="Toggle Menu"
            title="Toggle Menu"
            onClick={toggleNav}
          >
            <span className="one"></span>
            <span className="two"></span>
            <span className="three"></span>
          </button>

          <nav className={`navbar ${isNavActive ? 'active' : ''}`} data-navbar>
            <ul className="navbar-list">
              <li><a href="#home" className="navbar-link" onClick={toggleNav}>Home</a></li>
              <li><a href="#about" className="navbar-link" onClick={toggleNav}>About</a></li>
              <li><a href="#skills" className="navbar-link" onClick={toggleNav}>Skills</a></li>
              <li><a href="#portfolio" className="navbar-link" onClick={toggleNav}>Portfolio</a></li>
              <li><a href="#contact" className="navbar-link" onClick={toggleNav}>Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <article className="container">
          <section className="hero" id="home">
            <figure className="hero-banner">
              <picture>
                <source srcSet="https://i.postimg.cc/RF1wSs76/picture.jpg" media="(min-width: 768px)" />
                <source srcSet="https://i.postimg.cc/RF1wSs76/picture.jpg" media="(min-width: 500px)" />
                <img src="https://i.postimg.cc/RF1wSs76/picture.jpg" alt="A man with blue shirt" className="w-100" />
              </picture>
            </figure>

            <div className="hero-content">
              <h2 className="h2 hero-title">Designing & Building Creative Products</h2>
              <a href="#contact" className="btn btn-primary">Contact us</a>
            </div>

            <ul className="hero-social-list">
              <li>
                <a href="https://www.facebook.com/muhammad.daniyal.522942" target="_blank" rel="noopener noreferrer" className="hero-social-link">
                  <i className="ri-facebook-fill"></i>
                  <div className="tooltip">Facebook</div>
                </a>
              </li>

              <li>
                <a href="#" className="hero-social-link">
                  <i className="ri-twitter-x-line"></i>
                  <div className="tooltip">Twitter-X</div>
                </a>
              </li>

              <li>
                <a href="https://www.linkedin.com/in/muhammad-daniyal-3b3b43383/" target="_blank" rel="noopener noreferrer" className="hero-social-link">
                  <i className="ri-linkedin-fill"></i>
                  <div className="tooltip">Linkedin</div>
                </a>
              </li>
            </ul>

            <a href="#stats" className="scroll-down">Scroll</a>
          </section>

          <section className="stats" id="stats">
            <ul className="stats-list">
              <li>
                <a href="#" className="stats-card">
                  <div className="card-icon">
                    <img src="https://i.postimg.cc/x1TWtf69/stats-card-icon-1.png" alt="badge icon" />
                  </div>

                  <h2 className="h2 card-title">12+<strong>Years of Experience</strong></h2>
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="stats-card">
                  <div className="card-icon">
                    <img src="https://i.postimg.cc/q7ByNYBb/stats-card-icon-2.png" alt="checkmark icon" />
                  </div>

                  <h2 className="h2 card-title">230+<strong>Completed Projects</strong></h2>
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a>
              </li>

              <li>
                <a href="#" className="stats-card">
                  <div className="card-icon">
                    <img src="https://i.postimg.cc/hj6d3tL6/stats-card-icon-3.png" alt="peoples rating icon" />
                  </div>

                  <h2 className="h2 card-title">95+<strong>Happy Clients</strong></h2>
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </a>
              </li>
            </ul>
          </section>

          <section className="about" id="about">
            <figure className="about-banner">
              <img src="https://i.postimg.cc/LXcVgTbJ/about-banner.png" alt="A man thinking" className="w-100" />
            </figure>

            <div className="about-content section-content">
              <p className="section-subtitle">About me</p>
              <h2 className="h2 section-title">Need a Product? Get in Touch!</h2>
              <p className="section-text">
                Hi, I'm Jack Reacher. I'm a developer passionate in creating clean web applications with intuitive functionalities.
                I enjoy the process of turning ideas into reality using creative solutions. I'm always curious about leaning new skills,
                tools and concepts. In addition to working on various solo full stack projects, I have worked with complex teams,
                which involves daily stand-ups and communications, source control and project management
              </p>
            </div>

            <div className="btn-group">
              <button className="btn btn-secondary">Hire me</button>
              <button className="btn btn-primary">Download CV</button>
            </div>
          </section>

          <section className="skills" id="skills">
            <div className="skills-content section-content">
              <p className="section-subtitle">My Skills</p>
              <h2 className="h2 section-title">What my Programming Skills Includes?</h2>
              <p className="section-text">
                I develop simple, intuitive and responsive user interface that helps user get things done with less effort and time with those technologies
              </p>

              <div className={`skills-toggle ${isSkillsActive ? 'active' : ''}`} data-toggle-box>
                <button
                  className={`toggle-btn ${!isSkillsActive ? 'active' : ''}`}
                  onClick={toggleSkills}
                >
                  Skills
                </button>
                <button
                  className={`toggle-btn ${isSkillsActive ? 'active' : ''}`}
                  onClick={toggleSkills}
                >
                  Tools
                </button>
              </div>
            </div>

            <div className={`skills-box ${isSkillsActive ? 'active' : ''}`} data-skills-box>
              <SkillsList />
              <ToolsList />
            </div>
          </section>

          <ProjectSection />
          <ContactSection />
        </article>
      </main>

      <Footer />
      <GoTopButton isActive={isGoTopActive} />
    </div>
  );
};

// Separate components for better organization
const SkillsList = () => (
  <ul className="skills-list">
    {[
      { name: 'HTML5', img: 'https://i.postimg.cc/90cYBMc2/html5.png' },
      { name: 'CSS3', img: 'https://i.postimg.cc/cCDwMBD7/css3.png' },
      { name: 'Javascript', img: 'https://i.postimg.cc/htmQfnq1/javascript.png' },
      { name: 'TypeScript', img: 'https://i.postimg.cc/HswVg206/typescript.png' },
      { name: 'JQuery', img: 'https://i.postimg.cc/Y9C14PR2/jquery.png' },
      { name: 'Bootstrap', img: 'https://i.postimg.cc/Fzf3pJw2/bootstrap.png' },
      { name: 'Angular', img: 'https://i.postimg.cc/pLMzQrC6/angular.png' },
      { name: 'React', img: 'https://i.postimg.cc/LsNPMTpc/react.png' },
      { name: 'Vue', img: 'https://i.postimg.cc/YqYbBJyT/vue.png' },
      { name: 'Firebase', img: 'https://i.postimg.cc/vTHbwrGN/firebase.png' },
      { name: 'PugJs', img: 'https://i.postimg.cc/FRKN2brn/pugjs.png' },
      { name: 'SASS', img: 'https://i.postimg.cc/jSrKsYqf/sass.png' }
    ].map((skill, index) => (
      <li key={index}>
        <div className="skills-card">
          <div className="tooltip">{skill.name}</div>
          <div className="card-icon">
            <img src={skill.img} alt={`${skill.name} logo`} />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

const ToolsList = () => (
  <ul className="tools-list">
    {[
      { name: 'Ajax', img: 'https://i.postimg.cc/FHSDb1Sf/ajax.png' },
      { name: 'Gulp', img: 'https://i.postimg.cc/Xqhkd07c/gulp.png' },
      { name: 'Webpack', img: 'https://i.postimg.cc/NFTk6zy3/webpack.png' },
      { name: 'Git', img: 'https://i.postimg.cc/Gp5FZCv0/git.png' },
      { name: 'Npm', img: 'https://i.postimg.cc/wjxDMvV8/npm.png' },
      { name: 'Command Line', img: 'https://i.postimg.cc/VNrr0b0T/command.png' },
      { name: 'VS Code', img: 'https://i.postimg.cc/zvXqW9PB/vs-code.png' },
      { name: 'Trello', img: 'https://i.postimg.cc/FHJNjbGj/trello.png' },
      { name: 'Clickup', img: 'https://i.postimg.cc/wjJYtqT2/clickup.png' },
      { name: 'Slack', img: 'https://i.postimg.cc/3RfcSVxW/slack.png' },
      { name: 'Photoshop', img: 'https://i.postimg.cc/MZ4L1CLF/photoshop.png' },
      { name: 'Adobe XD', img: 'https://i.postimg.cc/g0NSjQR4/adobe-xd.png' }
    ].map((tool, index) => (
      <li key={index}>
        <div className="skills-card">
          <div className="tooltip">{tool.name}</div>
          <div className="card-icon">
            <img src={tool.img} alt={`${tool.name} logo`} />
          </div>
        </div>
      </li>
    ))}
  </ul>
);

const ProjectSection = () => {
  const projects = [
    {
      img: "https://i.postimg.cc/SRGFrbyY/image-plane.jpg",
      title: "Below the plane",
      date: "March 2025",
      datetime: "2025-03"
    },
    {
      img: "https://i.postimg.cc/3r4jFjjr/coffee.jpg",
      title: "Pile of coffee beans",
      date: "February 2025",
      datetime: "2025-02"
    },
    {
      img: "https://i.postimg.cc/grFpxQzw/desert.jpg",
      title: "Weathering Arc",
      date: "February 2025",
      datetime: "2025-02"
    },
    {
      img: "https://i.postimg.cc/s2mpWxFt/article-3.jpg",
      title: "Natural light",
      date: "February 2025",
      datetime: "2025-02"
    },
    {
      img: "https://i.postimg.cc/bJCS8cR7/explore-product-4.jpg",
      title: "Mixed shades",
      date: "January 2025",
      datetime: "2025-01"
    },
    {
      img: "https://i.postimg.cc/PJgBCFgV/img.jpg",
      title: "Rugged mountains",
      date: "January 2025",
      datetime: "2025-01"
    }
  ];

  return (
    <section className="project" id="portfolio">
      <ul className="project-list">
        <li>
          <div className="project-content section-content">
            <p className="section-subtitle">My Works</p>
            <h2 className="h3 section-title">See my works which will amaze you!</h2>
            <p className="section-text">
              We develop the best quality website that serves you in the long-term. Well-documented, clean,
              easy and elegant interface helps any non-technical clients
            </p>
          </div>
        </li>

        {projects.map((project, index) => (
          <li key={index}>
            <a href="#" className="project-card">
              <figure className="card-banner">
                <img src={project.img} alt={project.title} width="500" />
              </figure>

              <div className="card-content">
                <h3 className="h4 card-title">{project.title}</h3>
                <time className="publish-date" dateTime={project.datetime}>{project.date}</time>
              </div>
            </a>
          </li>
        ))}

        <li>
          <button className="load-more">Load More Works</button>
        </li>
      </ul>
    </section>
  );
};

const ContactSection = () => (
  <section className="contact" id="contact">
    <div className="contact-content section-content">
      <p className="section-subtitle">Contact</p>
      <h2 className="h3 section-title">Have you any project? Drop a message!</h2>
      <p className="section-text">
        Get in touch and let me know if I can help! Fill out the form and I'll be in touch as soon as possible
      </p>

      <ul className="contact-list">
        <ContactItem
          icon="location-outline"
          title="Address:"
          content={[
            <address key="address" className="contact-info">
              House no 490 Block 5 Sector D2 Green Town Lahore
            </address>
          ]}
        />

        <ContactItem
          icon="call-outline"
          title="Phone:"
          content={[
            <a key="phone1" href="#" className="contact-info">(+92) 32301-12464</a>,
            <a key="phone2" href="#" className="contact-info">(646) 33110-62800</a>
          ]}
        />

        <ContactItem
          icon="mail-outline"
          title="Email:"
          content={[
            <a key="email1" href="mailto:m.daniyalkhan490@gmail.com" className="contact-info">m.daniyalkhan490@gmail.com</a>,
            <a key="email2" href="mailto:ItxMDK@proton.me" className="contact-info">ItxMDK@proton.me</a>
          ]}
        />

        <li>
          <SocialLinks />
        </li>
      </ul>
    </div>

    <ContactForm />
  </section>
);

const ContactItem = ({ icon, title, content }) => (
  <li className="contact-list-item">
    <div className="contact-item-icon">
      <ion-icon name={icon}></ion-icon>
    </div>
    <div className="wrapper">
      <h3 className="h4 contact-item-title">{title}</h3>
      {Array.isArray(content) ? content.map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      )) : content}
    </div>
  </li>
);

const SocialLinks = () => (
  <ul className="contact-social-list">
    {[
      { name: 'Facebook', icon: 'ri-facebook-fill', href: 'https://www.facebook.com/muhammad.daniyal.522942' },
      { name: 'X-Twitter', icon: 'ri-twitter-x-line', href: '#' },
      { name: 'Linkedin', icon: 'ri-linkedin-fill', href: 'https://www.linkedin.com/in/muhammad-daniyal-3b3b43383/' },
      { name: 'Youtube', icon: 'ri-youtube-fill', href: '#' }
    ].map((social, index) => (
      <li key={index}>
        <a href={social.href} className="contact-social-link" target="_blank" rel="noopener noreferrer">
          <div className="tooltip">{social.name}</div>
          <i className={social.icon}></i>
        </a>
      </li>
    ))}
  </ul>
);

const ContactForm = () => (
  <form className="contact-form">
    <FormField
      type="text"
      name="name"
      id="name"
      label="Name"
      placeholder="John Doe"
      icon="person-outline"
      required
    />

    <FormField
      type="email"
      name="email"
      id="email"
      label="Email"
      placeholder="johndoe@gmail.com"
      icon="mail"
      required
    />

    <FormField
      type="tel"
      name="phone"
      id="phone"
      label="Phone"
      placeholder="Phone Number"
      icon="call"
      required
    />

    <FormField
      type="textarea"
      name="message"
      id="message"
      label="Message"
      placeholder="Write your Message"
      icon="chatbubbles"
      required
    />

    <button type="submit" className="btn btn-primary">Send</button>
  </form>
);

const FormField = ({ type, name, id, label, placeholder, icon, required }) => (
  <div className="form-wrapper">
    <label htmlFor={id} className="form-label">{label}</label>
    <div className="input-wrapper">
      {type === 'textarea' ? (
        <textarea
          name={name}
          id={id}
          className="input-field"
          required={required}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={id}
          required={required}
          placeholder={placeholder}
          className="input-field"
        />
      )}
      <ion-icon name={icon}></ion-icon>
    </div>
  </div>
);

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <p className="h1 logo">
        <a href="#">Muhammad Daniyal<span>.</span></a>
      </p>

      <p className="copyright">
        &copy; 2025 <a href="https://codepen.io/leonam-silva-de-souza" target="_blank" rel="noopener noreferrer">
          ULTRA CODE
        </a>. All rights reserved
      </p>
    </div>
  </footer>
);

const GoTopButton = ({ isActive }) => (
  <a href="#top" className={`go-top ${isActive ? 'active' : ''}`} title="Go to Top">
    <ion-icon name="arrow-up"></ion-icon>
  </a>
);

export default Portfolio;



