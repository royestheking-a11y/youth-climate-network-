import React, { useState } from 'react';
import {
  Scale, Globe, FileText, Plus, Edit2, Trash2,
  Calendar, CheckCircle, AlertCircle, Upload, Loader2,
  ExternalLink, Star
} from 'lucide-react';
import {
  useAdvocacy, apiAdvocacy, AdvocacyItem,
  useCopHistory, apiCopHistory, CopHistoryItem,
  usePolicyPositions, apiPolicyPositions, PolicyPositionItem,
  uploadFile
} from '../../lib/api';

type SubSection = 'publications' | 'cop' | 'positions';

export function AdvocacyTab() {
  const [subSection, setSubSection] = useState<SubSection>('publications');

  // Publications / Papers
  const { data: publications = [], mutate: mutatePubs } = useAdvocacy();
  const [editingPub, setEditingPub] = useState<AdvocacyItem | null>(null);
  const [isNewPub, setIsNewPub] = useState(false);
  const [pubFilter, setPubFilter] = useState('all');

  // COP History
  const { data: copItems = [], mutate: mutateCop } = useCopHistory();
  const [editingCop, setEditingCop] = useState<CopHistoryItem | null>(null);
  const [isNewCop, setIsNewCop] = useState(false);

  // Policy Positions
  const { data: positions = [], mutate: mutatePositions } = usePolicyPositions();
  const [editingPos, setEditingPos] = useState<PolicyPositionItem | null>(null);
  const [isNewPos, setIsNewPos] = useState(false);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 3500);
  };

  /* ── 1. PUBLICATION HANDLERS ── */
  const blankPub: AdvocacyItem = {
    id: '',
    title: '',
    title_bn: '',
    type: 'position-paper',
    date: new Date().toISOString().split('T')[0],
    summary: '',
    summary_bn: '',
    pdfUrl: '',
    featured: false,
    order: publications.length + 1
  };

  const handleSavePub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPub?.title.trim()) return showMsg('Title is required', 'error');
    setIsSubmitting(true);
    try {
      if (isNewPub) {
        await apiAdvocacy.create(editingPub);
        showMsg('Advocacy publication added successfully');
      } else {
        await apiAdvocacy.update(editingPub.id || (editingPub as any)._id, editingPub);
        showMsg('Advocacy publication updated successfully');
      }
      mutatePubs();
      setEditingPub(null);
    } catch (err: any) {
      showMsg(err.message || 'Failed to save publication', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePub = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;
    try {
      await apiAdvocacy.delete(id);
      mutatePubs();
      showMsg('Publication deleted');
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete publication', 'error');
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPub) return;
    setUploadingPdf(true);
    try {
      const url = await uploadFile(file);
      setEditingPub({ ...editingPub, pdfUrl: url });
      showMsg('PDF document uploaded successfully');
    } catch (err: any) {
      showMsg(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingPdf(false);
    }
  };

  /* ── 2. COP HISTORY HANDLERS ── */
  const blankCop: CopHistoryItem = {
    event: '',
    event_bn: '',
    year: '2024',
    role: 'Official Delegation',
    role_bn: 'অফিসিয়াল প্রতিনিধি দল',
    outcome: '',
    outcome_bn: '',
    highlight: false,
    order: copItems.length + 1
  };

  const handleSaveCop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCop?.event.trim()) return showMsg('Event name is required', 'error');
    setIsSubmitting(true);
    try {
      if (isNewCop) {
        await apiCopHistory.create(editingCop);
        showMsg('COP negotiation engagement added');
      } else {
        await apiCopHistory.update(editingCop.id || (editingCop as any)._id, editingCop);
        showMsg('COP negotiation updated');
      }
      mutateCop();
      setEditingCop(null);
    } catch (err: any) {
      showMsg(err.message || 'Failed to save COP item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this COP negotiation item?')) return;
    try {
      await apiCopHistory.delete(id);
      mutateCop();
      showMsg('COP item deleted');
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete', 'error');
    }
  };

  /* ── 3. POLICY POSITIONS HANDLERS ── */
  const blankPos: PolicyPositionItem = {
    title: '',
    title_bn: '',
    desc: '',
    desc_bn: '',
    order: positions.length + 1
  };

  const handleSavePos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPos?.title.trim()) return showMsg('Position title is required', 'error');
    setIsSubmitting(true);
    try {
      if (isNewPos) {
        await apiPolicyPositions.create(editingPos);
        showMsg('Policy Position added');
      } else {
        await apiPolicyPositions.update(editingPos.id || (editingPos as any)._id, editingPos);
        showMsg('Policy Position updated');
      }
      mutatePositions();
      setEditingPos(null);
    } catch (err: any) {
      showMsg(err.message || 'Failed to save position', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePos = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Policy Position?')) return;
    try {
      await apiPolicyPositions.delete(id);
      mutatePositions();
      showMsg('Position deleted');
    } catch (err: any) {
      showMsg(err.message || 'Failed to delete', 'error');
    }
  };

  const filteredPubs = pubFilter === 'all'
    ? publications
    : publications.filter(p => p.type === pubFilter);

  const typeBadges: Record<string, { label: string; bg: string; color: string }> = {
    'position-paper': { label: 'Position Paper', bg: '#E8F5EE', color: '#1A6B3C' },
    'statement': { label: 'Statement', bg: '#FFF3EE', color: '#E8521A' },
    'press-release': { label: 'Press Release', bg: '#E0F7FA', color: '#0E7490' },
    'report': { label: 'Report', bg: '#FFF8E1', color: '#D97706' },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2 backdrop-blur-md">
              <Scale size={14} className="text-[#E8521A]" />
              Policy & Advocacy Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-poppins">
              Advocacy, COP Delegations & Policy Stances
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-inter mt-1 max-w-2xl">
              Control all position papers, press statements, COP summit timelines, and core policy demands shown on the public Advocacy page.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {subSection === 'publications' && (
              <button
                onClick={() => { setEditingPub({ ...blankPub }); setIsNewPub(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8521A] text-white text-xs font-semibold hover:bg-[#d4430e] transition-all shadow-sm"
              >
                <Plus size={15} /> Add Publication
              </button>
            )}
            {subSection === 'cop' && (
              <button
                onClick={() => { setEditingCop({ ...blankCop }); setIsNewCop(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8521A] text-white text-xs font-semibold hover:bg-[#d4430e] transition-all shadow-sm"
              >
                <Plus size={15} /> Add COP Negotiation
              </button>
            )}
            {subSection === 'positions' && (
              <button
                onClick={() => { setEditingPos({ ...blankPos }); setIsNewPos(true); }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E8521A] text-white text-xs font-semibold hover:bg-[#d4430e] transition-all shadow-sm"
              >
                <Plus size={15} /> Add Policy Demand
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {statusMsg.type === 'success' ? <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" /> : <AlertCircle size={16} className="text-red-600 flex-shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setSubSection('publications')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${subSection === 'publications' ? 'border-[#1A6B3C] text-[#1A6B3C]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <FileText size={16} />
          <span>Publications & Statements ({publications.length})</span>
        </button>

        <button
          onClick={() => setSubSection('cop')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${subSection === 'cop' ? 'border-[#1A6B3C] text-[#1A6B3C]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Globe size={16} />
          <span>COP & International Summits ({copItems.length})</span>
        </button>

        <button
          onClick={() => setSubSection('positions')}
          className={`pb-3 text-xs sm:text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${subSection === 'positions' ? 'border-[#1A6B3C] text-[#1A6B3C]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Scale size={16} />
          <span>Policy Demands & Stances ({positions.length})</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════
          SUB-SECTION 1: PUBLICATIONS & STATEMENTS
      ══════════════════════════════════════════ */}
      {subSection === 'publications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              {['all', 'position-paper', 'statement', 'press-release', 'report'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setPubFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${pubFilter === cat ? 'bg-[#0A3320] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat === 'all' ? 'All Publications' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-inter">Showing {filteredPubs.length} items</span>
          </div>

          <div className="space-y-3">
            {filteredPubs.map(pub => {
              const badge = typeBadges[pub.type] || { label: pub.type, bg: '#F3F4F6', color: '#374151' };
              return (
                <div
                  key={pub.id || (pub as any)._id}
                  className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: badge.bg, color: badge.color }}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs text-gray-400 font-inter flex items-center gap-1">
                        <Calendar size={12} /> {pub.date}
                      </span>
                      {pub.featured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                          <Star size={10} className="fill-amber-500 text-amber-500" /> Featured
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-gray-900 font-poppins text-sm leading-snug">
                      {pub.title}
                    </h4>
                    {pub.title_bn && (
                      <p className="text-xs text-gray-500 font-bengali">{pub.title_bn}</p>
                    )}
                    <p className="text-xs text-gray-600 font-inter line-clamp-2 max-w-3xl">
                      {pub.summary}
                    </p>

                    {pub.pdfUrl && (
                      <div className="pt-1">
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1A6B3C] hover:underline"
                        >
                          <FileText size={12} /> View Attached PDF <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <button
                      onClick={() => { setEditingPub({ ...pub }); setIsNewPub(false); }}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-[#1A6B3C]/10 text-gray-600 hover:text-[#1A6B3C] transition-all"
                      title="Edit Publication"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeletePub(pub.id || (pub as any)._id)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                      title="Delete Publication"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredPubs.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">No publications found</p>
                <p className="text-xs text-gray-400 mt-1">Add your first policy paper or statement above</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SUB-SECTION 2: COP & CLIMATE SUMMITS
      ══════════════════════════════════════════ */}
      {subSection === 'cop' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-inter">
            These entries appear in the "Climate Negotiations Participation" section on the Advocacy page.
          </p>

          <div className="space-y-3">
            {copItems.map(item => (
              <div
                key={item.id || (item as any)._id}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="w-12 h-10 rounded-lg bg-[#E8F5EE] text-[#1A6B3C] font-bold text-xs flex items-center justify-center font-poppins">
                      {item.year}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 font-poppins text-sm leading-snug">
                        {item.event}
                      </h4>
                      {item.event_bn && <p className="text-xs text-gray-500 font-bengali">{item.event_bn}</p>}
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {item.role}
                    </span>
                    {item.highlight && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8521A] text-white">
                        Most Recent / Highlight
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-600 font-inter leading-relaxed max-w-3xl">
                    {item.outcome}
                  </p>
                  {item.outcome_bn && (
                    <p className="text-xs text-gray-500 font-bengali leading-relaxed max-w-3xl">
                      {item.outcome_bn}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => { setEditingCop({ ...item }); setIsNewCop(false); }}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-[#1A6B3C]/10 text-gray-600 hover:text-[#1A6B3C] transition-all"
                    title="Edit Negotiation"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteCop(item.id || (item as any)._id)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                    title="Delete Negotiation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            {copItems.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <Globe size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">No COP negotiations listed</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          SUB-SECTION 3: POLICY DEMANDS & STANCES
      ══════════════════════════════════════════ */}
      {subSection === 'positions' && (
        <div className="space-y-4">
          <p className="text-xs text-gray-500 font-inter">
            These cards appear in the "Our Policy Positions" grid on the Advocacy page.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.map((pos, idx) => (
              <div
                key={pos.id || (pos as any)._id}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between border-l-4 border-l-[#E8521A]"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-[#0A3320] text-[#E8521A] text-xs font-bold flex items-center justify-center font-poppins">
                      {pos.order || idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditingPos({ ...pos }); setIsNewPos(false); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-[#1A6B3C]"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeletePos(pos.id || (pos as any)._id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 font-poppins text-sm leading-snug">
                    {pos.title}
                  </h4>
                  {pos.title_bn && <p className="text-xs text-gray-500 font-bengali">{pos.title_bn}</p>}
                  <p className="text-xs text-gray-600 font-inter leading-relaxed line-clamp-4">
                    {pos.desc}
                  </p>
                </div>
              </div>
            ))}

            {positions.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                <Scale size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-600">No policy positions defined</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: EDIT / ADD PUBLICATION
      ══════════════════════════════════════════ */}
      {editingPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-inter">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 font-poppins text-base">
                {isNewPub ? 'Add Advocacy Publication' : 'Edit Advocacy Publication'}
              </h3>
              <button onClick={() => setEditingPub(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePub} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Type *</label>
                  <select
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                    value={editingPub.type}
                    onChange={e => setEditingPub({ ...editingPub, type: e.target.value as any })}
                    required
                  >
                    <option value="position-paper">Position Paper</option>
                    <option value="statement">Statement</option>
                    <option value="press-release">Press Release</option>
                    <option value="report">Report</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Publication Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                    value={editingPub.date}
                    onChange={e => setEditingPub({ ...editingPub, date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Title (English) *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="e.g. Bangladesh Youth Climate Position Paper — COP29"
                  value={editingPub.title}
                  onChange={e => setEditingPub({ ...editingPub, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Document Title (Bengali)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="উদাঃ বাংলাদেশ যুব জলবায়ু অবস্থানপত্র — কপ-২৯"
                  value={editingPub.title_bn || ''}
                  onChange={e => setEditingPub({ ...editingPub, title_bn: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Executive Summary (English) *</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="Summary of this advocacy position paper or statement..."
                  value={editingPub.summary}
                  onChange={e => setEditingPub({ ...editingPub, summary: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Executive Summary (Bengali)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="বাংলায় সারাংশ..."
                  value={editingPub.summary_bn || ''}
                  onChange={e => setEditingPub({ ...editingPub, summary_bn: e.target.value })}
                />
              </div>

              {/* PDF Document Upload */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">PDF Document File / URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                    placeholder="https://... or upload PDF below"
                    value={editingPub.pdfUrl || ''}
                    onChange={e => setEditingPub({ ...editingPub, pdfUrl: e.target.value })}
                  />
                  <label className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold cursor-pointer flex items-center gap-1.5 flex-shrink-0 transition-all">
                    {uploadingPdf ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{uploadingPdf ? 'Uploading...' : 'Upload PDF'}</span>
                    <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} disabled={uploadingPdf} />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#1A6B3C] focus:ring-[#1A6B3C]"
                    checked={editingPub.featured || false}
                    onChange={e => setEditingPub({ ...editingPub, featured: e.target.checked })}
                  />
                  <span>Mark as Featured Publication</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Display Order:</span>
                  <input
                    type="number"
                    className="w-16 px-2 py-1 rounded border border-gray-200 text-center"
                    value={editingPub.order || 0}
                    onChange={e => setEditingPub({ ...editingPub, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPub(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0A3320] text-white hover:bg-[#13532e] font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  <span>Save Publication</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: EDIT / ADD COP HISTORY
      ══════════════════════════════════════════ */}
      {editingCop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-inter">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 font-poppins text-base">
                {isNewCop ? 'Add COP Negotiation Engagement' : 'Edit COP Negotiation Engagement'}
              </h3>
              <button onClick={() => setEditingCop(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveCop} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Year *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                    placeholder="e.g. 2024 or ২০২৪"
                    value={editingCop.year}
                    onChange={e => setEditingCop({ ...editingCop, year: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Role / Capacity *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                    placeholder="e.g. Official Delegation"
                    value={editingCop.role}
                    onChange={e => setEditingCop({ ...editingCop, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event Name (English) *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="e.g. COP29 — Baku, Azerbaijan"
                  value={editingCop.event}
                  onChange={e => setEditingCop({ ...editingCop, event: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Event Name (Bengali)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="উদাঃ কপ-২৯ — বাকু, আজারবাইজান"
                  value={editingCop.event_bn || ''}
                  onChange={e => setEditingCop({ ...editingCop, event_bn: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Outcome & Actions (English) *</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="What was achieved, presented, or negotiated at this event?"
                  value={editingCop.outcome}
                  onChange={e => setEditingCop({ ...editingCop, outcome: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Outcome & Actions (Bengali)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="বাংলায় ফলাফল ও অর্জনের বিবরণ..."
                  value={editingCop.outcome_bn || ''}
                  onChange={e => setEditingCop({ ...editingCop, outcome_bn: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#1A6B3C] focus:ring-[#1A6B3C]"
                    checked={editingCop.highlight || false}
                    onChange={e => setEditingCop({ ...editingCop, highlight: e.target.checked })}
                  />
                  <span>Highlight (Dark Green Card Banner)</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700">Order:</span>
                  <input
                    type="number"
                    className="w-16 px-2 py-1 rounded border border-gray-200 text-center"
                    value={editingCop.order || 0}
                    onChange={e => setEditingCop({ ...editingCop, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingCop(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0A3320] text-white hover:bg-[#13532e] font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  <span>Save Engagement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          MODAL: EDIT / ADD POLICY POSITION
      ══════════════════════════════════════════ */}
      {editingPos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-inter">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 font-poppins text-base">
                {isNewPos ? 'Add Policy Position & Demand' : 'Edit Policy Position & Demand'}
              </h3>
              <button onClick={() => setEditingPos(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePos} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Position / Demand Title (English) *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="e.g. Loss & Damage Finance"
                  value={editingPos.title}
                  onChange={e => setEditingPos({ ...editingPos, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Position / Demand Title (Bengali)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="উদাঃ ক্ষয়ক্ষতি ও ক্ষতিপূরণ তহবিল"
                  value={editingPos.title_bn || ''}
                  onChange={e => setEditingPos({ ...editingPos, title_bn: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Core Demand Details (English) *</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="Clear description of our policy stance and demands from world leaders..."
                  value={editingPos.desc}
                  onChange={e => setEditingPos({ ...editingPos, desc: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Core Demand Details (Bengali)</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-[#1A6B3C]"
                  placeholder="বাংলায় বিস্তারিত অবস্থান ও নীতিগত দাবি..."
                  value={editingPos.desc_bn || ''}
                  onChange={e => setEditingPos({ ...editingPos, desc_bn: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <span className="font-semibold text-gray-700">Display Order Number:</span>
                <input
                  type="number"
                  className="w-20 px-2 py-1 rounded border border-gray-200 text-center font-bold"
                  value={editingPos.order || 0}
                  onChange={e => setEditingPos({ ...editingPos, order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingPos(null)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#0A3320] text-white hover:bg-[#13532e] font-semibold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  <span>Save Position</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
