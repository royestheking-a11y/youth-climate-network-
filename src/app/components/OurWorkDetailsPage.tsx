import { useParams, Link } from 'react-router';
import { SEO } from './ui/SEO';
import { apiProgram } from '../lib/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion as Motion } from 'motion/react';
import { useLanguage } from '../lib/LanguageContext';

export function OurWorkDetailsPage() {
  const { t, lang } = useLanguage();
  const { id } = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProgram();
  }, [id]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      const data = await apiProgram.getAll();
      const found = data.find((p: any) => p.slug === id);
      setProgram(found);
    } catch (error) {
      console.error('Error fetching program details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20" style={{ backgroundColor: '#F3F4F6' }}>
      <SEO title="Project Details" />
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
            {t('Program Not Found', 'প্রোগ্রাম পাওয়া যায়নি')}
          </h2>
          <Link to="/our-work" className="text-sm font-medium hover:underline" style={{ color: '#E8521A' }}>
            {t('Return to Our Work', 'আমাদের কার্যক্রমে ফিরে যান')}
          </Link>
        </div>
      </div>
    );
  }

  const Icon = (Icons as any)[program.iconName || 'Box'] || Icons.Box;
  const programTitle = t(program.title, program.title_bn);
  const programTheme = t(program.theme, program.theme_bn);
  const programDescription = t(program.description, program.description_bn);
  const initiatives = lang === 'bn' && program.keyPrograms_bn?.length ? program.keyPrograms_bn : program.keyPrograms || [];

  return (
    <div className="min-h-screen pt-36 pb-20" style={{ backgroundColor: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-6">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/our-work" className="inline-flex items-center gap-2 text-sm font-medium mb-8 hover:opacity-80 transition-all" style={{ color: '#4B5563' }}>
            <ArrowLeft size={16} /> {t('Back to All Programs', 'সব কার্যক্রমে ফিরে যান')}
          </Link>
          
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm mb-8" style={{ borderTop: `6px solid ${program.color}` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: program.bg }}>
                <Icon size={32} style={{ color: program.color }} />
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-wider mb-1 block" style={{ color: program.color }}>{programTheme}</span>
                <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#0A3320' }}>
                  {programTitle}
                </h1>
              </div>
            </div>
            
            <div className="prose max-w-none mb-12">
              <p className="text-lg leading-relaxed" style={{ color: '#4B5563' }}>
                {programDescription}
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6" style={{ fontFamily: 'Poppins, sans-serif', color: '#1F2937' }}>
                {t('Key Initiatives & Interventions', 'মূল উদ্যোগ ও হস্তক্ষেপসমূহ')}
              </h3>
              <ul className="space-y-4">
                {initiatives.map((item: string, i: number) => {
                  const [title, desc] = item.split(' — ');
                  return (
                    <Motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className="flex gap-4"
                    >
                      <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" style={{ color: program.color }} />
                      <div>
                        <strong className="block text-base mb-1" style={{ color: '#1F2937', fontFamily: 'Poppins, sans-serif' }}>{title}</strong>
                        {desc && <span className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{desc}</span>}
                      </div>
                    </Motion.li>
                  );
                })}
              </ul>
            </div>
          </div>

          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12 bg-white rounded-3xl p-10 shadow-sm"
          >
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif', color: '#0A3320' }}>
              {t('Want to Support this Program?', 'এই কর্মসূচিতে সহায়তা করতে চান?')}
            </h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              {t('Join us in making a real impact. Your contribution helps us expand our reach and support more vulnerable communities.', 'প্রকৃত প্রভাব তৈরি করতে আমাদের সাথে যুক্ত হোন। আপনার অবদান আমাদের কার্যক্রমের পরিধি বাড়াতে এবং আরও ঝুঁকিপূর্ণ সম্প্রদায়কে সহায়তা করতে সাহায্য করে।')}
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/get-involved" className="px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg" style={{ backgroundColor: program.color, color: '#fff' }}>
                {t('Volunteer With Us', 'স্বেচ্ছাসেবক হোন')}
              </Link>
              <Link to="/contact" className="px-6 py-3 rounded-xl font-semibold transition-all" style={{ backgroundColor: program.bg, color: program.color }}>
                {t('Partner With Us', 'অংশীদার হোন')}
              </Link>
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </div>
  );
}
