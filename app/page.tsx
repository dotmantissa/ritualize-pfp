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

    const randomSquad = SQUADS[Math.floor(Math.random() * SQUADS.length)];
    const randomTemplateNum = Math.floor(Math.random() * 5) + 1;
    setAssignedSquad(randomSquad);

    const templatePath = `/templates/${randomSquad.name}/template_${randomTemplateNum}.png`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const baseImg = await loadImage(userImage);
      const size = Math.min(baseImg.width, baseImg.height);
      const xOffset = (baseImg.width - size) / 2;
      const yOffset = (baseImg.height - size) / 2;
      ctx.drawImage(baseImg, xOffset, yOffset, size, size, 0, 0, 1000, 1000);

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
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      
      {/* HEADER MATCHING THE IMAGE EXACTLY */}
      <header className="w-full bg-[#24C958] px-6 py-3 flex items-center shadow-md relative z-20">
        <div className="flex items-center gap-2 text-black font-bold text-xl tracking-wide">
          {/* Replace with your exact SVG Ritual knot logo for the header if needed */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5L7.5 12 12 7.5 16.5 12 12 16.5z"/>
          </svg>
          <span>Ritual | PFP Generator</span>
        </div>
      </header>

      {/* BACKGROUND KNOT GRAPHICS (Placeholders for your existing SVGs/Images) */}
      <div className="absolute top-12 right-0 opacity-90 pointer-events-none z-0">
         {/* Drop your white corner graphic here */}
      </div>
      <div className="absolute bottom-0 left-0 opacity-90 pointer-events-none z-0">
         {/* Drop your green corner graphic here */}
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex flex-col items-center pt-20 px-4 w-full max-w-3xl mx-auto">
        
        {/* Controls Row (Matching the layout of the dropdown/search bar) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full mb-8">
          
          {/* Upload Button (Styled like the white dropdown) */}
          <div className="relative flex-1">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full bg-white text-black py-2 px-4 flex justify-between items-center cursor-pointer h-[42px]">
              <span className="text-sm">{userImage ? 'Change Image' : 'Upload Image'}</span>
              <span className="text-xs">▼</span>
            </div>
          </div>

          {/* Action Buttons Container (Styled like the black search bar with green border) */}
          <div className="flex-[2] flex gap-2">
            <button 
              onClick={generatePFP}
              disabled={!userImage}
              className="flex-1 bg-black border border-[#24C958] text-gray-300 py-2 px-4 text-left text-sm h-[42px] hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate PFP...
            </button>
            <button 
              onClick={downloadPFP}
              disabled={!userImage}
              className="bg-[#24C958] text-black font-bold px-6 h-[42px] hover:bg-[#1eb54f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download
            </button>
          </div>
        </div>

        {/* Level/Squad Display (Matching your uploaded level.png reference) */}
        <div className="w-full flex items-center gap-4 mb-4 min-h-[40px]">
          {assignedSquad && (
            <>
              <div className="flex-grow h-px bg-gray-600"></div>
              <span className="text-5xl font-light text-gray-300 tracking-wide" style={{ color: assignedSquad.color }}>
                {assignedSquad.name}
              </span>
            </>
          )}
        </div>

        {/* Canvas / Preview Area */}
        <div className="w-full aspect-square bg-black border border-gray-800 flex items-center justify-center relative shadow-2xl overflow-hidden">
           {!userImage && (
             <div className="text-gray-600 text-sm tracking-widest uppercase">Awaiting Base Protocol</div>
           )}
           <canvas 
            ref={canvasRef} 
            className={`w-full h-full object-contain ${!userImage ? 'opacity-0' : 'opacity-100'}`}
          />
        </div>
      </main>

      {/* FOOTER EXACTLY AS REQUESTED */}
      <footer className="absolute bottom-6 right-8 z-20 text-gray-200 text-sm tracking-wide">
        Built by: Mantissa | X, Discord: @dotmantissa
      </footer>

    </div>
  );
}
