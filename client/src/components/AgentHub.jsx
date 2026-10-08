import React, { useState } from 'react';
import API from '../api/axios';
import { Cpu, Send, Terminal, Sparkles, CheckCircle2, ShieldAlert, Activity } from 'lucide-react';

export default function AgentHub() {
  const [prompt, setPrompt] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, type: 'system', text: 'AI Agent Orchestrator initialized. Ready for tool execution requests.', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState(false);

  const handleRunAgent = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userPrompt = prompt;
    setPrompt('');
    
    // Append user prompt to log console
    setLogs((prev) => [
      ...prev,
      { id: Date.now(), type: 'user', text: userPrompt, timestamp: new Date().toLocaleTimeString() }
    ]);

    setLoading(true);

    try {
      // Calling our backend AI orchestrator endpoint
      const res = await API.post('/ai/agent/execute', { prompt: userPrompt });
      
      setLogs((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          type: 'success', 
          text: res.data.message || 'Agent executed action successfully.', 
          data: res.data.data,
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        { 
          id: Date.now() + 1, 
          type: 'error', 
          text: err.response?.data?.message || 'Agent execution failed to resolve tool call.', 
          timestamp: new Date().toLocaleTimeString() 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu size={14} />
            <span>Autonomous Intelligence Module</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">AI Agent Hub</h2>
          <p className="text-sm text-slate-400">Orchestrate autonomous multi-tenant tasks using natural language command execution.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 rounded-xl text-indigo-400 text-xs font-semibold shadow-sm">
          <Sparkles size={15} />
          <span>LLM Tool-Calling Active</span>
        </div>
      </div>

      {/* Terminal Console Container */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
        {/* Terminal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
            <Terminal size={15} className="text-indigo-400" />
            <span className="font-semibold tracking-wide">omnicore-agent-orchestrator://cluster-node-01</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>

        {/* Log Output Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-xs">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className={`p-4 rounded-xl border transition-all ${
                log.type === 'user' 
                  ? 'bg-slate-800/40 border-slate-700/80 text-slate-200 ml-12' 
                  : log.type === 'success'
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300 mr-12 shadow-sm'
                  : log.type === 'error'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300 mr-12 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] opacity-75 mb-1.5">
                <span className="uppercase font-bold tracking-wider flex items-center gap-1.5">
                  {log.type === 'success' && <CheckCircle2 size={13} className="text-emerald-400" />}
                  {log.type === 'error' && <ShieldAlert size={13} className="text-rose-400" />}
                  {log.type}
                </span>
                <span className="text-slate-500 font-mono">{log.timestamp}</span>
              </div>
              <div className="leading-relaxed">{log.text}</div>
              {log.data && (
                <pre className="mt-3 p-3 bg-slate-950/90 border border-slate-800/80 rounded-lg text-[11px] text-slate-300 overflow-x-auto font-mono">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {loading && (
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 text-indigo-300 rounded-xl animate-pulse flex items-center gap-3">
              <Cpu size={16} className="animate-spin text-indigo-400" />
              <span className="font-mono text-xs">Agent processing context and evaluating tool registry...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Form Bar */}
        <form onSubmit={handleRunAgent} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3.5">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Create a high priority task to review Q3 inventory levels'..."
            className="flex-1 bg-[#111827] border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
          >
            <Send size={16} />
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}