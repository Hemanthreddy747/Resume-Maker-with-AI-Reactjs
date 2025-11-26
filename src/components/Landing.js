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
      <header className="lm-navbar">
        <div className="container navbar-inner">
          <div className="brand">resumemaker</div>

          <nav className="nav-desktop">
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
                <a className="nav-link" href="#pricing">
                  Pricing
                </a>
              </li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              className="btn btn-ghost"
              onClick={() => setShowLogin(true)}
            >
              Sign in
            </button>
            <button className="btn btn-gradient" onClick={scrollToTemplates}>
              Create Resume
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="mobile-menu">
            <button
              className="hamburger"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((s) => !s)}
            >
              <span className={"hamburger-box"} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-drawer">
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
                  href="#pricing"
                  onClick={() => setMenuOpen(false)}
                >
                  Pricing
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
        <section className="hero-section">
          <div className="container hero-inner">
            <div className="hero-left">
              <div className="eyebrow">New</div>
              <h1 className="hero-title">Resumes that open doors</h1>
              <p className="hero-sub">
                Turn your experience into a stunning, ATS-friendly resume in
                minutes. Choose a template, edit inline, and export a polished
                PDF.
              </p>

              <div className="hero-ctas">
                <button
                  className="btn btn-gradient btn-lg"
                  // onClick={() => setShowLogin(true)}
                  onClick={scrollToTemplates}
                >
                  Create Resume — It's free
                </button>
                <button className="btn btn-ghost" onClick={scrollToTemplates}>
                  Explore Templates
                </button>
              </div>

              <div className="hero-features">
                <div className="feature-pill">ATS-friendly</div>
                <div className="feature-pill">One-click PDF</div>
                <div className="feature-pill">Modern designs</div>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-preview">
                <div className="preview-frame">
                  <img src={heroImg} alt="resume preview" />
                </div>
                <div className="preview-badge">Templates • Free</div>
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
                // scroll back to templates
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

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} resumemaker</div>
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
