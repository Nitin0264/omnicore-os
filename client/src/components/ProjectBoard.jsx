import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Plus, Clock, AlertCircle, CheckCircle2, User } from 'lucide-react';

export default function ProjectBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', status: 'backlog' });

  const columns = [
    { id: 'backlog', label: 'Backlog', color: 'border-slate-700 bg-slate-900/50' },
    { id: 'todo', label: 'To Do', color: 'border-blue-500/30 bg-blue-950/10' },
    { id: 'in_progress', label: 'In Progress', color: 'border-amber-500/30 bg-amber-950/10' },
    { id: 'review', label: 'Review', color: 'border-purple-500/30 bg-purple-950/10' },
    { id: 'done', label: 'Done', color: 'border-emerald-500/30 bg-emerald-950/10' },
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
    const colors = {
      low: 'text-slate-400 bg-slate-800',
      medium: 'text-blue-400 bg-blue-500/10',
      high: 'text-amber-400 bg-amber-500/10',
      urgent: 'text-rose-400 bg-rose-500/10',
    };
    return <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${colors[priority] || colors.medium}`}>{priority}</span>;
  };

  if (loading) {
    return <div className="text-slate-400 text-sm p-6">Loading project board...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Kanban Workspace</h3>
          <p className="text-xs text-slate-400">Manage tasks and track collaborative workflow progression.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className={`flex flex-col rounded-xl border ${col.color} p-4 min-h-[500px]`}>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">{col.label}</h4>
                <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">{colTasks.length}</span>
              </div>

              <div className="flex-1 space-y-3">
                {colTasks.map((task) => (
                  <div key={task._id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg shadow-sm hover:border-slate-700 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-sm font-semibold text-slate-200">{task.title}</h5>
                      {getPriorityBadge(task.priority)}
                    </div>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{task.assignedTo?.name || 'Unassigned'}</span>
                      </div>
                      
                      {/* Quick Move Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                        className="bg-slate-950 text-slate-300 text-[10px] border border-slate-800 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value="backlog">Backlog</option>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Task summary..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="Task details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
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