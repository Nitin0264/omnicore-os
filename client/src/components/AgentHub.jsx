import React, { useState } from 'react';
import API from '../api/axios';
import { Cpu, Send, Terminal, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Agent Hub</h3>
          <p className="text-xs text-slate-400">Orchestrate autonomous multi-tenant tasks using natural language command execution.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg text-indigo-400 text-xs font-medium">
          <Sparkles size={14} />
          <span>LLM Tool-Calling Active</span>
        </div>
      </div>

      {/* Terminal Console View */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[450px]">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Terminal size={14} className="text-indigo-400" />
            <span>omnicore-agent-orchestrator://cluster-node-01</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Log Output Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className={`p-3 rounded-lg border ${
              log.type === 'user' 
                ? 'bg-slate-800/50 border-slate-700 text-slate-200 ml-8' 
                : log.type === 'success'
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300 mr-8'
                : log.type === 'error'
                ? 'bg-rose-950/20 border-rose-500/20 text-rose-300 mr-8'
                : 'bg-slate-950 border-slate-800/60 text-slate-400'
            }`}>
              <div className="flex items-center justify-between text-[10px] opacity-70 mb-1">
                <span className="uppercase font-bold tracking-wider">{log.type}</span>
                <span>{log.timestamp}</span>
              </div>
              <div>{log.text}</div>
              {log.data && (
                <pre className="mt-2 p-2 bg-slate-950 rounded text-[10px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          ))}
          {loading && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 rounded-lg animate-pulse flex items-center gap-2">
              <Cpu size={14} className="animate-spin" />
              <span>Agent processing context and evaluating tool registry...</span>
            </div>
          )}
        </div>

        {/* Prompt Input Bar */}
        <form onSubmit={handleRunAgent} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'Create a high priority task to review Q3 inventory levels'..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            <Send size={16} />
            Execute
          </button>
        </form>
      </div>
    </div>
  );
}