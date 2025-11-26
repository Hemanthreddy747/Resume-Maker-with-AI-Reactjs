import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from "jspdf";

import "./EditResume.css";
import t1 from "../assets/template1.jpg";
import t2 from "../assets/template2.jpg";
import t3 from "../assets/template3.jpg";
import t4 from "../assets/template4.jpg";
import t5 from "../assets/template5.jpg";
import t6 from "../assets/template6.jpg";
import t7 from "../assets/template7.jpg";
import t8 from "../assets/template8.jpg";
import t9 from "../assets/template9.jpg";

const EditResume = ({ templateIndex = null, templateData = null, onBack }) => {
  const [data, setData] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
  });

  const [sections, setSections] = useState([
    { header: "Experience", content: "", placeholder: "Experience" },
    { header: "Studies", content: "", placeholder: "Studies" },
    {
      header: "Technical Skills List",
      content: "",
      placeholder: "Technical Skills List",
    },
  ]);

  const [aiInstructions, setAiInstructions] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHtmlRaw, setGeneratedHtmlRaw] = useState("");
  const [pageImages, setPageImages] = useState([]);
  const [isConverting, setIsConverting] = useState(false);

  // Remove style/link stylesheet tags from template data so template CSS
  // does not leak into the app's global styles when rendering as HTML
  const stripTemplateStyles = (html) => {
    if (!html) return html;
    // Remove <style>...</style>
    let cleaned = html.replace(/<style[\s\S]*?<\/style>/gi, "");
    // Remove stylesheet <link ... rel="stylesheet" ... />
    cleaned = cleaned.replace(
      /<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi,
      ""
    );
    return cleaned;
  };

  useEffect(() => {
    if (templateData) {
      setGeneratedHtmlRaw(stripTemplateStyles(templateData));
    }
  }, [templateData]);

  useEffect(() => {
    const formData = {
      personalInfo: {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
      },
      sections: sections.map((sec) => ({
        section_about: sec.header,
        content: sec.content,
      })),
      building_instructions_for_ai: aiInstructions,
      template_style: "html_code",
    };
    console.log("Resume Data:", formData);
  }, [data, sections, aiInstructions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((s) => ({ ...s, [name]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    setSections((s) => {
      const copy = [...s];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addSection = () => {
    setSections((s) => [
      ...s,
      { header: "", content: "", placeholder: "New Section" },
    ]);
  };

  const removeSection = (index) => {
    setSections((s) => s.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setData({
      name: "",
      title: "",
      email: "",
      phone: "",
    });
    setSections([
      { header: "Experience", content: "", placeholder: "Experience" },
      { header: "Studies", content: "", placeholder: "Studies" },
      {
        header: "Technical Skills List",
        content: "",
        placeholder: "Technical Skills List",
      },
    ]);
    setAiInstructions("");
  };

  const generateResumeWithAI = async () => {
    setIsGenerating(true);

    try {
      const formData = {
        personalInfo: {
          name: data.name,
          title: data.title,
          email: data.email,
          phone: data.phone,
        },
        sections: sections.map((sec) => ({
          section_about: sec.header,
          content: sec.content,
        })),
        building_instructions_for_ai: aiInstructions,
        template_style: "professional",
        reference_html: templateData || "",
      };

      const prompt = `Generate a professional A4 HTML resume (single-file) based on the data below.\nReturn ONLY the complete HTML markup (including inline CSS if needed) and nothing else — no explanations and no other markup formats. We will render this HTML and convert it to A4 PDF on the client.\n\nPersonal Info:\n- Name: ${
        formData.personalInfo.name
      }\n- Title: ${formData.personalInfo.title}\n- Email: ${
        formData.personalInfo.email
      }\n- Phone: ${
        formData.personalInfo.phone
      }\n\nSections:\n${formData.sections
        .map((s) => `- ${s.section_about}: ${s.content}`)
        .join("\n")}\n\nAdditional Instructions: ${
        formData.building_instructions_for_ai || "None"
      }`;

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        alert("API key not found. Please restart the development server.");
        return;
      }

      console.log("Using API Key:", apiKey.substring(0, 10) + "...");

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const fullPrompt = `You are an HTML resume generator. Generate only valid HTML (single-file) without any explanations or markdown formatting. Use the reference HTML structure provided (if any) as the visual/layout guide and fill it with the resume data. Do NOT add any extra text or commentary.\n\nReference HTML structure (use for guidance only):\n${
        templateData || "(none)"
      }\n\n${prompt}`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const htmlCode = await response.text();

      // store the raw HTML exactly as received and display it in the preview
      setGeneratedHtmlRaw(htmlCode);
      // convert the HTML into A4-sized page images for scrollable preview
      await convertHtmlToA4Images(htmlCode);
    } catch (error) {
      console.error("Error generating resume:", error);
      alert(
        "Failed to generate resume. Please check your API key and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert an HTML string into A4-sized PNG images (array of data URLs)
  const convertHtmlToA4Images = async (html) => {
    setIsConverting(true);
    setPageImages([]);
    try {
      // create offscreen container
      const container = document.createElement("div");
      container.style.width = "794px"; // A4 width at ~96dpi
      container.style.minHeight = "1123px"; // A4 height at ~96dpi
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.background = "white";
      container.innerHTML = html;
      document.body.appendChild(container);

      let html2canvas;
      try {
        html2canvas = (await import("html2canvas")).default;
      } catch (err) {
        console.error("html2canvas not found:", err);
        alert(
          "Please install html2canvas in the project: `npm install html2canvas` and restart the dev server."
        );
        document.body.removeChild(container);
        setIsConverting(false);
        return;
      }

      const scale = 2; // increase resolution
      const canvas = await html2canvas(container, {
        scale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: container.offsetWidth,
      });

      const pageHeight = Math.round(1123 * scale); // A4 height in px at scale
      const totalHeight = canvas.height;
      const pages = [];

      const tmpCanvas = document.createElement("canvas");
      const tmpCtx = tmpCanvas.getContext("2d");

      for (let y = 0; y < totalHeight; y += pageHeight) {
        const h = Math.min(pageHeight, totalHeight - y);
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = h;
        tmpCtx.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
        tmpCtx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          h,
          0,
          0,
          tmpCanvas.width,
          tmpCanvas.height
        );
        pages.push(tmpCanvas.toDataURL("image/png"));
      }

      document.body.removeChild(container);
      setPageImages(pages);
    } catch (err) {
      console.error("Error converting HTML to images:", err);
      alert(
        "Failed to convert generated HTML to images: " + (err.message || err)
      );
    } finally {
      setIsConverting(false);
    }
  };

  // Download generated pages as a PDF. If page images are not available,
  // convert the generated HTML first.
  const downloadPdf = async () => {
    try {
      if ((!pageImages || pageImages.length === 0) && !generatedHtmlRaw) {
        alert("Nothing to download. Generate the resume first.");
        return;
      }

      if ((!pageImages || pageImages.length === 0) && generatedHtmlRaw) {
        // ensure pageImages are generated
        await convertHtmlToA4Images(generatedHtmlRaw);
      }

      const imgs = pageImages && pageImages.length ? pageImages : [];
      if (imgs.length === 0) {
        alert("Failed to generate preview images for PDF.");
        return;
      }

      // Create PDF instance (try modern constructor, fallback to older)
      let pdf;
      try {
        pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
      } catch (e) {
        pdf = new jsPDF("p", "pt", "a4");
      }

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      imgs.forEach((img, idx) => {
        if (idx > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
      });

      const rawTitle = data && data.title ? data.title : "resume";
      const safeTitle = rawTitle
        .trim()
        .replace(/[^a-z0-9\-_. ]/gi, "")
        .replace(/\s+/g, "_");

      pdf.save(`${safeTitle || "resume"}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("Failed to generate PDF: " + (err.message || err));
    }
  };

  return (
    <section className="resume-section-container templates-section">
      <div className="edit-resume-topbar" style={{ marginBottom: 16 }}>
        {/* <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn btn-ghost"
            onClick={() => {
              if (onBack) onBack();
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0 }}>
            Editing Template{" "}
            {templateIndex !== null ? `#${templateIndex + 1}` : ""}
          </h2>
        </div>
        {templateData && (
          <div style={{ color: "#6c757d" }}>Template data available</div>
        )} */}
      </div>

      <div className="resume-left">
        <h3 className="mb-3">Enter Resume Data</h3>

        <div className="personal-details">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              placeholder="e.g. John Doe"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              placeholder="e.g. Full-Stack Developer"
              value={data.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              placeholder="e.g. john.doe@example.com"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              placeholder="e.g. (123) 456-7890"
              value={data.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* <hr className="divider" /> */}

        {sections.map((sec, idx) => (
          <div key={idx} className="section-block">
            <button
              type="button"
              onClick={() => removeSection(idx)}
              className="btn-remove-section"
              title="Remove section"
              aria-label="Remove section"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="form-group">
              <label>Section Header</label>
              <input
                type="text"
                placeholder={sec.placeholder || "Section Header"}
                value={sec.header}
                onChange={(e) =>
                  handleSectionChange(idx, "header", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows={4}
                value={sec.content}
                onChange={(e) =>
                  handleSectionChange(idx, "content", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <div className="ai-instructions-container">
          <input
            type="text"
            className="ai-instructions-input"
            placeholder="Add additional instructions to AI about building (optional)"
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button
            onClick={addSection}
            className="btn-secondary"
            title="Add a new section"
            aria-label="Add section"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add Section</span>
          </button>
          <button
            onClick={clearAll}
            className="btn-secondary"
            title="Clear all fields"
            aria-label="Clear all"
          >
            <span>Clear All</span>
          </button>
          <button
            className="btn-primary"
            onClick={generateResumeWithAI}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Resume"}
          </button>
        </div>
      </div>

      <div className="resume-right">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          {/* <h3 style={{ margin: 0 }}>Preview</h3> */}
          {templateIndex !== null && (
            <img
              src={[t1, t2, t3, t4, t5, t6, t7, t8, t9][templateIndex]}
              alt={`Template ${templateIndex + 1}`}
              style={{
                width: 120,
                height: "auto",
                objectFit: "cover",
                border: "2px solid #007bff",
                borderRadius: 4,
                marginLeft: 12,
              }}
            />
          )}
          <div style={{ marginLeft: 12, display: "flex", gap: 8 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (onBack) onBack();
              }}
            >
              ← Back
            </button>
            <button
              className="btn btn-primary"
              onClick={downloadPdf}
              disabled={
                isConverting ||
                (pageImages && pageImages.length > 0 ? false : false)
              }
              title="Download resume as PDF"
            >
              Download PDF
            </button>
          </div>
        </div>
        <div id="resume-preview" className="resume-preview">
          {(isGenerating || isConverting) && (
            <div className="preview-loader" role="status" aria-live="polite">
              <div className="spinner" />
              <div className="loader-text">
                {isGenerating
                  ? "Generating resume..."
                  : "Converting preview..."}
              </div>
            </div>
          )}
          {pageImages && pageImages.length > 0 ? (
            <div className="pdf-image-preview">
              {isConverting && (
                <div className="converting-indicator">
                  Converting to A4 images...
                </div>
              )}
              {pageImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Page ${idx + 1}`}
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              ))}
            </div>
          ) : generatedHtmlRaw ? (
            <div
              className="compiled-html-box"
              // Render the returned HTML directly into the preview area
              dangerouslySetInnerHTML={{ __html: generatedHtmlRaw }}
            />
          ) : (
            <div className="resume-root">
              <div className="resume-header">
                <h1>{data.name || "Your Name"}</h1>
                <div>{data.title}</div>
                <div>
                  {data.email} {data.email && data.phone ? " | " : ""}{" "}
                  {data.phone}
                </div>
              </div>

              {sections.map((sec, idx) =>
                sec.content ? (
                  <div className="resume-section" key={idx}>
                    <div className="section-title">{sec.header}</div>
                    <div>{sec.content}</div>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EditResume;
