import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { LifeBuoy, Plus, MessageSquare, AlertCircle, CheckCircle2, User } from 'lucide-react';

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
      low: 'text-slate-400 bg-slate-800',
      medium: 'text-blue-400 bg-blue-500/10',
      high: 'text-amber-400 bg-amber-500/10',
      urgent: 'text-rose-400 bg-rose-500/10',
    };
    return <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${colors[priority] || colors.medium}`}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      closed: 'bg-slate-800 text-slate-400 border-slate-700',
    };
    return <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border ${styles[status] || styles.open}`}>{status.replace('_', ' ')}</span>;
  };

  if (loading) {
    return <div className="text-slate-400 text-sm p-6">Loading helpdesk ticketing system...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Helpdesk Hub</h3>
          <p className="text-xs text-slate-400">Manage client support tickets, triage urgent requests, and monitor resolution workflows.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Tickets List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {tickets.length === 0 ? (
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center text-slate-500">
            No support tickets found. Click "New Ticket" to log a customer issue.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm hover:border-slate-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="text-base font-semibold text-slate-100">{ticket.subject}</h4>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{ticket.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Ticket ID: <strong className="font-mono text-slate-400">{ticket._id.slice(-6)}</strong></span>
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <div>{getStatusBadge(ticket.status)}</div>
                <select
                  value={ticket.status}
                  onChange={(e) => updateTicketStatus(ticket._id, e.target.value)}
                  className="bg-slate-950 text-slate-300 text-xs border border-slate-800 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Create Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Billing discrepancy on invoice #102..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  required
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Provide detailed context for the issue..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority Level</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
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