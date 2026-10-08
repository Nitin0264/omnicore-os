import React from 'react';
import { LayoutDashboard, CheckSquare, Package, LifeBuoy, Cpu, LogOut, ShieldCheck, Activity } from 'lucide-react';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Project Management', icon: CheckSquare },
    { id: 'inventory', label: 'Inventory ERP', icon: Package },
    { id: 'helpdesk', label: 'AI Helpdesk', icon: LifeBuoy },
    { id: 'agent', label: 'AI Agent Hub', icon: Cpu },
  ];

  const handleLogout = () => {
    localStorage.removeItem('omnicore_token');
    window.location.reload();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#090d16] text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-[#111827] border-r border-slate-800/80 flex flex-col z-20 shadow-2xl">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <ShieldCheck size={18} />
            </div>
            <h1 className="text-lg font-black tracking-wider text-slate-100">OMNICORE OS</h1>
          </div>
          <p className="text-xs text-slate-400 pl-10">Enterprise Agent Platform</p>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Workspace Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'} />
                <span className="tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Logout Area */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#090d16]">
        {/* Top Header */}
        <header className="h-20 bg-[#111827] border-b border-slate-800/80 flex items-center justify-between px-8 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold capitalize tracking-tight text-slate-100">{activeTab} Workspace</h2>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">/ omnicore://core-engine</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-300 font-mono font-medium tracking-wide">Connected to Cluster</span>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}