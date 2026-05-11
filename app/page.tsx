"use client";
import { useState, useEffect } from 'react';
import { runAudit, ToolInput, AuditResult } from './lib/auditEngine';
import { supabase } from './lib/supabase';

export default function AuditPage() {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [currentTool, setCurrentTool] = useState<ToolInput>({ name: 'ChatGPT', monthlySpend: 0, seats: 1, useCase: 'Coding' });
  const [email, setEmail] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('credex_audit_v2');
    if (saved) setTools(JSON.parse(saved));
  }, []);

  const addToStack = () => {
    if (currentTool.monthlySpend <= 0) return;
    const updated = [...tools, currentTool];
    setTools(updated);
    localStorage.setItem('credex_audit_v2', JSON.stringify(updated));
  };

  const results = runAudit(tools);
  const totalMonthly = results.reduce((acc, curr) => acc + curr.savings, 0);

  const handleSaveLead = async () => {
    setLoading(true);
    // 1. Save to Supabase
    const { error } = await supabase
      .from('leads')
      .insert([{ email, savings: totalMonthly * 12, tools: tools }]);

    if (error) {
  console.error("DB Error Details:", error.message, error.details, error.hint);
  alert("Error: " + error.message); // Ye screen par error dikha dega
}

    // 2. Fetch AI Summary
    const res = await fetch('/api/summary', {
      method: 'POST',
      body: JSON.stringify({ totalSavings: totalMonthly * 12, toolCount: tools.length }),
    });
    const data = await res.json();
    setAiSummary(data.summary);
    setLoading(false);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex justify-center py-12 px-4">
      <div className="w-full max-w-4xl">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-[#7db94a] tracking-tighter">CREDEX AI AUDIT</h1>
        </header>

        {/* HERO SECTION */}
        {tools.length > 0 && (
          <div className="bg-[#f2f9eb] rounded-[2.5rem] p-10 mb-10 text-[#2d4a22] shadow-2xl">
            <p className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Potential Savings</p>
            <h2 className="text-7xl font-black tracking-tighter">${(totalMonthly * 12).toLocaleString()}<span className="text-xl ml-2 opacity-60">/year</span></h2>
          </div>
        )}

        {/* INPUT BAR */}
        <div className="bg-[#1a1a1a] p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4">
          <select className="flex-1 bg-black p-4 rounded-2xl border border-white/10" value={currentTool.name} onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}>
            <option>ChatGPT</option><option>Cursor</option><option>OpenAI API</option>
          </select>
          <input type="number" placeholder="Spend ($)" className="flex-1 bg-black p-4 rounded-2xl border border-white/10" onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}/>
          <button onClick={addToStack} className="bg-[#7db94a] text-black font-black px-8 py-4 rounded-2xl">ADD TOOL</button>
        </div>

        {/* AI SUMMARY BOX (Shows after saving email) */}
        {isSaved && (
          <div className="mb-10 p-8 bg-[#1a1a1a] border-l-4 border-[#7db94a] rounded-2xl animate-in fade-in duration-700">
            <h4 className="text-[#7db94a] font-black text-xs uppercase mb-2">AI Executive Summary</h4>
            <p className="text-gray-300 italic leading-relaxed">"{aiSummary}"</p>
            <button 
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="mt-6 text-sm font-bold text-[#7db94a] flex items-center gap-2 hover:underline"
            >
              🔗 COPY UNIQUE AUDIT LINK
            </button>
          </div>
        )}

        {/* RESULTS BREAKDOWN */}
        <div className="space-y-4 mb-20">
          <h3 className="text-xl font-bold mb-4">Breakdown</h3>
          {results.map((res, i) => (
            <div key={i} className="bg-[#161616] p-6 rounded-2xl border border-white/5 flex justify-between items-center">
              <div><h4 className="font-bold">{res.name}</h4><p className="text-gray-500 text-sm">{res.reason}</p></div>
              <div className="text-[#7db94a] font-black">Save ${res.savings}/mo</div>
            </div>
          ))}
        </div>

        {/* LEAD CAPTURE MODAL */}
        {!isSaved && tools.length > 0 && (
          <div className="p-12 bg-white rounded-[3rem] text-black text-center shadow-2xl">
            <h3 className="text-3xl font-black mb-4">LOCK IN THESE SAVINGS</h3>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
              <input type="email" placeholder="name@company.com" className="flex-1 p-5 bg-gray-100 rounded-2xl border-none font-bold" onChange={(e) => setEmail(e.target.value)}/>
              <button onClick={handleSaveLead} disabled={loading} className="bg-black text-[#7db94a] font-black px-10 py-5 rounded-2xl">
                {loading ? "SAVING..." : "GET AUDIT"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}