import React, { useEffect, useState } from 'react';
import { GeminiInsightData, SolarTerm } from '../types';
import { generateTermInsight } from '../services/geminiService';

interface InfoPanelProps {
  term: SolarTerm;
  isCurrent: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ term, isCurrent }) => {
  const [insight, setInsight] = useState<GeminiInsightData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchInsight = async () => {
      setLoading(true);
      // Reset insight slightly to trigger visual refresh
      setInsight(null);
      
      try {
        const data = await generateTermInsight(term);
        if (isMounted) {
          setInsight(data);
        }
      } catch (err) {
        console.error("Failed to fetch insight", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInsight();

    return () => {
      isMounted = false;
    };
  }, [term]);

  // Format date to "X月X日"
  const dateStr = term.approxDate.replace(/([A-Za-z]+)\s(\d+)/, (match, m, d) => {
    const monthMap: Record<string, string> = {'Jan':'1','Feb':'2','Mar':'3','Apr':'4','May':'5','Jun':'6','Jul':'7','Aug':'8','Sep':'9','Oct':'10','Nov':'11','Dec':'12'};
    return `${monthMap[m]}月${d}日`;
  });

  return (
    <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-stone-200 transition-all duration-500">
      <div className="flex items-start justify-between mb-4 border-b border-stone-100 pb-4">
        <div>
          <h2 className="text-3xl font-serif text-stone-800">{term.name}</h2>
          <p className="text-sm text-stone-500 font-medium tracking-wide mt-1">{term.translation}</p>
        </div>
        <div className="flex flex-col items-end">
            {isCurrent && (
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-50 mb-1">
                    当前节气
                </span>
            )}
            <span className={`text-lg font-serif ${isCurrent ? 'text-stone-800 font-bold' : 'text-stone-500'}`}>
                公历 {dateStr}
            </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Description */}
        <p className="text-stone-600 italic">
          "{term.description}"
        </p>

        {/* AI Content Area */}
        <div className="min-h-[200px]">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                    <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin"></div>
                    <span className="text-xs text-stone-400 animate-pulse">正在寻访古籍智慧...</span>
                </div>
            ) : insight ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* Poem */}
                    <div className="bg-stone-50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: term.color }}>
                        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">诗意时节</h3>
                        <p className="font-serif text-stone-800 whitespace-pre-line leading-relaxed text-lg">
                            {insight.poem}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Advice */}
                        <div className="bg-stone-50 p-4 rounded-lg">
                             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                养生之道
                             </h3>
                             <p className="text-sm text-stone-700 leading-relaxed">
                                {insight.advice}
                             </p>
                        </div>

                        {/* Food */}
                        <div className="bg-stone-50 p-4 rounded-lg">
                             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                时令美食
                             </h3>
                             <p className="text-sm text-stone-700 leading-relaxed">
                                {insight.food}
                             </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-stone-400 py-10">无法加载数据。</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;