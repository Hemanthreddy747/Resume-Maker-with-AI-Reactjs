import React, { useRef, useState } from "react";
import LoginModal from "./LoginModal";
import "./Home.css";
import "./Landing.css";
import TemplatesSection from "./TemplatesSection";
import EditResume from "./EditResume";
import heroImg from "../assets/lisbon-resume-templates.jpg";

const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const templatesRef = useRef(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingTemplateData, setEditingTemplateData] = useState(null);

  const scrollToTemplates = () => {
    if (templatesRef.current) {
      templatesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="landing-root">
      <header className="lm-navbar" role="banner">
        <div className="container navbar-inner">
          <a className="brand" href="/" aria-label="ResumeMaker home">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="24" height="24" rx="6" fill="#0b5fff" />
              <path d="M7 15V9l5-2v10l-5-2z" fill="white" opacity="0.95" />
            </svg>
            <span className="brand-text">ResumeMaker</span>
          </a>

          <nav className="nav-desktop" role="navigation" aria-label="Main">
            <ul className="nav-links">
              <li>
                <button className="nav-link" onClick={scrollToTemplates}>
                  Templates
                </button>
              </li>
              <li>
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="nav-link" href="#howitworks">
                  How it works
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setShowLogin(true)}
              aria-haspopup="dialog"
            >
              Sign in
            </button>
            <button className="btn btn-gradient" onClick={scrollToTemplates}>
              Create Resume
            </button>
          </div>

          <div className="mobile-menu">
            <button
              className="mobile-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((s) => !s)}
            >
              <span className="sr-only">Toggle navigation</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {menuOpen ? (
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-drawer" role="dialog" aria-modal="true">
            <ul>
              <li>
                <button
                  className="nav-link"
                  onClick={() => {
                    scrollToTemplates();
                    setMenuOpen(false);
                  }}
                >
                  Templates
                </button>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="#features"
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  className="nav-link"
                  href="#howitworks"
                  onClick={() => setMenuOpen(false)}
                >
                  How it works
                </a>
              </li>
              <li className="mobile-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                  }}
                >
                  Sign in
                </button>
                <button
                  className="btn btn-gradient"
                  onClick={() => {
                    scrollToTemplates();
                    setMenuOpen(false);
                  }}
                >
                  Create Resume
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>

      {editingTemplate === null && (
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="eyebrow">Build confidently</div>
              <h1 id="hero-title" className="hero-title">
                Modern resumes — crafted for hiring managers and ATS
              </h1>
              <p className="hero-sub">
                Create a clean, professional resume in minutes. Pick a template,
                tailor sections, and export a print-ready PDF with one click.
              </p>

              <div className="hero-ctas">
                <button
                  className="btn btn-gradient btn-lg"
                  onClick={scrollToTemplates}
                >
                  Start for free
                </button>
                <button className="btn btn-outline" onClick={scrollToTemplates}>
                  Browse templates
                </button>
              </div>

              <div className="hero-features">
                <div className="feature-pill">ATS-ready</div>
                <div className="feature-pill">Smart sections</div>
                <div className="feature-pill">PDF export</div>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-preview">
                <div className="preview-frame">
                  <img src={heroImg} alt="Resume templates preview" />
                </div>
                <div className="preview-badge">Templates • Free</div>
              </div>
              <div className="trust-row">
                <div className="trust-item">Trusted by 50k+ professionals</div>
                <div className="trust-item">PDF export • Print-ready</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <main>
        {editingTemplate === null ? (
          <section ref={templatesRef} className="templates-anchor">
            <TemplatesSection
              onTemplateSelect={(idx, data) => {
                setEditingTemplate(idx);
                setEditingTemplateData(data || null);
              }}
            />
          </section>
        ) : (
          <section className="edit-anchor">
            <EditResume
              templateIndex={editingTemplate}
              templateData={editingTemplateData}
              onBack={() => {
                setEditingTemplate(null);
                setEditingTemplateData(null);
                if (templatesRef.current) {
                  templatesRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
            />
          </section>
        )}
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="brand-small">
            © {new Date().getFullYear()} ResumeMaker
          </div>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </div>
      </footer>

      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Landing;
