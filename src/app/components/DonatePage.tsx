import { useState } from 'react';
import { SEO } from './ui/SEO';
import { ShieldCheck, CreditCard, Building2, Globe2, CheckCircle, ArrowRight, Copy } from 'lucide-react';
import { addDonationRequest } from '../lib/storage';
import { useLanguage } from '../lib/LanguageContext';

export function DonatePage() {
  const { t } = useLanguage();
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(2500);
  const [payStep, setPayStep] = useState<'form'|'gateway'|'confirm'|'success'>('form');
  const [payMethod, setPayMethod] = useState<'bkash'|'nagad'|'bank'|'international'>('bkash');
  const [txnId, setTxnId] = useState('');
  const [copied, setCopied] = useState(false);
  const [donForm, setDonForm] = useState({ name: '', email: '', phone: '', type: 'one-time', note: '' });

  const donationAmounts = [500, 1000, 2500, 5000, 10000];
  const finalAmount = customAmount ? parseInt(customAmount) : (selectedAmount || 0);

  const handleDonateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || !donForm.name || !donForm.email) return;
    setPayStep('gateway');
  };

  const handleTxnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnId.trim()) return;
    addDonationRequest({
      name: donForm.name, email: donForm.email, phone: donForm.phone,
      amount: finalAmount, currency: 'BDT', type: donForm.type,
      method: payMethod, txnId: txnId.trim(), note: donForm.note,
    });
    setPayStep('success');
  };

  const copyRef = (val: string) => { 
    navigator.clipboard.writeText(val); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200";
  const inputStyle = {
    backgroundColor: '#F9FAFB',
    border: '1px solid #E5E7EB',
    color: '#1F2937',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div>
      <SEO 
        title="Donate" 
        description="Support the Youth Climate Network with a donation. Your contribution funds vital youth-led climate projects, tree planting, and sustainability campaigns."
        keywords="donate youth climate network, climate funding, support environmental cause, donate tree planting bangladesh, climate charity, fund youth action"
      />
      <section className="pt-32 pb-16 relative overflow-hidden" style={{ backgroundColor: '#0A3320' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(circle at 70% 50%, #E8521A 0%, transparent 45%)' }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4" style={{ backgroundColor: 'rgba(232,82,26,0.15)', color: '#E8521A' }}>
            {t('Take Action', 'পদক্ষেপ নিন')}
          </div>
          <h1 className="mb-6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#F0ECD8' }}>
            {t('Make a Donation', 'অনুদান করুন')}
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', color: '#A8C4B0', fontSize: '1.05rem' }}>
            {t(
              'Your support directly reaches frontline communities facing climate devastation. Every contribution drives climate justice forward.',
              'আপনার সমর্থন সরাসরি জলবায়ু ধ্বংসের মুখোমুখি ফ্রন্টলাইন সম্প্রদায়ের কাছে পৌঁছায়। আপনার প্রতিটি অবদান জলবায়ু ন্যায়বিচারকে ত্বরান্বিত করে।'
            )}
          </p>
        </div>
      </section>

      <div style={{ lineHeight: 0, backgroundColor: '#F3F4F6' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, display: 'block' }}>
          <path d="M0,20 C360,60 1080,0 1440,40 L1440,0 L0,0 Z" fill="#0A3320" />
        </svg>
      </div>

      <section className="py-16" style={{ backgroundColor: '#F3F4F6' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm" style={{ border: '1px solid #E5E7EB' }}>
            
            <h2 className="mb-2 text-center" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#1F2937' }}>
              {t("Support YCN's Mission", 'আমাদের লক্ষ্য অর্জনে সহায়তা করুন')}
            </h2>
            <p className="mb-8 text-sm text-center" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              {t("Your donation directly funds climate action on the frontlines — from solar panels for off-grid families to legal aid for displaced communities.", 'আপনার অনুদান সরাসরি ফ্রন্টলাইন জলবায়ু কার্যক্রমে অর্থায়ন করে।')}
            </p>

            {/* Progress bar */}
            {payStep !== 'success' && (
              <div className="flex items-center justify-center gap-2 mb-8 max-w-lg mx-auto">
                {[{k:'form',l:'Details'},{k:'gateway',l:'Payment'},{k:'confirm',l:'Confirm'}].map((s,i) => (
                  <div key={s.k} className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        style={{ backgroundColor: ['form','gateway','confirm','success'].indexOf(payStep) >= i ? '#E8521A' : '#E5E7EB', color: ['form','gateway','confirm','success'].indexOf(payStep) >= i ? '#fff' : '#9CA3AF' }}>
                        {i+1}
                      </div>
                      <span className="text-xs font-medium hidden sm:block" style={{ color: ['form','gateway','confirm','success'].indexOf(payStep) >= i ? '#E8521A' : '#9CA3AF' }}>{s.l}</span>
                    </div>
                    {i < 2 && <div className="flex-1 h-px" style={{ backgroundColor: ['form','gateway','confirm','success'].indexOf(payStep) > i ? '#E8521A' : '#E5E7EB' }} />}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1: Donor info */}
            {payStep === 'form' && (
              <form onSubmit={handleDonateInfo} className="space-y-5">
                <div className="flex gap-3">
                  {['one-time','monthly'].map(type => (
                    <button key={type} type="button" onClick={() => setDonForm(f => ({ ...f, type }))}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ backgroundColor: donForm.type === type ? '#0A3320' : '#F3F4F6', color: donForm.type === type ? '#F0ECD8' : '#374151', border: `1px solid ${donForm.type === type ? '#0A3320' : '#E5E7EB'}` }}>
                      {type === 'one-time' ? t('One-Time','এককালীন') : t('Monthly','মাসিক')}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#374151' }}>{t('Select Amount (BDT)','পরিমাণ নির্বাচন করুন (টাকা)')}</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {donationAmounts.map(amt => (
                      <button key={amt} type="button" onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{ backgroundColor: selectedAmount === amt && !customAmount ? '#E8521A' : '#F3F4F6', color: selectedAmount === amt && !customAmount ? '#fff' : '#374151', border: `1px solid ${selectedAmount === amt && !customAmount ? '#E8521A' : '#E5E7EB'}` }}>
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input className={inputCls} style={inputStyle} type="number" min="100" placeholder={t('Or enter custom amount (BDT)','অথবা কাস্টম পরিমাণ লিখুন (টাকা)')} value={customAmount} onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{t('Full Name *','পূর্ণ নাম *')}</label>
                    <input className={inputCls} style={inputStyle} value={donForm.name} onChange={e => setDonForm(f => ({ ...f, name: e.target.value }))} placeholder={t('Your name','আপনার নাম')} required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{t('Email *','ইমেইল *')}</label>
                    <input type="email" className={inputCls} style={inputStyle} value={donForm.email} onChange={e => setDonForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#374151' }}>{t('Phone','ফোন')}</label>
                    <input type="tel" className={inputCls} style={inputStyle} value={donForm.phone} onChange={e => setDonForm(f => ({ ...f, phone: e.target.value }))} placeholder="+880XXXXXXXXXX" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2 mt-4"
                  style={{ background: 'linear-gradient(135deg,#E8521A,#D97706)', color:'#fff', boxShadow:'0 4px 20px rgba(232,82,26,0.35)' }}>
                  {t('Continue to Payment','পেমেন্টে এগিয়ে যান')} <ArrowRight size={16} />
                </button>
              </form>
            )}

            {/* STEP 2: Payment method */}
            {payStep === 'gateway' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: '#FFF8F0', border: '1px solid rgba(232,82,26,0.2)' }}>
                  <div>
                    <p className="text-xs text-gray-500">{t('Donation Amount','অনুদানের পরিমাণ')}</p>
                    <p className="text-2xl font-bold" style={{ color:'#E8521A', fontFamily:'Poppins,sans-serif' }}>৳{finalAmount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setPayStep('form')} className="text-xs underline" style={{ color:'#6B7280' }}>{t('Change','পরিবর্তন')}</button>
                </div>

                <div>
                  <p className="text-xs font-semibold mb-3" style={{ color:'#374151' }}>{t('Select Payment Method','পেমেন্ট পদ্ধতি বেছে নিন')}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {([
                      { key:'bkash', label:'bKash', icon: CreditCard, color:'#E2136E', bg:'#FFF0F7' },
                      { key:'nagad', label:'Nagad', icon: CreditCard, color:'#F7941D', bg:'#FFF8F0' },
                      { key:'bank',  label:'Bank Transfer', icon: Building2, color:'#1565C0', bg:'#EBF4FF' },
                      { key:'international', label:'PayPal/Western Union', icon: Globe2, color:'#1A6B3C', bg:'#E8F5EE' },
                    ] as const).map(m => (
                      <button key={m.key} type="button" onClick={() => setPayMethod(m.key)}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                        style={{ backgroundColor: payMethod === m.key ? m.bg : '#F9FAFB', border: `2px solid ${payMethod === m.key ? m.color : '#E5E7EB'}` }}>
                        <m.icon size={20} style={{ color: m.color }} />
                        <span className="text-xs font-semibold" style={{ color: payMethod === m.key ? m.color : '#374151' }}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment details card */}
                <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid #E5E7EB' }}>
                  <div className="px-5 py-3" style={{ background: payMethod==='bkash'?'#E2136E': payMethod==='nagad'?'#F7941D': payMethod==='bank'?'#1565C0':'#1A6B3C' }}>
                    <p className="text-sm font-bold text-white">{payMethod==='bkash'?'bKash Payment': payMethod==='nagad'?'Nagad Payment': payMethod==='bank'?'Bank Transfer':'PayPal / Western Union'}</p>
                  </div>
                  <div className="p-5 space-y-3 bg-white">
                    {payMethod === 'bkash' && <>
                      <InfoRow label="Send Money To" value="+880 0000-000000" onCopy={() => copyRef('+880 0000-000000')} copied={copied} />
                      <InfoRow label="Account Type" value="Personal" />
                      <InfoRow label="Reference" value={`YCN-${finalAmount}`} onCopy={() => copyRef(`YCN-${finalAmount}`)} copied={copied} />
                      <p className="text-xs p-3 rounded-lg" style={{ backgroundColor:'#FFF0F7', color:'#E2136E' }}>Open bKash → Send Money → Enter number → Amount: ৳{finalAmount.toLocaleString()} → Reference: YCN-{finalAmount} → Confirm</p>
                    </>}
                    {payMethod === 'nagad' && <>
                      <InfoRow label="Send Money To" value="+880 0000-000000" onCopy={() => copyRef('+880 0000-000000')} copied={copied} />
                      <InfoRow label="Account Type" value="Personal" />
                      <InfoRow label="Reference" value={`YCN-${finalAmount}`} onCopy={() => copyRef(`YCN-${finalAmount}`)} copied={copied} />
                      <p className="text-xs p-3 rounded-lg" style={{ backgroundColor:'#FFF8F0', color:'#F7941D' }}>Open Nagad → Send Money → Enter number → Amount: ৳{finalAmount.toLocaleString()} → Confirm</p>
                    </>}
                    {payMethod === 'bank' && <>
                      <InfoRow label="Bank Name" value="Bangladesh Krishi Bank" />
                      <InfoRow label="Account Name" value="Youth Climate Network" />
                      <InfoRow label="Account No." value="1322 0311100509" onCopy={() => copyRef('1322 0311100509')} copied={copied} />
                      <InfoRow label="Routing No." value="035471938" onCopy={() => copyRef('035471938')} copied={copied} />
                      <InfoRow label="Branch" value="Nalian sub branch, Dacope, Khulna" />
                      <InfoRow label="Cell No." value="01730 708543" />
                      <InfoRow label="Reference" value={`YCN-DON-${finalAmount}`} onCopy={() => copyRef(`YCN-DON-${finalAmount}`)} copied={copied} />
                    </>}
                    {payMethod === 'international' && <>
                      <InfoRow label="Method" value="PayPal / Western Union" />
                      <InfoRow label="Reference" value={`YCN-INTL-${finalAmount}`} onCopy={() => copyRef(`YCN-INTL-${finalAmount}`)} copied={copied} />
                      <p className="text-xs p-3 rounded-lg" style={{ backgroundColor:'#E8F5EE', color:'#1A6B3C' }}>Please contact us for PayPal or Western Union payment details.</p>
                    </>}
                  </div>
                </div>

                <button onClick={() => setPayStep('confirm')} className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ background:'linear-gradient(135deg,#0A3320,#1A6B3C)', color:'#F0ECD8' }}>
                  {t("I've Sent the Payment",'পেমেন্ট পাঠানো হয়েছে')} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 3: Enter transaction ID */}
            {payStep === 'confirm' && (
              <form onSubmit={handleTxnSubmit} className="space-y-5">
                <div className="p-4 rounded-xl flex items-center gap-3" style={{ backgroundColor:'#E8F5EE', border:'1px solid rgba(26,107,60,0.2)' }}>
                  <ShieldCheck size={22} style={{ color:'#1A6B3C', flexShrink:0 }} />
                  <p className="text-sm" style={{ color:'#1F2937' }}>{t('Your payment has been sent. Please provide the transaction ID to complete verification.','আপনার পেমেন্ট পাঠানো হয়েছে। যাচাইয়ের জন্য ট্রানজেকশন আইডি দিন।')}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>
                    {payMethod==='bkash'?'bKash Transaction ID': payMethod==='nagad'?'Nagad Transaction ID': payMethod==='bank'?'Bank Reference / NPSB No.':'PayPal/Wise Transaction ID'} *
                  </label>
                  <input className={inputCls} style={{ ...inputStyle, fontFamily:'monospace', fontSize:'0.95rem', letterSpacing:'0.05em' }}
                    value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="e.g. TXN8BHK2ABCD" required />
                  <p className="text-xs mt-1.5" style={{ color:'#9CA3AF' }}>{t('Find this in your payment confirmation SMS or app receipt.','পেমেন্ট নিশ্চিতকরণ SMS বা রিসিটে এটি পাওয়া যাবে।')}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color:'#374151' }}>{t('Additional Note (optional)','অতিরিক্ত নোট (ঐচ্ছিক)')}</label>
                  <textarea className={inputCls} style={{ ...inputStyle, resize:'vertical' }} rows={2} value={donForm.note} onChange={e => setDonForm(f => ({ ...f, note: e.target.value }))} placeholder={t('Any note for YCN team...','YCN টিমের জন্য কোনো নোট...')} />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                  style={{ background:'linear-gradient(135deg,#E8521A,#D97706)', color:'#fff', boxShadow:'0 4px 20px rgba(232,82,26,0.35)' }}>
                  <CheckCircle size={16} /> {t('Submit for Verification','যাচাইয়ের জন্য জমা দিন')}
                </button>
              </form>
            )}

            {/* STEP 4: Success */}
            {payStep === 'success' && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background:'linear-gradient(135deg,#E8F5EE,#C8E6C9)' }}>
                  <CheckCircle size={40} style={{ color:'#1A6B3C' }} />
                </div>
                <h3 className="font-bold mb-2 text-xl" style={{ fontFamily:'Poppins,sans-serif', color:'#1F2937' }}>{t('Payment Submitted!','পেমেন্ট জমা হয়েছে!')}</h3>
                <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color:'#6B7280' }}>
                  {t('Your donation request has been received. Our team will verify your transaction ID and confirm within 1–2 business days.','আপনার অনুদান অনুরোধ পাওয়া গেছে। আমাদের টিম ১-২ কার্যদিবসের মধ্যে যাচাই করে নিশ্চিত করবে।')}
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm mb-6" style={{ backgroundColor:'#FFF8F0', border:'1px solid rgba(232,82,26,0.2)', color:'#E8521A' }}>
                  <span className="font-mono font-bold">{txnId}</span>
                  <span className="text-xs text-gray-400">· {t('Pending Review','পর্যালোচনাধীন')}</span>
                </div>
                <button onClick={() => { setPayStep('form'); setTxnId(''); setDonForm({ name:'', email:'', phone:'', type:'one-time', note:'' }); setCustomAmount(''); setSelectedAmount(2500); }}
                  className="block mx-auto text-sm underline" style={{ color:'#1A6B3C' }}>
                  {t('Make Another Donation','আরেকটি অনুদান করুন')}
                </button>
              </div>
            )}

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { amount: '৳৫০০', impact: t('Plants 10 trees and trains 1 community volunteer in climate resilience', '১০টি গাছ রোপণ করে এবং ১ জন সামাজিক স্বেচ্ছাসেবককে জলবায়ু সহনশীলতার প্রশিক্ষণ দেয়') },
                { amount: '৳২,৫০০', impact: t('Provides clean drinking water to a family for 1 year through WASH program', 'ওয়াশ প্রোগ্রামের মাধ্যমে ১ বছরের জন্য একটি পরিবারকে বিশুদ্ধ খাবার পানি সরবরাহ করে') },
                { amount: '৳১০,০০০', impact: t('Trains a youth climate leader through the Leadership Academy program', 'যুব নেতৃত্ব একাডেমির মাধ্যমে ১ জন ভবিষ্যৎ জলবায়ু নেতা গড়ে তোলে') },
              ].map(({ amount, impact }) => (
                <div key={amount} className="p-4 rounded-xl text-center" style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                  <p className="font-bold mb-1" style={{ color: '#E8521A', fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>{amount}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>{impact}</p>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, value, onCopy, copied }: { label:string, value:string, onCopy?:()=>void, copied?:boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-800" style={{ fontFamily:'monospace' }}>{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="Copy">
            {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
