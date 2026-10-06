import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('omnicore_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={(userData) => {
      setUser(userData);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="space-y-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="text-xl font-bold text-slate-100">Welcome to OmniCore OS Dashboard</h3>
          <p className="text-sm text-slate-400 mt-2">
            You are successfully connected to your multi-tenant workspace cluster. Select a module from the sidebar to manage projects, inventory, helpdesk tickets, or configure AI agent tools.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}