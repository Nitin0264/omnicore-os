import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Package, Plus, AlertTriangle, Layers, DollarSign, Tag, Hash, Sparkles } from 'lucide-react';

export default function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', sku: '', quantity: 0, price: 0, category: '' });

  const fetchInventory = async () => {
    try {
      const res = await API.get('/inventory');
      setItems(res.data.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/inventory', newItem);
      setItems([...items, res.data.data]);
      setNewItem({ name: '', sku: '', quantity: 0, price: 0, category: '' });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to add inventory item:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm gap-3 font-mono">
        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        Loading inventory hub...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111827] border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400">
            <Package size={20} />
            <h3 className="text-xl font-bold tracking-tight text-slate-100">Inventory ERP Hub</h3>
          </div>
          <p className="text-xs text-slate-400">Track stock levels, SKU identifiers, and asset valuations across your enterprise warehouse cluster.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/25 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Item</span>
        </button>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="p-5">Item Name</th>
                <th className="p-5">SKU Code</th>
                <th className="p-5">Category</th>
                <th className="p-5">Quantity</th>
                <th className="p-5">Unit Price</th>
                <th className="p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-3">
                      <Package size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-300">No inventory items found</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Click "Add Item" above to initialize your stock database.</p>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLowStock = item.quantity <= 10;
                  return (
                    <tr key={item._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="p-5 font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors">
                        {item.name}
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-400">
                        {item.sku}
                      </td>
                      <td className="p-5">
                        <span className="text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                          {item.category || 'General'}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-slate-200">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">{item.quantity}</span>
                          {isLowStock && (
                            <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md animate-pulse">
                              <AlertTriangle size={10} /> Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-mono text-slate-300 font-medium">
                        ${item.price?.toFixed(2)}
                      </td>
                      <td className="p-5">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-xl border flex items-center gap-1.5 w-max ${
                          item.quantity > 0 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Add Inventory Item</h3>
              </div>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="MacBook Pro M3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">SKU Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all font-mono text-xs"
                    placeholder="HW-MBP-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder="Hardware"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                </div>
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}