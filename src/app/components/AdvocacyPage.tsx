import { useState } from 'react';
import { SEO } from './ui/SEO';
import { Scale, FileText, Megaphone, Globe, ArrowRight, Download, Calendar } from 'lucide-react';
import { getAdvocacy } from '../lib/storage';
import { useLanguage } from '../lib/LanguageContext';

export function AdvocacyPage() {
  const { t } = useLanguage();
  const [activeType, setActiveType] = useState('All');
  const advocacy = getAdvocacy();

  const types = [
    t('All', 'সব'),
    t('Position Paper', 'অবস্থানপত্র'),
    t('Statement', 'বিবৃতি'),
    t('Press Release', 'প্রেস বিজ্ঞপ্তি'),
    t('Report', 'প্রতিবেদন')
  ];

  const copHistory = [
    {
      event: t('COP29 — Baku, Azerbaijan', 'কপ-২৯ — বাকু, আজারবাইজান'),
      year: '২০২৪',
      role: t('Official Delegation', 'অফিসিয়াল প্রতিনিধি দল'),
      outcome: t(
        'Submitted Bangladesh youth position paper on NCQG; participated in loss and damage negotiations; presented in 3 side events',
        'NCQG-এর ওপর বাংলাদেশের যুবসমাজের অবস্থানপত্র পেশ; ক্ষয়ক্ষতি ও ক্ষতিপূরণ আলোচনায় অংশ নিয়ে ৩টি সাইড ইভেন্টে উপস্থাপন'
      ),
      highlight: true
    },
    {
      event: t('COP28 — Dubai, UAE', 'কপ-২৮ — দুবাই, সংযুক্ত আরব আমিরাত'),
      year: '২০২৩',
      role: t('Observer & Advocate', 'পর্যবেক্ষক ও অ্যাডভোকেট'),
      outcome: t(
        'First YCN delegation; connected with YOUNGO; presented at CSO side event on South Asian climate finance gaps',
        'প্রথম ওয়াইসিএন প্রতিনিধি দল; ইয়াঙ্গোর (YOUNGO) সাথে যুক্ত হয়ে দক্ষিণ এশিয়ার জলবায়ু অর্থায়ন সংকটের ওপর সিএসও সাইড ইভেন্টে উপস্থাপন'
      ),
      highlight: false
    },
    {
      event: t('Asia Pacific Regional Forum on Climate', 'এশিয়া প্যাসিফিক রিজিওনাল ক্লাইমেট ফোরাম'),
      year: '২০২৪',
      role: t('Youth Representative', 'যুব প্রতিনিধি'),
      outcome: t(
        'Presented Bangladesh coastal community resilience case study; advocated for climate mobility regional framework',
        'বাংলাদেশের উপকূলীয় এলাকার অভিযোজন সক্ষমতা বিষয়ক কেস স্টাডি উপস্থাপন এবং জলবায়ু অভিবাসনের আঞ্চলিক কাঠামোর পক্ষে কথা বলা'
      ),
      highlight: false
    },
    {
      event: t('National Youth Climate Summit — Dhaka', 'জাতীয় যুব জলবায়ু সম্মেলন — ঢাকা'),
      year: '২০২৪',
      role: t('Co-organizer', 'সহ-আয়োজনকারী'),
      outcome: t(
        'Co-organized 300-person summit with participation from 8 South Asian countries',
        'দক্ষিণ এশিয়ার ৮টি দেশের অংশগ্রহণে ৩০০ জনের এই জাতীয় যুব জলবায়ু সম্মেলনের সহ-আয়োজন'
      ),
      highlight: false
    }
  ];

  const keyPositions = [
    {
      title: t('Loss & Damage Finance', 'ক্ষয়ক্ষতি ও ক্ষতিপূরণ তহবিল'),
      desc: t(
        'Wealthy nations must deliver adequate, accessible, and predictable loss and damage finance to frontline nations like Bangladesh. The Santiago Network must be operational and funded at scale.',
        'ধনী দেশগুলোকে বাংলাদেশের মতো ভুক্তভোগী দেশগুলোর জন্য পর্যাপ্ত ও সরাসরি প্রবেশযোগ্য ক্ষতিপূরণ তহবিল দিতে হবে। সান্তিয়াগো নেটওয়ার্ককে পুরোপুরি সচল এবং অর্থায়ন করতে হবে।'
      )
    },
    {
      title: t('Just Energy Transition', 'ন্যায়সঙ্গত জ্বালানি রূপান্তর'),
      desc: t(
        "Bangladesh's energy transition must be just, affordable, and community-driven — not locked into new fossil fuel infrastructure. Developed nations must fund this transition.",
        'বাংলাদেশের জ্বালানি খাতের রূপান্তর হতে হবে ন্যায়সঙ্গত, সাশ্রয়ী ও স্থানীয় মানুষের স্বার্থ রক্ষাকারী — নতুন জীবাশ্ম জ্বালানি পরিকাঠামোয় আবদ্ধ হওয়া যাবে না। উন্নত দেশগুলোকে এই রূপান্তরে অর্থায়ন করতে হবে।'
      )
    },
    {
      title: t('Climate Migration Rights', 'জলবায়ু উদ্বাস্তুদের অধিকার'),
      desc: t(
        'Climate-displaced persons need legal protection under international law. A regional framework for climate mobility rights in South Asia and Asia Pacific is urgently needed.',
        'জলবায়ু পরিবর্তনের কারণে বাস্তুচ্যুত মানুষের আন্তর্জাতিক আইনের অধীনে আইনি সুরক্ষা প্রয়োজন। দক্ষিণ এশিয়া ও এশিয়া প্যাসিফিক অঞ্চলে জলবায়ু অভিবাসন অধিকারের জন্য একটি আঞ্চলিক কাঠামো জরুরি।'
      )
    },
    {
      title: t('Youth in Decision-Making', 'সিদ্ধান্ত গ্রহণে তরুণদের অংশগ্রহণ'),
      desc: t(
        'Youth must have formal, meaningful roles in climate negotiations at all levels — not token representation. Young people represent the generation most affected by climate decisions made today.',
        'জলবায়ু আলোচনার প্রতিটি স্তরে তরুণদের আনুষ্ঠানিক ও অর্থপূর্ণ ভূমিকা থাকতে হবে — কেবল লোকদেখানো প্রতিনিধিত্ব নয়। আজকের সিদ্ধান্তের দ্বারা যুবসমাজই সবচেয়ে বেশি ক্ষতিগ্রস্ত হবে।'
      )
    },
    {
      title: t('Adaptation Finance Parity', 'অভিযোজন অর্থায়নের সমতা'),
      desc: t(
        'Adaptation finance must match mitigation finance. For Bangladesh and other frontline nations, adaptation is not optional — it is an existential requirement.',
        'অভিযোজন অর্থায়ন কার্বন নির্গমন কমানোর তহবিলের সমতুল্য হতে হবে। বাংলাদেশ এবং অন্যান্য ক্ষতিগ্রস্ত দেশের জন্য অভিযোজন কোনো ঐচ্ছিক বিষয় নয় — এটি বেঁচে থাকার লড়াই।'
      )
    },
    {
      title: t('Nature-Based Solutions', 'প্রকৃতি-ভিত্তিক সমাধান'),
      desc: t(
        'Investment in mangroves, wetlands, and coastal ecosystems must be recognized as legitimate, fundable climate solutions with measurable outcomes for communities and carbon.',
        'ম্যানগ্রোভ, জলাভূমি এবং উপকূলীয় বাস্তুতন্ত্রে বিনিয়োগকে বৈধ ও অর্থায়নযোগ্য জলবায়ু সমাধান হিসেবে স্বীকৃতি দিতে হবে, যা কার্বন শোষণ ও জনগণের জীবন রক্ষা করবে।'
      )
    }
  ];

  // Match active type across languages
  const filtered = activeType === t('All', 'সব') ? advocacy : advocacy.filter(a => {
    const paperLabel = t('Position Paper', 'অবস্থানপত্র');
    const statementLabel = t('Statement', 'বিবৃতি');
    const pressLabel = t('Press Release', 'প্রেস বিজ্ঞপ্তি');
    const reportLabel = t('Report', 'প্রতিবেদন');

    if (activeType === paperLabel) return a.type === 'position-paper';
    if (activeType === statementLabel) return a.type === 'statement';
    if (activeType === pressLabel) return a.type === 'press-release';
    if (activeType === reportLabel) return a.type === 'report';
    return true;
  });

  const typeLabels: Record<string, string> = {
    'position-paper': t('Position Paper', 'অবস্থানপত্র'),
    'statement': t('Statement', 'বিবৃতি'),
    'press-release': t('Press Release', 'প্রেস বিজ্ঞপ্তি'),
    'report': t('Report', 'প্রতিবেদন'),
  };

  const typeColors: Record<string, { bg: string; color: string }> = {
    'position-paper': { bg: '#E8F5EE', color: '#1A6B3C' },
    'statement': { bg: '#FFF3EE', color: '#E8521A' },
    'press-release': { bg: '#E0F7FA', color: '#0E7490' },
    'report': { bg: '#FFF8E1', color: '#D97706' },
  };

  return (
    <div>
      <SEO 
        title="Advocacy" 
        description="Discover the Youth Climate Network's advocacy initiatives. We influence environmental policies and organize impactful campaigns for climate justice."
        keywords="climate advocacy, environmental policy bangladesh, youth campaigns, climate justice, policy change, environmental rights"
      />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 30% 60%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Policy & Advocacy', 'নীতি ও অ্যাডভোকেসি')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Advocacy & Policy', 'অ্যাডভোকেসি ও নীতি নির্ধারণ')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              "YCN amplifies frontline voices in national, regional, and global climate negotiations — ensuring Bangladesh's youth are heard where decisions are made.",
              'ওয়াইসিএন জাতীয়, আঞ্চলিক এবং বৈশ্বিক জলবায়ু আলোচনায় ক্ষতিগ্রস্তদের কণ্ঠস্বরকে তুলে ধরে — যাতে সিদ্ধান্ত গ্রহণের প্রতিটি স্তরে বাংলাদেশের যুবসমাজের মতামত গুরুত্ব পায়।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Advocacy Pillars */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Scale, title: t('Climate Justice Advocacy', 'জলবায়ু ন্যায়বিচার অ্যাডভোকেসি'), desc: t('Representing frontline communities at national and international climate forums', 'জাতীয় ও আন্তর্জাতিক জলবায়ু ফোরামে ক্ষতিগ্রস্ত সম্প্রদায়ের প্রতিনিধিত্ব করা'), color: '#1A6B3C', bg: '#E8F5EE' },
              { icon: Globe, title: t('UNFCCC & COP', 'ইউএনএফসিসিসি ও কপ সম্মেলন'), desc: t('Active participation in UN climate negotiations as part of the YOUNGO constituency', 'ইয়াঙ্গো (YOUNGO)-এর অংশ হিসেবে জাতিসংঘের জলবায়ু আলোচনায় সক্রিয় অংশগ্রহণ'), color: '#0E7490', bg: '#E0F7FA' },
              { icon: Megaphone, title: t('Policy Submissions', 'নীতিমালা পেশকরণ'), desc: t('Evidence-based policy papers and position statements submitted to decision-makers', 'নীতিনির্ধারকদের কাছে তথ্যভিত্তিক নীতিপত্র এবং অবস্থানগত বিবৃতি জমা দেওয়া'), color: '#E8521A', bg: '#FFF3EE' },
              { icon: FileText, title: t('Research & Reports', 'গবেষণা ও প্রতিবেদন'), desc: t('Producing rigorous research that informs climate policy at national and regional levels', 'জাতীয় ও আঞ্চলিক স্তরে জলবায়ু নীতি গঠনে তথ্যপ্রমাণ ভিত্তিক গবেষণা পরিচালনা'), color: '#D97706', bg: '#FFF8E1' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl text-center hover:shadow-lg transition-all duration-300" style={{ backgroundColor: bg }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: color }}>
                  <Icon size={22} color="#fff" />
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Policy Positions */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Our Policy Positions', 'আমাদের অবস্থানগত নীতিমালা')}
            </h2>
            <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {t(
                "YCN's core advocacy demands, developed in consultation with frontline communities and aligned with international climate justice frameworks.",
                'উপকূলীয় এলাকার সাধারণ মানুষের সাথে আলোচনার মাধ্যমে এবং আন্তর্জাতিক জলবায়ু ন্যায়বিচারের সাথে সামঞ্জস্য রেখে ওয়াইসিএন-এর প্রধান অ্যাডভোকেসি দাবিগুলো তৈরি।'
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {keyPositions.map((pos, i) => (
              <div
                key={pos.title}
                className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderLeft: '4px solid #E8521A' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center mb-4 text-xs font-bold" style={{ backgroundColor: '#0A3320', color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}>
                  {i + 1}
                </div>
                <h4 className="font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{pos.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{pos.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COP / UNFCCC */}
      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#E0F7FA', color: '#0E7490' }}>
              {t('UNFCCC / COP', 'জাতিসংঘ জলবায়ু আলোচনা')}
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Climate Negotiations Participation', 'জলবায়ু আলোচনায় অংশগ্রহণ')}
            </h2>
          </div>
          <div className="space-y-5">
            {copHistory.map((item) => (
              <div
                key={item.event}
                className="p-6 rounded-2xl"
                style={{
                  backgroundColor: item.highlight ? '#0A3320' : '#fff',
                  border: item.highlight ? 'none' : '1px solid #E5E7EB',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: item.highlight ? 'rgba(232,82,26,0.2)' : '#E8F5EE',
                        color: item.highlight ? '#E8521A' : '#1A6B3C',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {item.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h4 className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif', color: item.highlight ? '#F0ECD8' : '#1F2937' }}>
                        {item.event}
                      </h4>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: item.highlight ? 'rgba(232,82,26,0.2)' : '#E8F5EE', color: item.highlight ? '#E8521A' : '#1A6B3C' }}
                      >
                        {item.role}
                      </span>
                      {item.highlight && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8521A', color: '#fff' }}>
                          {t('Most Recent', 'সাম্প্রতিকতম')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: item.highlight ? '#A8C4B0' : '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                      {item.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications & Statements */}
      <section className="py-16" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: '#1F2937' }}>
              {t('Position Papers & Statements', 'অবস্থানপত্র ও বিবৃতিসমূহ')}
            </h2>
            <div className="flex flex-wrap gap-2">
              {types.map(type => {
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      backgroundColor: activeType === type ? '#0A3320' : '#F3F4F6',
                      color: activeType === type ? '#F0ECD8' : '#374151',
                      border: `1px solid ${activeType === type ? '#0A3320' : '#E5E7EB'}`,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            {filtered.map((item) => {
              const { bg, color } = typeColors[item.type] || { bg: '#F3F4F6', color: '#374151' };
              const itemTitle = t(item.title, item.title_bn);
              const itemSummary = t(item.summary, item.summary_bn);

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: bg, color }}>
                          {typeLabels[item.type] || item.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: '#9CA3AF' }}>
                          <Calendar size={11} /> {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {item.featured && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFF8E1', color: '#D97706' }}>
                            {t('Featured', 'বিশেষ ফিচার')}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{itemTitle}</h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{itemSummary}</p>
                    </div>
                    <button
                      className="text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 flex-shrink-0 transition-all hover:scale-105"
                      style={{ backgroundColor: '#0A3320', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}
                    >
                      <Download size={11} /> PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#0A3320' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#F0ECD8' }}>
            {t('Want to amplify climate voices?', 'জলবায়ু কণ্ঠস্বর আরও জোরালো করতে চান?')}
          </h3>
          <p className="mb-8 text-sm" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
            {t(
              'Join our advocacy network, support our delegations, or collaborate on research and policy submissions.',
              'আমাদের অ্যাডভোকেসি নেটওয়ার্কে যোগ দিন, আমাদের প্রতিনিধি দলকে সমর্থন করুন বা গবেষণা এবং নীতিগত সুপারিশে সহযোগিতা করুন।'
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/get-involved" className="px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
              {t('Join Our Network', 'আমাদের নেটওয়ার্কে যুক্ত হোন')} <ArrowRight size={14} className="inline ml-1" />
            </a>
            <a href="/contact" className="px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ border: '1.5px solid rgba(240,236,216,0.3)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}>
              {t('Media Inquiries', 'মিডিয়া জিজ্ঞাসা')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
