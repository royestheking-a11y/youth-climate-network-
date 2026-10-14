import { useState, useEffect } from 'react';
import {
  FileCode, Globe, Save,
  AlertTriangle, ExternalLink, Trash2, Sparkles
} from 'lucide-react';
import { useRobots, updateRobots, usePageSchemas, updatePageSchema, cleanDemoData } from '../../lib/api';

export function SeoTab() {
  const { data: robotsData, mutate: mutateRobots } = useRobots();
  const { data: pageSchemas = [], mutate: mutateSchemas } = usePageSchemas();

  // Robots.txt State
  const [robotsContent, setRobotsContent] = useState('');
  const [savingRobots, setSavingRobots] = useState(false);
  const [robotsMsg, setRobotsMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Schema State
  const [selectedPage, setSelectedPage] = useState<'home' | 'about' | 'programs' | 'stories' | 'contact'>('home');
  const [schemaJson, setSchemaJson] = useState('');
  const [schemaType, setSchemaType] = useState('Organization');
  const [savingSchema, setSavingSchema] = useState(false);
  const [schemaMsg, setSchemaMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Clean Demo Data State
  const [cleanModalOpen, setCleanModalOpen] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleanResult, setCleanResult] = useState<string | null>(null);

  useEffect(() => {
    if (robotsData?.content) {
      setRobotsContent(robotsData.content);
    }
  }, [robotsData]);

  useEffect(() => {
    const existing = pageSchemas.find(s => s.page === selectedPage);
    if (existing) {
      setSchemaJson(existing.structuredData);
      setSchemaType(existing.schemaType || 'Organization');
    } else {
      // Defaults based on page
      if (selectedPage === 'home') {
        setSchemaType('Organization');
        setSchemaJson(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          "name": "Youth Climate Network Bangladesh",
          "alternateName": "YCN Bangladesh",
          "url": "https://youthclimatenetwork.org",
          "logo": "https://youthclimatenetwork.org/ycnmain.png",
          "sameAs": [
            "https://facebook.com/ycnbd",
            "https://linkedin.com/company/ycnbd",
            "https://twitter.com/ycn_bd"
          ],
          "description": "Youth-led environmental and climate resilience organization empowering young changemakers across Bangladesh."
        }, null, 2));
      } else if (selectedPage === 'about') {
        setSchemaType('AboutPage');
        setSchemaJson(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Youth Climate Network Bangladesh",
          "description": "Learn about YCN leadership, advisory board, and mission for climate resilience."
        }, null, 2));
      } else if (selectedPage === 'stories') {
        setSchemaType('CollectionPage');
        setSchemaJson(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Stories, Insights & Climate Action",
          "description": "Explore youth climate impact stories and community transformations."
        }, null, 2));
      } else {
        setSchemaType('WebPage');
        setSchemaJson(JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": `YCN ${selectedPage.charAt(0).toUpperCase() + selectedPage.slice(1)}`
        }, null, 2));
      }
    }
  }, [selectedPage, pageSchemas]);

  const handleSaveRobots = async () => {
    try {
      setSavingRobots(true);
      setRobotsMsg(null);
      await updateRobots(robotsContent);
      mutateRobots();
      setRobotsMsg({ text: 'robots.txt updated and synced successfully!', type: 'success' });
    } catch (err: any) {
      setRobotsMsg({ text: err.message || 'Failed to update robots.txt', type: 'error' });
    } finally {
      setSavingRobots(false);
    }
  };

  const handleSaveSchema = async () => {
    try {
      setSavingSchema(true);
      setSchemaMsg(null);
      // Validate JSON syntax
      JSON.parse(schemaJson);

      await updatePageSchema(selectedPage, schemaJson, schemaType);
      mutateSchemas();
      setSchemaMsg({ text: `Structured data for ${selectedPage} saved!`, type: 'success' });
    } catch (err: any) {
      setSchemaMsg({ text: `Invalid JSON syntax: ${err.message}`, type: 'error' });
    } finally {
      setSavingSchema(false);
    }
  };

  const handleCleanDemoData = async () => {
    try {
      setCleaning(true);
      const res = await cleanDemoData();
      setCleanResult(`Demo cleanup complete! Removed ${res.deletedCount || 0} dummy records without affecting live data.`);
      mutateSchemas();
      mutateRobots();
    } catch (err: any) {
      alert(`Cleanup failed: ${err.message}`);
    } finally {
      setCleaning(false);
      setCleanModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
            <Globe size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
              SEO, Robots.txt & Schema Markup
            </h1>
            <p className="text-xs text-gray-500">
              Manage search engine crawler directives, rich structured data (JSON-LD), and clean demo records
            </p>
          </div>
        </div>

        <button
          onClick={() => setCleanModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <Trash2 size={13} /> Clean Demo Data
        </button>
      </div>

      {cleanResult && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          {cleanResult}
        </div>
      )}

      {/* Section 1: robots.txt Editor */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <FileCode size={18} className="text-emerald-700" />
            <h3 className="font-bold text-gray-900 text-sm">Robots.txt Directive Manager</h3>
          </div>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
          >
            <ExternalLink size={12} /> View Live robots.txt
          </a>
        </div>

        <p className="text-xs text-gray-500">
          Configure which search engine spiders are permitted or disallowed from crawling specific directory paths.
        </p>

        {robotsMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              robotsMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {robotsMsg.text}
          </div>
        )}

        <textarea
          rows={8}
          value={robotsContent}
          onChange={e => setRobotsContent(e.target.value)}
          className="w-full font-mono text-xs p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none leading-relaxed"
          placeholder="User-agent: *&#10;Disallow: /admin/&#10;Disallow: /api/&#10;Allow: /&#10;Sitemap: https://youthclimatenetwork.org/sitemap.xml"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSaveRobots}
            disabled={savingRobots}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm disabled:opacity-50"
          >
            <Save size={14} />
            {savingRobots ? 'Saving robots.txt...' : 'Save & Publish robots.txt'}
          </button>
        </div>
      </div>

      {/* Section 2: Structured Data (Schema Markup) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-600" />
            <h3 className="font-bold text-gray-900 text-sm">Page Schema Markup (JSON-LD)</h3>
          </div>
          <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-semibold">
            Google Rich Results & AEO
          </span>
        </div>

        <p className="text-xs text-gray-500">
          Configure structured data schema per page to improve search result rich snippets, knowledge graph cards, and generative AI answer engine discoverability.
        </p>

        {/* Page selector pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(['home', 'about', 'programs', 'stories', 'contact'] as const).map(p => (
            <button
              key={p}
              onClick={() => setSelectedPage(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedPage === p
                  ? 'bg-[#1A6B3C] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p} Page
            </button>
          ))}
        </div>

        {schemaMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              schemaMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {schemaMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Primary Schema Type</label>
            <input
              type="text"
              value={schemaType}
              onChange={e => setSchemaType(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white"
              placeholder="E.g. Organization, AboutPage, Article"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            JSON-LD Structured Data Object:
          </label>
          <textarea
            rows={12}
            value={schemaJson}
            onChange={e => setSchemaJson(e.target.value)}
            className="w-full font-mono text-xs p-4 bg-gray-900 text-emerald-300 rounded-xl focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveSchema}
            disabled={savingSchema}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#0A3320] text-[#F0ECD8] hover:bg-[#1A6B3C] shadow-sm disabled:opacity-50"
          >
            <Save size={14} />
            {savingSchema ? 'Saving Schema...' : `Save Schema for ${selectedPage}`}
          </button>
        </div>
      </div>

      {/* Clean Demo Data Confirmation Modal */}
      {cleanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Clean Demo & Placeholder Data</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              This action will identify and remove dummy test records, sample placeholder applications, and test inquiries from the database. Real user submissions and approved content will be preserved.
            </p>

            <div className="flex gap-2 pt-3">
              <button
                onClick={() => setCleanModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCleanDemoData}
                disabled={cleaning}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                {cleaning ? 'Cleaning...' : 'Confirm Clean Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
