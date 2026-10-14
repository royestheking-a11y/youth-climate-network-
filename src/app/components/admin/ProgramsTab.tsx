import { useState } from 'react';
import {
  Compass, Plus, Search, Edit3, Trash2, X, Eye
} from 'lucide-react';
import { usePrograms, apiProgram } from '../../lib/api';

const COLOR_PRESETS = [
  { name: 'Forest Green', color: '#1A6B3C', bg: '#E8F5EE' },
  { name: 'Warm Orange', color: '#E8521A', bg: '#FDF2E9' },
  { name: 'Cyan Blue', color: '#0E7490', bg: '#ECFEFF' },
  { name: 'Royal Purple', color: '#7C3AED', bg: '#F5F3FF' },
  { name: 'Amber Gold', color: '#D97706', bg: '#FFFBEB' },
  { name: 'Crimson Red', color: '#DC2626', bg: '#FEF2F2' },
  { name: 'Teal Emerald', color: '#059669', bg: '#ECFDF5' },
  { name: 'Indigo Deep', color: '#4F46E5', bg: '#EEF2FF' },
];

const COMMON_ICONS = [
  'Compass', 'Sprout', 'Droplets', 'ShieldAlert', 'Sun', 'Trees',
  'BookOpen', 'Globe', 'Users', 'Heart', 'Award', 'Zap', 'Wind',
  'Recycle', 'Radio', 'Anchor', 'Activity', 'ShieldCheck'
];

export function ProgramsTab() {
  const { data: programs = [], mutate, isLoading } = usePrograms();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const blankProgram = {
    slug: '',
    title: '',
    title_bn: '',
    theme: '',
    theme_bn: '',
    description: '',
    description_bn: '',
    color: '#1A6B3C',
    bg: '#E8F5EE',
    iconName: 'Compass',
    keyPrograms: [] as string[],
    keyPrograms_bn: [] as string[],
  };

  const filteredPrograms = programs.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.title || '').toLowerCase().includes(q) ||
      (p.title_bn || '').toLowerCase().includes(q) ||
      (p.theme || '').toLowerCase().includes(q) ||
      (p.slug || '').toLowerCase().includes(q)
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMsg(null);
      if (isNew) {
        await apiProgram.create(editing);
        setStatusMsg({ text: 'New program pillar created successfully!', type: 'success' });
      } else {
        await apiProgram.update(editing.id || editing._id, editing);
        setStatusMsg({ text: 'Program pillar updated successfully!', type: 'success' });
      }
      await mutate();
      setEditing(null);
      setIsNew(false);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save program', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiProgram.delete(id);
      await mutate();
      setDeleteId(null);
      setStatusMsg({ text: 'Program pillar deleted successfully.', type: 'success' });
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1A6B3C]">
            <Compass size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Strategic Programs (20 Pillars)
            </h1>
            <p className="text-xs text-gray-500">
              Manage the 20 strategic thematic pillars displayed on the /programs page
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/programs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Eye size={14} /> Preview /programs
          </a>

          <button
            onClick={() => {
              setEditing({ ...blankProgram });
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white shadow-sm transition-all hover:scale-105"
            style={{ backgroundColor: '#1A6B3C' }}
          >
            <Plus size={15} /> Add New Pillar
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

      {/* Search and stats bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100">
        <div className="relative flex-1 min-w-[260px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search programs by title, theme, or slug..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
          />
        </div>
        <div className="text-xs font-semibold text-gray-500">
          Showing <span className="text-gray-900 font-bold">{filteredPrograms.length}</span> of {programs.length} program pillars
        </div>
      </div>

      {/* Editing Modal / View */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-poppins">
                  {isNew ? 'Create New Program Pillar' : 'Edit Program Pillar'}
                </h3>
                <p className="text-xs text-gray-500">Configure English & Bengali descriptions, initiatives, and visual branding</p>
              </div>
              <button
                onClick={() => { setEditing(null); setIsNew(false); }}
                className="p-2 hover:bg-gray-100 rounded-xl text-gray-500"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Column */}
                <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <h4 className="font-bold text-xs uppercase text-gray-700 tracking-wider">English Content</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English) *</label>
                    <input
                      type="text"
                      required
                      value={editing.title}
                      onChange={e => setEditing({ ...editing, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="e.g. Climate Justice & Frontline Rights"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Theme / Category (English)</label>
                    <input
                      type="text"
                      value={editing.theme}
                      onChange={e => setEditing({ ...editing, theme: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                      placeholder="e.g. Climate & Ecology"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English) *</label>
                    <textarea
                      rows={3}
                      required
                      value={editing.description}
                      onChange={e => setEditing({ ...editing, description: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                      placeholder="Comprehensive summary of this pillar..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Key Initiatives (English, 1 per line — format: Title — Description)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(editing.keyPrograms) ? editing.keyPrograms.join('\n') : editing.keyPrograms || ''}
                      onChange={e =>
                        setEditing({
                          ...editing,
                          keyPrograms: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none font-mono text-[11px]"
                      placeholder="Initiative 1 — Detailed description&#10;Initiative 2 — Detailed description"
                    />
                  </div>
                </div>

                {/* Bengali Column */}
                <div className="space-y-4 bg-orange-50/50 p-5 rounded-2xl border border-orange-200/60">
                  <div className="flex items-center gap-2 border-b border-orange-200/60 pb-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <h4 className="font-bold text-xs uppercase text-gray-700 tracking-wider">Bengali Content (বাংলা)</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title (Bengali)</label>
                    <input
                      type="text"
                      value={editing.title_bn || ''}
                      onChange={e => setEditing({ ...editing, title_bn: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      placeholder="যেমন: জলবায়ু ন্যায়বিচার ও অধিকার"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Theme / Category (Bengali)</label>
                    <input
                      type="text"
                      value={editing.theme_bn || ''}
                      onChange={e => setEditing({ ...editing, theme_bn: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                      placeholder="যেমন: জলবায়ু ও পরিবেশ"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Bengali)</label>
                    <textarea
                      rows={3}
                      value={editing.description_bn || ''}
                      onChange={e => setEditing({ ...editing, description_bn: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none"
                      placeholder="প্রোগ্রামের পূর্ণ বিবরণ..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Key Initiatives (Bengali, 1 per line — format: শিরোনাম — বিবরণ)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(editing.keyPrograms_bn) ? editing.keyPrograms_bn.join('\n') : editing.keyPrograms_bn || ''}
                      onChange={e =>
                        setEditing({
                          ...editing,
                          keyPrograms_bn: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full px-3.5 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none font-mono text-[11px]"
                      placeholder="উদ্যোগ ১ — বিস্তারিত বিবরণ&#10;উদ্যোগ ২ — বিস্তারিত বিবরণ"
                    />
                  </div>
                </div>
              </div>

              {/* Design & Configuration */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-4">
                <h4 className="font-bold text-xs uppercase text-gray-700 tracking-wider">Styling, URL Slug & Icon</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editing.slug}
                      onChange={e => setEditing({ ...editing, slug: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      placeholder="e.g. climate-justice"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Icon Name</label>
                    <input
                      type="text"
                      value={editing.iconName || 'Compass'}
                      onChange={e => setEditing({ ...editing, iconName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      placeholder="e.g. Compass, Sprout"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {COMMON_ICONS.slice(0, 6).map(ic => (
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
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editing.color || '#1A6B3C'}
                        onChange={e => setEditing({ ...editing, color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={editing.color || '#1A6B3C'}
                        onChange={e => setEditing({ ...editing, color: e.target.value })}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Card Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editing.bg || '#E8F5EE'}
                        onChange={e => setEditing({ ...editing, bg: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={editing.bg || '#E8F5EE'}
                        onChange={e => setEditing({ ...editing, bg: e.target.value })}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Presets */}
                <div>
                  <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">Quick Palette Presets:</span>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map(p => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setEditing({ ...editing, color: p.color, bg: p.bg })}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border border-gray-200"
                        style={{ backgroundColor: p.bg, color: p.color }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </button>
                    ))}
                  </div>
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
                  style={{ backgroundColor: '#1A6B3C' }}
                >
                  {saving ? 'Saving Pillar...' : isNew ? 'Create Pillar' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400">Loading programs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrograms.map((p, index) => (
            <div
              key={p.id || p._id || index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              style={{ borderTop: `4px solid ${p.color || '#1A6B3C'}` }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: p.bg || '#E8F5EE', color: p.color || '#1A6B3C' }}
                  >
                    {p.theme || 'Program Pillar'}
                  </span>
                  <span className="text-[10px] font-mono text-gray-400">#{index + 1}</span>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-1 font-poppins">
                  {p.title}
                </h3>
                {p.title_bn && (
                  <p className="text-xs text-emerald-800 font-medium mb-2 font-inter">{p.title_bn}</p>
                )}

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {p.description}
                </p>

                {p.keyPrograms && p.keyPrograms.length > 0 && (
                  <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-4">
                    <span className="font-bold text-gray-700 block mb-1">
                      {p.keyPrograms.length} Key Initiatives:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                      {p.keyPrograms.slice(0, 2).map((kp: string, i: number) => (
                        <li key={i} className="truncate">{kp}</li>
                      ))}
                      {p.keyPrograms.length > 2 && (
                        <li className="text-[10px] text-gray-400">+{p.keyPrograms.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-auto">
                <span className="text-[10px] font-mono text-gray-400 truncate max-w-[150px]">
                  /programs/{p.slug}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditing({ ...p });
                      setIsNew(false);
                    }}
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Edit Pillar"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id || p._id)}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Pillar"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-gray-900">Delete Program Pillar?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete this program pillar? This action cannot be undone.
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
