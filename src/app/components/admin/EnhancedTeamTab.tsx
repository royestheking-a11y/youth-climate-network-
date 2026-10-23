import { useState } from 'react';
import {
  Users, Plus, Edit3, Trash2, ArrowUp, ArrowDown, X,
  Upload, RotateCcw, Search
} from 'lucide-react';
import { useTeam, apiTeam, TeamMember, uploadFile } from '../../lib/api';

const DEPARTMENTS = [
  'Programs',
  'Research',
  'Communications',
  'Operations',
  'Finance',
  'Volunteers',
  'Executive',
  'Advisory',
  'Technology',
];

export function EnhancedTeamTab() {
  const { data: rawMembers = [], mutate } = useTeam();
  const [filterType, setFilterType] = useState<'all' | 'advisor' | 'director' | 'member'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const sortedMembers = [...rawMembers].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : (a.number ?? 0);
    const orderB = typeof b.order === 'number' ? b.order : (b.number ?? 0);
    if (orderA !== orderB) return orderA - orderB;
    return String(a.id || (a as any)._id || '').localeCompare(String(b.id || (b as any)._id || ''));
  });

  const blankMember: TeamMember = {
    id: '',
    name: '',
    name_bn: '',
    role: '',
    role_bn: '',
    bio: '',
    bio_bn: '',
    email: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    type: 'member',
    department: 'Programs',
    number: sortedMembers.length + 1,
    linkedin: '',
    order: sortedMembers.length,
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingMember) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(e.target.files[0]);
        setEditingMember({ ...editingMember, image: url });
      } catch (err) {
        alert('Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    try {
      setSaving(true);
      setStatusMsg(null);
      if (isNew) {
        await apiTeam.create(editingMember);
      } else {
        await apiTeam.update(editingMember.id, editingMember);
      }
      mutate();
      setEditingMember(null);
      setIsNew(false);
      setStatusMsg({ text: 'Team member saved successfully!', type: 'success' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save team member', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) return;
    try {
      await apiTeam.delete(id);
      mutate();
      setStatusMsg({ text: 'Member deleted', type: 'success' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMove = async (filteredIndex: number, direction: 'up' | 'down') => {
    const targetFilteredIndex = direction === 'up' ? filteredIndex - 1 : filteredIndex + 1;
    if (targetFilteredIndex < 0 || targetFilteredIndex >= filteredMembers.length) return;

    const currentMember = filteredMembers[filteredIndex];
    const targetMember = filteredMembers[targetFilteredIndex];
    if (!currentMember || !targetMember) return;

    const currentId = currentMember.id || (currentMember as any)._id;
    const targetId = targetMember.id || (targetMember as any)._id;

    // Find indices of both members in the complete sortedMembers array
    const currentPos = sortedMembers.findIndex(m => (m.id || (m as any)._id) === currentId);
    if (currentPos === -1) return;

    const newSorted = [...sortedMembers];
    const [moved] = newSorted.splice(currentPos, 1);

    const targetPosInNew = newSorted.findIndex(m => (m.id || (m as any)._id) === targetId);
    if (targetPosInNew === -1) return;

    if (direction === 'up') {
      newSorted.splice(targetPosInNew, 0, moved);
    } else {
      newSorted.splice(targetPosInNew + 1, 0, moved);
    }

    const reorderedPayload = newSorted.map((it, idx) => ({
      id: (it.id || (it as any)._id) as string,
      order: idx,
      number: idx + 1,
    }));

    // Optimistic UI update so buttons and list react immediately
    const optimisticData = newSorted.map((it, idx) => ({
      ...it,
      order: idx,
      number: idx + 1,
    }));
    mutate(optimisticData, false);

    try {
      await apiTeam.reorder(reorderedPayload);
      await mutate();
    } catch (err: any) {
      console.error('Reorder error:', err);
      setStatusMsg({ text: 'Failed to reorder: ' + (err.message || 'Unknown error'), type: 'error' });
      await mutate();
    }
  };

  const handleAutoRenumber = async () => {
    if (!window.confirm('Automatically renumber all members sequentially (1, 2, 3...)?')) return;
    try {
      setStatusMsg(null);
      const reorderedPayload = sortedMembers.map((it, idx) => ({
        id: (it.id || (it as any)._id) as string,
        order: idx,
        number: idx + 1,
      }));
      await apiTeam.reorder(reorderedPayload);
      await mutate();
      setStatusMsg({ text: 'Chronological numbering synchronized successfully!', type: 'success' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredMembers = sortedMembers.filter(m => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    if (selectedDept !== 'all' && m.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        (m.department && m.department.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const counts = {
    all: sortedMembers.length,
    advisor: sortedMembers.filter(m => m.type === 'advisor').length,
    director: sortedMembers.filter(m => m.type === 'director').length,
    member: sortedMembers.filter(m => m.type === 'member').length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#1A6B3C]">
            <Users size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Team & Leadership Management
            </h1>
            <p className="text-xs text-gray-500">
              Manage Advisory Board, Executive Directors, and Team Members with department tags and chronological numbers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoRenumber}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
            title="Sequentially update chronological #1, #2... for all members"
          >
            <RotateCcw size={13} /> Renumber Chronologically
          </button>
          <button
            onClick={() => {
              setEditingMember(blankMember);
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm"
          >
            <Plus size={15} /> Add Member
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Role / Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { key: 'all', label: 'All Leadership & Team', count: counts.all },
          { key: 'advisor', label: 'Advisory Board', count: counts.advisor },
          { key: 'director', label: 'Executive Directors', count: counts.director },
          { key: 'member', label: 'Team Members', count: counts.member },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === tab.key
                ? 'bg-[#0A3320] text-[#F0ECD8] shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                filterType === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Department Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="md:col-span-8 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, designation, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {isNew ? 'Add Team Member / Advisor' : 'Edit Member Details'}
              </h3>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setIsNew(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo preview + upload */}
              <div className="flex items-center gap-4">
                <img
                  src={editingMember.image || '/placeholder.png'}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover border border-gray-200 bg-gray-50"
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Profile Photograph</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingMember.image || ''}
                      onChange={e => setEditingMember({ ...editingMember, image: e.target.value })}
                      placeholder="Image URL..."
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                    />
                    <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1">
                      <Upload size={13} />
                      <span>{uploadingImage ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (English)</label>
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={e => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="E.g., Sadia Islam"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name (Bengali - Optional)</label>
                  <input
                    type="text"
                    value={editingMember.name_bn || ''}
                    onChange={e => setEditingMember({ ...editingMember, name_bn: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="সাদিয়া ইসলাম"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Designation</label>
                  <input
                    type="text"
                    value={editingMember.role}
                    onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="E.g., Program Officer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Leadership Section</label>
                  <select
                    value={editingMember.type || 'member'}
                    onChange={e => setEditingMember({ ...editingMember, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    <option value="advisor">Advisory Board</option>
                    <option value="director">Executive Director</option>
                    <option value="member">Team Member</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
                  <select
                    value={editingMember.department || 'Programs'}
                    onChange={e => setEditingMember({ ...editingMember, department: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Chronological Number (#)</label>
                  <input
                    type="number"
                    value={editingMember.number ?? 1}
                    onChange={e => setEditingMember({ ...editingMember, number: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={editingMember.linkedin || ''}
                    onChange={e => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={e => setEditingMember({ ...editingMember, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                    placeholder="email@ycn.org"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Bio / Focus Area</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={e => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
                  placeholder="Focus areas or short biographical summary..."
                />
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    setIsNew(false);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C]"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5 w-16 text-center"># Num</th>
              <th className="px-6 py-3.5">Member Details</th>
              <th className="px-4 py-3.5">Section</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5 text-center">Reorder</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredMembers.map((m, index) => (
              <tr key={m.id} className="hover:bg-gray-50/70">
                <td className="px-4 py-3.5 text-center font-bold text-gray-400">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-mono text-[11px]">
                    #{m.number ?? index + 1}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.image || '/placeholder.png'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block">{m.name}</span>
                      <span className="text-gray-500 text-[11px]">{m.role}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      m.type === 'advisor'
                        ? 'bg-amber-100 text-amber-800'
                        : m.type === 'director'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {m.type === 'advisor' ? 'Advisor' : m.type === 'director' ? 'Exec Director' : 'Team Member'}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                    {m.department || 'Programs'}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'up');
                      }}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 text-gray-600 transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={index === filteredMembers.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, 'down');
                      }}
                      className="p-1 rounded hover:bg-gray-200 disabled:opacity-20 text-gray-600 transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-right whitespace-nowrap">
                  <button
                    onClick={() => {
                      setEditingMember(m);
                      setIsNew(false);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
