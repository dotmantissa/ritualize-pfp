'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Type, Trash2, Image as ImageIcon, Settings2 } from 'lucide-react';

const MOCK_TEMPLATES = [
  { id: '1', url: 'https://placehold.co/800x600/18181b/22c55e?text=Distracted+Frog', name: 'Distracted Frog' },
  { id: '2', url: 'https://placehold.co/800x600/18181b/22c55e?text=Frog+Mind+Change', name: 'Frog Changing Mind' },
  { id: '3', url: 'https://placehold.co/800x600/18181b/22c55e?text=Buff+Frog', name: 'Buff Frog' },
  { id: '4', url: 'https://placehold.co/800x600/18181b/22c55e?text=Cozy+Frog', name: 'Cozy Frog' },
];

export default function MemeEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState(MOCK_TEMPLATES[0]);
  const [texts, setTexts] = useState([
    { id: 1, content: 'TOP TEXT', top: 10, left: 50, size: 48 }
  ]);
  const memeRef = useRef<HTMLDivElement>(null);

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
        link.download = `meme-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export meme', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans selection:bg-green-500/30">
      
      {/* LEFT SIDEBAR: Templates */}
      <aside className="w-full md:w-80 border-r border-zinc-800 bg-zinc-950 flex flex-col h-screen">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="text-green-500" size={24} />
            <h1 className="text-xl font-black tracking-tight text-white">MEME<span className="text-green-500">GEN</span></h1>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Select a base template</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {MOCK_TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id} 
              onClick={() => setSelectedTemplate(tpl)}
              className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 relative ${selectedTemplate.id === tpl.id ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-zinc-800 hover:border-zinc-600'}`}
            >
              <img src={tpl.url} alt={tpl.name} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                <p className="text-sm font-semibold text-white truncate">{tpl.name}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER: Canvas Editor */}
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center bg-zinc-900 relative overflow-hidden">
        {/* Subtle grid background for the canvas area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div 
          ref={memeRef} 
          className="relative rounded-lg overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-black/50 z-10 bg-black"
          style={{ width: '100%', maxWidth: '800px' }}
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
      </main>

      {/* RIGHT SIDEBAR: Controls */}
      <aside className="w-full md:w-96 border-l border-zinc-800 bg-zinc-950 flex flex-col h-screen shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Settings2 className="text-zinc-400" size={20} />
            <h2 className="text-lg font-bold text-white">Editor</h2>
          </div>
          <button 
            onClick={addText}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors border border-zinc-700"
          >
            <Plus size={16} /> Add Text
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {texts.map((text, index) => (
            <div key={text.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4 relative group">
              
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-green-400 font-bold tracking-wider uppercase flex items-center gap-2">
                  <Type size={14} /> Layer {index + 1}
                </label>
                <button 
                  onClick={() => removeText(text.id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Text Input */}
              <input
                type="text"
                value={text.content}
                onChange={(e) => updateText(text.id, 'content', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all font-medium"
                placeholder="Enter meme text..."
              />

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-8 font-medium">Size</span>
                  <input 
                    type="range" min="16" max="120" value={text.size} 
                    onChange={(e) => updateText(text.id, 'size', Number(e.target.value))}
                    className="flex-1 accent-green-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" 
                  />
                  <span className="text-xs text-zinc-400 w-6 text-right">{text.size}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-8 font-medium">Pos Y</span>
                  <input 
                    type="range" min="0" max="100" value={text.top} 
                    onChange={(e) => updateText(text.id, 'top', Number(e.target.value))}
                    className="flex-1 accent-green-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" 
                  />
                  <span className="text-xs text-zinc-400 w-6 text-right">{text.top}%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-8 font-medium">Pos X</span>
                  <input 
                    type="range" min="0" max="100" value={text.left} 
                    onChange={(e) => updateText(text.id, 'left', Number(e.target.value))}
                    className="flex-1 accent-green-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" 
                  />
                  <span className="text-xs text-zinc-400 w-6 text-right">{text.left}%</span>
                </div>
              </div>

            </div>
          ))}

          {texts.length === 0 && (
            <div className="text-center p-8 text-zinc-500 text-sm border-2 border-dashed border-zinc-800 rounded-xl">
              No text layers. Click "Add Text" to start.
            </div>
          )}
        </div>

        {/* Export Button Pinned to Bottom */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950">
          <button 
            onClick={exportMeme}
            disabled={texts.length === 0}
            className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Download size={20} />
            GENERATE MEME
          </button>
        </div>
      </aside>

    </div>
  );
}
