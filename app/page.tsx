'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Plus, Type } from 'lucide-react';

// Placeholder for your AI-generated templates
const MOCK_TEMPLATES = [
  { id: '1', url: 'https://placehold.co/600x400/1a1a1a/2dce89?text=Template+1', name: 'Distracted Frog' },
  { id: '2', url: 'https://placehold.co/600x400/1a1a1a/2dce89?text=Template+2', name: 'Frog Changing Mind' },
];

export default function MemeEditor() {
  const [selectedTemplate, setSelectedTemplate] = useState(MOCK_TEMPLATES[0]);
  const [texts, setTexts] = useState([{ id: 1, content: 'TOP TEXT', top: 10, left: 50 }]);
  const memeRef = useRef<HTMLDivElement>(null);

  const addText = () => {
    setTexts([...texts, { id: Date.now(), content: 'NEW TEXT', top: 50, left: 50 }]);
  };

  const updateText = (id: number, content: string) => {
    setTexts(texts.map(t => t.id === id ? { ...t, content } : t));
  };

  const exportMeme = async () => {
    if (memeRef.current) {
      try {
        const dataUrl = await toPng(memeRef.current, { cacheBust: true });
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDEBAR: Templates */}
      <aside className="w-full md:w-64 border-r border-gray-800 bg-gray-900 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-green-400">Templates</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {MOCK_TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id} 
              onClick={() => setSelectedTemplate(tpl)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate.id === tpl.id ? 'border-green-500' : 'border-transparent hover:border-gray-600'}`}
            >
              <img src={tpl.url} alt={tpl.name} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </aside>

      {/* CENTER: Canvas Editor */}
      <main className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-950">
        <div 
          ref={memeRef} 
          className="relative bg-gray-800 rounded-lg overflow-hidden shadow-2xl"
          style={{ maxWidth: '100%', display: 'inline-block' }}
        >
          <img 
            src={selectedTemplate.url} 
            alt="Meme base" 
            className="w-full h-auto max-h-[70vh] object-contain block pointer-events-none"
          />
          
          {/* Overlay Texts */}
          {texts.map((text) => (
            <div
              key={text.id}
              className="absolute cursor-move text-center w-full"
              style={{ 
                top: `${text.top}%`, 
                left: '50%', 
                transform: 'translateX(-50%)' 
              }}
            >
              <h1 
                className="uppercase font-black text-white text-4xl tracking-wide"
                style={{ 
                  WebkitTextStroke: '2px black', 
                  textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000' 
                }}
              >
                {text.content}
              </h1>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT SIDEBAR: Controls */}
      <aside className="w-full md:w-80 border-l border-gray-800 bg-gray-900 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-400">Editor</h2>
          <button 
            onClick={addText}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {texts.map((text, index) => (
            <div key={text.id} className="space-y-2">
              <label className="text-xs text-gray-400 font-semibold flex items-center gap-2">
                <Type size={14} /> Text Layer {index + 1}
              </label>
              <input
                type="text"
                value={text.content}
                onChange={(e) => updateText(text.id, e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Type here..."
              />
            </div>
          ))}
        </div>

        <button 
          onClick={exportMeme}
          className="w-full py-4 bg-green-500 hover:bg-green-600 text-gray-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
        >
          <Download size={20} />
          Export Meme
        </button>
      </aside>

    </div>
  );
}
