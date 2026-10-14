import { useState } from 'react';
import {
  Menu, Plus, Edit3, Trash2, ArrowUp, ArrowDown, X,
  ExternalLink, RotateCcw
} from 'lucide-react';
import { useNavigation, apiNavigation, NavigationItem } from '../../lib/api';

export function NavigationTab() {
  const { data: navItems = [], mutate, isLoading } = useNavigation();
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const sortedItems = [...navItems].sort((a, b) => a.order - b.order);

  const blankItem: NavigationItem = {
    id: '',
    label: '',
    label_bn: '',
    path: '',
    order: sortedItems.length,
    isActive: true,
    isExternal: false,
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setSaving(true);
      setStatusMsg(null);
      if (isNew) {
        await apiNavigation.create(editingItem);
      } else {
        await apiNavigation.update(editingItem.id, editingItem);
      }
      mutate();
      setEditingItem(null);
      setIsNew(false);
      setStatusMsg({ text: 'Navigation updated successfully!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setStatusMsg({ text: err.message || 'Failed to save navigation item', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this navigation item?')) return;
    try {
      await apiNavigation.delete(id);
      mutate();
      setStatusMsg({ text: 'Item deleted.', type: 'success' });
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleToggleActive = async (item: NavigationItem) => {
    try {
      await apiNavigation.update(item.id, { isActive: !item.isActive });
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return;

    const items = [...sortedItems];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);

    const reorderedPayload = items.map((it, idx) => ({ id: it.id, order: idx }));
    try {
      await apiNavigation.reorder(reorderedPayload);
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  const defaultPresets = [
    { label: 'Home', path: '/', order: 0 },
    { label: 'About', path: '/about', order: 1 },
    { label: 'Our Work', path: '/our-work', order: 2 },
    { label: 'Programs', path: '/our-work', order: 3 },
    { label: 'Stories', path: '/blog', order: 4 },
    { label: 'Get Involved', path: '/get-involved', order: 5 },
    { label: 'Contact', path: '/contact', order: 6 },
  ];

  const handleRestoreDefaults = async () => {
    if (!window.confirm('Restore default navigation items? This will reset custom ordering.')) return;
    try {
      for (const item of sortedItems) {
        await apiNavigation.delete(item.id);
      }
      for (const preset of defaultPresets) {
        await apiNavigation.create({ ...preset, isActive: true, isExternal: false });
      }
      mutate();
      setStatusMsg({ text: 'Navigation restored to defaults!', type: 'success' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading navigation settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1A6B3C]">
            <Menu size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Navigation Bar Management
            </h1>
            <p className="text-xs text-gray-500">
              Manage header links, labels, ordering, and destination URLs across desktop and mobile menus
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRestoreDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
          <button
            onClick={() => {
              setEditingItem(blankItem);
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm transition-all"
          >
            <Plus size={15} /> Add Menu Item
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Editor Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {isNew ? 'Add Navigation Item' : 'Edit Navigation Item'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsNew(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Menu Label (English)</label>
                <input
                  type="text"
                  value={editingItem.label}
                  onChange={e => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="E.g., About Us"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Menu Label (Bengali - Optional)</label>
                <input
                  type="text"
                  value={editingItem.label_bn || ''}
                  onChange={e => setEditingItem({ ...editingItem, label_bn: e.target.value })}
                  placeholder="আমাদের সম্পর্কে"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Destination URL / Path</label>
                <input
                  type="text"
                  value={editingItem.path}
                  onChange={e => setEditingItem({ ...editingItem, path: e.target.value })}
                  placeholder="E.g., /about or https://example.com"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none"
                  required
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Use internal paths like <code className="text-emerald-700">/about</code>, <code className="text-emerald-700">/blog</code>, or external URLs.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive}
                    onChange={e => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1A6B3C] focus:ring-0"
                  />
                  <span>Active & Visible</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isExternal || false}
                    onChange={e => setEditingItem({ ...editingItem, isExternal: e.target.checked })}
                    className="w-4 h-4 rounded text-[#1A6B3C] focus:ring-0"
                  />
                  <span>Open in New Tab</span>
                </label>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsNew(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C]"
                >
                  {saving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Items List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-12 text-center">Order</span>
            <span>Menu Item & Path</span>
          </div>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-gray-100">
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-gray-50/80 ${
                !item.isActive ? 'opacity-60 bg-gray-50/40' : ''
              }`}
            >
              {/* Order Controls & Label */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 text-gray-600"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <span className="text-xs font-bold text-gray-500 w-6 text-center">{index + 1}</span>
                  <button
                    disabled={index === sortedItems.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 text-gray-600"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{item.label}</span>
                    {item.label_bn && (
                      <span className="text-xs text-gray-400">({item.label_bn})</span>
                    )}
                    {item.isExternal && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        <ExternalLink size={10} /> external
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-emerald-700 font-mono">{item.path}</span>
                </div>
              </div>

              {/* Status Toggle & Edit/Delete */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleActive(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.isActive ? 'Active' : 'Hidden'}
                </button>

                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsNew(false);
                  }}
                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                  title="Edit item"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                  title="Delete item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
