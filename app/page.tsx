'use client';

import React, { useState, useRef } from 'react';

const SQUADS = [
  { name: 'Normie', color: '#ACA9A9' },
  { name: 'Bitty', color: '#3498DB' },
  { name: 'Ritty', color: '#9884D5' },
  { name: 'Ritualist', color: '#5AFD8E' },
  { name: 'Ascendant Ritualist', color: '#DE9A51' }
];

export default function RitualPFPGenerator() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [assignedSquad, setAssignedSquad] = useState<{ name: string; color: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
      setAssignedSquad(null);
      
      // Draw the initial uploaded image to the canvas
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const img = new Image();
        img.onload = () => {
          canvas.width = 1000;
          canvas.height = 1000;
          const size = Math.min(img.width, img.height);
          const xOffset = (img.width - size) / 2;
          const yOffset = (img.height - size) / 2;
          ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, 1000, 1000);
        };
        img.src = imageUrl;
      }
    }
  };

  const generatePFP = async () => {
    if (!userImage || !canvasRef.current) return;

    // Randomize
    const randomSquad = SQUADS[Math.floor(Math.random() * SQUADS.length)];
    const randomTemplateNum = Math.floor(Math.random() * 5) + 1;
    setAssignedSquad(randomSquad);

    const templatePath = `/templates/${randomSquad.name}/template_${randomTemplateNum}.png`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // 1. Redraw base image (to clear previous templates if user clicks generate multiple times)
      const baseImg = await loadImage(userImage);
      const size = Math.min(baseImg.width, baseImg.height);
      const xOffset = (baseImg.width - size) / 2;
      const yOffset = (baseImg.height - size) / 2;
      ctx.drawImage(baseImg, xOffset, yOffset, size, size, 0, 0, 1000, 1000);

      // 2. Overlay the template
      const overlayImg = await loadImage(templatePath);
      ctx.drawImage(overlayImg, 0, 0, 1000, 1000);
    } catch (error) {
      console.error("Template not found", error);
      alert(`Missing file: public${templatePath}`);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const downloadPFP = () => {
    if (!canvasRef.current || !userImage) return;
    const link = document.createElement('a');
    link.download = `Ritual_PFP_${assignedSquad?.name || 'Base'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
      
      {/* Title Area */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Ritual PFP Generator</h1>
        <p className="text-gray-400">Upload, randomize, and claim your squad.</p>
      </div>

      {/* Editor Container (Matches the old meme layout) */}
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
        
        {/* The Image Preview Area */}
        <div className="w-full aspect-square bg-gray-950 border border-gray-700 rounded-lg flex items-center justify-center mb-6 overflow-hidden relative">
          {!userImage && (
            <span className="text-gray-500 absolute pointer-events-none">Preview Area</span>
          )}
          <canvas 
            ref={canvasRef} 
            className={`w-full h-full object-contain ${!userImage ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>

        {/* The Controls Area (Replaced search/dropdown with Upload/Generate) */}
        <div className="space-y-4">
          
          {/* Upload Button */}
          <div className="relative w-full">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-center rounded-lg font-medium transition-colors border border-gray-700">
              {userImage ? 'Upload New Photo' : '1. Upload Base Photo'}
            </div>
          </div>

          {/* Generate Button */}
          <button 
            onClick={generatePFP}
            disabled={!userImage}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            2. Randomize Squad & Apply Template
          </button>

          {/* Squad Indicator (Only shows after generation) */}
          {assignedSquad && (
            <div className="text-center py-2">
              <span className="text-gray-400 text-sm">Squad: </span>
              <span className="font-bold tracking-wide uppercase" style={{ color: assignedSquad.color }}>
                {assignedSquad.name}
              </span>
            </div>
          )}

          {/* Download Button */}
          <button 
            onClick={downloadPFP}
            disabled={!userImage}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            3. Download PFP
          </button>

        </div>
      </div>
    </main>
  );
}
