import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Package, Plus, AlertTriangle, Layers, DollarSign } from 'lucide-react';

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
    return <div className="text-slate-400 text-sm p-6">Loading inventory hub...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Inventory ERP Hub</h3>
          <p className="text-xs text-slate-400">Track stock levels, SKUs, and asset valuations across your enterprise warehouse.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold uppercase text-slate-400">
              <th className="p-4">Item Name</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {items.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  No inventory items found. Click "Add Item" to initialize your stock database.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isLowStock = item.quantity <= 10;
                return (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-medium text-slate-200">{item.name}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">{item.sku}</td>
                    <td className="p-4 text-slate-300">{item.category || 'General'}</td>
                    <td className="p-4 font-mono text-slate-200 flex items-center gap-2">
                      {item.quantity}
                      {isLowStock && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          <AlertTriangle size={10} /> Low Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-300">${item.price?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                        item.quantity > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
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

      {/* Add Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Add Inventory Item</h3>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="MacBook Pro M3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="HW-MBP-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Hardware"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    required
                    min="0"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
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