import React, { useState, useEffect } from "react";
import "./TemplatesSection.css";
import t1 from "../assets/template1.jpg";
import t2 from "../assets/template2.jpg";
import t3 from "../assets/template3.jpg";
import t4 from "../assets/template4.jpg";
import t5 from "../assets/template5.jpg";
import t6 from "../assets/template6.jpg";
import t7 from "../assets/template7.jpg";
import t8 from "../assets/template8.jpg";
import t9 from "../assets/template9.jpg";
// Template data files (text/html). Only first two exist for now.
import templateData1 from "../assets/templates_data/template1.txt";
import templateData2 from "../assets/templates_data/template2.txt";

const templateLabels = [
  { title: "Classic", desc: "Clean & timeless layout" },
  { title: "Professional", desc: "Formal, recruiter-friendly" },
  { title: "Modern", desc: "Contemporary and bold" },
  { title: "Creative", desc: "Visually-driven layout" },
  { title: "Minimalist", desc: "Simple & elegant" },
  { title: "Elegant", desc: "Refined typography" },
  { title: "Corporate", desc: "Business-oriented" },
  { title: "Simple", desc: "Straightforward, no-frills" },
  { title: "Bold", desc: "Strong headings and contrast" },
];

// index => URL mapping for text data files
const templateDataUrls = [
  templateData1,
  templateData2,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];

const TemplatesSection = ({ onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateData, setTemplateData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setTemplateData(null);
      setDataError(null);
      if (selectedTemplate === null || selectedTemplate === undefined) return;
      const url = templateDataUrls[selectedTemplate];
      if (!url) {
        if (onTemplateSelect) onTemplateSelect(selectedTemplate, null);
        return;
      }
      setLoadingData(true);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        if (!cancelled) {
          setTemplateData(text);
          if (onTemplateSelect) onTemplateSelect(selectedTemplate, text);
        }
      } catch (err) {
        if (!cancelled) setDataError(err.message || String(err));
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedTemplate, onTemplateSelect]);

  return (
    <section className="templates-section mt-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Templates</h2>
          <div className="text-muted">Choose a template</div>
        </div>

        <div className="templates-grid">
          {[t1, t2, t3, t4, t5, t6, t7, t8, t9].map((imgSrc, idx) => {
            const isPdf = /\.pdf(\?.*)?$/i.test(String(imgSrc));

            return (
              <button
                key={idx}
                type="button"
                className={`template-item ${
                  selectedTemplate === idx ? "selected" : ""
                }`}
                onClick={() => setSelectedTemplate(idx)}
                aria-pressed={selectedTemplate === idx}
                aria-label={`Select template ${idx + 1}`}
              >
                {isPdf ? (
                  <object
                    data={imgSrc}
                    type="application/pdf"
                    className="template-preview"
                    aria-label={`PDF preview Template ${idx + 1}`}
                  >
                    <a href={imgSrc} target="_blank" rel="noopener noreferrer">
                      Open PDF (Template {idx + 1})
                    </a>
                  </object>
                ) : (
                  <img src={imgSrc} alt={`Template ${idx + 1}`} />
                )}

                <span className="template-badge">#{idx + 1}</span>

                <div className="template-footer" aria-hidden="true">
                  <div>
                    <div className="template-title">
                      {templateLabels[idx]
                        ? templateLabels[idx].title
                        : `Template ${idx + 1}`}
                    </div>
                    <div className="template-subtitle">
                      {templateLabels[idx] ? templateLabels[idx].desc : ""}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedTemplate !== null && (
          <div className="mt-3">
            Selected: <strong>Template {selectedTemplate + 1}</strong>
            {loadingData && (
              <div className="text-muted"> Loading template data...</div>
            )}
            {dataError && <div className="text-danger">Error loading data</div>}
          </div>
        )}

        {/* Small preview of the loaded template data (if any) */}
        {templateData && (
          <div className="template-data-preview mt-3">
            <div className="preview-title">Template data preview</div>
            <pre>
              {templateData.slice(0, 200)}
              {templateData.length > 200 ? "…" : ""}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default TemplatesSection;
