import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Clock, AlertCircle, CheckCircle2, User, Layers, Tag } from 'lucide-react';

export default function ProjectBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'backlog' });

  const columns = [
    { id: 'backlog', label: 'Backlog', border: 'border-slate-800', bg: 'bg-[#0f172a]/60', headerColor: 'text-slate-400' },
    { id: 'todo', label: 'To Do', border: 'border-blue-500/20', bg: 'bg-[#0f172a]/60', headerColor: 'text-blue-400' },
    { id: 'in_progress', label: 'In Progress', border: 'border-amber-500/20', bg: 'bg-[#0f172a]/60', headerColor: 'text-amber-400' },
    { id: 'review', label: 'Review', border: 'border-purple-500/20', bg: 'bg-[#0f172a]/60', headerColor: 'text-purple-400' },
    { id: 'done', label: 'Done', border: 'border-emerald-500/20', bg: 'bg-[#0f172a]/60', headerColor: 'text-emerald-400' },
  ];

  const fetchTasks = async () => {
    try {
      const res = await API.get('/projects/tasks');
      setTasks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/projects/tasks', newTask);
      setTasks([...tasks, res.data.data]);
      setNewTask({ title: '', description: '', priority: 'medium', status: 'backlog' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/projects/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'text-slate-400 bg-slate-800/80 border-slate-700',
      medium: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      urgent: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };
    return (
      <span className={`text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full border ${styles[priority] || styles.medium}`}>
        {priority}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          Loading project workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Layers size={14} />
            <span>Project Management Module</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Kanban Workspace</h2>
          <p className="text-sm text-slate-400">Manage tasks, organize priorities, and track collaborative workflow progression in real time.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/45 active:scale-[0.98]"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 overflow-x-auto pb-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`flex flex-col rounded-2xl border ${col.border} ${col.bg} p-4 min-h-[600px] shadow-lg backdrop-blur-md`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.headerColor.replace('text-', 'bg-')}`}></span>
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>{col.label}</h4>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3.5">
                {colTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-800/80 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">No tasks in {col.label}</p>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task._id}
                      className="group relative bg-[#111827] border border-slate-800 hover:border-slate-700/80 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h5 className="text-sm font-semibold text-slate-200 leading-snug group-hover:text-indigo-300 transition-colors">
                          {task.title}
                        </h5>
                        {getPriorityBadge(task.priority)}
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5 font-medium">
                          <User size={13} className="text-slate-500" />
                          <span>{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>

                        {/* Quick Status Dropdown */}
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                          className="bg-slate-950 text-slate-300 text-[11px] font-medium border border-slate-800 hover:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-colors"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#111827] border border-slate-800 rounded-2xl p-7 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Create New Task</h3>
                <p className="text-xs text-slate-400">Add a work item to your project pipeline.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold px-2 py-1 rounded-lg bg-slate-800/50 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  placeholder="e.g. Implement OAuth2 authentication flow"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  placeholder="Outline key requirements or steps..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Initial Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}