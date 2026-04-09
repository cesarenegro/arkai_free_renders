import React, { useState, useRef, useEffect } from "react";
import { fal } from "@fal-ai/client";

const QUICK_PROMPTS = [
  "Natural Wood",
  "Concrete",
  "Marble",
  "Glass",
  "Remove Object",
  "Add Plants",
  "Fix Lighting",
];

const QUICK_PROMPTS_MAP = {
  "Natural Wood": "natural oak wood surface, realistic grain texture, warm tone, photorealistic",
  "Concrete": "raw concrete surface, subtle formwork texture, grey tone, architectural photography",
  "Marble": "polished white marble surface, subtle grey veining, reflective, luxury interior",
  "Glass": "clear glass window, transparent, outdoor garden visible through glass, natural light",
  "Remove Object": "empty space, matching surrounding wall/floor texture, seamless blend",
  "Add Plants": "lush tropical indoor plant, monstera or fiddle leaf fig, natural pot, realistic",
  "Fix Lighting": "warm ambient interior lighting, soft shadows, golden hour quality, no harsh spots",
};

export default function MaskEditor({ imageUrl, onClose, generatedImageSetter }) {
  const containerRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const [tool, setTool] = useState("brush"); // brush, eraser, rect, lasso, polygon
  const [brushSize, setBrushSize] = useState(20);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const points = useRef([]); // For lasso and polygon

  const RED_FILL = "rgba(255, 0, 0, 0.5)";
  const RED_STROKE = "rgba(255, 0, 0, 0.5)";

  useEffect(() => {
    // Setup canvases sizes matching the image
    const mainCtx = mainCanvasRef.current.getContext("2d");
    mainCtx.lineCap = "round";
    mainCtx.lineJoin = "round";

    const previewCtx = previewCanvasRef.current.getContext("2d");
    previewCtx.lineCap = "round";
    previewCtx.lineJoin = "round";
  }, []);

  const getCanvasPos = (e) => {
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const scaleX = previewCanvasRef.current.width / rect.width;
    const scaleY = previewCanvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getCanvasPos(e);
    const mainCtx = mainCanvasRef.current.getContext("2d");
    
    if (tool === "polygon") {
      // Polygon logic: click to add points
      if (points.current.length === 0) {
        points.current.push(pos);
      } else {
        // Check distance to first point to close shape
        const first = points.current[0];
        const dist = Math.hypot(pos.x - first.x, pos.y - first.y);
        if (dist < 15 && points.current.length > 2) {
          // Close and commit
          mainCtx.fillStyle = RED_FILL;
          mainCtx.beginPath();
          mainCtx.moveTo(first.x, first.y);
          for (let i = 1; i < points.current.length; i++) {
            mainCtx.lineTo(points.current[i].x, points.current[i].y);
          }
          mainCtx.closePath();
          mainCtx.fill();
          
          points.current = []; // reset
          const previewCtx = previewCanvasRef.current.getContext("2d");
          previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
          return;
        } else {
          points.current.push(pos);
        }
      }
      return;
    }

    isDrawing.current = true;
    startPos.current = pos;
    points.current = [pos];

    if (tool === "brush" || tool === "eraser") {
      mainCtx.beginPath();
      mainCtx.moveTo(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e) => {
    const pos = getCanvasPos(e);
    const previewCtx = previewCanvasRef.current.getContext("2d");
    const mainCtx = mainCanvasRef.current.getContext("2d");

    if (tool === "polygon" && points.current.length > 0) {
      previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      previewCtx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      previewCtx.lineWidth = 2;
      previewCtx.beginPath();
      previewCtx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        previewCtx.lineTo(points.current[i].x, points.current[i].y);
      }
      previewCtx.lineTo(pos.x, pos.y);
      previewCtx.stroke();
      
      // Draw handles for points
      points.current.forEach(pt => {
        previewCtx.beginPath();
        previewCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        previewCtx.fillStyle = "white";
        previewCtx.fill();
        previewCtx.stroke();
      });
      return;
    }

    if (!isDrawing.current) return;

    if (tool === "brush" || tool === "eraser") {
      mainCtx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : RED_STROKE;
      mainCtx.lineWidth = brushSize;
      mainCtx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
      mainCtx.lineTo(pos.x, pos.y);
      mainCtx.stroke();
      mainCtx.globalCompositeOperation = "source-over"; // Reset
    } else if (tool === "rect") {
      previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      previewCtx.fillStyle = RED_FILL;
      previewCtx.fillRect(
        startPos.current.x,
        startPos.current.y,
        pos.x - startPos.current.x,
        pos.y - startPos.current.y
      );
    } else if (tool === "lasso") {
      points.current.push(pos);
      previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      previewCtx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      previewCtx.fillStyle = "rgba(255, 0, 0, 0.2)";
      previewCtx.lineWidth = 2;
      previewCtx.beginPath();
      previewCtx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        previewCtx.lineTo(points.current[i].x, points.current[i].y);
      }
      previewCtx.stroke();
      previewCtx.fill();
    }
  };

  const handleMouseUp = (e) => {
    if (tool === "polygon") return;
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const pos = getCanvasPos(e);
    const mainCtx = mainCanvasRef.current.getContext("2d");
    const previewCtx = previewCanvasRef.current.getContext("2d");

    if (tool === "rect") {
      mainCtx.fillStyle = RED_FILL;
      mainCtx.fillRect(
        startPos.current.x,
        startPos.current.y,
        pos.x - startPos.current.x,
        pos.y - startPos.current.y
      );
      previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
    } else if (tool === "lasso") {
      mainCtx.fillStyle = RED_FILL;
      mainCtx.beginPath();
      mainCtx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        mainCtx.lineTo(points.current[i].x, points.current[i].y);
      }
      mainCtx.closePath();
      mainCtx.fill();
      previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
    }
  };

  const handleDoubleClick = () => {
    if (tool === "polygon" || tool === "lasso") {
      if (points.current.length > 2) {
        const mainCtx = mainCanvasRef.current.getContext("2d");
        const previewCtx = previewCanvasRef.current.getContext("2d");
        
        mainCtx.fillStyle = RED_FILL;
        mainCtx.beginPath();
        mainCtx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length; i++) {
          mainCtx.lineTo(points.current[i].x, points.current[i].y);
        }
        mainCtx.closePath();
        mainCtx.fill();
        
        points.current = [];
        isDrawing.current = false;
        previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
      }
    }
  };

  const clearMask = () => {
    const mainCtx = mainCanvasRef.current.getContext("2d");
    const previewCtx = previewCanvasRef.current.getContext("2d");
    mainCtx.clearRect(0, 0, mainCanvasRef.current.width, mainCanvasRef.current.height);
    previewCtx.clearRect(0, 0, previewCanvasRef.current.width, previewCanvasRef.current.height);
    points.current = [];
  };

  const generateMaskBase64 = () => {
    const cWidth = mainCanvasRef.current.width;
    const cHeight = mainCanvasRef.current.height;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = cWidth;
    exportCanvas.height = cHeight;
    const exportCtx = exportCanvas.getContext("2d");

    const imgData = mainCanvasRef.current.getContext("2d").getImageData(0, 0, cWidth, cHeight);
    const exportData = exportCtx.createImageData(cWidth, cHeight);

    for (let i = 0; i < imgData.data.length; i += 4) {
      if (imgData.data[i + 3] > 10) { // If there's any drawing
        exportData.data[i] = 255;
        exportData.data[i + 1] = 255;
        exportData.data[i + 2] = 255;
        exportData.data[i + 3] = 255;
      } else {
        exportData.data[i] = 0;
        exportData.data[i + 1] = 0;
        exportData.data[i + 2] = 0;
        exportData.data[i + 3] = 255;
      }
    }
    exportCtx.putImageData(exportData, 0, 0);
    return exportCanvas.toDataURL("image/png");
  };

  const handleRegenerate = async () => {
    if (!prompt) {
      alert("Please enter a prompt for the masked area.");
      return;
    }

    setIsGenerating(true);
    try {
      const maskBase64 = generateMaskBase64();
      
      const result = await fal.subscribe("fal-ai/fast-sdxl/inpainting", {
        input: {
          image_url: imageUrl,
          mask_url: maskBase64,
          prompt: prompt + ", extremely detailed, architectural rendering"
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
             console.log(update.logs.map((log) => log.message));
          }
        }
      });

      if (result.data && result.data.images && result.data.images.length > 0) {
        generatedImageSetter(result.data.images[0].url); 
        clearMask();
        onClose(); 
      } else {
        throw new Error("No image returned from API.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to regenerate: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-surface flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-300 bg-surface sticky top-0">
        <button onClick={onClose} className="px-5 py-2 text-primary font-bold bg-transparent border border-gray-400 rounded-lg cursor-pointer hover:bg-soft">
          ← Back
        </button>
        <span className="text-lg font-bold tracking-widest text-primary uppercase">Refine Render</span>
        <button onClick={onClose} className="px-5 py-2 text-on-dark font-semibold bg-accent-primary rounded-lg cursor-pointer hover:bg-accent-primary/90">
          Done
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white">
        {/* CANVAS WORKSPACE */}
        <div className="flex-1 flex items-center justify-center bg-[#f4f4f5] border-r border-[#e5e7eb] p-4 overflow-hidden" ref={containerRef}>
          <div className="relative shadow-2xl rounded overflow-hidden" style={{ width: 512, height: 512 }}>
            <img src={imageUrl} alt="Base Render" className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" />
            
            {/* Draw layer */}
            <canvas
              ref={mainCanvasRef}
              width={512}
              height={512}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            />
            {/* Preview layer for lasso/rect */}
            <canvas
              ref={previewCanvasRef}
              width={512}
              height={512}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
              onContextMenu={(e) => { e.preventDefault(); if(tool === "polygon"){ points.current = []; previewCanvasRef.current.getContext("2d").clearRect(0,0,512,512); } }}
            />
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-[340px] bg-white flex flex-col h-full overflow-hidden shrink-0 border-l border-[#e5e7eb]">
          <div className="p-5 border-b border-[#e5e7eb] shrink-0">
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#000] block mb-3">Tools</span>
            <div className="flex gap-2 flex-wrap">
              {["brush", "eraser", "rect", "lasso", "polygon"].map(t => (
                <button 
                  key={t}
                  onClick={() => setTool(t)}
                  className={`px-3 py-1.5 capitalize font-bold text-[12px] rounded-lg border transition-colors ${tool === t ? 'bg-[#000] text-[#fff] border-[#000]' : 'bg-[#fff] text-[#000] border-[#d1d5db] hover:bg-[#f3f4f6]'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {(tool === "brush" || tool === "eraser") && (
              <div className="mt-4">
                <span className="text-[12px] font-bold text-[#000] block mb-2">Brush Size: {brushSize}px</span>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-accent-primary"
                />
              </div>
            )}

            <button onClick={clearMask} className="w-full mt-4 py-1.5 bg-[#fff] text-[#000] border border-[#d1d5db] font-bold rounded-lg hover:bg-[#f3f4f6] hover:text-[#dc2626] text-[13px] transition-colors">
              Clear Mask
            </button>
          </div>

          <div className="p-5 flex-1 flex flex-col overflow-y-auto min-h-0">
            <div className="mb-4">
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#000] block mb-3">Quick Prompts</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPrompt(QUICK_PROMPTS_MAP[p])}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#f3f4f6] text-[#000] border border-[#d1d5db] rounded-md hover:border-[#000] hover:bg-[#e5e7eb] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#000] block mb-2">Area Instruction</span>
            
            <textarea
              className="w-full flex-1 min-h-[80px] p-3 bg-[#fff] border border-[#d1d5db] rounded-xl text-[#000] text-[13px] leading-relaxed resize-none focus:outline-none focus:border-[#000] mb-2"
              placeholder="Describe what this masked area should become... e.g. 'polished concrete floor with warm reflections'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {/* STICKY BOTTOM BUTTON */}
          <div className="p-5 border-t border-[#e5e7eb] shrink-0 bg-[#fff]">
            <button 
              onClick={handleRegenerate}
              disabled={isGenerating}
              className={`w-full py-3 text-[14px] font-bold rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-[0.98] ${isGenerating ? 'bg-[#71717a] text-[#fff]' : 'bg-[#10b981] text-[#000] hover:bg-[#059669]'}`}
            >
              {isGenerating ? "Refining..." : "✨ Regenerate Masked Area"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

