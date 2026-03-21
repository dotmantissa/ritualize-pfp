'use client';

import { useState, useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Type, Trash2, Search } from 'lucide-react';

// The Geometric Knot SVG Component
const RitualKnot = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 25h15v15H25zM60 25h15v15H60zM25 60h15v15H25zM60 60h15v15H60z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M40 10h20v15H40V10zm0 65h20v15H40V75zM10 40h15v20H10V40zm65 0h15v20H75V40z" fill="currentColor"/>
    <path d="M30 30h40v40H30z" stroke="currentColor" strokeWidth="10" fill="none"/>
    <path d="M45 10v80M10 45h80M55 10v80M10 55h80" stroke="currentColor" strokeWidth="10"/>
  </svg>
);

const MOCK_TEMPLATES = [
  { id: '1', url: 'https://placehold.co/800x600/18181b/22c55e?text=Distracted+Frog', name: 'Distracted Frog' },
  { id: '2', url: 'https://placehold.co/800x600/18181b/22c55e?text=Frog+Mind+Change', name: 'Frog Changing Mind' },
  { id: '3', url: 'https://placehold.co/800x600/18181b/22c55e?text=Buff+Frog', name: 'Buff Frog' },
  { id: '4', url: 'https://placehold.co/800x600/18181b/22c55e?text=Cozy+Frog', name: 'Cozy Frog' },
];

export default function MemeEditor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(MOCK_TEMPLATES[0].id);
  const [texts, setTexts] = useState([
    { id: 1, content: 'TOP TEXT', top: 10, left: 50, size: 48 }
  ]);
  const memeRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = useMemo(() => 
    MOCK_TEMPLATES.find(t => t.id === selectedTemplateId) || MOCK_TEMPLATES[0]
  , [selectedTemplateId]);

  const filteredTemplates = useMemo(() => 
    MOCK_TEMPLATES.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  , [searchQuery]);

  const addText = () => {
    setTexts([...texts, { id: Date.now(), content: 'NEW TEXT', top: 50, left: 50, size: 48 }]);
  };

  const updateText = (id: number, field: string, value: string | number) => {
    setTexts(texts.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeText = (id: number) => {
    setTexts(texts.filter(t => t.id !== id));
  };

  const exportMeme = async () => {
    if (memeRef.current) {
      try {
        const dataUrl = await toPng(memeRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `ritual-meme-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export meme', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans flex flex-col">
      
      {/* --- BACKGROUND PATTERNS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <RitualKnot className="absolute -bottom-32 -left-32 w-[600px] h-[600px] text-[#10b981] opacity-90 transform rotate-45" />
        <RitualKnot className="absolute -top-32 -right-32 w-[500px] h-[500px] text-white opacity-90 transform rotate-45" />
        <RitualKnot className="absolute bottom-10 right-20 w-[300px] h-[300px] text-white opacity-90 transform rotate-45" />
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="w-full bg-[#10b981] text-black px-6 py-3 flex items-center z-20 relative">
        <div className="flex items-center gap-3 font-bold text-xl tracking-wide">
          <RitualKnot className="w-6 h-6 text-black" />
          <span>Ritual <span className="font-normal opacity-80 mx-2">|</span> Meme Generator</span>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 relative z-10 flex flex-col p-8 md:p-12">
        
        {/* Search & Select Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl">
          <select 
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="bg-white text-black px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] cursor-pointer min-w-[200px]"
          >
            {MOCK_TEMPLATES.map(tpl => (
              <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input 
              type="text" 
              placeholder="Search Template..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border border-white/30 text-white placeholder:text-white/50 px-10 py-2 text-lg focus:outline-none focus:border-[#10b981] transition-colors"
            />
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Left: Canvas */}
          <div className="flex-1 flex justify-center w-full">
            <div 
              ref={memeRef} 
              className="relative w-full max-w-2xl bg-black border border-white/10 shadow-2xl overflow-hidden"
            >
              <img 
                src={selectedTemplate.url} 
                alt="Meme base" 
                className="w-full h-auto block pointer-events-none"
              />
              
              {/* Overlay Texts */}
              {texts.map((text) => (
                <div
                  key={text.id}
                  className="absolute text-center w-full select-none"
                  style={{ 
                    top: `${text.top}%`, 
                    left: `${text.left}%`, 
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <h1 
                    className="uppercase font-black text-white tracking-wide leading-tight"
                    style={{ 
                      fontSize: `${text.size}px`,
                      WebkitTextStroke: `${Math.max(2, text.size / 16)}px black`, 
                      textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                      paintOrder: 'stroke fill'
                    }}
                  >
                    {text.content}
                  </h1>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating Control Panel */}
          <div className="w-full lg:w-96 bg-black/60 backdrop-blur-xl border border-white/10 p-6 shadow-2xl flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#10b981]">Layers</h2>
              <button 
                onClick={addText}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10"
              >
                <Plus size={16} /> Add Text
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-6">
              {texts.map((text, index) => (
                <div key={text.id} className="p-4 bg-white/5 border border-white/10 space-y-4 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs text-white/50 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Type size={14} /> Layer {index + 1}
                    </label>
                    <button 
                      onClick={() => removeText(text.id)}
                      className="text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={text.content}
                    onChange={(e) => updateText(text.id, 'content', e.target.value)}
                    className="w-full bg-black/50 border border-white/20 p-2 text-white focus:outline-none focus:border-[#10b981] transition-all font-medium"
                    placeholder="Enter meme text..."
                  />

                  {/* Sliders */}
                  <div className="space-y-2 pt-2">
                    {[
                      { label: 'Size', field: 'size', min: 16, max: 120 },
                      { label: 'Pos Y', field: 'top', min: 0, max: 100 },
                      { label: 'Pos X', field: 'left', min: 0, max: 100 }
                    ].map(({ label, field, min, max }) => (
                      <div key={field} className="flex items-center gap-3">
                        <span className="text-xs text-white/50 w-8">{label}</span>
                        <input 
                          type="range" min={min} max={max} 
                          value={text[field as keyof typeof text]} 
                          onChange={(e) => updateText(text.id, field, Number(e.target.value))}
                          className="flex-1 accent-[#10b981] h-1 bg-white/20 appearance-none cursor-pointer" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={exportMeme}
              disabled={texts.length === 0}
              className="w-full py-4 bg-[#10b981] hover:bg-[#0ea5e9] text-black font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              GENERATE
            </button>
          </div>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="absolute bottom-6 right-8 text-white/70 text-sm font-medium z-20">
        Built by: Mantissa | X, Discord: @dotmantissa
      </footer>
    </div>
  );
}
