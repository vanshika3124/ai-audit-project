"use client";
import { useState } from 'react';
import { runAudit, ToolInput } from './lib/auditEngine';
export default function AuditPage() {
  const [tools, setTools] = useState<ToolInput[]>([]);
  const [currentTool, setCurrentTool] = useState({ name: 'Cursor', plan: 'Pro', monthlySpend: 0, seats: 1 });

  const addTool = () => {
    setTools([...tools, currentTool]);
    // Reset form for next tool
  };

  const results = runAudit(tools);

  return (
    <div className="max-w-4xl mx-auto p-10 bg-[#0a0a0a] min-h-screen text-white">
      <h2 className="text-3xl font-bold mb-8 text-[#7db94a]">AI Spend Audit</h2>
      
      {/* Input Section */}
      <div className="grid gap-4 bg-[#161616] p-6 rounded-xl border border-gray-800 mb-10">
        <select 
          className="bg-black p-3 rounded border border-gray-700"
          onChange={(e) => setCurrentTool({...currentTool, name: e.target.value})}
        >
          <option>Cursor</option>
          <option>ChatGPT</option>
          <option>GitHub Copilot</option>
        </select>
        <input 
          type="number" 
          placeholder="Monthly Spend ($)" 
          className="bg-black p-3 rounded border border-gray-700"
          onChange={(e) => setCurrentTool({...currentTool, monthlySpend: Number(e.target.value)})}
        />
        <button onClick={addTool} className="bg-[#7db94a] text-black font-bold py-3 rounded">
          Add Tool to Audit
        </button>
      </div>

      {/* Results Section - Matching your screenshot */}
      <div className="space-y-4">
        {results.map((res, i) => (
          <div key={i} className="flex justify-between items-center p-5 bg-[#1c1c1c] rounded-lg border-l-4 border-[#7db94a]">
            <div>
              <h3 className="font-bold">{res.name}</h3>
              <p className="text-sm text-gray-400">{res.reason}</p>
            </div>
            <div className="text-right">
              <span className="text-[#7db94a] font-mono font-bold">Save ${res.savings}/mo</span>
              <p className="text-xs text-gray-500">{res.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}