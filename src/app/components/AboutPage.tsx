import { Link } from 'react-router';
import { SEO } from './ui/SEO';
import { ArrowRight, Shield, Lightbulb, Heart, Users, Eye, Target, Waves, Wind, Droplets, Scale, Sprout, MapPin } from 'lucide-react';
import { useState } from 'react';
import logo2 from '../../imports/image-2.webp';
import { useLanguage } from '../lib/LanguageContext';

function TeamMemberCard({ member }: { member: { id: string; name: string; role: string; bio: string; email: string; image?: string } }) {
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {member.image ? (
        <img src={member.image} alt={member.name} className="w-24 h-24 rounded-2xl mb-4 object-cover" style={{ border: '2px solid #E8521A' }} />
      ) : (
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold"
          style={{ backgroundColor: '#0A3320', color: '#E8521A', fontFamily: 'Poppins, sans-serif' }}
        >
          {initials}
        </div>
      )}
      <h3 className="font-semibold mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{member.name}</h3>
      <p className="text-xs font-medium mb-3" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>{member.role}</p>
      {member.bio && <p className="text-sm leading-relaxed" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{member.bio}</p>}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-4 inline-block text-xs hover:underline transition-colors"
          style={{ color: '#1A6B3C', fontFamily: 'Inter, sans-serif' }}
        >
          {member.email}
        </a>
      )}
    </div>
  );
}

export function AboutPage() {
  const { t } = useLanguage();
  const advisors = [
    { name: 'Dr. Sue Maxam', role: 'Assistant Provost for Wellness at Pace University, USA and Inaugural Co Chair of the MCN Civic Learning Council', image: '/members/Dr. Sue Maxam ,  Assistant Provost for Wellness at  Pace University , USA  and  Inaugural Co Chair of the MCN ( Millennium Campus Network ) Civic Learning Council  - Advisor .webp' },
    { name: 'Dr. Dave Dowland', role: 'Registrar, BRAC University and Inaugural Co Chair of the MCN Civic Learning Council', image: '/members/Dr. Dave Dowland , Registrar, BRAC University  and Inaugural Co Chair of the MCN ( Millennium Campus Network ) Civic Learning Council - Advisor .jpg' },
    { name: 'Dr. Navid Saleh', role: 'Professor, Department of Civil, Architectural and Environmental Engineering at the University of Texas at Austin, USA', image: '/members/Dr. Navid Saleh ,  Professor , Department of Civil , Architectural and Environmental Engineering at the University of Texas at Austin , USA..jpg' },
    { name: 'Abel Atares', role: 'Humanitarian', image: '/members/Abel Atares - Humanitarian .jpg' },
    { name: 'Pablo Bescos', role: 'Humanitarian', image: '/members/Pablo Bescos - Humanitarian .jpg' },
    { name: 'Dr. Tuhin Roy', role: 'Sociology Discipline, University of Khulna', email: 'tuhinroy@soc.ku.ac.bd', image: '/members/Dr. Tuhin Roy , Sociology Discipline , University of Khulna .jpeg' },
    { name: 'Dr Hanif Miah', role: 'Associate Professor, Department of Sociology at University of Chittagong', email: 'miah.hanif@cu.ac.bd', image: '/members/Dr Hanif Miah , Associate Professor , Department of Sociology at University of Chittagong   - Advisor .jpg' },
    { name: 'Dr. Md. Wasiul Islam', role: 'Professor, Forestry and Wood Technology Discipline, University of Khulna', email: 'wislam@fwt.ku.ac.bd', image: '/members/Dr. Md. Wasiul Islam , Professor ,  Forestry and Wood Technology Discipline , University of Khulna  .jpg' },
    { name: 'Dr. Md Hafizur Rahman', role: 'Founder & Executive Director - Education for Development and Sustainability - EDS', image: '/members/Dr. Md Hafizur Rahman , Founder & Executive Director - Education for Development  and Sustainability - EDS - Advisor .jpg' },
    { name: 'Dr. Md. Hasan Howlader', role: 'Associate Professor, Development Studies Discipline, University of Khulna', email: 'hasan@ds.ku.ac.bd', image: '/members/Dr. Md.  Hasan  Howlader , Associate Professor , Development Studies Discipline , University of Khulna .jpg' },
    { name: 'Dr. Shapla Singha', role: 'Assistant Professor, Drawing and Painting Discipline, University of Khulna', email: 'shaplasingha@ku.ac.bd', image: '/members/Dr. Shapla Singha, Assistant Professor , Drawing and Painting Discipline , University of Khulna  .jpg' },
    { name: 'M RIAD AKTER (Aadib)', role: 'Founder & CEO at EDAXIS Global', email: 'mail.me@riyadaadib.com' },
    { name: 'MUTLUBA NACHRIN (Meete)', role: 'Founder & CEO @ Tourng Travelers', email: 'director@tourng.com' },
    { name: 'MD. Matiur Rahman Talukder', role: 'Retired Deputy Director - Department of Youth Development', image: '/members/MD. Matiur Rahman Talukder  Retired Deputy Director - Department of Youth Development,  Ministry of Youth and Sports_.jpg' },
    { name: 'Mohammed Mofizur Rahman', role: 'Scientist, Potsdam Institute for Climate Impact Research', image: '/members/Mohammed Mofizur Rahman - Scientist , Potsdam Institute for Climate Impact Research ..jpg' },
  ];

  const teamList = [
    { name: 'Arafat Hossain Akash', role: 'Founder & Executive Director', image: '/members/Arafat Hossain Akash - Founder & Executive Director .png' },
    { name: 'Madhusudan Mondal', role: 'Head of Programs & Climate Action', image: '/members/Madhusudan Mondal - Head of Programs & Climate Action .jpeg' },
    { name: 'Sadique Haseen Ratul', role: 'Head of Digital Engagement & Advocacy', image: '/members/Sadique Haseen Ratul - Head of Digital Engagement & Advocacy .jpeg' },
    { name: 'Ashikur Rahman', role: 'Head of Operations', image: '/members/Ashikur Rahman - Head of Operations .jpeg' },
    { name: 'Hasibul Alam Hridoy', role: 'Head of Research, Policy & Innovation', image: '/members/Hasibul Alam Hridoy - Head of Research, Policy & Innovation .jpg.jpeg' },
    { name: 'Anupurba sarkar', role: 'Head of People & Culture (HR)', image: '/members/Anupurba sarkar  -  Head of People & Culture .jpeg' },
    { name: 'Antora Akter Nodee', role: 'Head of Safeguarding & Ethics', image: '/members/Antora  Akter Nodee - Head of Safeguarding & Ethics .jpeg' },
    { name: 'Puja Gain', role: 'Head of Volunteer Operations', image: '/members/Head of Volunteer Operations -   Puja Gain (1).jpg' },
    { name: 'Imran Hosen', role: 'Head of Events & Campaigns', image: '/members/Head of Events & Campaigns —  Imran Hosen .jpg' },
    { name: 'Ariful Islam', role: 'Head of Inclusion', image: '/members/Ariful Islam -  Head of Inclusion .jpeg' },
    { name: 'Azibar Hossain', role: 'Head of Partnerships & Resource Mobilization', image: '/members/Azibar Hossain - Head of Partnerships & Resource Mobilization .jpeg' },
    { name: 'Md. Arif Morol', role: 'Head of Finance & Administration', image: '/members/Md. Arif Morol   -  Head of Finance & Administration .jpeg' },
    { name: 'Usha Bin Farid', role: 'Head of Communications & Content', image: '/members/Head of Communications & Content -    Usha Bin Farid .jpeg' },
    { name: 'Jobaer Hossain', role: 'Head of Monitoring, Evaluation & Learning (MEL)', image: '/members/Jobaer Hossain -   Head of Monitoring, Evaluation & Learning (MEL)  .jpeg' },
    { name: 'Riaz Afrin', role: 'Head of Legal & Governance', image: '/members/Head of Legal & Governance   — Riaz Afrin .jpg' },
    { name: 'Rifat Sana', role: 'Head of Management Information Systems (MIS)', image: '/members/Rifat Sana   -   Head of Management Information Systems (MIS).jpeg' },
  ];

  const [expandedStatement, setExpandedStatement] = useState(false);

  const values = [
    {
      icon: Shield, title: t('Climate Justice', 'জলবায়ু ন্যায়বিচার'),
      desc: t('We believe climate change is a justice issue. Those least responsible bear the greatest burden, and our work centers their rights and voices.', 'আমরা বিশ্বাস করি জলবায়ু পরিবর্তন একটি ন্যায়বিচারের বিষয়। সবচেয়ে কম দায়ী ব্যক্তিরাই সবচেয়ে বেশি বোঝা বহন করে এবং আমাদের কাজ তাদের অধিকার ও কণ্ঠস্বরকে কেন্দ্র করে।'),
      color: '#1A6B3C', bg: '#E8F5EE',
    },
    {
      icon: Users, title: t('Youth Leadership', 'যুব নেতৃত্ব'),
      desc: t('Young people are not just beneficiaries — they are agents of change, innovators, and leaders whose perspectives are essential.', 'তরুণরা কেবল সুবিধাভোগী নয় — তারা পরিবর্তনের চালিকাশক্তি, উদ্ভাবক এবং নেতা যাদের দৃষ্টিভঙ্গি অত্যন্ত গুরুত্বপূর্ণ।'),
      color: '#E8521A', bg: '#FFF3EE',
    },
    {
      icon: Heart, title: t('Inclusivity & Equity', 'অন্তর্ভুক্তি ও সমতা'),
      desc: t('We prioritize gender equity, disability inclusion, and the meaningful participation of marginalized groups in all programs and governance.', 'আমরা আমাদের সমস্ত প্রোগ্রাম ও পরিচালনায় জেন্ডার সমতা, প্রতিবন্ধী অন্তর্ভুক্তি এবং প্রান্তিক জনগোষ্ঠীর অর্থপূর্ণ অংশগ্রহণকে অগ্রাধিকার দিই।'),
      color: '#0E7490', bg: '#E0F7FA',
    },
    {
      icon: Target, title: t('Community Ownership', 'সামাজিক মালিকানাধীন'),
      desc: t('Our programs are co-designed with communities. Local knowledge, needs, and aspirations drive every initiative we undertake.', 'আমাদের প্রোগ্রামগুলো স্থানীয় জনগোষ্ঠীর সাথে যৌথভাবে ডিজাইন করা হয়। স্থানীয় জ্ঞান, চাহিদা এবং আকাঙ্ক্ষাই আমাদের প্রতিটি উদ্যোগ পরিচালনা করে।'),
      color: '#7B1FA2', bg: '#F3E5F5',
    },
    {
      icon: Eye, title: t('Transparency & Accountability', 'স্বচ্ছতা ও জবাবদিহিতা'),
      desc: t('We uphold the highest standards of financial integrity, programmatic transparency, and stakeholder accountability in all operations.', 'আমরা আমাদের সমস্ত কার্যকলাপে আর্থিক সততা, প্রোগ্রামভিত্তিক স্বচ্ছতা এবং স্টেকহোল্ডারদের প্রতি জবাবদিহিতার সর্বোচ্চ মান বজায় রাখি।'),
      color: '#D97706', bg: '#FFF8E1',
    },
    {
      icon: Lightbulb, title: t('Science & Innovation', 'বিজ্ঞান ও উদ্ভাবন'),
      desc: t('We ground our advocacy and programs in rigorous research, evidence-based approaches, and creative local innovation.', 'আমরা আমাদের অ্যাডভোকেসি এবং প্রোগ্রামগুলোকে কঠোর গবেষণা, প্রমাণ-ভিত্তিক পদ্ধতি এবং সৃজনশীল স্থানীয় উদ্ভাবনের ওপর ভিত্তি করে পরিচালনা করি।'),
      color: '#2E7D32', bg: '#E8F5E9',
    },
  ];

  return (
    <div>
      <SEO 
        title="About Us" 
        description="Learn about the Youth Climate Network's history, mission, vision, and the passionate team working tirelessly to combat climate change in Bangladesh."
        keywords="about youth climate network, climate organization mission, environmental team bangladesh, youth climate leaders, sustainable vision"
      />
      {/* Hero */}
      <section
        className="pt-32 pb-20 relative overflow-hidden"
        style={{ backgroundColor: '#0A3320' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #E8521A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1A6B3C 0%, transparent 50%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('About Us', 'আমাদের সম্পর্কে')}
          </div>
          <h1
            className="mb-6"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: '#F0ECD8' }}
          >
            {t('Who We Are', 'আমরা কে')}
          </h1>
          <p
            className="max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.1rem' }}
          >
            {t(
              'Youth Climate Network is a grassroots, youth-led non-profit established in Bangladesh, operating at the forefront of climate justice across Asia Pacific and South Asia.',
              'ইয়ুথ ক্লাইমেট নেটওয়ার্ক হল বাংলাদেশে প্রতিষ্ঠিত একটি তৃণমূল, যুব-নেতৃত্বাধীন অলাভজনক সংস্থা, যা এশিয়া প্যাসিফিক এবং দক্ষিণ এশিয়া জুড়ে জলবায়ু ন্যায়বিচারের অগ্রভাগে কাজ করছে।'
            )}
          </p>
        </div>
      </section>

      {/* Wave */}
      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      {/* Who We Are */}
      <section className="py-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="mb-6"
                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}
              >
                {t('Founded by Young People,', 'তরুণদের দ্বারা প্রতিষ্ঠিত,')} <br />
                <span style={{ color: '#1A6B3C' }}>{t('for Young People', 'তরুণদের জন্য')}</span>
              </h2>
              <p className="leading-relaxed mb-5" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'Youth Climate Network (YCN) embodies the conviction that the generation most affected by the climate crisis must also lead the response to it. We work at the intersection of climate science, community resilience, social equity, and youth empowerment.',
                  'ইয়ুথ ক্লাইমেট নেটওয়ার্ক (ওয়াইসিএন) এই দৃঢ় বিশ্বাস ধারণ করে যে জলবায়ু সংকট দ্বারা সবচেয়ে বেশি ক্ষতিগ্রস্ত প্রজন্মকেই এর নেতৃত্বে থাকতে হবে। আমরা জলবায়ু বিজ্ঞান, সামাজিক সহনশীলতা, সমতা এবং যুব ক্ষমতায়নের মেলবন্ধনে কাজ করি।'
                )}
              </p>
              <p className="leading-relaxed mb-5" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  "Officially registered under the Department of Youth Development, Government of the People's Republic of Bangladesh (Registration No: DYD/Khulna/Reg-104), YCN operates with full legal standing and institutional accountability.",
                  'গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের যুব উন্নয়ন অধিদপ্তরের অধীনে অফিসিয়ালি নিবন্ধিত (নিবন্ধন নম্বর: DYD/Khulna/Reg-104), ওয়াইসিএন সম্পূর্ণ আইনি ভিত্তি এবং প্রাতিষ্ঠানিক জবাবদিহিতার সাথে তার কার্যক্রম পরিচালনা করে।'
                )}
              </p>
              <p className="leading-relaxed mb-8" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'We recognize that environmental challenges are inseparable from issues of poverty, gender inequality, food security, and human dignity — and that real solutions must be community-led, inclusive, and just.',
                  'আমরা বিশ্বাস করি যে পরিবেশগত চ্যালেঞ্জগুলো দারিদ্র্য, লিঙ্গ বৈষম্য, খাদ্য নিরাপত্তা এবং মানুষের মর্যাদার সাথে অবিচ্ছেদ্যভাবে জড়িত — এবং প্রকৃত সমাধানগুলোকে অবশ্যই সামাজিক-নেতৃত্বাধীন, অন্তর্ভুক্তিমূলক এবং ন্যায়সঙ্গত হতে হবে।'
                )}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t('Founded', 'প্রতিষ্ঠিত'), value: '2022' },
                  { label: t('Registration', 'নিবন্ধন'), value: 'DYD/Khulna/Reg-104' },
                  { label: t('Headquarters', 'প্রধান কার্যালয়'), value: t('Khulna, Bangladesh', 'খুলনা, বাংলাদেশ') },
                  { label: t('Scope', 'পরিধি'), value: t('South Asia & Asia Pacific', 'দক্ষিণ এশিয়া ও এশিয়া প্যাসিফিক') },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-xl bg-white" style={{ border: '1px solid #E5E7EB' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl p-8" style={{ backgroundColor: '#0A3320' }}>
                <div className="text-center mb-6">
                  <img src={logo2} alt="YCN" className="h-16 w-auto mx-auto" />
                </div>
                <div
                  className="rounded-2xl p-6 mb-4"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p className="text-sm leading-relaxed mb-2" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                    {t(
                      '"YCN bridges the gap between local grassroots action and regional and global policy platforms, ensuring that the voices of frontline youth communities are heard, respected, and acted upon."',
                      '"ওয়াইসিএন স্থানীয় তৃণমূলের পদক্ষেপ এবং আঞ্চলিক ও বৈশ্বিক নীতিনির্ধারণী প্ল্যাটফর্মগুলোর মধ্যে ব্যবধান দূর করে, যা ফ্রন্টলাইন যুব সম্প্রদায়ের কণ্ঠস্বর শোনা, সম্মান করা এবং সেই অনুযায়ী কাজ করা নিশ্চিত করে।"'
                    )}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: t('Type', 'ধরন'), value: t('Grassroots Non-Profit, Youth-Led', 'তৃণমূল অলাভজনক, যুব-নেতৃত্বাধীন') },
                    { label: t('Geographic Focus', 'ভৌগোলিক ফোকাস'), value: t('Bangladesh (primary) · South Asia · Asia Pacific', 'বাংলাদেশ (প্রধান) · দক্ষিণ এশিয়া · এশিয়া প্যাসিফিক') },
                    { label: t('Registration Body', 'নিবন্ধন সংস্থা'), value: t('Dept. of Youth Development, GoB', 'যুব উন্নয়ন অধিদপ্তর, বাংলাদেশ সরকার') },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <span className="text-xs" style={{ color: '#E8521A', fontFamily: 'Inter, sans-serif' }}>{label}</span>
                      <span className="text-sm" style={{ color: '#D4CDB8', fontFamily: 'Inter, sans-serif' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bangladesh Context */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 10% 80%, rgba(232,82,26,0.08) 0%, transparent 50%), radial-gradient(circle at 90% 20%, rgba(26,107,60,0.15) 0%, transparent 50%)',
          }}
        />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0ECD8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
              {t('Our Context', 'আমাদের প্রেক্ষাপট')}
            </div>
            <h2
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#F0ECD8' }}
            >
              {t('Bangladesh: A Climate Frontline Nation', 'বাংলাদেশ: জলবায়ু পরিবর্তনের ফ্রন্টলাইন জাতি')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
              {t('Why Bangladesh matters — and why youth-led climate action is not optional, but urgent.', 'কেন বাংলাদেশ গুরুত্বপূর্ণ — এবং কেন যুব-নেতৃত্বাধীন জলবায়ু পদক্ষেপ ঐচ্ছিক নয়, বরং অত্যন্ত জরুরি।')}
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {[
              { stat: '#7', label: t('Most Climate-Vulnerable Country', 'সবচেয়ে জলবায়ু-ঝুঁকিপূর্ণ দেশ'), sub: t('Global Climate Risk Index', 'গ্লোবাল ক্লাইমেট রিস্ক ইনডেক্স'), color: '#E8521A' },
              { stat: '17%', label: t('Land at risk from sea level rise', 'সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধির ঝুঁকিতে থাকা ভূমি'), sub: t('30 million people threatened', '৩ কোটি মানুষ হুমকির মুখে'), color: '#F59E0B' },
              { stat: '60M+', label: t('Climate-Affected People', 'জলবায়ু-আক্রান্ত মানুষ'), sub: t('Annually from floods & cyclones', 'বার্ষিক বন্যা ও ঘূর্ণিঝড়ে'), color: '#10B981' },
              { stat: '165M', label: t('Population Exposed', 'ঝুঁকিতে থাকা জনসংখ্যা'), sub: t('0.3% of global emissions', 'বৈশ্বিক নির্গমনের ০.৩%'), color: '#0E7490' },
            ].map(({ stat, label, sub, color }) => (
              <div
                key={label}
                className="rounded-2xl p-5 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="text-3xl font-black mb-2" style={{ color, fontFamily: 'Poppins, sans-serif' }}>{stat}</div>
                <div className="text-sm font-semibold mb-1" style={{ color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}>{label}</div>
                <div className="text-xs" style={{ color: '#7FAF8A', fontFamily: 'Inter, sans-serif' }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Content blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Waves,
                title: t('Coastal & River Flooding', 'উপকূলীয় এবং নদীর বন্যা'),
                desc: t('Bangladesh experiences severe flooding annually, displacing millions. The Brahmaputra, Ganges, and Meghna river systems converge here, making it one of the world\'s most flood-prone nations.', 'বাংলাদেশে প্রতি বছর ভয়াবহ বন্যা দেখা দেয়, যা লাখ লাখ মানুষকে বাস্তুচ্যুত করে। ব্রহ্মপুত্র, গঙ্গা এবং মেঘনা নদী ব্যবস্থা এখানে মিলিত হয়েছে, যা এটিকে বিশ্বের অন্যতম বন্যাপ্রবণ দেশ করে তুলেছে।'),
                color: '#0E7490',
              },
              {
                icon: Wind,
                title: t('Cyclones & Storm Surges', 'ঘূর্ণিঝড় এবং জলোচ্ছ্বাস'),
                desc: t('The Bay of Bengal\'s funnel shape amplifies tropical cyclones. Cyclone Sidr (2007) and Cyclone Amphan (2020) caused massive destruction — affecting millions of coastal communities where YCN works.', 'বঙ্গোপসাগরের ফানেল আকৃতি ক্রান্তীয় ঘূর্ণিঝড়কে আরও ঘনীভূত করে। সিডর (২০০৭) এবং আম্পান (২০২০) ভয়াবহ ধ্বংসলীলা সৃষ্টি করেছিল — যা লক্ষ লক্ষ উপকূলীয় মানুষকে প্রভাবিত করে যেখানে ওয়াইসিএন কাজ করে।'),
                color: '#E8521A',
              },
              {
                icon: Droplets,
                title: t('Sea Level Rise & Salinity', 'সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি ও লবণাক্ততা'),
                desc: t('Rising sea levels are inundating coastal islands (chars). Saltwater intrusion is destroying farmland and freshwater sources, forcing climate migration — a crisis YCN addresses through advocacy and WASH programs.', 'সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি উপকূলীয় দ্বীপ ও চরাঞ্চলগুলোকে প্লাবিত করছে। লবণাক্ত পানির অনুপ্রবেশ কৃষি জমি এবং মিষ্টি পানির উৎস ধ্বংস করছে, জলবায়ু অভিবাসনকে ত্বরান্বিত করছে।'),
                color: '#10B981',
              },
              {
                icon: Users,
                title: t('Youth at the Forefront', 'অগ্রভাগে তরুণরা'),
                desc: t('Over 65% of Bangladesh\'s population is under 35. Young people bear the brunt of climate impacts — losing homes, livelihoods, and educational opportunities. YCN exists to amplify their voices and agency.', 'বাংলাদেশের জনসংখ্যার ৬৫% এরও বেশি তরূণ (৩৫ বছরের নিচে)। তরুণরা জলবায়ুর প্রভাবের সবচেয়ে বেশি শিকার — তাদের কণ্ঠস্বর এবং এজেন্সিকে জোরালো করতে ওয়াইসিএন কাজ করে।'),
                color: '#F59E0B',
              },
              {
                icon: Scale,
                title: t('Climate Justice Paradox', 'জলবায়ু ন্যায়বিচার বৈপরীত্য'),
                desc: t('Bangladesh contributes less than 0.3% of global GHG emissions yet faces catastrophic consequences. YCN advocates for climate justice — demanding accountability from high-emitting nations at UNFCCC and beyond.', 'বাংলাদেশ বৈশ্বিক নির্গমনের ০.৩%-এরও কম অবদান রাখে অথচ মারাত্মক জলবায়ু হুমকির সম্মুখীন। ওয়াইসিএন জলবায়ু ন্যায়বিচারের পক্ষে কাজ করে এবং নির্গমনকারী দেশগুলোর জবাবদিহিতা দাবি করে।'),
                color: '#8B5CF6',
              },
              {
                icon: Sprout,
                title: t('Youth-Led Solutions', 'যুব-নেতৃত্বাধীন সমাধান'),
                desc: t('From mangrove restoration to solar energy, from WASH programs to policy advocacy — Bangladesh\'s youth are building resilience. YCN coordinates, trains, and amplifies these local solutions at regional scale.', 'ম্যানগ্রোভ পুনরুদ্ধার থেকে শুরু করে সৌর শক্তি, ওয়াশ প্রোগ্রাম থেকে নীতি নির্ধারণী অ্যাডভোকেসি — বাংলাদেশের যুবসমাজ সহনশীলতা তৈরি করছে। ওয়াইসিএন এই সমাধানগুলোর সমন্বয় করে।'),
                color: '#1A6B3C',
              },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${color}30`,
                  borderLeft: `3px solid ${color}`,
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${color}15` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#F0ECD8' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Khulna highlight */}
          <div
            className="mt-10 rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(232,82,26,0.15) 0%, rgba(26,107,60,0.15) 100%)',
              border: '1px solid rgba(232,82,26,0.2)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(232,82,26,0.15)', border: '1px solid rgba(232,82,26,0.3)' }}>
                <MapPin size={32} style={{ color: '#E8521A' }} />
              </div>
              <div>
                <h4 className="font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#F0ECD8', fontSize: '1.1rem' }}>
                  {t('Why Khulna? Why the Sundarbans?', 'কেন খুলনা? কেন সুন্দরবন?')}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
                  {t(
                    "YCN was born in Khulna — Bangladesh's third-largest city and gateway to the Sundarbans mangrove forest, the world's largest coastal mangrove ecosystem and a UNESCO World Heritage site. The Sundarbans absorbs cyclone impacts, protects over 4 million coastal people, and hosts extraordinary biodiversity — yet faces devastating threats from rising seas, salinity, and deforestation. Working from this frontline context, YCN's programs are grounded in the lived realities of the most climate-vulnerable communities in South Asia.",
                    'ওয়াইসিএন-এর জন্ম খুলনায় — যা বাংলাদেশের তৃতীয় বৃহত্তম শহর এবং বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবনের প্রবেশদ্বার। সুন্দরবন ঘূর্ণিঝড়ের প্রভাব প্রতিরোধ করে, ৪ কোটিরও বেশি উপকূলীয় মানুষকে রক্ষা করে এবং অসাধারণ জীববৈচিত্র্য রক্ষা করে — তবুও সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি ও লবণাক্ততার কারণে হুমকির সম্মুখীন। এই ফ্রন্টলাইন প্রেক্ষাপট থেকে কাজ করে ওয়াইসিএন-এর প্রোগ্রামগুলো দক্ষিণ এশিয়ার সবচেয়ে জলবায়ু-ঝুঁকিপূর্ণ মানুষের জীবনযাত্রার বাস্তবতার ওপর ভিত্তি করে গড়ে উঠেছে।'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Vision, Mission & Values', 'ভিশন, মিশন এবং মূল্যবোধ')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #0A3320 0%, #1A6B3C 100%)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(232,82,26,0.2)' }}>
                <Eye size={20} style={{ color: '#E8521A' }} />
              </div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#F0ECD8', fontSize: '1.2rem' }}>{t('Our Vision', 'আমাদের ভিশন')}</h3>
              <p className="leading-relaxed" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'A climate-resilient, environmentally just, and sustainably developed South Asia and Asia Pacific — where every young person has the knowledge, power, and opportunity to shape a thriving planet for present and future generations.',
                  'একটি জলবায়ু-সহনশীল, পরিবেশগতভাবে ন্যায়সঙ্গত এবং টেকসইভাবে উন্নত দক্ষিণ এশিয়া ও এশিয়া প্যাসিফিক অঞ্চল গড়ে তোলা — যেখানে প্রতিটি তরুণ-তরুণীর বর্তমান এবং ভবিষ্যত প্রজন্মের জন্য একটি সমৃদ্ধ পৃথিবী গড়ে তোলার জ্ঞান, ক্ষমতা এবং সুযোগ থাকবে।'
                )}
              </p>
            </div>
            <div
              className="p-8 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #E8521A 0%, #D97706 100%)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Target size={20} style={{ color: '#fff' }} />
              </div>
              <h3 className="font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#fff', fontSize: '1.2rem' }}>{t('Our Mission', 'আমাদের মিশন')}</h3>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter, sans-serif' }}>
                {t(
                  'Youth Climate Network mobilizes, equips, and amplifies the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — leaving no community behind.',
                  'ইয়ুথ ক্লাইমেট নেটওয়ার্ক যুবসমাজকে সংগঠিত করে, প্রস্তুত করে এবং তাদের ক্ষমতা বৃদ্ধি করে যাতে তারা জলবায়ু পরিবর্তন, পরিবেশগত ন্যায়বিচার এবং টেকসই উন্নয়নে রূপান্তরমূলক ভূমিকা রাখতে পারে — কোনো সম্প্রদায়কে পেছনে না রেখে।'
                )}
              </p>
            </div>
          </div>

          {/* Values */}
          <h3 className="text-center font-bold mb-10" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937', fontSize: '1.3rem' }}>{t('Core Values', 'মূল মূল্যবোধসমূহ')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl hover:shadow-lg transition-all duration-300" style={{ backgroundColor: bg }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: color }}>
                  <Icon size={20} color="#fff" />
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Statement */}
      <section className="py-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 mb-6">
                <img src="/members/Arafat Hossain Akash - Founder & Executive Director .png" alt="Arafat Hossain Akash" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>Photo Placeholder</div>
              </div>
              <h3 className="font-bold text-xl mb-1" style={{ color: '#1F2937' }}>Arafat Hossain Akash</h3>
              <p className="text-sm font-medium" style={{ color: '#E8521A' }}>Founder & Executive Director, Youth Climate Network</p>
            </div>
            <div className="lg:w-2/3">
              <h2 className="mb-6 font-bold" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', color: '#1F2937' }}>
                Founder & Executive Director's Statement
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed font-inter">
                <p>
                  On 25 May 2009, Cyclone Aila struck the coast of Bangladesh. Our home, everything we had — washed away in hours. I was nine years old, and I lost my school before I ever fully understood what I was losing. That was not the only storm of my childhood.
                </p>
                {expandedStatement && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <p>
                      I grew up watching cyclone after cyclone tear through our coast — Sidr, Aila, Fani, Amphan — each one arriving with a different name but the same devastating signature: homes destroyed, harvests lost, children pulled out of school, families pushed deeper into hardship. Year after year, I watched the same communities rebuild, only to be struck down again. That repetition — of suffering, survival, and starting over — moved something in me that has never left. It was not abstract data or distant news. It was my neighbors. It was people I loved, losing everything, again and again, through no fault of their own.
                    </p>
                    <p>
                      Somewhere in the middle of all that loss, I made a decision I could not unmake: I would not simply survive this crisis. I would stand up and act — as a changemaker — to change the condition of the people around me who had suffered exactly as I had.
                    </p>
                    <p>
                      In 2021, that conviction led me to establish Humanity Public Library, so that children and families in climate-vulnerable coastal communities — like the one I grew up in — would never have to lose their education to a disaster the way I nearly did. It was never meant to be the end of the work. It was only the beginning.
                    </p>
                    <p>
                      That same conviction led to the founding of Youth Climate Network (YCN).
                    </p>
                    <p>
                      Our Mission is to mobilize, equip, and amplify the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — building the capacity of youth leaders and frontline communities, advocating for systemic change at local, national, and regional levels, and delivering life-changing programs in education, livelihoods, water, sanitation, disaster preparedness, and renewable energy, so that no community is left behind.
                    </p>
                    <p>
                      Our Vision is a climate-resilient, environmentally just, and sustainably developed South Asia and Asia Pacific — where every young person has the knowledge, power, and opportunity to shape a thriving planet for present and future generations.
                    </p>
                    <p>
                      Every program YCN runs today — from safe water access to disaster risk reduction to youth leadership training — carries the memory of a broken embankment, three years of uncertain tides, and a childhood measured out in cyclones. It is personal, and it is precisely why our work stays honest, urgent, and rooted in what frontline communities actually need — because I was one of them, and in many ways, I still am.
                    </p>
                    <p>
                      We are deeply grateful to the partners, donors, and institutions who have chosen to invest in that belief — trusting young people from Bangladesh's coast not just to survive the climate crisis, but to lead the fight against it.
                    </p>
                    <p>
                      There is an enormous distance still to travel. But I have seen what a cyclone can take from a community — and I have also seen what young people, given the trust and the tools, can rebuild in its place.
                    </p>
                    <p>
                      This is only the beginning of that journey.
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setExpandedStatement(!expandedStatement)}
                  className="mt-4 font-semibold hover:underline flex items-center gap-1 transition-colors"
                  style={{ color: '#1A6B3C' }}
                >
                  {expandedStatement ? 'Show Less ↑' : 'Read Full Story →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>
              {t('Leadership', 'নেতৃত্ব')}
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Meet the Team', 'দলের সাথে পরিচিত হোন')}
            </h2>
            <p className="mt-3 max-w-xl mx-auto" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {t('Dedicated young professionals driving YCN\'s mission across programs, advocacy, and operations.', 'প্রোগ্রাম, অ্যাডভোকেসি এবং অপারেশন জুড়ে ওয়াইসিএন-এর মিশন পরিচালনাকারী নিবেদিত তরুণ দল।')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamList.map((member, i) => (
              <TeamMemberCard key={i} member={{ id: `${i}`, name: member.name, role: member.role, bio: '', email: '', image: member.image }} />
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-20" style={{ backgroundColor: '#F9FAFB' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: '#E8F5EE', color: '#1A6B3C' }}>
              Advisors
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              Meet Our Advisors
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advisors.map((advisor, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                {advisor.image ? (
                  <img src={advisor.image} alt={advisor.name} className="w-24 h-24 rounded-full object-cover mb-4 border-2" style={{ borderColor: '#E8521A' }} />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#0A3320] text-[#E8521A] flex items-center justify-center font-bold text-2xl mb-4">
                    {advisor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
                <h3 className="font-semibold mb-2 text-[#1F2937]">{advisor.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{advisor.role}</p>
                {advisor.email && (
                  <a href={`mailto:${advisor.email}`} className="text-xs text-[#1A6B3C] hover:underline mt-auto">
                    {advisor.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', color: '#1F2937' }}>
              {t('Governance Structure', 'পরিচালনা কাঠামো')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: t('General Assembly', 'সাধারণ পরিষদ'), desc: t('The supreme decision-making body comprising all active YCN members. Meets annually to review strategy, elect leadership, and approve plans and budgets.', 'সকল ওয়াইসিএন সদস্যদের নিয়ে গঠিত নীতি নির্ধারণী মূল চালিকাশক্তি। বার্ষিক সাধারণ সভায় কৌশল পর্যালোচনা, নেতৃত্ব নির্বাচন এবং বাজেট অনুমোদন করা হয়।') },
              { title: t('Executive Committee', 'কার্যনির্বাহী কমিটি'), desc: t('Elected body of 7–11 youth leaders responsible for governance oversight, policy, and major institutional decisions.', '৭-১১ জন নির্বাচিত যুব নেতাদের সমন্বয়ে গঠিত কমিটি যা নীতি ও অন্যান্য প্রাতিষ্ঠানিক সিদ্ধান্তের জন্য দায়িত্বশীল।') },
              { title: t('Executive Director', 'নির্বাহী পরিচালক'), desc: t('Chief executive responsible for organizational management, external representation, and strategic leadership.', 'সাংগঠনিক ব্যবস্থাপনা, বাহ্যিক প্রতিনিধিত্ব এবং কৌশলগত নেতৃত্বের জন্য দায়ী প্রধান নির্বাহী কর্মকর্তা।') },
              { title: t('Program Teams', 'প্রোগ্রাম টিমসমূহ'), desc: t('Dedicated teams for each of YCN\'s 15 strategic pillars, led by Program Coordinators with thematic expertise.', 'ওয়াইসিএন-এর ১৫টি কৌশলগত পিলারের প্রতিটির জন্য নিবেদিত দল, যা নির্দিষ্ট ক্ষেত্রে বিশেষজ্ঞ সমন্বয়কারীদের দ্বারা পরিচালিত।') },
              { title: t('Finance & Administration', 'অর্থ ও প্রশাসন'), desc: t('Independent finance function with internal audit, transparent reporting, and donor accountability systems.', 'অভ্যন্তরীণ অডিট, স্বচ্ছ রিপোর্টিং এবং দাতার প্রতি জবাবদিহিতা সম্বলিত একটি স্বাধীন অর্থ বিভাগ।') },
              { title: t('Youth Advisory Council', 'যুব উপদেষ্টা পরিষদ'), desc: t('Representative body of young people from YCN\'s program areas, ensuring grassroots perspectives inform all decisions.', 'ওয়াইসিএন-এর প্রোগ্রাম এলাকাগুলোর যুব প্রতিনিধিদের নিয়ে গঠিত পরিষদ, যা নিশ্চিত করে যে তৃণমূলের মতামত সমস্ত সিদ্ধান্ত গ্রহণে প্রতিফলিত হচ্ছে।') },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold mb-3" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>{item.title}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: '#0A3320' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="mb-4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#F0ECD8' }}>
            {t('Ready to take action?', 'পদক্ষেপ নিতে প্রস্তুত?')}
          </h3>
          <p className="mb-8 text-sm" style={{ color: '#A8C4B0', fontFamily: 'Inter, sans-serif' }}>
            {t('Join thousands of young people working to build a climate-resilient, just future for Bangladesh and beyond.', 'বাংলাদেশ এবং এর বাইরেও একটি জলবায়ু-সহনশীল, ন্যায়সঙ্গত ভবিষ্যৎ গড়তে হাজার হাজার তরুণের সাথে যুক্ত হোন।')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-involved" className="px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ backgroundColor: '#E8521A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
              {t('Get Involved', 'যুক্ত হোন')} <ArrowRight size={14} className="inline ml-1" />
            </Link>
            <Link to="/contact" className="px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{ border: '1.5px solid rgba(240,236,216,0.3)', color: '#F0ECD8', fontFamily: 'Inter, sans-serif' }}>
              {t('Contact Us', 'যোগাযোগ করুন')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
