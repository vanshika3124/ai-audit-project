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

  const toggleTool = (id: string, name: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
      if (!toolData[id]) {
        setToolData({ ...toolData, [id]: { name, monthlySpend: 0, seats: 1, useCase: 'General' } });
      }
    }
  };

  const updateData = (id: string, field: keyof ToolInput, value: any) => {
    setToolData({ ...toolData, [id]: { ...toolData[id], [field]: value } });
  };

  const totalAnnual = Object.values(toolData)
    .filter((_, i) => selectedIds.includes(Object.keys(toolData)[i]))
    .reduce((acc, curr) => acc + (curr.monthlySpend * 12), 0);

  const handleAudit = async () => {
    if (selectedIds.length === 0) return alert("Pehle tools select karo!");
    if (!email || !email.includes('@')) return alert("Valid work email zaroori hai!");
    
    setLoading(true);
    const { error } = await supabase.from('leads').insert([{ 
        email, 
        savings: totalAnnual, 
        tools: Object.values(toolData).filter((_, i) => selectedIds.includes(Object.keys(toolData)[i])) 
    }]);
    
    if (!error) setIsAudited(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6 md:p-12 font-sans selection:bg-[#7db94a] selection:text-black print:bg-white print:text-black">
      <div className="max-w-5xl mx-auto bg-[#262626] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 print:border-none print:bg-transparent">
        
        {/* BRANDING & HEADER */}
        <header className="mb-12 print:hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#7db94a] font-black italic tracking-tighter text-3xl uppercase">Credex</span>
            <span className="h-4 w-[1px] bg-white/20 mx-2"></span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Audit Engine</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Which AI tools does your team pay for?</h1>
          <p className="text-gray-400 text-sm italic mt-1">Select tools from your current stack to begin analysis</p>
        </header>

        {/* TOOL SELECTION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12 print:hidden">
          {AVAILABLE_TOOLS.map((tool) => {
            const isSelected = selectedIds.includes(tool.id);
            return (
              <button key={tool.id} onClick={() => toggleTool(tool.id, tool.name)}
                className={`text-left p-4 rounded-xl border-2 transition-all relative ${isSelected ? 'border-[#7db94a] bg-[#7db94a]/5' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}>
                <div className={`${tool.color} w-8 h-8 rounded-lg flex items-center justify-center font-bold mb-3 text-[10px]`}>{tool.icon}</div>
                <h3 className="font-bold text-sm">{tool.name}</h3>
                <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#7db94a] border-[#7db94a]' : 'border-white/20'}`}>
                  {isSelected && <span className="text-[8px] font-bold text-black">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* CONFIGURATION SECTION */}
        {selectedIds.length > 0 && (
          <div className="space-y-4 pt-10 border-t border-white/5">
            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 print:text-black">Configure Selected Tools</h2>
            <AnimatePresence>
              {selectedIds.map((id) => {
                const info = AVAILABLE_TOOLS.find(t => t.id === id);
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={id} className="bg-[#1f1f1f] p-6 rounded-2xl border border-white/5 print:bg-gray-100 print:text-black">
                    <div className="flex items-center gap-3 mb-6">
                       <div className={`${info?.color} w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]`}>{info?.icon}</div>
                       <h4 className="font-bold text-base">{info?.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Select Plan</label>
                        <select className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-white/5 outline-none focus:border-[#7db94a] print:bg-white">
                          <option>Pro Plan ($20/seat)</option>
                          <option>Team Plan ($25/seat)</option>
                          <option>Custom Enterprise</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">No. of seats</label>
                        <input type="number" value={toolData[id]?.seats || ''} onChange={(e) => updateData(id, 'seats', Number(e.target.value))} className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-white/5 outline-none print:bg-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-600 uppercase ml-1">Monthly Bill ($)</label>
                        <input type="number" placeholder="e.g. 240" onChange={(e) => updateData(id, 'monthlySpend', Number(e.target.value))} className="w-full bg-[#2b2b2b] p-3 rounded-lg text-xs font-bold border border-[#7db94a] outline-none text-[#7db94a] print:bg-white placeholder:opacity-20" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* FOOTER ACTION */}
        <div className="mt-10 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center gap-6 print:hidden">
          <input type="email" placeholder="Work email address" value={email} onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-transparent border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#7db94a]" />
          
          <button onClick={handleAudit} disabled={loading} className="bg-white text-black px-10 py-4 rounded-xl font-black text-sm uppercase tracking-tighter hover:bg-[#7db94a] transition-all">
            {loading ? "Processing..." : "Calculate Savings →"}
          </button>
        </div>

        {/* RESULTS OVERLAY */}
        {isAudited && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 bg-[#7db94a] p-12 rounded-[3rem] text-black text-center shadow-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-2 opacity-60">Total Annual Recovery Potential</p>
            <h2 className="text-8xl font-black italic tracking-tighter mb-8 leading-none">${totalAnnual.toLocaleString()}</h2>
            <div className="flex justify-center gap-3 print:hidden">
               <button onClick={() => window.open(`https://www.linkedin.com/feed/?shareActive=true&text=I saved $${totalAnnual} on AI with Credex!`, '_blank')} className="bg-black text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Share on LinkedIn</button>
               <button onClick={() => window.print()} className="bg-white text-black px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest border border-black/10 hover:scale-105 transition-all">Download PDF</button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}