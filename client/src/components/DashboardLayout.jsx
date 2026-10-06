import React from 'react';
import { LayoutDashboard, CheckSquare, Package, LifeBuoy, Cpu, LogOut } from 'lucide-react';

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
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider text-indigo-400">OMNICORE OS</h1>
          <p className="text-xs text-slate-400 mt-1">Enterprise Agent Platform</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold capitalize text-slate-200">{activeTab} Workspace</h2>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-400 font-mono">Connected to Cluster</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
}