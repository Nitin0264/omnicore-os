import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { LifeBuoy, Plus, MessageSquare, AlertCircle, CheckCircle2, User, Clock, Tag, Sparkles } from 'lucide-react';

export default function HelpdeskView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'medium' });

  const fetchTickets = async () => {
    try {
      const res = await API.get('/helpdesk/tickets');
      setTickets(res.data.data);
    } catch (err) {
      console.error('Failed to fetch helpdesk tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/helpdesk/tickets', newTicket);
      setTickets([res.data.data, ...tickets]);
      setNewTicket({ subject: '', description: '', priority: 'medium' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      await API.patch(`/helpdesk/tickets/${ticketId}/status`, { status: newStatus });
      setTickets(tickets.map(t => t._id === ticketId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'text-slate-400 bg-slate-800 border-slate-700',
      medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse',
    };
    return (
      <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border ${colors[priority] || colors.medium}`}>
        {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      closed: 'bg-slate-800 text-slate-400 border-slate-700',
    };
    return (
      <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${styles[status] || styles.open}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm gap-3 font-mono">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        Loading helpdesk ticketing system...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <LifeBuoy size={20} />
            <h3 className="text-xl font-bold tracking-tight text-slate-100">AI Helpdesk Hub</h3>
          </div>
          <p className="text-xs text-slate-400">Manage client support tickets, triage urgent requests, and monitor autonomous resolution workflows.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Tickets List Grid */}
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <div className="p-16 bg-[#111827] border border-slate-800/80 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <LifeBuoy size={24} />
            </div>
            <p className="text-sm font-medium text-slate-300">No support tickets found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">Click "New Ticket" above to log a customer issue or trigger a triage workflow.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              className="p-6 bg-[#111827] border border-slate-800/80 rounded-2xl shadow-md hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">{ticket.subject}</h4>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ticket.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Tag size={12} /> ID: <strong className="text-slate-300">#{ticket._id.slice(-6)}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> Created: {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-800/80">
                <div>{getStatusBadge(ticket.status)}</div>
                <select
                  value={ticket.status}
                  onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                  className="bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer shadow-inner"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Create Support Ticket</h3>
              </div>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="Billing discrepancy on invoice #102..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                  placeholder="Provide detailed context for the issue..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Priority Level</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Priority</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl transition-colors cursor-pointer border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}