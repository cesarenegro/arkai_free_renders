import { useState, useRef, useEffect } from "react";
import { Client } from "@gradio/client";
import MaskEditor from "./MaskEditor";

import { promptConfig } from "./config/prompts";

// ── Constants ──────────────────────────────────────────────────
const PAGES = { HOME: "home", MODELS: "models", GALLERY: "gallery" };

const ASPECT_RATIOS = [
  { label: "16:9 Landscape", value: "16:9" },
  { label: "4:3 Standard", value: "4:3" },
  { label: "1:1 Square", value: "1:1" },
  { label: "9:16 Portrait", value: "9:16" },
];

// ── Styles ─────────────────────────────────────────────────────
// ── Icons (inline SVG components) ──────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
    brush: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18.37 2.63a2.12 2.12 0 0 1 3 3L14 13l-4 1 1-4z"/><path d="M8 21a5 3 0 0 1-5-3c0-2 2-3 3-3 2 0 3 1 5 1s3-1 5-1"/></svg>,
    eraser: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 20H7l-2-2 9-9 7 7-1 4zM7 7l7-7"/></svg>,
    select: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2"/></svg>,
    layers: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    share: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
    more: <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>,
    save: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  };
  return icons[name] || null;
};

// ── Placeholder images (architectural stock via unsplash) ─────
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
  generate: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  edit: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  gallery1: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&q=80",
  gallery2: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80",
  gallery3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
  gallery4: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80",
  forest: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
};

// ── Navbar ─────────────────────────────────────────────────────
function Navbar({ page, setPage, showGalleryActions, setSettingsOpen }) {
  return (
    <nav className="flex items-center justify-between px-8 h-[60px] bg-surface border-b border-border-light sticky top-0 z-[100]">
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <span className="font-bold text-[20px] tracking-[1.5px] text-primary cursor-pointer" onClick={() => setPage(PAGES.HOME)}>ARKAI</span>
        <div className="flex gap-7 items-center">
          <span className={`text-[14px] font-medium text-secondary cursor-pointer no-underline py-1 border-b-2 transition-all duration-200 hover:text-primary ${page === PAGES.MODELS ? 'text-primary border-accent-primary' : 'border-transparent'}`} onClick={() => setPage(PAGES.MODELS)}>Models</span>
          <span className={`text-[14px] font-medium text-secondary cursor-pointer no-underline py-1 border-b-2 transition-all duration-200 hover:text-primary ${page === PAGES.GALLERY ? 'text-primary border-accent-primary' : 'border-transparent'}`} onClick={() => setPage(PAGES.GALLERY)}>Gallery</span>
          <span className="navbar-link">Credits</span>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        {showGalleryActions ? (
          <>
            <button className="flex items-center gap-[6px] bg-surface border border-border-light text-primary text-[14px] font-medium py-2 px-4 rounded-lg cursor-pointer font-inherit hover:bg-soft"><Icon name="save" size={16} /> Save</button>
            <button className="flex items-center gap-[6px] bg-accent-primary text-on-dark text-[14px] font-semibold py-2 px-4 rounded-lg border-none cursor-pointer font-inherit hover:bg-accent-primary/90 w-full justify-center"><Icon name="upload" size={16} /> Export</button>
          </>
        ) : (
          <>
            <button className="text-[14px] font-medium text-secondary cursor-pointer bg-transparent border-none font-inherit">Login</button>
            <button className="bg-accent-secondary text-primary text-[14px] font-semibold py-2 px-5 rounded-lg border-none cursor-pointer font-inherit transition-colors duration-150 hover:bg-accent-secondary/80" onClick={() => setPage(PAGES.MODELS)}>Start</button>
          </>
        )}
        <span className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer text-secondary transition-colors duration-150 hover:bg-soft"><Icon name="globe" /></span>
        <span className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer text-secondary transition-colors duration-150 hover:bg-soft" onClick={() => setSettingsOpen?.(true)}><Icon name="settings" /></span>
      </div>
    </nav>
  );
}

// ── Home Page ──────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div>
      <section className="relative px-[8%] py-[60px] pb-20 min-h-[480px] overflow-hidden bg-surface flex flex-col justify-center">
        <img className="absolute top-0 right-0 w-[60%] h-full object-cover opacity-85 z-0" src={IMAGES.hero} alt="" />
        <div className="relative z-10 max-w-[480px]">
          <h1 className="text-[56px] font-bold leading-[1.05] mb-5 text-primary">Draft the<br /><em>impossible.</em></h1>
          <p className="text-[15px] leading-[1.6] text-secondary mb-8 max-w-[380px]">Precision AI tools designed for the modern architect and vision designer. Translate structural concepts into photorealistic environments with uncompromised fidelity.</p>
          <div className="flex items-center gap-6">
            <button className="bg-accent-secondary text-primary text-[15px] font-semibold py-[14px] px-[28px] rounded-[10px] border-none cursor-pointer font-inherit transition-colors duration-150 hover:bg-accent-secondary-hover" onClick={() => setPage(PAGES.MODELS)}>Launch Synthesis Mode</button>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted">System Status</span>
              <span className="flex items-center gap-[6px] text-[13px] font-semibold text-accent-primary"><span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" /> Neural Engine Active</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[8%] py-12 pb-14 bg-app">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_0.8fr] gap-4">
          <div className="feature-card card-generate" onClick={() => setPage(PAGES.MODELS)}>
            <img className="w-full h-[200px] object-cover" src={IMAGES.generate} alt="" style={{ height: 280 }} />
            <div className="p-5 flex flex-col flex-1">
              <div className="w-6 h-6 mb-2 text-accent-primary"><Icon name="sparkle" /></div>
              <div className="text-[20px] font-bold mb-[6px] text-primary">Generate Image</div>
              <div className="text-[13px] text-secondary leading-relaxed flex-1">Convert blueprints and text prompts into hyper-realistic spatial visualizations.</div>
              <div className="inline-flex text-[12px] font-semibold tracking-[1.2px] uppercase text-primary items-center gap-[6px] mt-3">Open Engine <Icon name="arrow" size={14} /></div>
            </div>
          </div>

          <div className="feature-card card-edit" onClick={() => setPage(PAGES.GALLERY)}>
            <img className="w-full h-[200px] object-cover" src={IMAGES.edit} alt="" />
            <div className="p-5 flex flex-col flex-1">
              <div className="w-6 h-6 mb-2 text-accent-primary"><Icon name="brush" /></div>
              <div className="text-[20px] font-bold mb-[6px] text-primary">Edit Image</div>
              <div className="text-[13px] text-secondary leading-relaxed flex-1">In-paint, out-paint and modify existing structural renders.</div>
            </div>
          </div>

          <div className="feature-card card-hd">
            <div className="p-5 flex flex-col flex-1">
              <div className="w-6 h-6 mb-2 text-accent-primary">⚡</div>
              <div className="text-[20px] font-bold mb-[6px] text-primary">HD Enhancement</div>
              <div className="text-[13px] text-secondary leading-relaxed flex-1">Upscale to 8K with AI detailing.</div>
            </div>
          </div>

          <div className="feature-card card-styles">
            <div className="p-5 flex flex-col flex-1">
              <div style={{ fontSize: 20, marginBottom: 8 }}>🎨</div>
              <div className="text-[20px] font-bold mb-[6px] text-primary" style={{ color: "#fff" }}>Explore Styles</div>
              <div className="text-[13px] text-secondary leading-relaxed flex-1">Browse 500+ architectural motifs.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-[8%] py-12 pb-14 flex items-center gap-12 border-t border-border-light bg-surface flex-wrap">
        <div>
          <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-2 block">Core Technology</div>
          <div className="text-[32px] font-bold leading-[1.15] max-w-[280px] text-primary">Built for Precision. Developed for Scale.</div>
        </div>
        <div className="flex flex-1 flex-wrap">
          <div className="flex-1 py-5 px-6 border-l border-border-light min-w-[150px]">
            <div className="font-mono text-[28px] font-semibold text-accent-primary mb-1">0.02ms</div>
            <div className="text-[12px] text-secondary">Latency Threshold</div>
          </div>
          <div className="flex-1 py-5 px-6 border-l border-border-light min-w-[150px]">
            <div className="font-mono text-[28px] font-semibold text-accent-primary mb-1">16bit</div>
            <div className="text-[12px] text-secondary">Color Depth Range</div>
          </div>
          <div className="flex-1 py-5 px-6 border-l border-border-light min-w-[150px]">
            <div className="font-mono text-[28px] font-semibold text-accent-primary mb-1">8K+</div>
            <div className="text-[12px] text-secondary">Max Output Scale</div>
          </div>
          <div className="flex-1 py-5 px-6 border-l border-border-light min-w-[150px]">
            <div className="font-mono text-[28px] font-semibold text-accent-primary mb-1">128M</div>
            <div className="text-[12px] text-secondary">Parameters Cached</div>
          </div>
        </div>
      </section>

      <footer className="px-[8%] py-8 flex justify-between items-start border-t border-border-light bg-muted flex-wrap gap-8">
        <div className="footer-brand">
          <div className="font-bold text-[18px] text-accent-primary tracking-[1px] mb-2">ARKAI</div>
          <div className="text-[11px] text-muted tracking-[0.5px] uppercase">© 2024 ARKAI Synthesis Systems. All rights reserved.</div>
        </div>
        <div className="flex gap-14 flex-wrap">
          <div>
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-3">Platform</div>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">Models</a>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">API Docs</a>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">Enterprise</a>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-3">Legal</div>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">Privacy</a>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">Terms</a>
            <a className="block text-[13px] text-secondary mb-2 cursor-pointer no-underline transition-colors hover:text-primary">Ethics</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Models Page (Image Generation) ────────────────────────────
function ModelsPage() {
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [geoFidelity, setGeoFidelity] = useState(92);
  const [atmosphere, setAtmosphere] = useState(0.65);
  
  const [activePrompts, setActivePrompts] = useState(
    promptConfig.reduce((acc, cat) => ({ ...acc, [cat.key]: cat.default }), {})
  );

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [toast, setToast] = useState(null);
  const [renderId, setRenderId] = useState("ARK-" + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const [refineMode, setRefineMode] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const falApiKey = import.meta.env.VITE_FAL_API_KEY;
  const fileRef = useRef(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const resizeImage = (dataUrl, maxSize = 1024) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
    });
  };

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const resized = await resizeImage(ev.target.result);
      setUploadedImage(resized);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `arkai-render-${renderId}.png`;
    a.click();
  };

  const handleReset = () => {
    setGeneratedImage(null);
    setUploadedImage(null);
    setProgress(0);
  };

  const handleUpscale = async () => {
    if (!generatedImage || !falApiKey) {
      if (!falApiKey) showToast("Fal.ai API token missing.");
      return;
    }
    
    setIsUpscaling(true);
    setProgress(0);
    setProgressText("Initializing upscale (Real-ESRGAN)...");
    
    try {
      const response = await fetch("/api/fal/fal-ai/esrgan", {
        method: "POST",
        headers: {
          "Authorization": `Key ${falApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image_url: generatedImage,
          scale: 4
        })
      });
      
      let prediction = await response.json();
      if (!response.ok) throw new Error(prediction.detail || "Failed to create prediction");
      
      const reqId = prediction.request_id;
      let isCompleted = false;
      while (!isCompleted) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await fetch(`/api/fal/fal-ai/esrgan/requests/${reqId}/status`, {
          headers: { "Authorization": `Key ${falApiKey}` }
        });
        const pollData = await pollResponse.json();
        
        if (pollData.status === "COMPLETED") {
          isCompleted = true;
        } else if (pollData.status === "ERROR" || pollData.status === "FAILED") {
          throw new Error("Upscale failed.");
        }
        setProgressText(`Upscaling... ${pollData.status}`);
      }
      
      const resResponse = await fetch(`/api/fal/fal-ai/esrgan/requests/${reqId}`, {
        headers: { "Authorization": `Key ${falApiKey}` }
      });
      const resData = await resResponse.json();
        
      if (resData.image && resData.image.url) {
        setGeneratedImage(resData.image.url);
        showToast("Upscale complete!", "success");
      } else {
        throw new Error("Upscale failed");
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || "Upscale failed");
    } finally {
      setIsUpscaling(false);
      setProgressText("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          processFile(item.getAsFile());
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleRewritePrompt = async () => {
    if (!prompt) return showToast("Please enter a basic prompt first to refine.");
    if (!falApiKey) return showToast("Fal.ai API token missing.");
    
    setIsRewriting(true);
    let originalPrompt = prompt;
    setPrompt("Refining prompt with AI...");

    try {
      const response = await fetch("/api/fal/fal-ai/any-llm", {
        method: "POST",
        headers: {
          "Authorization": `Key ${falApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: `Enhance this basic architectural design prompt into a highly descriptive, professional midjourney architectural prompt. Only return the final prompt without quotes or intro: ${originalPrompt}`,
          system_prompt: "You are an expert architectural prompt engineer.",
          model: "openai/gpt-4o"
        })
      });
      
      let resData = await response.json();
      if (!response.ok) throw new Error(resData.detail || "Failed to submit prompt to fal.ai queue");

      const reqId = resData.request_id;
      let isCompleted = false;
      while (!isCompleted) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const pollResponse = await fetch(`/api/fal/fal-ai/any-llm/requests/${reqId}/status`, {
          headers: { "Authorization": `Key ${falApiKey}` }
        });
        const pollData = await pollResponse.json();
        
        if (pollData.status === "COMPLETED") {
          isCompleted = true;
        } else if (pollData.status === "ERROR" || pollData.status === "FAILED") {
          throw new Error("Rewrite failed.");
        }
      }

      const finalResponse = await fetch(`/api/fal/fal-ai/any-llm/requests/${reqId}`, {
        headers: { "Authorization": `Key ${falApiKey}` }
      });
      const finalData = await finalResponse.json();
      
      if (finalData.output) {
        setPrompt(finalData.output.trim());
        showToast("Prompt Refined!", "success");
      } else {
        throw new Error("No output text structure returned.");
      }
    } catch (err) {
      console.error(err);
      showToast("Rewrite failed: " + err.message);
      setPrompt(originalPrompt);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return showToast("Please enter a semantic prompt.");
    
    setGenerating(true);
    setProgress(0);
    setProgressText("Initializing pipeline...");
    setGeneratedImage(null);

    try {
      if (falApiKey && uploadedImage) {
        setProgress(20);
        setProgressText("Uploading model payload to fal.ai...");

        let dynamicPrompt = "";
        let dynamicNegative = "";

        if (activePrompts.structureType && activePrompts.structureType !== "DEFAULT") {
          dynamicPrompt += ` ${activePrompts.structureType.toLowerCase()} shot,`;
        }
        if (activePrompts.flooring && activePrompts.flooring !== "DEFAULT") {
          dynamicPrompt += ` flooring: ${activePrompts.flooring.toLowerCase()},`;
        }
        if (activePrompts.furniture === "ADD FURNITURE") {
          dynamicPrompt += ` highly furnished, decorated interior,`;
        } else if (activePrompts.furniture === "REMOVE FURNITURE") {
          dynamicNegative += ` furniture, items, tables, chairs, indoor plants, populated,`;
        } else if (activePrompts.furniture === "MINIMAL") {
          dynamicPrompt += ` minimalist furniture, clean, empty space,`;
        }
        if (activePrompts.material && activePrompts.material !== "DEFAULT") {
          dynamicPrompt += ` styled as ${activePrompts.material.toLowerCase()},`;
        }
        if (activePrompts.lighting && activePrompts.lighting !== "DEFAULT") {
          dynamicPrompt += ` lighting: ${activePrompts.lighting.toLowerCase()},`;
        }
        if (activePrompts.setting && activePrompts.setting !== "DEFAULT") {
          dynamicPrompt += ` setting: ${activePrompts.setting.toLowerCase()},`;
        }

        const finalPrompt = `${prompt},${dynamicPrompt} best quality, extremely detailed, photorealistic architectural rendering`;
        const baseNegative = (negativePrompt ? negativePrompt + ", " : "") + dynamicNegative + " blurry, low quality, distorted, watermark, cartoon, painting";

        const response = await fetch("/api/fal/fal-ai/sd15-depth-controlnet", {
          method: "POST",
          headers: {
            "Authorization": `Key ${falApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: finalPrompt,
            control_image_url: uploadedImage,
            negative_prompt: baseNegative,
            num_inference_steps: 25,
            controlnet_conditioning_scale: 0.9,
            image_size: "landscape_4_3"
          })
        });
        
        let prediction = await response.json();
        if (!response.ok) throw new Error(prediction.detail || "Failed to create fal.ai prediction");
        
        const reqId = prediction.request_id;
        setProgress(50);
        setProgressText("Processing (this may take a moment)...");

        let isCompleted = false;
        while (!isCompleted) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const pollResponse = await fetch(`/api/fal/fal-ai/sd15-depth-controlnet/requests/${reqId}/status`, {
            headers: { "Authorization": `Key ${falApiKey}` }
          });
          const pollData = await pollResponse.json();
          if (pollData.status === "COMPLETED") {
             isCompleted = true;
          } else if (pollData.status === "IN_PROGRESS") {
             setProgress((p) => Math.min(p + 5, 95));
          } else if (pollData.status === "QUEUED") {
             setProgress(55);
          } else if (pollData.status === "ERROR" || pollData.status === "FAILED") {
             throw new Error("Generation failed: " + pollData.error);
          }
        }

        const resResponse = await fetch(`/api/fal/fal-ai/sd15-depth-controlnet/requests/${reqId}`, {
            headers: { "Authorization": `Key ${falApiKey}` }
        });
        const resData = await resResponse.json();

        if (resData.images && resData.images.length > 0) {
          setGeneratedImage(resData.images[0].url);
          setProgress(100);
          setProgressText("Complete!");
          setRenderId("ARK-" + Math.random().toString(36).substring(2, 8).toUpperCase());
        } else {
          throw new Error("ControlNet failed to return an image URL.");
        }
      } else {
        // Demo mode — no APIs configured
        setProgressText("Demo mode — configure APIs for real generation");
        setProgress(100);
        // Show a placeholder result
        setGeneratedImage(IMAGES.gallery2);
      }
    } catch (err) {
      showToast("Pipeline error: " + err.message, "error");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      {refineMode && generatedImage && (
        <MaskEditor 
          imageUrl={generatedImage} 
          onClose={() => setRefineMode(false)} 
          generatedImageSetter={setGeneratedImage}
          falApiKey={falApiKey}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-[312px_1fr_280px] flex-1 min-h-[calc(100vh-60px)]">
        {/* Left Panel — Model Configuration */}
        <div className="p-6 border-r border-border-light bg-surface overflow-y-auto max-h-[calc(100vh-60px)]">
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-4">Model Configuration</div>

        <div className="text-[12px] text-secondary mb-[6px] block">Aspect Ratio</div>
        <div className="grid grid-cols-2 gap-[6px] mb-5">
          {ASPECT_RATIOS.map((ar) => (
            <button key={ar.value} className={`py-[7px] px-[10px] border rounded-lg text-[12px] font-medium text-center cursor-pointer font-inherit transition-all duration-150 ${aspectRatio === ar.value ? 'bg-accent-primary text-on-dark border-accent-primary' : 'bg-surface text-secondary border-border-light hover:bg-soft'}`} onClick={() => setAspectRatio(ar.value)}>
              {ar.label}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium text-primary">Geometry Fidelity</span>
            <span className="font-mono text-[12px] font-semibold text-accent-primary">{geoFidelity}%</span>
          </div>
          <input type="range" className="w-full h-1 rounded-sm appearance-none outline-none bg-border-light cursor-pointer accent-accent-primary" min={0} max={100} value={geoFidelity} onChange={(e) => setGeoFidelity(+e.target.value)} />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium text-primary">Atmospheric Depth</span>
            <span className="font-mono text-[12px] font-semibold text-accent-primary">{atmosphere.toFixed(2)}</span>
          </div>
          <input type="range" className="w-full h-1 rounded-sm appearance-none outline-none bg-border-light cursor-pointer accent-accent-primary" min={0} max={100} value={atmosphere * 100} onChange={(e) => setAtmosphere(+e.target.value / 100)} />
        </div>

        <div className="space-y-3">
          {promptConfig.map((cat) => (
            <div key={cat.key}>
              <label htmlFor={cat.key} className="text-[12px] font-medium text-primary mb-1.5 block">{cat.category}</label>
              <select 
                id={cat.key}
                value={activePrompts[cat.key]} 
                onChange={(e) => setActivePrompts(prev => ({ ...prev, [cat.key]: e.target.value }))}
                className="w-full bg-surface border border-border-light text-primary text-[12px] font-medium rounded-md px-3 py-2 outline-none cursor-pointer focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all duration-150"
              >
                {cat.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Center — Canvas */}
      <div 
        className="bg-app flex flex-col items-center justify-center p-6 relative overflow-hidden"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {generatedImage ? (
          <div className="w-full flex flex-col items-center">
            <div className="relative inline-block w-full max-h-[70vh] rounded-lg bg-muted shadow-sm overflow-hidden flex items-center justify-center select-none">
              <div className="absolute top-4 right-4 flex items-center gap-[10px] bg-surface/85 backdrop-blur-[8px] py-1.5 px-3 rounded-lg text-[11px] z-[5] shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                <span className="font-mono font-medium text-secondary">RENDER_ID: {renderId}</span>
              </div>
              
              <img className="block w-full max-h-[70vh] object-contain pointer-events-none" src={generatedImage} alt="Generated" />
              
              {uploadedImage && (
                <>
                  <div className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none" style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}>
                    <img className="block w-full h-full object-contain filter grayscale-[0.3] opacity-80" src={uploadedImage} alt="Original" />
                  </div>
                  <div className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize z-10 pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ left: `${sliderPos}%` }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l6-6-6-6" />
                        <path d="M9 18l-6-6 6-6" />
                      </svg>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 m-0" />
                  
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white text-[10px] font-semibold tracking-wider px-2 py-1 rounded backdrop-blur-sm z-[5] pointer-events-none">BEFORE</div>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-semibold tracking-wider px-2 py-1 rounded backdrop-blur-sm z-[5] pointer-events-none">AFTER</div>
                </>
              )}
            </div>
            
            <div className="flex gap-[2px] bg-[#3c3c3c]/80 backdrop-blur-[12px] py-[6px] px-2 rounded-[10px] mt-4">
              <button 
                onClick={() => setRefineMode(true)}
                className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg cursor-pointer text-white bg-accent-primary border-none text-[13px] font-bold tracking-[0.5px] transition-all duration-150 hover:bg-accent-primary-hover shadow-sm mr-2">
                <Icon name="brush" size={16} /> REFINE RENDER
              </button>
              
              <button 
                onClick={handleUpscale}
                disabled={isUpscaling}
                className={`flex items-center justify-center gap-2 px-4 h-9 rounded-lg cursor-pointer border-none text-[13px] font-bold tracking-[0.5px] transition-all duration-150 shadow-sm mr-1 ${isUpscaling ? 'text-white/50 bg-white/5' : 'text-white/90 bg-white/10 hover:bg-white/20'}`}>
                {isUpscaling ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Icon name="sparkle" size={16} />
                )}
                {isUpscaling ? "UPSCALING..." : "UPSCALE 4X"}
              </button>

              <button 
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg cursor-pointer text-white/90 bg-white/10 border-none text-[13px] font-bold tracking-[0.5px] transition-all duration-150 hover:bg-white/20 shadow-sm mr-1">
                <Icon name="download" size={16} /> DOWNLOAD
              </button>
              <button 
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg cursor-pointer text-[#ff6b6b]/90 bg-[#ff6b6b]/10 border-none text-[13px] font-bold tracking-[0.5px] transition-all duration-150 hover:bg-[#ff6b6b]/20 hover:text-[#ff6b6b] shadow-sm">
                <Icon name="close" size={16} /> RESET
              </button>
            </div>
          </div>
        ) : uploadedImage ? (
          <>
            <img className="w-full max-h-[70vh] object-contain rounded-lg bg-muted shadow-sm" src={uploadedImage} alt="Uploaded sketch" style={{ opacity: 0.7 }} />
            {generating && (
              <div className="progress-wrap" style={{ position: "absolute", bottom: 40, left: 40, right: 40 }}>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="progress-text">{progressText}</div>
              </div>
            )}
          </>
        ) : (
          <div 
            className={`w-full h-[560px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 text-muted bg-surface cursor-pointer hover:border-accent-primary hover:bg-accent-primary-soft transition-all duration-200 ${isDragging ? 'border-accent-primary bg-accent-primary-soft' : 'border-border-soft'}`} 
            onClick={() => fileRef.current?.click()}
          >
            <div className="text-[36px] opacity-40"><Icon name="upload" size={36} /></div>
            <div className="text-[14px] font-medium text-primary">Upload sketch, 3D screenshot, or paste from clipboard</div>
            <div className="text-[12px] text-disabled">PNG, JPG, or drag and drop here</div>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleUpload} />

        {/* Generation History */}
        <div style={{ width: "100%", marginTop: 24 }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[12px] font-semibold tracking-[0.5px] uppercase text-primary">Generation History</span>
            <span className="text-[12px] font-semibold tracking-[1px] text-muted">24 TOTAL SESSIONS</span>
          </div>
          <div className="flex gap-3 px-6 pb-6 overflow-x-auto">
            {[IMAGES.gallery1, IMAGES.gallery2, IMAGES.gallery3, IMAGES.gallery4].map((src, i) => (
              <img key={i} className="w-[140px] h-[100px] rounded-lg object-cover shrink-0 cursor-pointer border-2 border-transparent transition-all duration-200 hover:filter-none hover:border-accent-primary" src={src} alt="" style={{ filter: "grayscale(0.85)" }} onClick={() => setGeneratedImage(src)} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Semantic Prompt & API Config */}
      <div className="p-6 bg-surface overflow-y-auto max-h-[calc(100vh-60px)]">
        <div className="flex justify-between items-center mb-4">
          <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-primary">Semantic Prompt</div>
          <button 
            disabled={isRewriting}
            onClick={handleRewritePrompt}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[1px] border rounded-md cursor-pointer transition-colors ${isRewriting ? 'bg-border-light text-disabled border-transparent' : 'bg-accent-primary/10 text-accent-primary border-accent-primary/30 hover:bg-accent-primary hover:text-[#fff] hover:border-transparent'}`}
            title="Auto-enhance prompt with AI"
          >
            <Icon name="sparkle" size={12} /> Rewrite
          </button>
        </div>
        <textarea
          className="w-full min-h-[140px] border-2 border-border-light bg-surface rounded-[10px] p-[14px] font-inherit text-[13px] font-medium leading-[1.6] text-primary placeholder:text-disabled resize-y outline-none transition-colors duration-200 mb-2 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary shadow-sm"
          placeholder="Describe the architectural atmosphere... e.g., 'Modern cantilevered museum in a coastal cliff setting, raw concrete textures...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="text-[10px] font-bold tracking-[1.5px] uppercase text-primary mb-2 mt-4">Negative Prompt</div>
        <textarea
          className="w-full min-h-[80px] border-2 border-border-light bg-surface rounded-[10px] p-[14px] font-inherit text-[13px] font-medium leading-[1.6] text-primary placeholder:text-disabled resize-y outline-none transition-colors duration-200 mb-5 focus:border-accent-primary focus:ring-1 focus:ring-accent-primary shadow-sm"
          placeholder="Things to avoid... e.g., blurry, out of focus, distorted, cartoon..."
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        />



        <div style={{ marginTop: 20 }}>
          <button className="flex items-center justify-center gap-2 w-full p-4 bg-accent-secondary text-primary text-[15px] font-bold tracking-[0.5px] border-none rounded-xl cursor-pointer font-inherit transition-colors duration-150 hover:bg-accent-secondary-hover disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleGenerate} disabled={generating}>
            <Icon name="sparkle" size={18} />
            {generating ? "GENERATING..." : "GENERATE"}
          </button>
          <div className="text-[11px] text-muted text-center mt-[6px]">Consumes 4.0 Studio Credits</div>
        </div>

        {generating && (
          <div className="progress-wrap" style={{ marginTop: 12 }}>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-text">{progressText}</div>
          </div>
        )}
      </div>

      {toast && <div className={`fixed bottom-6 right-6 py-3 px-5 rounded-[10px] text-[13px] font-medium z-[200] animate-[slideIn_0.3s_ease] ${toast.type === "error" ? "bg-[#F9E2DA] text-error" : "bg-accent-primary-soft text-accent-primary"}`}>{toast.msg}</div>}
      </div>
    </>
  );
}

// ── Gallery / Edit Page ───────────────────────────────────────
function GalleryPage() {
  const [activeTool, setActiveTool] = useState("brush");
  const [styleIntensity, setStyleIntensity] = useState(84);
  const [textureFidelity, setTextureFidelity] = useState(42);
  const [geometricBias, setGeometricBias] = useState(68);

  const tools = [
    { id: "brush", label: "BRUSH", icon: "brush" },
    { id: "eraser", label: "ERASER", icon: "eraser" },
    { id: "select", label: "SELECT", icon: "select" },
    { id: "layers", label: "LAYERS", icon: "layers" },
  ];

  return (
    <div className="grid grid-cols-[364px_1fr] flex-1 min-h-[calc(100vh-60px)]">
      <div className="p-6 bg-surface border-r border-border-light">
        <div className="text-[10px] font-semibold tracking-[1.5px] uppercase text-muted mb-4">Active Project</div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-[10px] bg-soft flex items-center justify-center text-[18px] text-accent-primary"><Icon name="sparkle" size={18} /></div>
          <div>
            <div className="text-[14px] font-bold text-primary">Project Alpha</div>
            <div className="font-mono text-[10px] tracking-[1px] uppercase text-muted">AI Synthesis Mode</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {tools.map((t) => (
            <button key={t.id} className={`flex flex-col items-center gap-[6px] p-[14px] border rounded-[10px] cursor-pointer font-inherit transition-all duration-150 ${activeTool === t.id ? "border-accent-primary bg-accent-primary-soft" : "border-border-light bg-surface"}`} onClick={() => setActiveTool(t.id)}>
              <span className={`text-[20px] ${activeTool === t.id ? "text-accent-primary" : "text-secondary"}`}><Icon name={t.icon} /></span>
              <span className={`text-[11px] font-semibold tracking-[0.8px] uppercase ${activeTool === t.id ? "text-accent-primary" : "text-secondary"}`}>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium text-primary">STYLE INTENSITY</span>
            <span className="font-mono text-[12px] font-semibold text-accent-primary">{styleIntensity}%</span>
          </div>
          <input type="range" className="w-full h-1 rounded-sm appearance-none outline-none bg-border-light cursor-pointer accent-accent-primary" min={0} max={100} value={styleIntensity} onChange={(e) => setStyleIntensity(+e.target.value)} />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium text-primary">TEXTURE FIDELITY</span>
            <span className="font-mono text-[12px] font-semibold text-accent-primary">{textureFidelity}%</span>
          </div>
          <input type="range" className="w-full h-1 rounded-sm appearance-none outline-none bg-border-light cursor-pointer accent-accent-primary" min={0} max={100} value={textureFidelity} onChange={(e) => setTextureFidelity(+e.target.value)} />
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium text-primary">GEOMETRIC BIAS</span>
            <span className="font-mono text-[12px] font-semibold text-accent-primary">{geometricBias}%</span>
          </div>
          <input type="range" className="w-full h-1 rounded-sm appearance-none outline-none bg-border-light cursor-pointer accent-accent-primary" min={0} max={100} value={geometricBias} onChange={(e) => setGeometricBias(+e.target.value)} />
        </div>

        <button className="flex items-center justify-center gap-2 w-full p-4 bg-accent-secondary text-primary text-[15px] font-bold tracking-[0.5px] border-none rounded-xl cursor-pointer font-inherit transition-colors duration-150 hover:bg-accent-secondary-hover mt-auto">
          <Icon name="sparkle" size={18} /> GENERATE NEW
        </button>
      </div>

      <div className="bg-app flex items-center justify-center p-6 relative">
        <div className="absolute top-5 right-5 bg-white/85 backdrop-blur-md py-2 px-[14px] rounded-lg flex gap-4 text-[12px]">
          <div>
            <div className="text-[10px] font-semibold tracking-[1px] uppercase text-muted">Zoom</div>
            <div className="font-mono text-[12px] font-medium">124.5%</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-[1px] uppercase text-muted">Coords</div>
            <div className="font-mono text-[12px] font-medium text-accent-primary">34.02, -118.24</div>
          </div>
        </div>
        <img className="max-w-full max-h-[80vh] object-contain rounded" src={IMAGES.forest} alt="Project render" />
      </div>
    </div>
  );
}

// ── Settings Modal ─────────────────────────────────────────────
function SettingsModal({ isOpen, onClose, modelEngine, setModelEngine }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="bg-surface border border-border-light rounded-xl w-full max-w-[480px] p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[18px] font-bold text-primary">Settings</h2>
          <button className="text-secondary hover:text-primary bg-transparent border-none cursor-pointer text-[18px]" onClick={onClose}>✕</button>
        </div>
        
        <div className="mb-5">
          <div className="text-[12px] text-secondary mb-[6px] block">Selected Architecture Engine</div>
          <select className="w-full py-2 px-3 border border-border-light rounded-lg font-inherit text-[13px] font-medium bg-surface text-primary appearance-none cursor-pointer focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary" value={modelEngine} onChange={e => setModelEngine(e.target.value)}>
            <option>ARKAI-Vision v4.2</option>
            <option>ARKAI-Sketch v3.0</option>
          </select>
        </div>

        
        <div className="flex justify-end">
          <button className="bg-accent-primary text-on-dark text-[14px] font-semibold py-2 px-6 rounded-lg border-none cursor-pointer hover:bg-accent-primary/90 transition-colors" onClick={onClose}>Save & Close</button>
        </div>
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modelEngine, setModelEngine] = useState("ARKAI-Vision v4.2");

  return (
    <>
      <div className="min-h-screen flex flex-col w-full overflow-hidden transform-gpu bg-app">
        <Navbar page={page} setPage={setPage} showGalleryActions={page === PAGES.GALLERY} setSettingsOpen={setSettingsOpen} />
        {page === PAGES.HOME && <HomePage setPage={setPage} />}
        {page === PAGES.MODELS && <ModelsPage />}
        {page === PAGES.GALLERY && <GalleryPage />}
      </div>
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        modelEngine={modelEngine}
        setModelEngine={setModelEngine}
      />
    </>
  );
}
