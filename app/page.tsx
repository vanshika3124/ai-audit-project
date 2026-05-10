"use client";
import { useState, useEffect } from 'react';
import { runAudit, ToolInput, AuditResult } from './lib/auditEngine';

export default function AuditPage() {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [email, setEmail] = useState("");
  const [currentTool, setCurrentTool] = useState<ToolInput>({ 
    name: 'ChatGPT', plan: 'Team', monthlySpend: 0, seats: 1 
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('credex_audit');
    if (saved) {
      try { setTools(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const addTool = () => {
    if (currentTool.monthlySpend <= 0) return alert("Please enter spend");
    const updated = [...tools, currentTool];
    setTools(updated);
    localStorage.setItem('credex_audit', JSON.stringify(updated));
  };

  const results = runAudit(tools);
  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-[#0a0a0a] min-h-screen text-white font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter text-[#7db94a] mb-2">
          CREDEX AI AUDIT
        </h1>
        <p className="text-gray-400 text-lg">Stop overpaying for your AI infrastructure.</p>
      </header>

      {/* INPUT SECTION */}
      <section className="bg-[#161616] p-8 rounded-3xl border border-gray-800 mb-12 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Tool</label>
            <select 
              className="w-full bg-black p-4 rounded-xl border border-gray-800 focus:border-[#7db94a] outline-none"
              onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
            >
              <option>ChatGPT</option>
              <option>Cursor</option>
              <option>OpenAI API</option>
              <option>Claude</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Monthly Spend ($)</label>
            <input 
              type="number" 
              placeholder="e.g. 500"
              className="w-full bg-black p-4 rounded-xl border border-gray-800 focus:border-[#7db94a] outline-none"
              onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-500">Seats</label>
            <input 
              type="number" 
              placeholder="e.g. 10"
              className="w-full bg-black p-4 rounded-xl border border-gray-800 focus:border-[#7db94a] outline-none"
              onChange={(e) => setCurrentTool({...currentTool, seats: Number(e.target.value)})}
            />
          </div>
        </div>
        <button 
          onClick={addTool} 
          className="mt-8 w-full bg-[#7db94a] text-black font-black py-5 rounded-2xl hover:scale-[1.02] transition-transform text-lg"
        >
          ADD TO AUDIT
        </button>
      </section>

      {/* RESULTS SECTION */}
      {tools.length > 0 && (
        <div className="animate-in fade-in duration-700">
          <div className="bg-[#dcfce710] border-2 border-[#7db94a] p-10 rounded-[2rem] mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-[#7db94a] uppercase text-sm font-black tracking-widest mb-1">Total Annual Savings</p>
              <h2 className="text-7xl font-black text-[#7db94a] tracking-tighter">
                ${(totalMonthlySavings * 12).toLocaleString()}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{tools.length} Tools Audited</p>
              <p className="text-gray-500 italic">"You're burning cash!"</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">Per-tool breakdown</h3>
            {results.map((res: AuditResult, i: number) => (
              <div key={i} className="flex justify-between items-center p-8 bg-[#161616] rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
                <div>
                  <h4 className="font-black text-xl mb-1">{res.name}</h4>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">{res.reason}</p>
                </div>
                <div className="text-right">
                  {res.savings > 0 ? (
                    <div className="text-[#7db94a]">
                      <p className="text-2xl font-black">Save ${res.savings.toLocaleString()}</p>
                      <p className="text-xs uppercase font-bold text-gray-500">per month</p>
                    </div>
                  ) : (
                    <div className="text-gray-500 font-bold uppercase tracking-widest text-sm">Optimal</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* LEAD CAPTURE */}
          {!isSaved && (
            <div className="mt-20 p-12 bg-white rounded-[2.5rem] text-black text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-4xl font-black tracking-tighter mb-4">CLAIM YOUR SAVINGS</h3>
                <p className="text-gray-600 mb-8 font-medium max-w-md mx-auto">
                  Enter your email to receive the PDF report and unlock Credex discounted credits.
                </p>
                <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="flex-1 p-5 bg-gray-100 rounded-2xl border-none focus:ring-2 focus:ring-[#7db94a] outline-none text-black font-bold"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    onClick={() => { setIsSaved(true); alert("Lead Saved! (Check Console)"); console.log("Lead:", email, tools); }}
                    className="bg-black text-[#7db94a] font-black px-10 py-5 rounded-2xl hover:invert transition-all"
                  >
                    GET REPORT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}