import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardLayout from './components/DashboardLayout';
import ProjectBoard from './components/ProjectBoard';
import InventoryView from './components/InventoryView';
import HelpdeskView from './components/HelpdeskView';
import AgentHub from './components/AgentHub';
import { ShieldCheck, ArrowRight, Layers, Sparkles, Terminal, Activity, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('omnicore_token'));
  const [activeTab, setActiveTab] = useState('overview');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLoginSuccess = (userData) => {
    setToken(localStorage.getItem('omnicore_token'));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('omnicore_token');
    setToken(null);
  };

  // If token is active, show the protected dashboard workspace
  if (token) {
    return (
      <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 animate-fadeIn">
            <div className="bg-[#111827] border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl text-indigo-400 text-xs font-semibold">
                  <Sparkles size={14} />
                  <span>Enterprise Cluster Active</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-100">
                  Welcome to OmniCore OS Dashboard
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed">
                  Your multi-tenant enterprise operating system is fully structured. Use the sidebar navigation to switch between modules and manage your infrastructure.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center gap-3 text-indigo-400">
                  <Layers size={20} />
                  <h3 className="text-lg font-bold text-slate-100">Project Management</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Kanban board for workflow tasks, item tracking, priority assignment, and cross-team progress orchestration.
                </p>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer pt-2"
                >
                  Open Board <ArrowRight size={14} />
                </button>
              </div>

              <div className="bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Terminal size={20} />
                  <h3 className="text-lg font-bold text-slate-100">Inventory & ERP</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Warehouse asset management, SKU lookup tracking, asset valuations, and low-stock threshold alerting.
                </p>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer pt-2"
                >
                  Open ERP Hub <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'projects' && <ProjectBoard />}
        {activeTab === 'inventory' && <InventoryView />}
        {activeTab === 'helpdesk' && <HelpdeskView />}
        {activeTab === 'agent' && <AgentHub />}
      </DashboardLayout>
    );
  }

  // If user clicked Sign In from the landing page, show the Auth Modal/Screen
  if (showAuthModal) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-6 left-6 z-50 px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-lg"
        >
          ← Back to Landing
        </button>
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Landing Page with Hero Image background, description, and two CTA buttons
  return (
    <div className="relative min-h-screen w-screen flex flex-col items-center justify-center bg-[#090d16] text-slate-100 overflow-hidden px-4">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000"
          alt="OmniCore OS Enterprise Background"
          className="w-full h-full object-cover opacity-20 filter saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/80 to-transparent"></div>
      </div>

      {/* Hero Content Center Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2.5 bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-2xl text-indigo-400 text-xs font-bold tracking-wider uppercase shadow-xl backdrop-blur-md">
          <ShieldCheck size={16} />
          <span>Enterprise Agent Platform & Operating System</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100 leading-tight">
          OMNICORE <span className="text-indigo-500">OS</span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A modular, multi-tenant enterprise operating system built with Node.js, MongoDB, and React. Centralize project workflows, warehouse inventory ERP, AI helpdesk triage, and autonomous LLM agent execution in one unified cluster.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              const element = document.getElementById('about-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm rounded-xl transition-all shadow-xl backdrop-blur-md cursor-pointer"
          >
            Explore Project
          </button>
          
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In / Workspace</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Explore Section anchor info */}
      <div id="about-section" className="relative z-10 max-w-5xl mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div className="bg-[#111827]/80 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl space-y-2 shadow-xl">
          <div className="text-indigo-400 font-bold text-sm">01 / Modular Architecture</div>
          <h4 className="text-base font-bold text-slate-100">Isolated Micro-Modules</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Auth, Projects Kanban, Inventory ERP, and AI Helpdesk neatly partitioned into scalable backend service layers.</p>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl space-y-2 shadow-xl">
          <div className="text-indigo-400 font-bold text-sm">02 / Autonomous AI</div>
          <h4 className="text-base font-bold text-slate-100">LLM Tool-Calling Orchestrator</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Execute natural language cluster commands that programmatically create tasks, triage tickets, and query inventory databases.</p>
        </div>

        <div className="bg-[#111827]/80 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl space-y-2 shadow-xl">
          <div className="text-indigo-400 font-bold text-sm">03 / Enterprise UI/UX</div>
          <h4 className="text-base font-bold text-slate-100">Dark Slate Aesthetic</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Built with Tailwind CSS, custom slate surfaces, and glowing accent indicators designed for high-density enterprise operations.</p>
        </div>
      </div>
    </div>
  );
}