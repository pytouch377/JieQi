import React, { useState, useEffect } from 'react';
import SolarClock from './components/SolarClock';
import InfoPanel from './components/InfoPanel';
import { getCurrentSolarTerm } from './services/solarLogic';
import { SolarTerm } from './types';

const App: React.FC = () => {
  const [currentTerm, setCurrentTerm] = useState<SolarTerm | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<SolarTerm | null>(null);

  // Initialize current term on mount
  useEffect(() => {
    const term = getCurrentSolarTerm();
    setCurrentTerm(term);
    setSelectedTerm(term);
  }, []);

  if (!currentTerm || !selectedTerm) {
    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800"></div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-stone-800 selection:bg-stone-200">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
         <div className="absolute top-0 left-0 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
         <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
         <div className="absolute bottom-0 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center mb-8 z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-2">
            岁时 · 节气
          </h1>
          <p className="text-stone-500 font-medium tracking-widest text-xs uppercase">
            二十四节气智慧
          </p>
        </header>

        {/* The Clock Visualizer */}
        <div className="w-full mb-6 z-10">
          <SolarClock 
            currentTerm={currentTerm} 
            selectedTerm={selectedTerm} 
            onSelectTerm={setSelectedTerm} 
          />
        </div>

        {/* Info & AI Insights */}
        <div className="w-full z-10">
          <InfoPanel 
            term={selectedTerm} 
            isCurrent={selectedTerm.id === currentTerm.id} 
          />
        </div>

      </div>
    </div>
  );
};

export default App;