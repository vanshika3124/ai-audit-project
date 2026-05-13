"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { runAudit, ToolInput } from './lib/auditEngine';
import { supabase } from './lib/supabase';

const AVAILABLE_TOOLS = [
  { id: 'cursor', name: 'Cursor', desc: 'Code editor', color: 'bg-black', icon: 'C' },
  { id: 'chatgpt', name: 'ChatGPT', desc: 'Writing / research', color: 'bg-[#10a37f]', icon: 'GP' },
  { id: 'claude', name: 'Claude', desc: 'Writing / coding', color: 'bg-[#d97757]', icon: 'AN' },
  { id: 'copilot', name: 'Copilot', desc: 'Code editor', color: 'bg-[#24292e]', icon: 'GH' },
  { id: 'gemini', name: 'Gemini', desc: 'General AI', color: 'bg-[#4285f4]', icon: 'GM' },
  { id: 'windsurf', name: 'Windsurf', desc: 'Code editor', color: 'bg-[#5b21b6]', icon: 'WS' },
];

export default function AuditPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toolData, setToolData] = useState<Record<string, ToolInput>>({});
  const [email, setEmail] = useState("");
  const [isAudited, setIsAudited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const toggleTool = (id: string, name: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
      if (!toolData[id]) {
        // Initializing with 1 seat and 0 monthly spend
        setToolData({ ...toolData, [id]: { name, monthlySpend: 0, seats: 1, useCase: 'General' } });
      }
    }
  };

  const updateData = (id: string, field: keyof ToolInput, value: any) => {
    setToolData({ ...toolData, [id]: { ...toolData[id], [field]: value } });
  };

  // FIXED CALCULATION: (Seats * Cost per Seat) * 12 months
  const totalAnnual = Object.entries(toolData)
    .filter(([id]) => selectedIds.includes(id))
    .reduce((acc, [_, data]) => {
      const seatCount = data.seats || 0;
      const costPerSeat = data.monthlySpend || 0;
      return acc + (seatCount * costPerSeat * 12);
    }, 0);

  const handleAudit = async () => {
    if (selectedIds.length === 0) return alert("Please select at least one tool.");
    if (!email || !email.includes('@')) {
      setShowError(true);
      return;
    }
    
    setLoading(true);
    const selectedToolsArray = Object.entries(toolData)
      .filter(([id]) => selectedIds.includes(id))
      .map(([_, data]) => data);

    const { error } = await supabase.from('leads').insert([{ 
        email, 
        savings: totalAnnual, 
        tools: selectedToolsArray
    }]);
    
    if (!error) setIsAudited(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-4 sm:p-6 md:p-12 font-sans selection:bg-[#7db94a] selection:text-black print:bg-white print:text-black">
      
      {/* ERROR MODAL */}
      <AnimatePresence>
        {showError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#262626] border border-red-500/30 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
              <h3 className="text-xl font-bold mb-2 text-white">Email Required</h3>
              <p className="text-gray-400 text-sm mb-6">Please enter a valid work email address to generate your audit report.</p>
              <button onClick={() => setShowError(false)} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest text-xs">Got it</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto bg-[#262626] rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/5 print:border-none print:bg-transparent">
        
        {/* BRANDING & HEADER */}
        <header className="mb-8 md:mb-12 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#7db94a] font-black italic tracking-tighter text-2xl sm:text-3xl uppercase">Credex</span>
            <span className="h-4 w-[1px] bg-white/20 mx-2"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Audit Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">Which AI tools does your team pay for?</h1>
          <p className="text-gray-400 text-xs sm:text-sm italic mt-1 font-medium">Identify capital leakage based on seats and plans</p>
        </header>

        {/* TOOL SELECTION GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10 print:hidden">
          {AVAILABLE_TOOLS.map((tool) => {
            const isSelected = selectedIds.includes(tool.id);
            return (
              <button key={tool.id} onClick={() => toggleTool(tool.id, tool.name)}
                className={`text-left p-4 rounded-xl border-2 transition-all relative ${isSelected ? 'border-[#7db94a] bg-[#7db94a]/5' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                <div className={`${tool.color} w-8 h-8 rounded-lg flex items-center justify-center font-bold mb-3 text-[10px]`}>{tool.icon}</div>
                <h3 className="font-bold text-xs sm:text-sm truncate">{tool.name}</h3>
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#7db94a] border-[#7db94a]' : 'border-white/20'}`}>
                  {isSelected && <span className="text-[8px] font-bold text-black">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* CONFIGURATION SECTION */}
        {selectedIds.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-white/5">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 print:text-black">Configure Stack Detail</h2>
            <AnimatePresence>
              {selectedIds.map((id) => {
                const info = AVAILABLE_TOOLS.find(t => t.id === id);
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={id} className="bg-[#1f1f1f] p-5 sm:p-6 rounded-2xl border border-white/5 print:bg-gray-100 print:text-black">
                    <div className="flex items-center gap-3 mb-6">
                       <div className={`${info?.color} w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]`}>{info?.icon}</div>
                       <h4 className="font-bold text-sm sm:text-base">{info?.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Plan</label>
                        <select className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-white/5 outline-none focus:border-[#7db94a] print:bg-white">
                          <option>Pro Plan</option>
                          <option>Team Plan</option>
                          <option>Enterprise</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">No. of seats</label>
                        <input type="number" value={toolData[id]?.seats} onChange={(e) => updateData(id, 'seats', Number(e.target.value))} className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-white/5 outline-none print:bg-white" placeholder="1" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Cost / Seat ($)</label>
                        <input type="number" placeholder="20" onChange={(e) => updateData(id, 'monthlySpend', Number(e.target.value))} className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-[#7db94a] outline-none text-[#7db94a] print:bg-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* FOOTER ACTION */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-4 print:hidden">
          <input type="email" placeholder="Enter work email to calculate" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 bg-transparent border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#7db94a] transition-colors placeholder:text-gray-600" />
          
          <button onClick={handleAudit} disabled={loading} className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#7db94a] transition-all active:scale-95">
            {loading ? "Calculating..." : "Calculate Savings"}
          </button>
        </div>

        {/* RESULTS SECTION */}
        {isAudited && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-[#7db94a] p-8 sm:p-12 rounded-[2.5rem] text-black text-center shadow-2xl">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Calculated Annual Savings</p>
            <h2 className="text-5xl sm:text-7xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none">${totalAnnual.toLocaleString()}</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3 print:hidden">
               <button onClick={() => window.open(`https://www.linkedin.com/feed/?shareActive=true&text=I saved $${totalAnnual} with Credex!`, '_blank')} className="bg-black text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Share Report</button>
               <button onClick={() => window.print()} className="bg-white text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border border-black/10 hover:scale-105 transition-all">Print PDF</button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}