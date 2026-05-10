"use client";
import { useState, useEffect } from 'react';
import { runAudit, ToolInput, AuditResult } from './lib/auditEngine';it 
export default function AuditPage() {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [email, setEmail] = useState("");
  const [currentTool, setCurrentTool] = useState<ToolInput>({ 
    name: 'Cursor', plan: 'Pro', monthlySpend: 0, seats: 1 
  });
  const [isSaved, setIsSaved] = useState(false);

  // Persistence: Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('credex_audit');
    if (saved) setTools(JSON.parse(saved));
  }, []);

  const addTool = () => {
    const updated = [...tools, currentTool];
    setTools(updated);
    localStorage.setItem('credex_audit', JSON.stringify(updated));
  };

  const results = runAudit(tools);
  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.savings, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 bg-[#0a0a0a] min-h-screen text-white font-sans">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-[#7db94a]">Credex AI Spend Audit</h1>
        <p className="text-gray-400 mt-2">Stop burning cash on mismanaged AI seats.</p>
      </header>

      {/* Input Card */}
      <section className="bg-[#161616] p-8 rounded-2xl border border-gray-800 mb-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select Tool</label>
            <select 
              className="w-full bg-black p-3 rounded-lg border border-gray-700 focus:border-[#7db94a] outline-none"
              onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
            >
              <option>Cursor</option>
              <option>ChatGPT</option>
              <option>Claude</option>
              <option>OpenAI API</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Monthly Spend ($)</label>
            <input 
              type="number" 
              className="w-full bg-black p-3 rounded-lg border border-gray-700 focus:border-[#7db94a] outline-none"
              onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}
            />
          </div>
        </div>
        <button 
          onClick={addTool} 
          className="mt-6 w-full bg-[#7db94a] text-black font-bold py-4 rounded-lg hover:bg-[#6aa33f] transition-all"
        >
          Add to Audit
        </button>
      </section>

      {/* Results Breakdown */}
      {tools.length > 0 && (
        <section className="space-y-6">
          <div className="bg-[#dcfce720] border border-[#7db94a] p-8 rounded-2xl mb-8 flex justify-between items-center">
            <div>
              <p className="text-[#7db94a] uppercase text-xs font-bold tracking-widest">Total Annual Savings</p>
              <h2 className="text-5xl font-black text-[#7db94a]">${(totalMonthlySavings * 12).toLocaleString()}</h2>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-gray-400">Optimizing {tools.length} Tools</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Per-tool breakdown</h3>
          {results.map((res, i) => (
            <div key={i} className="flex justify-between items-center p-6 bg-[#161616] rounded-xl border border-gray-800">
              <div>
                <h4 className="font-bold text-lg">{res.name}</h4>
                <p className="text-gray-400 text-sm max-w-md">{res.reason}</p>
              </div>
              <div className="text-right">
                {res.savings > 0 ? (
                  <div className="bg-[#7db94a20] text-[#7db94a] px-3 py-1 rounded-full text-sm font-bold">
                    Save ${res.savings}/mo
                  </div>
                ) : (
                  <div className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-sm">Optimal</div>
                )}
              </div>
            </div>
          ))}

          {/* Lead Capture Gate */}
          {!isSaved && (
            <div className="mt-12 p-10 bg-[#161616] border-2 border-[#7db94a] rounded-3xl text-center shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Claim these savings</h3>
              <p className="text-gray-400 mb-6">Enter your work email to get the full report and shareable link.</p>
              <div className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="flex-1 p-4 bg-black rounded-xl border border-gray-700"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={() => setIsSaved(true)}
                  className="bg-[#7db94a] text-black font-black px-8 py-4 rounded-xl"
                >
                  Save Results
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}