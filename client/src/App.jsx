import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardLayout from './components/DashboardLayout';
import ProjectBoard from './components/ProjectBoard';
import InventoryView from './components/InventoryView';
import HelpdeskView from './components/HelpdeskView';
import AgentHub from './components/AgentHub';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const token = localStorage.getItem('omnicore_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <h3 className="text-xl font-bold text-slate-100">Welcome to OmniCore OS Dashboard</h3>
            <p className="text-sm text-slate-400">
              Your multi-tenant enterprise operating system is fully structured. Use the sidebar to switch between modules:
            </p>
            <ul className="text-sm text-indigo-400 list-disc list-inside space-y-1 pt-2">
              <li><strong>Project Management</strong>: Kanban board for workflow tasks.</li>
              <li><strong>Inventory ERP</strong>: Warehouse asset and SKU tracking.</li>
              <li><strong>AI Helpdesk</strong>: Customer support ticket triage.</li>
              <li><strong>AI Agent Hub</strong>: Autonomous LLM orchestrator control panel.</li>
            </ul>
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