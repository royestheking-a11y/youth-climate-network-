import { useState, useMemo } from 'react';
import {
  HelpCircle, Plus, Edit3, Trash2, X, Check,
  Search, ArrowUp, ArrowDown, CheckCircle2
} from 'lucide-react';
import { useFaqs, apiFaqs, type FaqItem } from '../../lib/api';

export function FaqTab() {
  const { data: faqs = [], mutate, isLoading } = useFaqs();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach(f => { if (f.category) set.add(f.category); });
    return ['All', ...Array.from(set)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter(f => {
        if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          f.question.toLowerCase().includes(q) ||
          (f.question_bn && f.question_bn.toLowerCase().includes(q)) ||
          f.answer.toLowerCase().includes(q) ||
          (f.answer_bn && f.answer_bn.toLowerCase().includes(q)) ||
          f.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [faqs, selectedCategory, search]);

  const blankFaq: FaqItem = {
    question: '',
    question_bn: '',
    answer: '',
    answer_bn: '',
    category: 'About YCN',
    category_bn: 'ওয়াইসিএন পরিচিতি',
    order: faqs.length + 1,
    active: true
  };

  const handleStartCreate = () => {
    setEditingFaq({ ...blankFaq, order: faqs.length + 1 });
    setIsNew(true);
    setStatusMsg(null);
  };

  const handleStartEdit = (faq: FaqItem) => {
    setEditingFaq({ ...faq });
    setIsNew(false);
    setStatusMsg(null);
  };

  const handleCancelEdit = () => {
    setEditingFaq(null);
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.answer) return;

    setSaving(true);
    try {
      if (isNew) {
        await apiFaqs.create(editingFaq);
        setStatusMsg({ text: 'Question added successfully!', type: 'success' });
      } else if (editingFaq.id || editingFaq._id) {
        const id = (editingFaq.id || editingFaq._id)!;
        await apiFaqs.update(id, editingFaq);
        setStatusMsg({ text: 'Question updated successfully!', type: 'success' });
      }
      await mutate();
      setEditingFaq(null);
      setIsNew(false);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save FAQ', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFaqs.delete(id);
      await mutate();
      setDeleteConfirmId(null);
      setStatusMsg({ text: 'Question deleted successfully', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredFaqs.length) return;

    const currentItem = filteredFaqs[index];
    const targetItem = filteredFaqs[targetIndex];

    const currentId = currentItem.id || currentItem._id;
    const targetId = targetItem.id || targetItem._id;
    if (!currentId || !targetId) return;

    const updated = [
      { id: currentId, order: targetItem.order ?? targetIndex },
      { id: targetId, order: currentItem.order ?? index }
    ];

    try {
      await apiFaqs.reorder(updated);
      await mutate();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-inter">
      {/* Toast Feedback */}
      {statusMsg && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className={statusMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'} />
            <span>{statusMsg.text}</span>
          </div>
          <button type="button" onClick={() => setStatusMsg(null)} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="bg-gradient-to-br from-[#0A3320] via-[#0E422B] to-[#1A6B3C] p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-emerald-500/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-[#E8521A] text-xs font-bold border border-emerald-500/30">
            <HelpCircle size={13} />
            <span>Homepage Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poppins text-[#F0ECD8] tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-inter">
            Curate questions and authoritative answers displayed on the YCN homepage. Features full bilingual support (English &amp; বাংলা) and automatically generates Schema.org FAQPage structured data for Google Rich Snippets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartCreate}
          className="px-5 py-3 rounded-2xl bg-[#E8521A] hover:bg-[#d44814] text-white text-xs font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2 flex-shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Question</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Questions</div>
          <div className="text-2xl font-black text-gray-900 font-poppins">{faqs.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Categories</div>
          <div className="text-2xl font-black text-[#1A6B3C] font-poppins">{categories.length - 1}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active on Home</div>
          <div className="text-2xl font-black text-[#E8521A] font-poppins">{faqs.filter(f => f.active !== false).length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Schema Status</div>
          <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 mt-1.5">
            <Check size={14} /> Ready for SEO
          </div>
        </div>
      </div>

      {/* ── EDITOR MODAL / PANEL ── */}
      {editingFaq && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center font-bold">
                <HelpCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg font-poppins">
                  {isNew ? 'Create New Question & Answer' : 'Edit Question & Answer'}
                </h3>
                <p className="text-xs text-gray-500">Provide clear and concise details in both English and Bangla.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Question in English *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.question}
                  onChange={e => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. How can I join YCN as a volunteer?"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none font-semibold text-gray-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">Category *</label>
                <input
                  type="text"
                  required
                  value={editingFaq.category}
                  onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value })}
                  placeholder="e.g. Volunteering, Programs, About YCN"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">প্রশ্ন (বাংলা - ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingFaq.question_bn || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, question_bn: e.target.value })}
                  placeholder="যেমন: আমি কীভাবে ওয়াইসিএন-এ স্বেচ্ছাসেবক হিসেবে যোগ দিতে পারি?"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700">ক্যাটাগরি (বাংলা - ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={editingFaq.category_bn || ''}
                  onChange={e => setEditingFaq({ ...editingFaq, category_bn: e.target.value })}
                  placeholder="যেমন: স্বেচ্ছাসেবক, কর্মসূচি"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">Authoritative Answer (English) *</label>
              <textarea
                required
                rows={4}
                value={editingFaq.answer}
                onChange={e => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                placeholder="Write a clear, helpful answer that visitors and search engines will find authoritative..."
                className="w-full p-3.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">বিস্তারিত উত্তর (বাংলা - ঐচ্ছিক)</label>
              <textarea
                rows={4}
                value={editingFaq.answer_bn || ''}
                onChange={e => setEditingFaq({ ...editingFaq, answer_bn: e.target.value })}
                placeholder="বাংলা ভাষায় সুস্পষ্ট ও সম্পূর্ণ উত্তর লিখুন..."
                className="w-full p-3.5 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingFaq.active !== false}
                    onChange={e => setEditingFaq({ ...editingFaq, active: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-gray-700">Display on Homepage</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-700">Display Order:</label>
                  <input
                    type="number"
                    value={editingFaq.order ?? 1}
                    onChange={e => setEditingFaq({ ...editingFaq, order: parseInt(e.target.value, 10) || 1 })}
                    className="w-16 px-2 py-1 text-xs bg-gray-50 rounded-lg border border-gray-200 text-center font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#1A6B3C] hover:bg-[#145530] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>{saving ? 'Saving...' : isNew ? 'Create FAQ' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── CONTROLS: Filter & Search ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-500 outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A6B3C] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQ LIST ACCORDION / TABLE ── */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-400 text-xs">Loading questions...</div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-3">
          <HelpCircle size={36} className="mx-auto text-gray-300" />
          <h4 className="text-base font-bold text-gray-900 font-poppins">No questions found</h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {search ? 'No questions matched your search criteria.' : 'No questions have been created yet.'}
          </p>
          <button
            type="button"
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
          >
            + Create your first question
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const id = faq.id || faq._id;
            return (
              <div
                key={id || idx}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-emerald-500/30 shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8521A]/10 text-[#E8521A] border border-[#E8521A]/20">
                          {faq.category}
                        </span>
                        {faq.active === false && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">
                            Hidden from Homepage
                          </span>
                        )}
                        {faq.question_bn && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800">
                            বাংলা উপলব্ধ
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm font-poppins group-hover:text-[#1A6B3C] transition-colors">
                        {faq.question}
                      </h4>
                      {faq.question_bn && (
                        <p className="text-xs text-gray-500 font-inter">
                          {faq.question_bn}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 font-inter leading-relaxed line-clamp-2 pt-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="flex flex-col mr-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, 'up')}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === filteredFaqs.length - 1}
                        onClick={() => handleMove(idx, 'down')}
                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(faq)}
                      className="p-2 rounded-xl text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit3 size={15} />
                    </button>
                    {deleteConfirmId === id ? (
                      <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-200">
                        <button
                          type="button"
                          onClick={() => handleDelete(id!)}
                          className="px-2 py-1 bg-red-600 text-white text-[11px] font-bold rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-1 text-gray-500 text-[11px] hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(id!)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete FAQ"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
