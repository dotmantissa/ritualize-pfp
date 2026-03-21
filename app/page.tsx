'use client';

import { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Image as ImageIcon, Dices, UploadCloud } from 'lucide-react';

const SQUADS = [
  { name: 'Normie', color: '#ACA9A9', level: 'LEV. 1' },
  { name: 'Bitty', color: '#3498DB', level: 'LEV. 2' },
  { name: 'Ritty', color: '#9884D5', level: 'LEV. 3' },
  { name: 'Ritualist', color: '#5AFD8E', level: 'LEV. 4' },
  { name: 'Ascendant Ritualist', color: '#DE9A51', level: 'LEV. 5' }
];

export default function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [assignedSquad, setAssignedSquad] = useState<typeof SQUADS[0] | null>(null);
  const [templateNum, setTemplateNum] = useState<number>(1);
  const pfpRef = useRef<HTMLDivElement>(null);

  // Roll the Gachapon logic
  const randomizeIdentity = () => {
    const randomSquadIndex = Math.floor(Math.random() * SQUADS.length);
    const randomTemplateNumber = Math.floor(Math.random() * 5) + 1;
    setAssignedSquad(SQUADS[randomSquadIndex]);
    setTemplateNum(randomTemplateNumber);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserImage(imageUrl);
      randomizeIdentity(); // Assign initial random squad upon upload
      setView('editor');
    }
  };

  const exportPFP = async () => {
    if (pfpRef.current) {
      try {
        const dataUrl = await toPng(pfpRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `ritual-pfp-${assignedSquad?.name.replace(' ', '-')}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export PFP', err);
      }
    }
  };

  // ==========================================
  // VIEW 1: THE LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden font-sans">
        
        {/* Background Patterns - Using Pre-Rotated Images */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <img 
            src="/logo-white.png" 
            alt="" 
            className="absolute -top-[150px] -right-[150px] w-[600px] h-[600px] object-contain opacity-90" 
          />
          <img 
            src="/logo-green.png" 
            alt="" 
            className="absolute -bottom-[120px] -left-[150px] w-[700px] h-[700px] object-contain opacity-90" 
          />
          <img 
            src="/logo-white.png" 
            alt="" 
            className="absolute -bottom-[170px] left-[420px] w-[500px] h-[500px] object-contain opacity-90" 
          />
        </div>

        {/* Top Green Bar */}
        <header className="w-full bg-[#22c55e] px-6 py-3 flex items-center z-20 relative">
          <div className="flex items-center gap-2 text-xl tracking-tight">
            <img src="/logo-black.png" alt="Ritual" className="w-6 h-6 object-contain" />
            <span className="font-bold text-black">Ritual</span>
            <span className="text-white mx-1">|</span>
            <span className="text-white">PFP Generator</span>
          </div>
        </header>

        {/* Center Controls */}
        <main className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4">
          <div className="flex flex-col w-full max-w-2xl">
            
            {/* Upload Area styled to match the old Search Bar aesthetic */}
            <div className="relative w-full group cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full bg-black/50 border border-[#22c55e] text-white px-4 py-6 flex flex-col items-center justify-center gap-3 transition-all group-hover:bg-black/80 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <UploadCloud size={32} className="text-[#22c55e]" />
                <span className="font-medium text-lg tracking-wide uppercase">Upload Photo to Initialize</span>
                <span className="text-sm text-gray-500">JPG, PNG supported</span>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="absolute bottom-6 right-8 text-white text-sm z-20 font-medium">
          Built by: Mantissa &nbsp;|&nbsp; X, Discord: @dotmantissa
        </footer>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE EDITOR WORKSPACE
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col font-sans">
      
      {/* Editor Header */}
      <header className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex justify-between items-center z-20">
        <button 
          onClick={() => {
            setView('landing');
            setUserImage(null);
            setAssignedSquad(null);
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Upload</span>
        </button>
        <div className="flex items-center gap-2 text-[#22c55e] font-bold">
          <ImageIcon size={20} />
          <span>Identity Forged</span>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden">
        
        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8 relative overflow-y-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          {/* PFP Stacking Container */}
          <div 
            ref={pfpRef} 
            className="relative bg-black ring-1 ring-white/10 shadow-2xl z-10 w-full max-w-xl aspect-square overflow-hidden rounded-md"
          >
            {/* Layer 1: User Image (Center Cropped via object-cover) */}
            {userImage && (
              <img 
                src={userImage} 
                alt="Base Photo" 
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            
            {/* Layer 2: Transparent PFP Overlay */}
            {assignedSquad && (
              <img 
                src={`/templates/${assignedSquad.name}/template_${templateNum}.png`} 
                alt="PFP Template" 
                className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
                crossOrigin="anonymous"
                onError={(e) => {
                  // Fallback visual if image isn't in public folder yet
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>
        </div>

        {/* Control Panel */}
        <aside className="w-full lg:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl z-20">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Protocol Data</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-center">
            
            {/* Squad Status Display */}
            {assignedSquad && (
              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4 text-center">
                <p className="text-sm text-zinc-500 font-bold tracking-widest uppercase">Assigned Squad</p>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black uppercase tracking-tight" style={{ color: assignedSquad.color }}>
                    {assignedSquad.name}
                  </h3>
                  <p className="text-lg font-bold text-white">{assignedSquad.level}</p>
                </div>
                <div className="w-full h-1 mt-4 rounded-full" style={{ backgroundColor: assignedSquad.color, opacity: 0.5 }}></div>
              </div>
            )}

            {/* Reroll Button */}
            <button 
              onClick={randomizeIdentity}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-zinc-700"
            >
              <Dices size={20} />
              REROLL IDENTITY
            </button>
            <p className="text-xs text-center text-zinc-500">
              Templates are randomly pulled from the protocol database.
            </p>
          </div>

          {/* Export Panel */}
          <div className="p-6 border-t border-zinc-800 bg-zinc-950">
            <button 
              onClick={exportPFP}
              className="w-full py-4 bg-[#22c55e] hover:bg-[#1ea550] text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Download size={20} />
              DOWNLOAD PFP
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}
