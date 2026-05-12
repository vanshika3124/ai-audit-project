"use client";
import { useState, useEffect } from 'react';
import { runAudit, ToolInput } from './lib/auditEngine';
import { supabase } from './lib/supabase';

export default function AuditPage() {
  // State Management
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [currentTool, setCurrentTool] = useState<ToolInput>({ 
    name: 'ChatGPT', 
    monthlySpend: 0, 
    seats: 1, 
    useCase: 'Coding' 
  });
  const [email, setEmail] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Math Calculations
  const results = runAudit(tools);
  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings, 0);
  const totalAnnualSavings = totalMonthlySavings * 12;

  // Add Tool to List - FIXED LOGIC
  const addToStack = () => {
    if (currentTool.monthlySpend <= 0) {
      alert("Please enter a valid monthly spend!");
      return;
    }
    // Latest state ka use karke naya tool add karo
    setTools((prev) => [...prev, { ...currentTool }]);
    
    // Inputs ko default par reset karo
    setCurrentTool({ name: 'ChatGPT', monthlySpend: 0, seats: 1, useCase: 'Coding' });
  };

  // LinkedIn Sharing
  const handleShare = () => {
    const text = `I just found $${totalAnnualSavings.toLocaleString()} in hidden savings on my AI stack using Credex! 🚀 Check yours: ${window.location.href}`;
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  // Save to Supabase
  const handleSaveLead = async () => {
    if (!email) return alert("Enter email first!");
    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert([{ 
        email, 
        savings: totalAnnualSavings, 
        tools 
      }]);
      if (error) throw error;
      
      setAiSummary(`Audit Successful! Switching to Credex credits could recover up to 40% of your operational costs for ${tools.length} tools.`);
      setIsSaved(true);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 selection:bg-[#7db94a] selection:text-black font-sans">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex justify-between items-end border-b border-white/5 pb-6">
          <div>
            <h1 className="text-6xl font-black text-[#7db94a] tracking-tighter italic">CREDEX</h1>
            <p className="text-gray-500 font-bold tracking-[0.3em] text-[10px] mt-2 uppercase">AI Spend Audit Engine</p>
          </div>
          <div className="text-right">
            <span className="bg-[#7db94a]/10 text-[#7db94a] px-4 py-1 rounded-full text-[10px] font-black tracking-widest border border-[#7db94a]/20">v2.0 LIVE</span>
          </div>
        </header>

        {/* HERO SAVINGS DISPLAY */}
        {tools.length > 0 ? (
          <div className="bg-[#f2f9eb] rounded-[3rem] p-12 mb-10 text-[#2d4a22] shadow-[0_20px_60px_rgba(125,185,74,0.1)] transform transition-all duration-500 hover:scale-[1.01]">
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-70">Annual Recovery Potential</p>
            <h2 className="text-9xl font-black tracking-tighter">
              ${totalAnnualSavings.toLocaleString()}
            </h2>
          </div>
        ) : (
          <div className="h-[250px] border-2 border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-gray-600 mb-10">
             <p className="font-black text-xl tracking-tighter uppercase mb-2">Your AI Stack is empty</p>
             <p className="text-sm font-medium opacity-50">Add tools below to analyze leakage</p>
          </div>
        )}

        {/* INPUT SECTION - 3 COL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12 bg-white/5 p-3 rounded-[2.5rem] border border-white/5">
          <select 
            className="bg-black p-6 rounded-3xl font-black text-[#7db94a] outline-none cursor-pointer hover:bg-black/80 transition-colors"
            value={currentTool.name}
            onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
          >
            <option>ChatGPT</option>
            <option>Cursor</option>
            <option>Claude</option>
            <option>Github Copilot</option>
          </select>
          
          <input 
            type="number" 
            placeholder="Monthly Cost ($)" 
            className="bg-black p-6 rounded-3xl font-black outline-none focus:ring-2 focus:ring-[#7db94a] transition-all"
            value={currentTool.monthlySpend === 0 ? '' : currentTool.monthlySpend}
            onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}
          />
          
          <button 
            onClick={addToStack}
            className="bg-[#7db94a] hover:bg-white text-black font-black p-6 rounded-3xl transition-all active:scale-95 shadow-lg shadow-[#7db94a]/20"
          >
            ADD TO STACK
          </button>
        </div>

        {/* REPORT & SHARE SECTION */}
        {isSaved && (
          <div className="bg-gradient-to-br from-[#1a1a1a] to-black p-10 rounded-[3rem] border border-[#7db94a]/30 mb-10 animate-in fade-in zoom-in duration-500">
            <h4 className="text-[#7db94a] font-black text-xs tracking-widest mb-4 uppercase opacity-80">AI Strategy Insights</h4>
            <p className="text-2xl font-bold leading-tight mb-8">"{aiSummary}"</p>
            <button 
              onClick={handleShare}
              className="w-full md:w-auto bg-white text-black font-black px-10 py-5 rounded-2xl hover:bg-[#7db94a] transition-colors flex items-center justify-center gap-2"
            >
              SHARE ON LINKEDIN 
            </button>
          </div>
        )}

        {/* TOOL BREAKDOWN LIST */}
        <div className="space-y-3 mb-24">
          <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-6 mb-4">Detailed Breakdown</h3>
          {results.map((res, i) => (
            <div key={i} className="bg-[#111] p-8 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:bg-[#151515] transition-all">
              <div>
                <h4 className="text-xl font-black mb-1 group-hover:text-[#7db94a] transition-colors">{res.name}</h4>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-tighter italic">{res.reason}</p>
              </div>
              <div className="text-right">
                <span className="text-[#7db94a] text-3xl font-black italic">Save ${res.savings}</span>
                <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">monthly</p>
              </div>
            </div>
          ))}
        </div>

        {/* LEAD CAPTURE MODAL-LIKE BOX */}
        {!isSaved && tools.length > 0 && (
          <div className="bg-white p-12 rounded-[4rem] text-black shadow-2xl transform transition-all animate-in slide-in-from-bottom-10 duration-700">
            <h3 className="text-5xl font-black tracking-tighter mb-4 leading-none uppercase">Unlock Full<br/>Report</h3>
            <p className="text-gray-500 font-bold mb-10 text-lg italic">We found $${totalAnnualSavings.toLocaleString()} in leakage. Get the plan to fix it.</p>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Work Email Address" 
                className="flex-[2] p-6 bg-gray-100 rounded-3xl font-bold text-lg border-none focus:ring-2 focus:ring-[#7db94a] outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={handleSaveLead}
                disabled={loading}
                className="flex-1 bg-black text-[#7db94a] font-black p-6 rounded-3xl text-xl hover:scale-[1.03] active:scale-95 transition-all"
              >
                {loading ? "SAVING..." : "REVEAL PLAN"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}