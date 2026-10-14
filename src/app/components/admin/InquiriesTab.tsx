import { useState } from 'react';
import {
  Inbox, Search, Mail, Phone, CheckCircle2,
  Clock, ArrowUpDown, ExternalLink,
  Building, GraduationCap, Heart, MessageSquare,
  ChevronRight, RefreshCw, X, Eye
} from 'lucide-react';
import { useInquiries, updateInquiryStatus, InquiryItem } from '../../lib/api';

type InquiryTypeFilter = 'all' | 'contact' | 'partnership' | 'volunteer' | 'internship';
type StatusFilter = 'all' | 'pending' | 'reviewed' | 'contacted' | 'rejected';

export function InquiriesTab() {
  const [typeFilter, setTypeFilter] = useState<InquiryTypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: rawInquiries = [], isLoading, mutate } = useInquiries(
    typeFilter !== 'all' ? `type=${typeFilter}` : undefined
  );

  const handleStatusChange = async (inquiry: InquiryItem, newStatus: string) => {
    try {
      setUpdatingId(inquiry.id);
      await updateInquiryStatus(inquiry.type, inquiry.originalId || inquiry.id, newStatus);
      mutate();
      if (selectedInquiry && selectedInquiry.id === inquiry.id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInquiries = rawInquiries
    .filter(item => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (typeFilter !== 'all') {
        if (typeFilter === 'partnership' && item.type !== 'partnership' && item.type !== 'partner') return false;
        if (typeFilter === 'internship' && item.type !== 'internship' && item.type !== 'intern') return false;
        if (typeFilter !== 'partnership' && typeFilter !== 'internship' && item.type !== typeFilter) return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesEmail = item.email?.toLowerCase().includes(q);
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDetails = (item.details || item.message || '')?.toLowerCase().includes(q);
        const matchesPhone = item.phone?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesTitle || matchesDetails || matchesPhone;
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  const counts = {
    all: rawInquiries.length,
    contact: rawInquiries.filter(i => i.type === 'contact').length,
    partnership: rawInquiries.filter(i => i.type === 'partnership' || i.type === 'partner').length,
    volunteer: rawInquiries.filter(i => i.type === 'volunteer').length,
    internship: rawInquiries.filter(i => i.type === 'internship' || i.type === 'intern').length,
    pending: rawInquiries.filter(i => i.status === 'pending').length,
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'contact':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <MessageSquare size={12} /> Contact Message
          </span>
        );
      case 'partnership':
      case 'partner':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Building size={12} /> Partner Inquiry
          </span>
        );
      case 'volunteer':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <Heart size={12} /> Volunteer Application
          </span>
        );
      case 'internship':
      case 'intern':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <GraduationCap size={12} /> Intern Application
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {type}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-[#E8521A]">
            <Clock size={11} /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <CheckCircle2 size={11} /> Reviewed
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={11} /> Contacted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <X size={11} /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5EE] flex items-center justify-center text-[#1A6B3C]">
              <Inbox size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Centralized Inquiry Management
              </h1>
              <p className="text-xs text-gray-500">
                Unified inbox for contact messages, partnerships, volunteers, and intern applications
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {counts.pending > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-semibold text-[#E8521A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E8521A] animate-pulse" />
              {counts.pending} Action Needed
            </div>
          )}
          <button
            onClick={() => mutate()}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh Inquiries"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs by Submission Type */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { key: 'all', label: 'All Inquiries', count: counts.all, icon: Inbox },
          { key: 'contact', label: 'Contact Messages', count: counts.contact, icon: MessageSquare },
          { key: 'partnership', label: 'Partner Inquiries', count: counts.partnership, icon: Building },
          { key: 'volunteer', label: 'Volunteers', count: counts.volunteer, icon: Heart },
          { key: 'internship', label: 'Intern Applications', count: counts.internship, icon: GraduationCap },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setTypeFilter(tab.key as InquiryTypeFilter)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              typeFilter === tab.key
                ? 'bg-[#0A3320] text-[#F0ECD8] shadow-sm'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                typeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Secondary Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="md:col-span-6 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]/20 focus:border-[#1A6B3C]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A6B3C]/20 focus:border-[#1A6B3C]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="md:col-span-3 flex gap-2">
          <button
            onClick={() => setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'))}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-700"
          >
            <ArrowUpDown size={14} />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Main Inquiries Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table / List View */}
        <div className={`${selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-gray-400">Loading submissions...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-12 text-center">
                <Inbox size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-base font-semibold text-gray-800">No submissions found</h3>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredInquiries.map(item => {
                  const isSelected = selectedInquiry?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInquiry(item)}
                      className={`p-4 transition-colors cursor-pointer hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected ? 'bg-emerald-50/40 border-l-4 border-l-[#1A6B3C]' : ''
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {getTypeBadge(item.type)}
                          {getStatusBadge(item.status)}
                          <span className="text-[11px] text-gray-400">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {item.name || 'Anonymous'}
                          </h4>
                          <span className="text-xs text-gray-400 truncate">({item.email})</span>
                        </div>

                        {item.title && (
                          <p className="text-xs font-medium text-gray-700 truncate">{item.title}</p>
                        )}

                        <p className="text-xs text-gray-500 line-clamp-1">{item.details || item.message}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInquiry(item);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-[#1A6B3C] border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-sm"
                          >
                            <Eye size={12} />
                            <span>View Details</span>
                          </button>

                          <select
                            value={item.status}
                            disabled={updatingId === item.id}
                            onClick={e => e.stopPropagation()}
                            onChange={e => handleStatusChange(item, e.target.value)}
                            className="text-xs font-semibold px-2 py-1 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1A6B3C]"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 hidden sm:block" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedInquiry && (
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6 space-y-6">
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(selectedInquiry.type)}
                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedInquiry.name}</h3>
                  <p className="text-xs text-gray-500">{selectedInquiry.email}</p>
                </div>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status Update Control */}
              <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={e => handleStatusChange(selectedInquiry, e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="contacted">Contacted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Message / Details Body */}
              <div className="space-y-4 text-xs">
                {selectedInquiry.title && (
                  <div>
                    <label className="font-semibold text-gray-700 block mb-1">Subject / Focus:</label>
                    <p className="p-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                      {selectedInquiry.title}
                    </p>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Submitted Content:</label>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {selectedInquiry.details || selectedInquiry.message || 'No additional details provided.'}
                  </div>
                </div>

                {/* Additional Metadata Fields */}
                {selectedInquiry.data && (
                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    <label className="font-semibold text-gray-700 block">Additional Details:</label>
                    {selectedInquiry.data.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone size={13} className="text-gray-400" />
                        <span>Phone: {selectedInquiry.data.phone}</span>
                      </div>
                    )}
                    {selectedInquiry.data.organizationName && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building size={13} className="text-gray-400" />
                        <span>Organization: {selectedInquiry.data.organizationName}</span>
                      </div>
                    )}
                    {selectedInquiry.data.university && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap size={13} className="text-gray-400" />
                        <span>
                          University: {selectedInquiry.data.university} ({selectedInquiry.data.department})
                        </span>
                      </div>
                    )}
                    {selectedInquiry.data.resumeUrl && (
                      <div className="pt-1">
                        <a
                          href={selectedInquiry.data.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A6B3C] hover:underline"
                        >
                          <ExternalLink size={13} /> View Attached Resume / Portfolio
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-100 pt-4 flex gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Inquiry with Youth Climate Network`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#1A6B3C] text-white hover:bg-[#14532D] transition-colors"
                >
                  <Mail size={14} /> Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
