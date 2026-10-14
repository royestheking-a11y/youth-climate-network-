import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: [] },
  isSuperAdmin: { type: Boolean, default: false },
});

const newsSchema = new mongoose.Schema({
  title: String,
  title_bn: String,
  excerpt: String,
  excerpt_bn: String,
  content: String,
  content_bn: String,
  date: String,
  category: String,
  category_bn: String,
  image: String,
  featured: Boolean,
});

const eventSchema = new mongoose.Schema({
  title: String,
  title_bn: String,
  date: String,
  location: String,
  location_bn: String,
  description: String,
  description_bn: String,
  type: String,
  type_bn: String,
});

const teamSchema = new mongoose.Schema({
  name: String,
  name_bn: String,
  role: String,
  role_bn: String,
  department: String,
  department_bn: String,
  bio: String,
  bio_bn: String,
  email: String,
  image: String,
  type: { type: String, default: 'member' }, // 'advisor' | 'director' | 'member'
  order: { type: Number, default: 0 },
  number: { type: Number, default: 0 },
  linkedin: String,
  featured: { type: Boolean, default: false },
});

const partnerSchema = new mongoose.Schema({
  name: String,
  category: String,
  url: String,
  logo: String,
  description: String,
  description_bn: String,
  details: String,
  details_bn: String,
});

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  bio: String,
  image: String,
  email: String,
  linkedin: String,
  twitter: String,
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_bn: String,
  slug: { type: String, sparse: true },
  content: String,
  content_bn: String,
  excerpt: String,
  excerpt_bn: String,
  image: String,
  galleryImages: { type: [String], default: [] },
  category: { type: String, default: 'Climate Action' },
  category_bn: String,
  tags: [String],
  date: String,
  readTime: { type: String, default: '5 min read' },
  location: String,
  featured: { type: Boolean, default: false },
  
  // Author
  authorId: String,
  authorName: String,
  authorRole: String,
  authorImage: String,

  // SDGs
  sdgs: { type: [Number], default: [] },

  // SEO
  seoTitle: String,
  metaDescription: String,
  metaKeywords: String,
  canonicalUrl: String,
  ogImage: String,
  imageAlt: String,
  noIndex: { type: Boolean, default: false },

  // GEO (Generative Engine Optimization)
  geoEntity: String,
  geoSummary: String,

  // AEO (Answer Engine Optimization)
  faqs: [{ question: String, answer: String }],

  // Linking
  inboundLinks: [{ text: String, url: String }],
  outboundLinks: [{ text: String, url: String, openInNewTab: Boolean }],

  // Schema Markup
  schemaType: { type: String, default: 'Article' },
  customSchema: String,
});

const founderBriefSchema = new mongoose.Schema({
  title: { type: String, default: "From a Simple Belief to a Growing Movement" },
  title_bn: String,
  subtitle: { type: String, default: "FOUNDER'S STORY" },
  subtitle_bn: String,
  content: { type: String, default: "YCN Bangladesh began with a simple belief — that young people can drive real change for our climate, communities and future. Our founder's journey reflects this belief and the story behind the network." },
  content_bn: String,
  quote: { type: String, default: "We are not just protecting our environment today — we are building a safer, stronger future for our communities." },
  quote_bn: String,
  founderName: { type: String, default: "Arafat Hossain Akash" },
  founderRole: { type: String, default: "Founder & Executive Director, Youth Climate Network" },
  founderImage: { type: String, default: "/Arafat Hossain Akash - Founder & Executive Director.jpg" },
  author: String,
  authorRole: String,
  image: String,
  videoUrl: String,
  articleLink: { type: String, default: "/about" },
  articleUrl: String,
  buttonText: { type: String, default: "Read the Full Founder's Story" },
  buttonText_bn: String,
  fullStory: {
    type: String,
    default: `On 25 May 2009, Cyclone Aila struck the coast of Bangladesh. Our home, everything we had — washed away in hours. I was nine years old, and I lost my school before I ever fully understood what I was losing. That was not the only storm of my childhood.

I grew up watching cyclone after cyclone tear through our coast — Sidr, Aila, Fani, Amphan — each one arriving with a different name but the same devastating signature: homes destroyed, harvests lost, children pulled out of school, families pushed deeper into hardship. Year after year, I watched the same communities rebuild, only to be struck down again.

That repetition — of suffering, survival, and starting over — moved something in me that has never left. In 2021, that conviction led me to establish Humanity Public Library, and subsequently the Youth Climate Network (YCN).

Our Mission is to mobilize, equip, and amplify the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — building the capacity of youth leaders and frontline communities, so that no community is left behind.`
  },
  fullStory_bn: String,
});

const ourWorkItemSchema = new mongoose.Schema({
  slug: String,
  title: { type: String, required: true },
  title_bn: String,
  desc: String,
  desc_bn: String,
  iconName: { type: String, default: 'Sprout' },
  image: String,
  link: String,
  order: { type: Number, default: 0 },
});

const aboutContentSchema = new mongoose.Schema({
  heroTagline: { type: String, default: "People · Planet · Resilient Bangladesh" },
  heroTagline_bn: { type: String, default: "মানুষ · পৃথিবী · সহনশীল বাংলাদেশ" },
  heroTitle: { type: String, default: "About YCN Bangladesh" },
  heroTitle_bn: { type: String, default: "ওয়াইসিএন বাংলাদেশ সম্পর্কে" },
  heroSubtitle: { type: String, default: "A youth-led network working for a cleaner, greener and more resilient Bangladesh." },
  heroSubtitle_bn: { type: String, default: "একটি যুব-নেতৃত্বাধীন নেটওয়ার্ক যা আরও পরিষ্কার, সবুজ এবং জলবায়ু-সহনশীল বাংলাদেশের জন্য কাজ করছে।" },

  missionTitle: { type: String, default: "Our Mission" },
  missionTitle_bn: { type: String, default: "আমাদের মিশন" },
  missionDesc: { type: String, default: "Empowering youth for a climate-resilient Bangladesh." },
  missionDesc_bn: { type: String, default: "জলবায়ু-সহনশীল বাংলাদেশের জন্য তরুণদের ক্ষমতায়ন।" },
  missionColor: { type: String, default: "#1A6B3C" },
  missionIcon: { type: String, default: "Target" },

  visionTitle: { type: String, default: "Our Vision" },
  visionTitle_bn: { type: String, default: "আমাদের ভিশন" },
  visionDesc: { type: String, default: "A sustainable, just and climate-resilient Bangladesh." },
  visionDesc_bn: { type: String, default: "একটি টেকসই, ন্যায়সঙ্গত এবং জলবায়ু-সহনশীল বাংলাদেশ।" },
  visionColor: { type: String, default: "#E8521A" },
  visionIcon: { type: String, default: "Eye" },

  approachTitle: { type: String, default: "Our Approach" },
  approachTitle_bn: { type: String, default: "আমাদের পদ্ধতি" },
  approachDesc: { type: String, default: "Youth leadership, collaboration and evidence-based action." },
  approachDesc_bn: { type: String, default: "যুব নেতৃত্ব, সহযোগিতা এবং প্রমাণ-ভিত্তিক কর্মপদ্ধতি।" },
  approachColor: { type: String, default: "#0E7490" },
  approachIcon: { type: String, default: "Users" },

  valuesTitle: { type: String, default: "Our Values" },
  valuesTitle_bn: { type: String, default: "আমাদের মূল্যবোধ" },
  valuesDesc: { type: String, default: "Inclusivity, integrity, innovation and impact." },
  valuesDesc_bn: { type: String, default: "অন্তর্ভুক্তি, সততা, উদ্ভাবন এবং ইতিবাচক প্রভাব।" },
  valuesColor: { type: String, default: "#7C3AED" },
  valuesIcon: { type: String, default: "Heart" },

  ctaTitle: { type: String, default: "Join the Youth Climate Movement" },
  ctaTitle_bn: { type: String, default: "যুব জলবায়ু আন্দোলনে যোগ দিন" },
  ctaDesc: { type: String, default: "Whether as a volunteer, partner, researcher, or supporter — there is a place for you in building a resilient Bangladesh." },
  ctaDesc_bn: { type: String, default: "স্বেচ্ছাসেবক, অংশীদার, গবেষক বা সমর্থক হিসেবে — একটি সহনশীল বাংলাদেশ গঠনে আপনার ভূমিকা রয়েছে।" },
  ctaButton1Text: { type: String, default: "Get Involved" },
  ctaButton1Text_bn: { type: String, default: "যুক্ত হোন" },
  ctaButton1Link: { type: String, default: "/get-involved" },
  ctaButton2Text: { type: String, default: "Support Our Work" },
  ctaButton2Text_bn: { type: String, default: "আমাদের সমর্থন করুন" },
  ctaButton2Link: { type: String, default: "/contact" },
});


const navigationItemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  label_bn: String,
  path: { type: String, required: true },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  dropdown: [{
    label: String,
    label_bn: String,
    path: String,
  }],
});

const robotsConfigSchema = new mongoose.Schema({
  content: { type: String, default: "User-agent: *\nAllow: /\n\nSitemap: https://ycnbd.org/sitemap.xml" },
  updatedAt: { type: Date, default: Date.now },
});

const pageSchemaSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  schemaType: { type: String, default: 'Organization' },
  structuredData: String,
});

const sdgSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  color: String,
});

const programSchema = new mongoose.Schema({
  slug: String,
  title: String,
  title_bn: String,
  iconName: String,
  theme: String,
  theme_bn: String,
  color: String,
  bg: String,
  description: String,
  description_bn: String,
  keyPrograms: [String],
  keyPrograms_bn: [String],
});

const volunteerAppSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  interest: String,
  skills: String,
  message: String,
  date: String,
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
});

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: String,
  status: { type: String, default: 'active' },
});

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: String,
  read: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' },
});

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  currency: String,
  type: String,
  date: String,
});

const donationRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  amount: Number,
  currency: String,
  type: String,
  method: String,
  txnId: String,
  note: String,
  date: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

const heroCarouselSchema = new mongoose.Schema({
  titleEn: String,
  titleBn: String,
  image: String,
  link: String,
});

const advocacySchema = new mongoose.Schema({
  title: String,
  title_bn: String,
  type: String, // 'position-paper' | 'statement' | 'press-release' | 'report'
  date: String,
  summary: String,
  summary_bn: String,
  file: String,
  pdfUrl: String,
  demands: [String],
  demands_bn: [String],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const copHistorySchema = new mongoose.Schema({
  event: { type: String, required: true },
  event_bn: String,
  year: String,
  role: String,
  role_bn: String,
  outcome: String,
  outcome_bn: String,
  highlight: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
});

const policyPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_bn: String,
  desc: String,
  desc_bn: String,
  order: { type: Number, default: 0 },
});


const partnershipInquirySchema = new mongoose.Schema({
  name: String,
  org: String,
  email: String,
  phone: String,
  type: String,
  message: String,
  date: String,
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
});

const internshipAppSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  program: String,
  university: String,
  skills: String,
  message: String,
  date: String,
  status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
});

const internshipPostSchema = new mongoose.Schema({
  title: String,
  title_bn: String,
  duration: String,
  duration_bn: String,
  desc: String,
  desc_bn: String,
  requirements: [String],
  requirements_bn: [String],
  active: { type: Boolean, default: true },
  badgeColor: { type: String, default: '#1A6B3C' },
});

const impactStatsSchema = new mongoose.Schema({
  peopleReached: Number,
  treesPlanted: Number,
  volunteers: Number,
  projects: Number,
  partners: Number,
  districts: Number,
});

const mediaSchema = new mongoose.Schema({
  type: { type: String, enum: ['image', 'video', 'press', 'pressKit'], default: 'image' },
  title: String,
  title_bn: String,
  category: String,
  category_bn: String,
  url: String,
  thumbnail: String,
  location: String,
  location_bn: String,
  date: String,
  duration: String,
  outlet: String, // For press
  desc: String, // For pressKit
  size: String, // For pressKit
});

const siteSettingsSchema = new mongoose.Schema({
  phone: { type: String, default: '+88 01911 368538' },
  email: { type: String, default: 'youthclimatenetworkbd@gmail.com' },
  addressDhaka: { type: String, default: '15/KA, Shyamoli, Mirpur Road\nDhaka-1207, Bangladesh' },
  addressDhaka_bn: { type: String, default: '১৫/ক, শ্যামলী, মিরপুর রোড\nঢাকা-১২০৭, বাংলাদেশ' },
  addressKhulna: { type: String, default: 'Village + Post: Nalian 9273\nUnion: Sutrakhali, Dacope, Khulna' },
  addressKhulna_bn: { type: String, default: 'গ্রাম + ডাক: নলিয়ান ৯২৭৩\nইউনিয়ন: সুতারখালী, দাকোপ, খুলনা' },
  whatsappLink: { type: String, default: 'https://whatsapp.com/channel/0029VbDURgAADTOEJvOAEX2z' },
  facebookUrl: { type: String, default: 'https://www.facebook.com/youthclimatenetwork' },
  twitterUrl: { type: String, default: 'https://x.com/ycnorgbd' },
  instagramUrl: { type: String, default: 'https://www.instagram.com/youthclimatenetworkbd/' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/company/youth-climate-network' },
  youtubeUrl: { type: String, default: 'https://www.youtube.com/@YouthClimateNetwork' },
  registrationNumber: { type: String, default: 'Reg. No. S-13962/2023' },
  registrationAuthority: { type: String, default: 'Registrar of Joint Stock Companies and Firms, Government of Bangladesh' },
  registrationAuthority_bn: { type: String, default: 'যৌথ মূলধন কোম্পানি ও ফার্মসমূহের পরিদপ্তর, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার' },
  bkashNumber: { type: String, default: '+880 1911-368538' },
  bkashType: { type: String, default: 'Personal' },
  nagadNumber: { type: String, default: '+880 1911-368538' },
  nagadType: { type: String, default: 'Personal' },
  bankName: { type: String, default: 'Bangladesh Krishi Bank' },
  bankAccountName: { type: String, default: 'Youth Climate Network' },
  bankAccountNumber: { type: String, default: '1322 0311100509' },
  bankRoutingNumber: { type: String, default: '035471938' },
  bankBranch: { type: String, default: 'Nalian sub branch, Dacope, Khulna' },
  bankCell: { type: String, default: '01730 708543' },
  intlPaymentNote: { type: String, default: 'Please contact us for PayPal or Western Union payment details.' },
  intlPaymentNote_bn: { type: String, default: 'পেপ্যাল বা ওয়েস্টার্ন ইউনিয়ন পেমেন্টের জন্য সরাসরি যোগাযোগ করুন।' },
  mindShantaraStartupPlanUrl: { type: String, default: '/MindShantara_Startup_Plan_2026.pdf' },
  mindShantaraTitle: { type: String, default: 'Mind Shantara' },
  mindShantaraTitle_bn: { type: String, default: 'মাইন্ড শান্তারা' },
  mindShantaraSubtitle: { type: String, default: "Bangladesh’s First Climate Anxiety & Mental Health Wellbeing platform." },
  mindShantaraSubtitle_bn: { type: String, default: "বাংলাদেশের প্রথম জলবায়ু উদ্বেগ এবং মানসিক স্বাস্থ্য সুরক্ষা প্ল্যাটফর্ম।" },
  mindShantaraDesc: { type: String, default: "Climate change is not just an environmental crisis—it is a deeply emotional and psychological one. Mind Shantara is dedicated to addressing eco-anxiety and providing a safe space for youth and frontline communities to find mental health support." },
  mindShantaraDesc_bn: { type: String, default: "জলবায়ু পরিবর্তন শুধুমাত্র একটি পরিবেশগত সংকট নয়—এটি একটি গভীর মানসিক সংকটও। মাইন্ড শান্তারা ইকো-অ্যাংজাইটি (পরিবেশগত উদ্বেগ) মোকাবেলা করতে এবং তরুণদের জন্য মানসিক স্বাস্থ্য সহায়তা প্রদানের জন্য নিবেদিত।" },
  privacyLastUpdated: { type: String, default: "May 20, 2026" },
  privacyLastUpdated_bn: { type: String, default: "২০ মে, ২০২৬" },
  termsLastUpdated: { type: String, default: "May 20, 2026" },
  termsLastUpdated_bn: { type: String, default: "২০ মে, ২০২৬" },
});


const impactReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  title_bn: String,
  date: String,
  pages: String,
  type: String,
  fileUrl: String,
  order: { type: Number, default: 0 },
});

const caseStudySchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_bn: String,
  location: String,
  location_bn: String,
  program: String,
  program_bn: String,
  story: String,
  story_bn: String,
  impact: String,
  impact_bn: String,
  image: String,
  color: { type: String, default: '#0A3320' },
  bg: { type: String, default: '#E8F5EE' },
  order: { type: Number, default: 0 },
});

const volunteerTrackSchema = new mongoose.Schema({
  slug: String,
  title: { type: String, required: true },
  title_bn: String,
  badge: String,
  commitment: String,
  location: String,
  description: String,
  description_bn: String,
  responsibilities: [String],
  responsibilities_bn: [String],
  skills: [String],
  benefits: [String],
  order: { type: Number, default: 0 },
});

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export const News = mongoose.model('News', newsSchema);
export const Event = mongoose.model('Event', eventSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Partner = mongoose.model('Partner', partnerSchema);
export const VolunteerApp = mongoose.model('VolunteerApp', volunteerAppSchema);
export const NewsletterSub = mongoose.model('NewsletterSub', newsletterSchema);
export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export const Donation = mongoose.model('Donation', donationSchema);
export const DonationRequest = mongoose.model('DonationRequest', donationRequestSchema);
export const HeroCarousel = mongoose.model('HeroCarousel', heroCarouselSchema);
export const Advocacy = mongoose.model('Advocacy', advocacySchema);
export const PartnershipInquiry = mongoose.model('PartnershipInquiry', partnershipInquirySchema);
export const InternshipApp = mongoose.model('InternshipApp', internshipAppSchema);
export const InternshipPost = mongoose.model('InternshipPost', internshipPostSchema);
export const ImpactStats = mongoose.model('ImpactStats', impactStatsSchema);
export const Media = mongoose.model('Media', mediaSchema);
export const Blog = mongoose.model('Blog', blogSchema);
export const Program = mongoose.model('Program', programSchema);
export const Author = mongoose.model('Author', authorSchema);
export const FounderBrief = mongoose.model('FounderBrief', founderBriefSchema);
export const NavigationItem = mongoose.model('NavigationItem', navigationItemSchema);
export const RobotsConfig = mongoose.model('RobotsConfig', robotsConfigSchema);
export const PageSchema = mongoose.model('PageSchema', pageSchemaSchema);
export const SDG = mongoose.model('SDG', sdgSchema);
export const OurWorkItem = mongoose.model('OurWorkItem', ourWorkItemSchema);
export const AboutContent = mongoose.model('AboutContent', aboutContentSchema);
export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export const ImpactReport = mongoose.model('ImpactReport', impactReportSchema);
export const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);
export const VolunteerTrack = mongoose.model('VolunteerTrack', volunteerTrackSchema);
export const CopHistory = mongoose.model('CopHistory', copHistorySchema);
export const PolicyPosition = mongoose.model('PolicyPosition', policyPositionSchema);

