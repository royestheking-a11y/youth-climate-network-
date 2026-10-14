import { useState } from 'react';
import {
  FileText, Plus, Edit3, Trash2, X, Eye, Upload,
  Download, User
} from 'lucide-react';
import {
  useImpactReports, apiImpactReports, type ImpactReport,
  useCaseStudies, apiCaseStudies, type CaseStudy, uploadFile
} from '../../lib/api';

export function ImpactReportsTab() {
  const { data: reports = [], mutate: mutateReports } = useImpactReports();
  const { data: caseStudies = [], mutate: mutateCaseStudies } = useCaseStudies();

  const [activeSubTab, setActiveSubTab] = useState<'reports' | 'casestudies'>('reports');

  // Report State
  const [editingReport, setEditingReport] = useState<ImpactReport | null>(null);
  const [isNewReport, setIsNewReport] = useState(false);
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);

  // Case Study State
  const [editingCase, setEditingCase] = useState<CaseStudy | null>(null);
  const [isNewCase, setIsNewCase] = useState(false);
  const [deleteCaseId, setDeleteCaseId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const blankReport: ImpactReport = {
    title: '',
    title_bn: '',
    date: 'January 2025',
    pages: '32',
    type: 'Annual Report',
    fileUrl: '',
    order: reports.length + 1
  };

  const blankCase: CaseStudy = {
    name: '',
    name_bn: '',
    location: 'Age 25 · Khulna',
    location_bn: 'বয়স ২৫ · খুলনা',
    program: 'Climate Action',
    program_bn: 'জলবায়ু পদক্ষেপ',
    story: '',
    story_bn: '',
    impact: 'Community Resilience',
    impact_bn: 'সামাজিক স্থিতিস্থাপকতা',
    image: '',
    color: '#0A3320',
    bg: '#E8F5EE',
    order: caseStudies.length + 1
  };

  // REPORT HANDLERS
  const saveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      if (isNewReport) {
        await apiImpactReports.create(editingReport);
      } else {
        await apiImpactReports.update(editingReport.id!, editingReport);
      }
      await mutateReports();
      setEditingReport(null);
      setIsNewReport(false);
      setStatusMsg({ text: 'Report saved successfully!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save report', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteReport = async (id: string) => {
    try {
      await apiImpactReports.delete(id);
      await mutateReports();
      setDeleteReportId(null);
    } catch (err: any) {
      alert('Failed to delete report: ' + err.message);
    }
  };

  // CASE STUDY HANDLERS
  const saveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    setSaving(true);
    setStatusMsg(null);
    try {
      if (isNewCase) {
        await apiCaseStudies.create(editingCase);
      } else {
        await apiCaseStudies.update(editingCase.id!, editingCase);
      }
      await mutateCaseStudies();
      setEditingCase(null);
      setIsNewCase(false);
      setStatusMsg({ text: 'Case study saved successfully!', type: 'success' });
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'Failed to save case study', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const deleteCase = async (id: string) => {
    try {
      await apiCaseStudies.delete(id);
      await mutateCaseStudies();
      setDeleteCaseId(null);
    } catch (err: any) {
      alert('Failed to delete case study: ' + err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'fileUrl' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (field === 'fileUrl' && editingReport) {
        setEditingReport({ ...editingReport, fileUrl: url });
      } else if (field === 'image' && editingCase) {
        setEditingCase({ ...editingCase, image: url });
      }
    } catch (err: any) {
      alert('File upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1A6B3C] flex items-center justify-center">
              <FileText size={20} />
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 font-poppins">Impact Reports & Frontline Stories</h2>
          </div>
          <p className="text-xs text-gray-500 font-inter max-w-xl">
            Manage downloadable Annual Reports, assessments, and community "Voices from the Frontline" case studies displayed on the Impact page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/impact"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-all"
          >
            <Eye size={14} /> Preview /impact
          </a>
          {activeSubTab === 'reports' ? (
            <button
              onClick={() => { setEditingReport(blankReport); setIsNewReport(true); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={15} /> Add New Report
            </button>
          ) : (
            <button
              onClick={() => { setEditingCase(blankCase); setIsNewCase(true); }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A3320] to-[#1A6B3C] text-white text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={15} /> Add Frontline Story
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          {statusMsg.text}
        </div>
      )}

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'reports'
              ? 'bg-[#0A3320] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText size={15} />
          <span>Annual & Research Reports ({reports.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('casestudies')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeSubTab === 'casestudies'
              ? 'bg-[#0A3320] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <User size={15} />
          <span>Voices from the Frontline ({caseStudies.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: REPORTS */}
      {activeSubTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#1A6B3C]">
                      {report.type}
                    </span>
                    <span className="text-xs text-gray-400 font-inter font-medium">{report.date}</span>
                  </div>

                  <h3 className="font-bold text-sm text-gray-900 font-poppins mb-1.5 leading-snug">
                    {report.title}
                  </h3>
                  {report.title_bn && (
                    <p className="text-xs text-gray-500 font-inter mb-3 line-clamp-1">
                      {report.title_bn}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <span className="font-semibold">{report.pages} Pages</span>
                    {report.fileUrl && (
                      <span className="inline-flex items-center gap-1 text-[#1A6B3C] font-medium">
                        · <Download size={12} /> File Attached
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setEditingReport(report); setIsNewReport(false); }}
                      className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteReportId(report.id!)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  {report.fileUrl && (
                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#E8521A] hover:underline flex items-center gap-1"
                    >
                      <Download size={13} /> View File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: CASE STUDIES */}
      {activeSubTab === 'casestudies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {caseStudies.map((cs) => (
              <div
                key={cs.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    {cs.image ? (
                      <img src={cs.image} alt={cs.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={32} />
                      </div>
                    )}
                    <span
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow"
                      style={{ backgroundColor: cs.color || '#0A3320' }}
                    >
                      {cs.program}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base text-gray-900 font-poppins mb-0.5">
                      {cs.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-inter mb-3">
                      {cs.location}
                    </p>
                    <p className="text-xs text-gray-600 font-inter line-clamp-3 leading-relaxed mb-4">
                      "{cs.story}"
                    </p>
                    <div className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700">
                      {cs.impact}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-inter font-medium">Order: #{cs.order || 1}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setEditingCase(cs); setIsNewCase(false); }}
                      className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm transition-all"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteCaseId(cs.id!)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-white hover:shadow-sm transition-all"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT REPORT MODAL */}
      {editingReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-base font-bold text-gray-900 font-poppins">
                {isNewReport ? 'Add New Impact Report' : 'Edit Impact Report'}
              </h3>
              <button onClick={() => setEditingReport(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveReport} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Report Title (English) *</label>
                <input
                  type="text"
                  required
                  value={editingReport.title}
                  onChange={e => setEditingReport({ ...editingReport, title: e.target.value })}
                  placeholder="YCN Annual Report 2024"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Report Title (বাংলা)</label>
                <input
                  type="text"
                  value={editingReport.title_bn || ''}
                  onChange={e => setEditingReport({ ...editingReport, title_bn: e.target.value })}
                  placeholder="ওয়াইসিএন বার্ষিক প্রতিবেদন ২০২৪"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#1A6B3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Publication Date</label>
                  <input
                    type="text"
                    value={editingReport.date}
                    onChange={e => setEditingReport({ ...editingReport, date: e.target.value })}
                    placeholder="January 2025"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pages Count</label>
                  <input
                    type="text"
                    value={editingReport.pages}
                    onChange={e => setEditingReport({ ...editingReport, pages: e.target.value })}
                    placeholder="48"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Report Type</label>
                <select
                  value={editingReport.type}
                  onChange={e => setEditingReport({ ...editingReport, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                >
                  <option value="Annual Report">Annual Report</option>
                  <option value="Research Report">Research Report</option>
                  <option value="Program Report">Program Report</option>
                  <option value="Evaluation">Evaluation</option>
                  <option value="Field Report">Field Report</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">PDF or Document File URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingReport.fileUrl || ''}
                    onChange={e => setEditingReport({ ...editingReport, fileUrl: e.target.value })}
                    placeholder="https://... or /reports/file.pdf"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'fileUrl')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReport(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0A3320] text-white text-xs font-bold hover:bg-[#13532e] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CASE STUDY MODAL */}
      {editingCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-base font-bold text-gray-900 font-poppins">
                {isNewCase ? 'Add Frontline Story / Case Study' : 'Edit Frontline Story'}
              </h3>
              <button onClick={() => setEditingCase(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveCase} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Person Name (EN) *</label>
                  <input
                    type="text"
                    required
                    value={editingCase.name}
                    onChange={e => setEditingCase({ ...editingCase, name: e.target.value })}
                    placeholder="Azim Kha"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Person Name (বাংলা)</label>
                  <input
                    type="text"
                    value={editingCase.name_bn || ''}
                    onChange={e => setEditingCase({ ...editingCase, name_bn: e.target.value })}
                    placeholder="আজিম খাঁ"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age & Location (EN)</label>
                  <input
                    type="text"
                    value={editingCase.location}
                    onChange={e => setEditingCase({ ...editingCase, location: e.target.value })}
                    placeholder="Age 26 · Paikgaca, Khulna"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age & Location (বাংলা)</label>
                  <input
                    type="text"
                    value={editingCase.location_bn || ''}
                    onChange={e => setEditingCase({ ...editingCase, location_bn: e.target.value })}
                    placeholder="বয়স ২৬ · পাইকগাছা, খুলনা"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Program Theme (EN)</label>
                  <input
                    type="text"
                    value={editingCase.program}
                    onChange={e => setEditingCase({ ...editingCase, program: e.target.value })}
                    placeholder="Climate Action"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Impact Badge (EN)</label>
                  <input
                    type="text"
                    value={editingCase.impact}
                    onChange={e => setEditingCase({ ...editingCase, impact: e.target.value })}
                    placeholder="Community Resilience"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Story / Testimonial (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={editingCase.story}
                  onChange={e => setEditingCase({ ...editingCase, story: e.target.value })}
                  placeholder="A frontline climate activist working to protect his community..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Story / Testimonial (বাংলা)</label>
                <textarea
                  rows={3}
                  value={editingCase.story_bn || ''}
                  onChange={e => setEditingCase({ ...editingCase, story_bn: e.target.value })}
                  placeholder="পাইকগাছায় উপকূলীয় লবণাক্ততা এবং চরম আবহাওয়া..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Photo Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingCase.image || ''}
                    onChange={e => setEditingCase({ ...editingCase, image: e.target.value })}
                    placeholder="https://... or /voice_frontline/name.jpg"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={14} />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'image')} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#0A3320] text-white text-xs font-bold hover:bg-[#13532e] transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE DIALOGS */}
      {deleteReportId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-bold text-base text-gray-900">Delete Report?</h3>
            <p className="text-xs text-gray-500">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => setDeleteReportId(null)} className="px-4 py-2 rounded-xl border text-xs font-semibold">Cancel</button>
              <button onClick={() => deleteReport(deleteReportId)} className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {deleteCaseId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-bold text-base text-gray-900">Delete Case Study?</h3>
            <p className="text-xs text-gray-500">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3 justify-center pt-2">
              <button onClick={() => setDeleteCaseId(null)} className="px-4 py-2 rounded-xl border text-xs font-semibold">Cancel</button>
              <button onClick={() => deleteCase(deleteCaseId)} className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
