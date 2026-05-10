"use client";
import { useState, useEffect } from 'react';
import { runAudit, ToolInput, AuditResult } from './lib/auditEngine';

export default function AuditPage() {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [currentTool, setCurrentTool] = useState<ToolInput>({ 
    name: 'ChatGPT', monthlySpend: 0, seats: 1, useCase: 'Coding' 
  });
  const [email, setEmail] = useState("");

  // Load from localstorage
  useEffect(() => {
    const saved = localStorage.getItem('credex_audit_v2');
    if (saved) setTools(JSON.parse(saved));
  }, []);

  const addToStack = () => {
    if (currentTool.monthlySpend <= 0) return;
    const updated = [...tools, currentTool];
    setTools(updated);
    localStorage.setItem('credex_audit_v2', JSON.stringify(updated));
    setCurrentTool({ ...currentTool, monthlySpend: 0 }); // Reset for next tool
  };

  const results = runAudit(tools);
  const totalMonthly = results.reduce((acc, curr) => acc + curr.savings, 0);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex justify-center py-12 px-4 md:px-0">
      <div className="w-full max-w-4xl">
        
        {/* 1. HEADER */}
        <header className="mb-12 px-2">
          <h1 className="text-4xl font-black tracking-tighter text-[#7db94a]">
            CREDEX AI AUDIT
          </h1>
          <p className="text-gray-400 font-medium">Identify overspend in your AI infrastructure stack.</p>
        </header>

        {/* 2. DYNAMIC SAVINGS HERO (Only shows if tools added) */}
        {tools.length > 0 && (
          <div className="bg-[#f2f9eb] rounded-[2.5rem] p-10 mb-10 text-[#2d4a22] shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-60">Calculated Savings</p>
            <div className="flex flex-col md:flex-row md:items-baseline gap-4">
              <h2 className="text-7xl md:text-8xl font-black tracking-tighter leading-none">
                ${totalMonthly.toLocaleString()}
              </h2>
              <span className="text-4xl opacity-30 hidden md:block">→</span>
              <div className="flex flex-col">
                <h3 className="text-4xl font-bold tracking-tight">${(totalMonthly * 12).toLocaleString()}</h3>
                <p className="text-xs font-black uppercase opacity-60">Saved Per Year</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. INPUT BUILDER BAR */}
        <div className="bg-[#1a1a1a] p-4 rounded-[2rem] border border-white/5 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <select 
              className="flex-1 bg-black p-4 rounded-2xl border border-white/10 outline-none focus:border-[#7db94a] text-sm font-bold"
              value={currentTool.name}
              onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
            >
              <option value="ChatGPT">ChatGPT</option>
              <option value="Cursor">Cursor</option>
              <option value="Claude">Claude</option>
              <option value="OpenAI API">OpenAI API</option>
            </select>
            
            <input 
              type="number" 
              placeholder="Spend ($)" 
              className="flex-1 bg-black p-4 rounded-2xl border border-white/10 outline-none focus:border-[#7db94a] text-sm font-bold"
              value={currentTool.monthlySpend || ''}
              onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}
            />

            <input 
              type="number" 
              placeholder="Seats" 
              className="w-full md:w-24 bg-black p-4 rounded-2xl border border-white/10 outline-none focus:border-[#7db94a] text-sm font-bold text-center"
              value={currentTool.seats || ''}
              onChange={(e) => setCurrentTool({...currentTool, seats: Number(e.target.value)})}
            />

            <button 
              onClick={addToStack} 
              className="w-full md:w-auto bg-[#7db94a] text-black font-black px-8 py-4 rounded-2xl hover:scale-[0.98] transition-all text-sm uppercase"
            >
              Add Tool
            </button>
          </div>
        </div>

        {/* 4. RESULTS BREAKDOWN */}
        <div className="px-2">
          <h3 className="text-xl font-bold mb-6">Per-tool breakdown</h3>
          {tools.length === 0 ? (
            <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-16 text-center text-white/20 font-bold uppercase tracking-widest">
              Add your first tool to start
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((res: AuditResult, i: number) => (
                <div key={i} className="bg-[#161616] p-8 rounded-[2rem] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[#7db94a]/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center font-black text-[#7db94a] border border-white/10 group-hover:scale-110 transition-transform">
                      {res.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{res.name}</h4>
                      <p className="text-gray-500 text-sm max-w-xs">{res.reason}</p>
                    </div>
                  </div>
                  <div className="w-full md:w-auto text-right">
                    {res.savings > 0 ? (
                      <span className="bg-[#7db94a] text-black px-4 py-2 rounded-full text-xs font-black uppercase inline-block">
                        Save ${res.savings.toLocaleString()}/mo
                      </span>
                    ) : (
                      <span className="text-gray-600 font-bold uppercase text-xs tracking-widest">Optimal Stack</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. LEAD CAPTURE (Bottom) */}
        {tools.length > 0 && (
          <div className="mt-20 p-12 bg-white rounded-[3rem] text-black text-center shadow-2xl animate-in fade-in duration-1000">
            <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase leading-none">Export Audit</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium leading-tight">
              Enter your email to receive a shareable PDF and unlock discounted enterprise credits.
            </p>
            <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="name@company.com" 
                className="flex-1 p-5 bg-gray-100 rounded-2xl border-none outline-none font-bold text-black focus:ring-2 focus:ring-[#7db94a]"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                className="bg-black text-[#7db94a] font-black px-10 py-5 rounded-2xl hover:bg-gray-900 transition-all text-sm uppercase"
                onClick={() => alert(`Sending report to ${email}`)}
              >
                Get PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}