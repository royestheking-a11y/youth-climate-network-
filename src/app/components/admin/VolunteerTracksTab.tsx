import { useState } from 'react';
import {
  Heart, Plus, Edit3, Trash2, X, Eye, CheckCircle2,
  MapPin, Clock
} from 'lucide-react';
import { useVolunteerTracks, apiVolunteerTracks, type VolunteerTrack } from '../../lib/api';

export function VolunteerTracksTab() {
  const { data: tracks = [], mutate, isLoading } = useVolunteerTracks();
  const [editing, setEditing] = useState<VolunteerTrack | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const blankTrack: VolunteerTrack = {
    slug: '',
    title: '',
    title_bn: '',
    badge: 'Community Action',
    commitment: '3–5 hrs / week',
    location: 'Coastal & Delta Districts',
    description: '',
    description_bn: '',
    responsibilities: [],
    responsibilities_bn: [],
    skills: [],
    benefits: ['Official Volunteer Certificate', 'Leadership Training Workshops'],
    order: tracks.length + 1
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      const payload = {
        ...editing,
        slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };
      if (isNew) {
        await apiVolunteerTracks.create(payload);
      } else {
        await apiVolunteerTracks.update(editing.id!, payload);
      }
      await mutate();
      setEditing(null);
      setIsNew(false);
      setStatusMsg({ text: 'Volunteer track saved successfully!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save track', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiVolunteerTracks.delete(id);
      await mutate();
      setDeleteId(null);
    } catch (err: any) {
      alert('Failed to delete track: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart size={20} />
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 font-poppins">Volunteer Opportunities & Tracks</h2>
          </div>
          <p className="text-xs text-gray-500 font-inter max-w-xl">
            Manage volunteer roles and tracks displayed on the Get Involved page. Customize badges, commitments, responsibilities, and volunteer perks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/get-involved"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all"
          >
            <Eye size={14} /> Preview /get-involved
          </a>
          <button
            onClick={() => { setEditing(blankTrack); setIsNew(true); }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={15} /> Add Volunteer Track
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          {statusMsg.text}
        </div>
      )}

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#1A6B3C]">
                  {track.badge}
                </span>
                <span className="text-xs text-gray-400 font-inter flex items-center gap-1">
                  <Clock size={12} /> {track.commitment}
                </span>
              </div>

              <h3 className="font-bold text-base text-gray-900 font-poppins mb-1">
                {track.title}
              </h3>
              {track.title_bn && (
                <p className="text-xs text-[#1A6B3C] font-inter mb-2">
                  {track.title_bn}
                </p>
              )}

              <p className="text-xs text-gray-500 font-inter mb-3 flex items-center gap-1">
                <MapPin size={12} className="text-gray-400" /> {track.location}
              </p>

              <p className="text-xs text-gray-600 font-inter line-clamp-2 leading-relaxed mb-4">
                {track.description}
              </p>

              {/* Responsibilities list sample */}
              {track.responsibilities && track.responsibilities.length > 0 && (
                <div className="space-y-1 pt-3 border-t border-gray-100 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Responsibilities:</span>
                  {track.responsibilities.slice(0, 2).map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600">
                      <CheckCircle2 size={12} className="text-[#1A6B3C] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-mono">slug: {track.slug}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditing(track); setIsNew(false); }}
                  className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  title="Edit"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(track.id!)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-base font-bold text-gray-900 font-poppins">
                {isNew ? 'Add Volunteer Track' : 'Edit Volunteer Track'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Track Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editing.title}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    placeholder="Grassroots Climate Mobilizer"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Track Title (বাংলা)</label>
                  <input
                    type="text"
                    value={editing.title_bn || ''}
                    onChange={e => setEditing({ ...editing, title_bn: e.target.value })}
                    placeholder="তৃণমূল জলবায়ু সমন্বয়কারী"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editing.badge}
                    onChange={e => setEditing({ ...editing, badge: e.target.value })}
                    placeholder="Field & Community"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Commitment</label>
                  <input
                    type="text"
                    value={editing.commitment}
                    onChange={e => setEditing({ ...editing, commitment: e.target.value })}
                    placeholder="4–6 hrs / week"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location</label>
                  <input
                    type="text"
                    value={editing.location}
                    onChange={e => setEditing({ ...editing, location: e.target.value })}
                    placeholder="Coastal Districts"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (English) *</label>
                <textarea
                  rows={2}
                  required
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Engage frontline youth and organize community workshops..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description (বাংলা)</label>
                <textarea
                  rows={2}
                  value={editing.description_bn || ''}
                  onChange={e => setEditing({ ...editing, description_bn: e.target.value })}
                  placeholder="উপকূলীয় এলাকায় তরুণদের উদ্বুদ্ধকরণ ও সচেতনতামূলক কর্মশালা..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Key Responsibilities (One per line)
                </label>
                <textarea
                  rows={3}
                  value={(editing.responsibilities || []).join('\n')}
                  onChange={e => setEditing({ ...editing, responsibilities: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Organize localized climate awareness sessions&#10;Coordinate tree plantation drives&#10;Liaise with local youth groups"
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={(editing.skills || []).join(', ')}
                  onChange={e => setEditing({ ...editing, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="Communication, Community Engagement, Leadership"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0A3320] text-white text-xs font-bold hover:bg-[#13532e] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Track'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-bold text-base text-gray-900">Delete Volunteer Track?</h3>
            <p className="text-xs text-gray-500">This action will remove the track from the Get Involved page.</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border text-xs font-semibold">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
