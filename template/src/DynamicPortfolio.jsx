import React, { useState, useEffect } from 'react';
import { Mail, Phone, Linkedin, Github, MapPin, Calendar, Award, BookOpen, Code, Briefcase, User, ExternalLink } from 'lucide-react';

const DynamicPortfolio = ({ jsonData = null, jsonUrl = null }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    console.log(jsonData)
  // Fetch JSON data from URL or use provided data
  useEffect(() => {
    const fetchData = async () => {
      if (jsonData) {
        setPortfolioData(jsonData);
        return;
      }

      if (jsonUrl) {
        setLoading(true);
        try {
          const response = await fetch(jsonUrl);
          if (!response.ok) throw new Error('Failed to fetch data');
          const data = await response.json();
          setPortfolioData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [jsonData, jsonUrl]);

  // Helper function to safely get nested values
  const getValue = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || defaultValue;
  };

  // Helper function to check if a field exists and has content
  const hasContent = (obj, path) => {
    const value = getValue(obj, path);
    return value && (Array.isArray(value) ? value.length > 0 : value.toString().trim() !== '');
  };

  // Dynamic contact icon mapping
  const getContactIcon = (key) => {
    const iconMap = {
      email: Mail,
      phone: Phone,
      linkedin: Linkedin,
      github: Github,
      location: MapPin,
      website: ExternalLink
    };
    return iconMap[key.toLowerCase()] || ExternalLink;
  };

  // Dynamic contact color mapping
  const getContactColor = (key) => {
    const colorMap = {
      email: 'text-primary',
      phone: 'text-success',
      linkedin: 'text-info',
      github: 'text-dark',
      location: 'text-danger',
      website: 'text-warning'
    };
    return colorMap[key.toLowerCase()] || 'text-secondary';
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolioData) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error!</h4>
            <p className="mb-0">Failed to load portfolio data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) return null;

  return (
    <>
      {/* Bootstrap CSS CDN */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="bg-light min-vh-100">
        {/* Hero Section */}
        <header className="bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
          <div className="container py-5">
            <div className="row justify-content-center text-center text-dark">
              <div className="col-lg-8">
                <h1 className="display-4 fw-bold mb-3">
                  {getValue(portfolioData, 'name', 'Your Name')}
                </h1>
                {hasContent(portfolioData, 'title') && (
                  <p className="lead mb-4 opacity-75">
                    {getValue(portfolioData, 'title')}
                  </p>
                )}
                
                {/* Dynamic Contact Information */}
                {portfolioData.contact && (
                  <div className="d-flex flex-wrap justify-content-center gap-4 mb-0">
                    {Object.entries(portfolioData.contact).map(([key, value]) => {
                      if (!value) return null;
                      const IconComponent = getContactIcon(key);
                      
                      return (
                        <div key={key} className="d-flex align-items-center gap-2 text-dark-50">
                          <IconComponent size={18} />
                          <span className="small">{value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container py-5">
          <div className="row g-4">
            {/* About Me Section */}
            {hasContent(portfolioData, 'summary') && (
              <div className="col-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                        <User className="text-primary" size={24} />
                      </div>
                      <h2 className="card-title h4 mb-0">About Me</h2>
                    </div>
                    <p className="card-text lead text-muted lh-lg">
                      {getValue(portfolioData, 'summary')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {hasContent(portfolioData, 'skills') && (
              <div className="col-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-3">
                        <Code className="text-warning" size={24} />
                      </div>
                      <h2 className="card-title h4 mb-0">Skills</h2>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {portfolioData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-normal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Experience Section */}
            {hasContent(portfolioData, 'experience') && (
              <div className="col-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                        <Briefcase className="text-success" size={24} />
                      </div>
                      <h2 className="card-title h4 mb-0">Experience</h2>
                    </div>
                    <div className="row g-4">
                      {(Array.isArray(portfolioData.experience) ? portfolioData.experience : [portfolioData.experience]).map((exp, index) => (
                        <div key={index} className="col-12">
                          <div className="border-start border-primary border-4 ps-4 pb-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
                              <h5 className="fw-bold text-dark mb-1">
                                {getValue(exp, 'job_title') || getValue(exp, 'role', 'Role')}
                                {getValue(exp, 'company') && (
                                  <span className="text-primary"> @ {getValue(exp, 'company')}</span>
                                )}
                              </h5>
                              {getValue(exp, 'duration') && (
                                <div className="d-flex align-items-center text-muted small">
                                  <Calendar size={16} className="me-2" />
                                  <span>{getValue(exp, 'duration')}</span>
                                </div>
                              )}
                            </div>
                            {getValue(exp, 'description') && (
                              <p className="text-muted mb-0 lh-lg">
                                {getValue(exp, 'description')}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects Section */}
            {hasContent(portfolioData, 'projects') && (
              <div className="col-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3">
                        <Code className="text-info" size={24} />
                      </div>
                      <h2 className="card-title h4 mb-0">Projects</h2>
                    </div>
                    <div className="row g-4">
                      {portfolioData.projects.map((project, index) => (
                        <div key={index} className="col-lg-6">
                          <div className="card border h-100 hover-shadow">
                            <div className="card-body">
                              <h5 className="card-title text-dark mb-3">
                                {getValue(project, 'title', `Project ${index + 1}`)}
                              </h5>
                              {getValue(project, 'tech') && Array.isArray(project.tech) && (
                                <div className="mb-3">
                                  {project.tech.map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="badge bg-light text-dark me-2 mb-2 fw-normal"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {getValue(project, 'description') && (
                                <p className="card-text text-muted lh-lg">
                                  {getValue(project, 'description')}
                                </p>
                              )}
                              {getValue(project, 'url') && (
                                <a 
                                  href={getValue(project, 'url')} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-2"
                                >
                                  <ExternalLink size={16} />
                                  View Project
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row g-4">
              {/* Education Section */}
              {(hasContent(portfolioData, 'education.degree') || hasContent(portfolioData, 'education')) && (
                <div className="col-lg-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-secondary bg-opacity-10 rounded-circle p-2 me-3">
                          <BookOpen className="text-secondary" size={24} />
                        </div>
                        <h2 className="card-title h4 mb-0">Education</h2>
                      </div>
                      <div className="border-start border-secondary border-3 ps-3">
                        <h5 className="fw-bold text-dark mb-2">
                          {getValue(portfolioData, 'education.degree') || getValue(portfolioData, 'education')}
                        </h5>
                        <div className="text-muted">
                          {getValue(portfolioData, 'education.institute') && (
                            <div className="fw-medium mb-1">{getValue(portfolioData, 'education.institute')}</div>
                          )}
                          {getValue(portfolioData, 'education.year') && (
                            <div className="d-flex align-items-center small">
                              <Calendar size={16} className="me-2" />
                              <span>{getValue(portfolioData, 'education.year')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Achievements Section */}
              {hasContent(portfolioData, 'achievements') && (
                <div className="col-lg-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                          <Award className="text-danger" size={24} />
                        </div>
                        <h2 className="card-title h4 mb-0">Achievements</h2>
                      </div>
                      <div className="list-group list-group-flush">
                        {portfolioData.achievements.map((achievement, index) => (
                          <div key={index} className="list-group-item px-0 d-flex align-items-start">
                            <div className="bg-warning rounded-circle me-3 mt-2" style={{width: '8px', height: '8px'}}></div>
                            <span className="text-muted">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Additional Sections */}
            <div className="row g-4">
              {Object.entries(portfolioData).map(([key, value]) => {
                // Skip already rendered sections
                const skipSections = ['name', 'title', 'summary', 'contact', 'skills', 'experience', 'projects', 'education', 'achievements'];
                if (skipSections.includes(key) || !value) return null;

                // Handle array sections
                if (Array.isArray(value) && value.length > 0) {
                  return (
                    <div key={key} className="col-lg-6">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-dark bg-opacity-10 rounded-circle p-2 me-3">
                              <Code className="text-dark" size={24} />
                            </div>
                            <h2 className="card-title h4 mb-0">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
                          </div>
                          <div className="list-group list-group-flush">
                            {value.map((item, index) => (
                              <div key={index} className="list-group-item px-0 d-flex align-items-start">
                                <div className="bg-secondary rounded-circle me-3 mt-2" style={{width: '6px', height: '6px'}}></div>
                                <span className="text-muted small">
                                  {typeof item === 'string' ? item : JSON.stringify(item)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Handle object sections
                if (typeof value === 'object' && !Array.isArray(value)) {
                  return (
                    <div key={key} className="col-lg-6">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-dark bg-opacity-10 rounded-circle p-2 me-3">
                              <Code className="text-dark" size={24} />
                            </div>
                            <h2 className="card-title h4 mb-0">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
                          </div>
                          <div className="row g-2">
                            {Object.entries(value).map(([subKey, subValue]) => (
                              <div key={subKey} className="col-12">
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                                  <span className="fw-medium text-dark small">{subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                                  <span className="text-muted small">{typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Handle simple string/number sections
                if (typeof value === 'string' || typeof value === 'number') {
                  return (
                    <div key={key} className="col-12">
                      <div className="card shadow-sm border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-dark bg-opacity-10 rounded-circle p-2 me-3">
                              <Code className="text-dark" size={24} />
                            </div>
                            <h2 className="card-title h4 mb-0">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h2>
                          </div>
                          <p className="text-muted lh-lg mb-0">
                            {value}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p className="mb-0 small text-white-50">
                  © 2024 {getValue(portfolioData, 'name', 'Portfolio')}. Built with React & Bootstrap.
                </p>
              </div>
              {portfolioData.contact && (
                <div className="col-md-6">
                  <div className="d-flex justify-content-center justify-content-md-end gap-3">
                    {Object.entries(portfolioData.contact)
                      .filter(([key]) => ['linkedin', 'github', 'website'].includes(key.toLowerCase()))
                      .map(([key, value]) => {
                        const IconComponent = getContactIcon(key);
                        const colorClass = getContactColor(key);
                        return (
                          <div key={key} className={`d-flex align-items-center gap-2 ${colorClass} hover-opacity`}>
                            <IconComponent size={20} />
                            <span className="small d-none d-sm-inline">{value}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transition: box-shadow 0.15s ease-in-out;
        }
        .hover-white:hover {
          color: white !important;
          transition: color 0.15s ease-in-out;
        }
        .hover-opacity:hover {
          opacity: 0.8;
          transition: opacity 0.15s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default DynamicPortfolio;