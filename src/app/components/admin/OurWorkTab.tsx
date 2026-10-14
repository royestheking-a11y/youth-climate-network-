import { useState } from 'react';
import {
  Layers, Plus, Edit3, Trash2, X, Eye,
  Upload, ArrowUp, ArrowDown
} from 'lucide-react';
import { useOurWork, apiOurWork, uploadFile, type OurWorkItem } from '../../lib/api';

const COMMON_ICONS = [
  'Sprout', 'BookOpen', 'Droplets', 'ShieldAlert', 'Trees', 'Sun',
  'Globe', 'Users', 'Target', 'Heart', 'Award', 'Zap'
];

export function OurWorkTab() {
  const { data: items = [], mutate, isLoading } = useOurWork();
  const [editing, setEditing] = useState<OurWorkItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const blankItem: OurWorkItem = {
    slug: '',
    title: '',
    title_bn: '',
    desc: '',
    desc_bn: '',
    iconName: 'Sprout',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    link: '',
    order: items.length + 1,
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploading(true);
        const url = await uploadFile(e.target.files[0]);
        if (editing) {
          setEditing({ ...editing, image: url });
        }
      } catch (err: any) {
        alert('Upload failed: ' + (err.message || 'Unknown error'));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      setSaving(true);
      setStatusMsg(null);
      if (isNew) {
        await apiOurWork.create(editing);
        setStatusMsg({ text: 'Focus area created successfully!', type: 'success' });
      } else {
        const id = editing.id || editing._id;
        await apiOurWork.update(id!, editing);
        setStatusMsg({ text: 'Focus area updated successfully!', type: 'success' });
      }
      await mutate();
      setEditing(null);
      setIsNew(false);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save focus area', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiOurWork.delete(id);
      await mutate();
      setDeleteId(null);
      setStatusMsg({ text: 'Focus area removed successfully.', type: 'success' });
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);

    const reordered = newItems.map((item, i) => ({
      id: item.id || item._id!,
      order: i + 1,
    }));

    try {
      await apiOurWork.reorder(reordered);
      await mutate();
    } catch (e: any) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#E8521A]">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Our Work (Focus Areas & Initiatives)
            </h1>
            <p className="text-xs text-gray-500">
              Manage the focus area cards, descriptions, photos, and destinations displayed on the /our-work page
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/our-work"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Eye size={14} /> Preview /our-work
          </a>

          <button
            onClick={() => {
              setEditing({ ...blankItem });
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition-all hover:scale-105"
            style={{ backgroundColor: '#E8521A' }}
          >
            <Plus size={15} /> Add Focus Area
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Editing Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-poppins">
                  {isNew ? 'Create New Focus Area' : 'Edit Focus Area'}
                </h3>
                <p className="text-xs text-gray-500">Configure title, description, thumbnail photo, and route</p>
              </div>
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editing.title}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    placeholder="e.g. Climate Action"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title (Bengali)</label>
                  <input
                    type="text"
                    value={editing.title_bn || ''}
                    onChange={e => setEditing({ ...editing, title_bn: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    placeholder="যেমন: জলবায়ু কার্যক্রম"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English) *</label>
                  <textarea
                    rows={3}
                    required
                    value={editing.desc || ''}
                    onChange={e => setEditing({ ...editing, desc: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    placeholder="Short summary of this focus area..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Bengali)</label>
                  <textarea
                    rows={3}
                    value={editing.desc_bn || ''}
                    onChange={e => setEditing({ ...editing, desc_bn: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    placeholder="কাজের সংক্ষিপ্ত বিবরণ..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Slug / Identifier</label>
                  <input
                    type="text"
                    value={editing.slug || ''}
                    onChange={e => setEditing({ ...editing, slug: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    placeholder="climate-action"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={editing.iconName || 'Sprout'}
                    onChange={e => setEditing({ ...editing, iconName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {COMMON_ICONS.slice(0, 5).map(ic => (
                      <button
                        type="button"
                        key={ic}
                        onClick={() => setEditing({ ...editing, iconName: ic })}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700"
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Link (Optional)</label>
                  <input
                    type="text"
                    value={editing.link || ''}
                    onChange={e => setEditing({ ...editing, link: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="/our-work/climate-action"
                  />
                </div>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Card Background Photo</label>
                {editing.image && (
                  <div className="relative mb-3 rounded-2xl overflow-hidden aspect-video max-h-48 border border-gray-200 bg-gray-50">
                    <img src={editing.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editing.image || ''}
                    onChange={e => setEditing({ ...editing, image: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
                    placeholder="Paste image URL..."
                  />
                  <label className="cursor-pointer px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-1.5 flex-shrink-0">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => { setEditing(null); setIsNew(false); }}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-semibold text-white rounded-xl shadow-md transition-all hover:scale-105"
                  style={{ backgroundColor: '#E8521A' }}
                >
                  {saving ? 'Saving...' : isNew ? 'Create Focus Area' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Focus Areas */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400">Loading focus areas...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div
              key={item.id || item._id || index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Photo preview */}
              <div className="aspect-[16/10] w-full relative bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 block mb-0.5 font-mono">
                    #{index + 1} · {item.iconName || 'Sprout'}
                  </span>
                  <h3 className="font-bold text-lg font-poppins">{item.title}</h3>
                  {item.title_bn && <p className="text-xs text-emerald-200">{item.title_bn}</p>}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-2">
                  {item.desc}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveOrder(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveOrder(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-600"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditing({ ...item });
                        setIsNew(false);
                      }}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id || item._id!)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-gray-900">Delete Focus Area?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to remove this focus area from the Our Work page?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
