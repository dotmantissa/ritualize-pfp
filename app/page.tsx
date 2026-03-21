'use client';

import { useState, useRef, useMemo } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Type, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const MOCK_TEMPLATES = [
  { id: '1', url: 'https://placehold.co/800x600/18181b/22c55e?text=Distracted+Frog', name: 'Distracted Frog' },
  { id: '2', url: 'https://placehold.co/800x600/18181b/22c55e?text=Frog+Mind+Change', name: 'Frog Changing Mind' },
  { id: '3', url: 'https://placehold.co/800x600/18181b/22c55e?text=Buff+Frog', name: 'Buff Frog' },
  { id: '4', url: 'https://placehold.co/800x600/18181b/22c55e?text=Cozy+Frog', name: 'Cozy Frog' },
];

export default function App() {
  const [view, setView] = useState<'landing' | 'editor'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  const [texts, setTexts] = useState([
    { id: 1, content: 'TOP TEXT', top: 10, left: 50, size: 48 }
  ]);
  const memeRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = useMemo(() => 
    MOCK_TEMPLATES.find(t => t.id === selectedTemplateId) || MOCK_TEMPLATES[0]
  , [selectedTemplateId]);

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return MOCK_TEMPLATES.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectTemplate = (id: string) => {
    if (!id) return;
    setSelectedTemplateId(id);
    setSearchQuery(''); 
    setShowSearchResults(false);
    setView('editor');
  };

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

  // ==========================================
  // VIEW 1: THE LANDING PAGE
  // ==========================================
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden font-sans">
        
        {/* Background Patterns - Using Pre-Rotated Images */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          
          {/* Top Right White Logo */}
          <img 
            src="/logo-white.png" 
            alt="" 
            className="absolute -top-[150px] -right-[150px] w-[600px] h-[600px] object-contain opacity-90" 
          />

          {/* Bottom Left Green Logo (Moved Up) */}
          <img 
            src="/logo-green.png" 
            alt="" 
            className="absolute -bottom-[120px] -left-[150px] w-[700px] h-[700px] object-contain opacity-90" 
          />

          {/* Bottom Adjacent White Logo (Moved Up & Pushed Right) */}
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
          <div className="flex flex-col md:flex-row items-start gap-4 w-full max-w-2xl">
            
            {/* White Dropdown */}
            <select 
              value={selectedTemplateId}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="bg-white text-black px-4 py-3 min-w-[200px] focus:outline-none appearance-none cursor-pointer font-medium border border-white"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7rem top 50%', backgroundSize: '.65rem auto' }}
            >
              <option value="" disabled>Choose Template</option>
              {MOCK_TEMPLATES.map(tpl => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>

            {/* Dark Search Bar & Autocomplete Dropdown */}
            <div className="relative flex-1 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search Template..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="w-full bg-black/50 border border-[#22c55e] text-white placeholder:text-gray-400 px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
              />

              {/* Live Search Results */}
              {showSearchResults && searchQuery.trim() !== '' && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 shadow-xl max-h-64 overflow-y-auto z-50 rounded-md custom-scrollbar">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map(tpl => (
                      <li 
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className="px-4 py-3 hover:bg-zinc-800 cursor-pointer flex items-center gap-3 border-b border-zinc-800/50 last:border-0 transition-colors"
                      >
                        <img src={tpl.url} alt={tpl.name} className="w-12 h-10 object-cover rounded bg-black" />
                        <span className="font-medium text-white">{tpl.name}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-4 text-zinc-500 text-center font-medium">
                      No templates found
                    </li>
                  )}
                </ul>
              )}
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
            setSelectedTemplateId('');
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Templates</span>
        </button>
        <div className="flex items-center gap-2 text-[#22c55e] font-bold">
          <ImageIcon size={20} />
          <span>Editing: {selectedTemplate.name}</span>
        </div>
      </header>

      {/* Workspace Area */}
      <main className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-65px)] overflow-hidden">
        
        {/* Canvas Area */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-8 relative overflow-y-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div 
            ref={memeRef} 
            className="relative bg-black ring-1 ring-white/10 shadow-2xl z-10 w-full max-w-3xl"
          >
            <img 
              src={selectedTemplate.url} 
              alt="Meme base" 
              className="w-full h-auto block pointer-events-none"
              crossOrigin="anonymous"
            />
            
            {texts.map((text) => (
              <div
                key={text.id}
                className="absolute text-center w-full select-none cursor-move"
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

        {/* Control Panel */}
        <aside className="w-full lg:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl z-20">
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Text Layers</h2>
            <button 
              onClick={addText}
              className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
            >
              <Plus size={16} /> Add Text
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {texts.map((text, index) => (
              <div key={text.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-[#22c55e] font-bold uppercase flex items-center gap-2">
                    <Type size={14} /> Layer {index + 1}
                  </label>
                  <button 
                    onClick={() => removeText(text.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <input
                  type="text"
                  value={text.content}
                  onChange={(e) => updateText(text.id, 'content', e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#22c55e] transition-all"
                />

                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Size', field: 'size', min: 16, max: 120 },
                    { label: 'Pos Y', field: 'top', min: 0, max: 100 },
                    { label: 'Pos X', field: 'left', min: 0, max: 100 }
                  ].map(({ label, field, min, max }) => (
                    <div key={field} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 w-10">{label}</span>
                      <input 
                        type="range" min={min} max={max} 
                        value={text[field as keyof typeof text]} 
                        onChange={(e) => updateText(text.id, field, Number(e.target.value))}
                        className="flex-1 accent-[#22c55e] h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t border-zinc-800 bg-zinc-950">
            <button 
              onClick={exportMeme}
              disabled={texts.length === 0}
              className="w-full py-4 bg-[#22c55e] hover:bg-[#1ea550] text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Download size={20} />
              GENERATE MEME
            </button>
          </div>
        </aside>

      </main>
    </div>
  );
}
