export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] text-white p-10">
      <h1 className="text-5xl font-bold mb-4">AI Spend Audit</h1>
      <p className="text-gray-400 mb-10">Stop overpaying for your AI stack.</p>
      
      <div className="bg-[#1e1e1e] p-8 rounded-xl border border-gray-800 max-w-2xl">
        <h2 className="text-2xl mb-4">Check your savings</h2>
        <input type="text" placeholder="Tool Name" className="w-full p-3 mb-4 bg-black rounded" />
        <button className="bg-[#7db94a] text-black font-bold py-3 px-6 rounded w-full">
          Analyze Spend
        </button>
      </div>
    </main>
  );
}