import { useState } from 'react';
import {
  Plus, Edit3, Trash2, X
} from 'lucide-react';
import { useAuthors, apiAuthors, AuthorItem, uploadFile } from '../../lib/api';

export function AuthorsTab() {
  const { data: authors = [], mutate } = useAuthors();
  const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const blankAuthor: AuthorItem = {
    id: '',
    name: '',
    role: '',
    bio: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: '',
    twitter: '',
    linkedin: '',
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && editingAuthor) {
      try {
        setUploadingAvatar(true);
        const url = await uploadFile(e.target.files[0]);
        setEditingAuthor({ ...editingAuthor, avatar: url });
      } catch (err) {
        alert('Avatar upload failed');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor) return;

    try {
      setSaving(true);
      setStatusMsg(null);
      if (isNew) {
        await apiAuthors.create(editingAuthor);
      } else {
        await apiAuthors.update(editingAuthor.id, editingAuthor);
      }
      mutate();
      setEditingAuthor(null);
      setIsNew(false);
      setStatusMsg({ text: 'Author profile saved successfully!', type: 'success' });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save author', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this author profile?')) return;
    try {
      await apiAuthors.delete(id);
      mutate();
      setStatusMsg({ text: 'Author deleted', type: 'success' });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Blog Author Profiles</h3>
          <p className="text-xs text-gray-500">Manage writers and researchers credited on published articles</p>
        </div>
        <button
          onClick={() => {
            setEditingAuthor(blankAuthor);
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C]"
        >
          <Plus size={14} /> Add Author
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Editor Modal */}
      {editingAuthor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {isNew ? 'Create Author Profile' : 'Edit Author Profile'}
              </h3>
              <button
                onClick={() => {
                  setEditingAuthor(null);
                  setIsNew(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={editingAuthor.avatar || '/placeholder.png'}
                  alt={editingAuthor.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">Avatar Image</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingAuthor.avatar || ''}
                      onChange={e => setEditingAuthor({ ...editingAuthor, avatar: e.target.value })}
                      placeholder="Paste image URL..."
                      className="flex-1 px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                    />
                    <label className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg">
                      <span>{uploadingAvatar ? '...' : 'Upload'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingAuthor.name}
                  onChange={e => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="E.g., Sadia Islam"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editingAuthor.role}
                  onChange={e => setEditingAuthor({ ...editingAuthor, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="E.g., Program Officer, YCN Bangladesh"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={editingAuthor.bio || ''}
                  onChange={e => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                  placeholder="Brief author bio..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingAuthor.email || ''}
                    onChange={e => setEditingAuthor({ ...editingAuthor, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="author@ycn.org"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={editingAuthor.linkedin || ''}
                    onChange={e => setEditingAuthor({ ...editingAuthor, linkedin: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Twitter / X</label>
                  <input
                    type="url"
                    value={editingAuthor.twitter || ''}
                    onChange={e => setEditingAuthor({ ...editingAuthor, twitter: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg"
                    placeholder="https://x.com/..."
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setEditingAuthor(null);
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
                  {saving ? 'Saving...' : 'Save Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Authors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(author => (
          <div key={author.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-3.5">
            <img
              src={author.avatar || '/placeholder.png'}
              alt={author.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-gray-900 truncate">{author.name}</h4>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingAuthor(author);
                      setIsNew(false);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(author.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <p className="text-xs font-medium text-emerald-800 truncate">{author.role}</p>
              {author.bio && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{author.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
