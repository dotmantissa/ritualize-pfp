'use client';

import React, { useState, useRef } from 'react';

// The 5 Squads and their accent colors for the UI
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
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle User Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
      setAssignedSquad(null); // Reset squad on new upload
    }
  };

  // The "Gachapon" Generation Logic
  const generatePFP = async () => {
    if (!userImage || !canvasRef.current) return;
    setIsGenerating(true);

    // 1. Randomly assign a squad
    const randomSquadIndex = Math.floor(Math.random() * SQUADS.length);
    const selectedSquad = SQUADS[randomSquadIndex];
    setAssignedSquad(selectedSquad);

    // 2. Randomly pick one of the 5 templates for that squad
    const randomTemplateNumber = Math.floor(Math.random() * 5) + 1;
    
    // NOTE: You will need to make sure your public folder has these exact paths, e.g.,
    // /public/templates/Ritty/template_3.png
    const templatePath = `/templates/${selectedSquad.name}/template_${randomTemplateNumber}.png`;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set standard PFP size (1000x1000 is great for high-res Twitter/Discord)
    canvas.width = 1000;
    canvas.height = 1000;

    try {
      // 3. Load user image and draw it as the base layer
      const baseImg = await loadImage(userImage);
      
      // Calculate aspect ratio to center-crop the user's uploaded image to fit the 1000x1000 square
      const size = Math.min(baseImg.width, baseImg.height);
      const xOffset = (baseImg.width - size) / 2;
      const yOffset = (baseImg.height - size) / 2;
      
      ctx.drawImage(baseImg, xOffset, yOffset, size, size, 0, 0, 1000, 1000);

      // 4. Load the random transparent template and stack it on top
      const overlayImg = await loadImage(templatePath);
      ctx.drawImage(overlayImg, 0, 0, 1000, 1000);

    } catch (error) {
      console.error("Failed to load images to canvas", error);
      alert("Make sure your template transparent PNGs are in the public folder!");
    }

    setIsGenerating(false);
  };

  // Helper to load images asynchronously for the canvas
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Prevents canvas tainting
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Download the flattened canvas
  const downloadPFP = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `Ritual_PFP_${assignedSquad?.name || 'Generated'}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center py-12 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          RITUAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">PROTOCOL</span>
        </h1>
        <p className="text-gray-400 text-lg">Identity Generation Foundry</p>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col justify-center shadow-2xl">
          
          {!userImage ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-12 hover:border-emerald-500 transition-colors cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-gray-400 text-lg font-medium">Click to Upload Base Photo</span>
              <span className="text-gray-600 text-sm mt-2">JPG, PNG (Max 5MB)</span>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-medium">Image Loaded Successfully</span>
                <button 
                  onClick={() => { setUserImage(null); setAssignedSquad(null); }}
                  className="text-sm text-gray-500 hover:text-white"
                >
                  Clear
                </button>
              </div>

              <button 
                onClick={generatePFP}
                disabled={isGenerating}
                className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 uppercase tracking-widest"
              >
                {isGenerating ? 'Forging Identity...' : 'Generate PFP'}
              </button>

              {assignedSquad && (
                <div 
                  className="p-4 rounded-xl border text-center"
                  style={{ borderColor: assignedSquad.color, backgroundColor: `${assignedSquad.color}10` }}
                >
                  <p className="text-sm text-gray-400 mb-1">Squad Assigned</p>
                  <p className="text-2xl font-bold uppercase tracking-wider" style={{ color: assignedSquad.color }}>
                    {assignedSquad.name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW CANVAS */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center shadow-2xl aspect-square relative">
          
          {!userImage && (
            <div className="text-gray-600 font-medium">Awaiting Data...</div>
          )}

          {/* The Canvas is where the magic happens. 
            We make it max-w-full to scale responsively, but internally it processes at 1000x1000 
          */}
          <canvas 
            ref={canvasRef} 
            className={`w-full h-auto rounded-xl shadow-lg ${!assignedSquad ? 'hidden' : 'block'}`}
          />

          {assignedSquad && (
            <button 
              onClick={downloadPFP}
              className="absolute bottom-[-20px] bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Download Asset
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
