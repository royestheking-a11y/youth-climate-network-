export interface ImpactStats {
  peopleReached: number;
  treesPlanted: number;
  volunteers: number;
  projects: number;
  partners: number;
  districts: number;
}

export interface NewsItem {
  id: string;
  title: string;
  title_bn: string;
  excerpt: string;
  excerpt_bn: string;
  content: string;
  content_bn: string;
  date: string;
  category: string;
  category_bn: string;
  image: string;
  featured: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  title_bn: string;
  date: string;
  location: string;
  location_bn: string;
  description: string;
  description_bn: string;
  type: string;
  type_bn: string;
}

export interface TeamMember {
  id: string;
  name: string;
  name_bn?: string;
  role: string;
  role_bn: string;
  bio: string;
  bio_bn: string;
  email: string;
  image: string;
  type?: 'member' | 'advisor';
}

export interface Partner {
  id: string;
  name: string;
  category: string;
  url: string;
  logo: string;
}

export interface VolunteerApp {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  skills: string;
  message: string;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface NewsletterSub {
  id: string;
  email: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface DonationRecord {
  id: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  type: string;
  date: string;
}

export interface DonationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  type: string;          // 'one-time' | 'monthly'
  method: string;        // 'bkash' | 'nagad' | 'bank' | 'international'
  txnId: string;         // transaction/reference ID entered by donor
  note: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface HeroCarouselItem {
  id: string;
  titleEn: string;
  titleBn: string;
  image: string;
  link: string;
}

export interface AdvocacyItem {
  id: string;
  title: string;
  title_bn: string;
  type: 'position-paper' | 'statement' | 'press-release' | 'report';
  date: string;
  summary: string;
  summary_bn: string;
  file?: string;
  featured: boolean;
}

export interface PartnershipInquiry {
  id: string;
  name: string;
  org: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface InternshipApp {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  university: string;
  skills: string;
  message: string;
  date: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface InternshipPost {
  id: string;
  title: string;
  title_bn: string;
  duration: string;
  duration_bn: string;
  desc: string;
  desc_bn: string;
  requirements: string[];
  requirements_bn: string[];
  active: boolean;
  badgeColor: string;
}

const DEFAULT_STATS: ImpactStats = {
  peopleReached: 75000,
  treesPlanted: 10000,
  volunteers: 1200,
  projects: 15,
  partners: 20,
  districts: 64,
};

const DEFAULT_CAROUSEL: HeroCarouselItem[] = [
  {
    id: '1',
    titleEn: 'YOUTH CLIMATE ACTION',
    titleBn: 'যুব জলবায়ু পদক্ষেপ',
    image: '/youth_climate_action.png',
    link: '/about'
  },
  {
    id: '2',
    titleEn: 'SUSTAINABLE ENERGY',
    titleBn: 'টেকসই শক্তি',
    image: '/sustainable_energy.png',
    link: '/impact'
  },
  {
    id: '3',
    titleEn: 'DISASTER RESILIENCE',
    titleBn: 'দুর্যোগ সহনশীলতা',
    image: '/disaster_resilience.png',
    link: '/programs'
  },
  {
    id: '4',
    titleEn: 'EDUCATION & RESEARCH',
    titleBn: 'শিক্ষা ও গবেষণা',
    image: '/education_research.png',
    link: '/get-involved'
  }
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'YCN at COP29: Demanding Climate Justice for Bangladesh',
    title_bn: 'কপ-২৯ সম্মেলনে ওয়াইসিএন: বাংলাদেশের জন্য জলবায়ু ন্যায়বিচারের দাবি',
    excerpt: 'Youth Climate Network delegates participated in UNFCCC COP29, presenting Bangladesh\'s climate vulnerability report and demanding urgent loss and damage finance for frontline communities.',
    excerpt_bn: 'ইয়ুথ ক্লাইমেট নেটওয়ার্কের প্রতিনিধিরা কপ-২৯ (COP29) সম্মেলনে অংশ নিয়ে বাংলাদেশের জলবায়ুঝুঁকি বিষয়ক প্রতিবেদন পেশ করেন এবং ক্ষতিগ্রস্তদের জন্য জরুরি অর্থায়নের দাবি জানান।',
    content: 'Youth Climate Network sent a delegation to COP29 in Baku, Azerbaijan, representing the voices of young people and frontline communities from Bangladesh. Our delegates participated in formal negotiations, side events, and advocacy meetings with government representatives from developed nations.',
    content_bn: 'ইয়ুথ ক্লাইমেট নেটওয়ার্ক আজারবাইজানের বাকুতে অনুষ্ঠিত কপ-২৯ সম্মেলনে প্রতিনিধি দল পাঠায়, যারা বাংলাদেশের যুবসমাজ ও ক্ষতিগ্রস্ত উপকূলীয় মানুষের কণ্ঠস্বর তুলে ধরে। আমাদের প্রতিনিধিরা নীতিনির্ধারণী বৈঠক ও দ্বিপাক্ষিক সভায় অংশ নেন।',
    date: '2024-11-20',
    category: 'Advocacy',
    category_bn: 'অ্যাডভোকেসি',
    image: 'https://images.unsplash.com/photo-1636304182456-5c25a53856a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGltYXRlJTIweW91dGglMjBCYW5nbGFkZXNoJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzc5MjU3NTI5fDA&ixlib=rb-4.1.0&q=80&w=600',
    featured: true,
  },
  {
    id: '2',
    title: 'Solar Homes Project Reaches 500 Families in Khulna',
    title_bn: 'খুলনায় ৫০০ পরিবারে পৌঁছাল সোলার হোমস প্রকল্প',
    excerpt: 'YCN\'s renewable energy program has successfully provided solar home systems to 500 off-grid families in Khulna, reducing reliance on fossil fuels and cutting energy costs.',
    excerpt_bn: 'ওয়াইসিএন-এর নবায়নযোগ্য শক্তি কর্মসূচির মাধ্যমে খুলনার গ্রিড-বহির্ভূত ৫০০টি পরিবারে সোলার হোম সিস্টেম সরবরাহ করা হয়েছে, যা জীবাশ্ম জ্বালানির ব্যবহার কমাবে।',
    content: 'The Solar Homes Project, funded by international climate finance, has reached a milestone of 500 families in the coastal belt of Khulna division. Each household now has reliable solar power for lighting, mobile charging, and water pumping.',
    content_bn: 'আন্তর্জাতিক জলবায়ু তহবিলের অর্থায়নে সোলার হোমস প্রকল্প খুলনার উপকূলীয় অঞ্চলের ৫০০টি পরিবারের মাইলফলক স্পর্শ করেছে। প্রতিটি পরিবার এখন আলো, মোবাইল চার্জিং এবং পানির পাম্পের জন্য নির্ভরযোগ্য সৌর শক্তি পাচ্ছে।',
    date: '2024-10-15',
    category: 'Renewable Energy',
    category_bn: 'নবায়নযোগ্য শক্তি',
    image: 'https://images.unsplash.com/photo-1758599668360-48ba8ba71b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlJTIwcGxhbnRpbmclMjBjb21tdW5pdHklMjBlbnZpcm9ubWVudGFsJTIwdm9sdW50ZWVyc3xlbnwxfHx8fDE3NzkyNTc1Mjl8MA&ixlib=rb-4.1.0&q=80&w=600',
    featured: true,
  },
  {
    id: '3',
    title: 'Youth Leadership Academy 2024 Graduates 120 Climate Champions',
    title_bn: 'যুব নেতৃত্ব একাডেমি ২০২৪ থেকে ১২০ জন জলবায়ু চ্যাম্পিয়নের স্নাতক সম্পন্ন',
    excerpt: 'The third cohort of YCN\'s Youth Leadership Academy has successfully completed their training, with 120 young leaders ready to drive climate action in their communities.',
    excerpt_bn: 'ওয়াইসিএন-এর যুব নেতৃত্ব একাডেমির তৃতীয় ব্যাচ তাদের প্রশিক্ষণ সফলভাবে সম্পন্ন করেছে, যেখানে ১২০ জন তরুণ তাদের নিজ নিজ এলাকায় কাজ করতে প্রস্তুত।',
    content: 'The Youth Leadership Academy 2024 concluded with a graduation ceremony attended by government officials, civil society leaders, and international partners. Graduates received certificates and were connected with mentors across the region.',
    content_bn: 'সরকারি কর্মকর্তা, সুশীল সমাজের প্রতিনিধি এবং আন্তর্জাতিক অংশীদারদের উপস্থিতিতে যুব নেতৃত্ব একাডেমি ২০২৪-এর সমাবর্তন অনুষ্ঠিত হয়। গ্র্যাজুয়েটরা সার্টিফিকেট লাভ করেন এবং মেন্টরদের সাথে যুক্ত হন।',
    date: '2024-09-05',
    category: 'Youth Development',
    category_bn: 'যুব উন্নয়ন',
    image: 'https://images.unsplash.com/photo-1573906094214-194b33da6acc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwZGV2ZWxvcGluZyUyMHdvcmxkJTIwbGVhZGVyc2hpcHxlbnwxfHx8fDE3NzkyNTc1MzZ8MA&ixlib=rb-4.1.0&q=80&w=600',
    featured: true,
  },
  {
    id: '4',
    title: 'YCN Launches Mangrove Restoration Drive in Sundarbans',
    title_bn: 'সুন্দরবনে ম্যানগ্রোভ পুনরুদ্ধার অভিযান শুরু করল ওয়াইসিএন',
    excerpt: 'In partnership with local communities, YCN has launched an ambitious mangrove restoration initiative targeting 500 hectares in the Sundarbans buffer zone.',
    excerpt_bn: 'স্থানীয় জনগণের সাথে অংশীদারিত্বে ওয়াইসিএন সুন্দরবনের বাফার জোনে ৫০০ হেক্টর এলাকায় ম্যানগ্রোভ পুনরুদ্ধার কার্যক্রম শুরু করেছে।',
    content: 'The Mangrove Restoration Drive brings together community volunteers, local fishermen, and environmental scientists to restore degraded mangrove areas. The initiative will sequester carbon while protecting coastal communities from cyclones and tidal surges.',
    content_bn: 'ম্যানগ্রোভ পুনরুদ্ধার অভিযানে স্থানীয় মৎস্যজীবী, সাধারণ মানুষ ও পরিবেশ বিজ্ঞানীরা একসাথে ক্ষতিগ্রস্ত বন এলাকা পুনরুদ্ধারে কাজ করছেন, যা কার্বন শোষণ করবে এবং জলোচ্ছ্বাস থেকে রক্ষা করবে।',
    date: '2024-08-12',
    category: 'Environment',
    category_bn: 'পরিবেশ',
    image: 'https://images.unsplash.com/photo-1682778556316-ff439b06a1ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjbGltYXRlJTIweW91dGglMjBCYW5nbGFkZXNoJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzc5MjU3NTI5fDA&ixlib=rb-4.1.0&q=80&w=600',
    featured: false,
  },
  {
    id: '5',
    title: 'WASH Program Delivers Clean Water to 3,000 Coastal Households',
    title_bn: 'উপকূলীয় ৩,০০০ পরিবারে বিশুদ্ধ পানি পৌঁছে দিল ওয়াইসিএন ওয়াশ প্রোগ্রাম',
    excerpt: 'YCN\'s water security program has installed arsenic-free tube wells and rainwater harvesting systems, giving 3,000 coastal households access to safe drinking water.',
    excerpt_bn: 'ওয়াইসিএন-এর পানি নিরাপত্তা কর্মসূচি আর্সেনিকমুক্ত নলকূপ ও বৃষ্টির পানি সংগ্রহের ব্যবস্থা স্থাপনের মাধ্যমে ৩,০০০ উপকূলীয় পরিবারে নিরাপদ পানির নিশ্চয়তা দিয়েছে।',
    content: 'Safe water access remains a critical challenge in coastal Bangladesh due to salinity intrusion and arsenic contamination. YCN\'s WASH program has addressed this with community-managed water points across 25 villages.',
    content_bn: 'লবণাক্ততা বৃদ্ধি ও আর্সেনিকের কারণে নিরাপদ পানির তীব্র সংকট দূর করতে ওয়াইসিএন ২৫টি গ্রাম জুড়ে সামাজিক ব্যবস্থাপনায় ওয়াটার পয়েন্ট স্থাপন করেছে।',
    date: '2024-07-20',
    category: 'WASH',
    category_bn: 'ওয়াশ (WASH)',
    image: 'https://images.unsplash.com/photo-1582783681787-2503399778d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjbGltYXRlJTIweW91dGglMjBCYW5nbGFkZXNoJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzc5MjU3NTI5fDA&ixlib=rb-4.1.0&q=80&w=600',
    featured: false,
  },
  {
    id: '6',
    title: 'Women\'s Climate Leadership Program Empowers 200 Women',
    title_bn: 'নারীদের জলবায়ু নেতৃত্ব কর্মসূচির মাধ্যমে ২০০ জন নারী ক্ষমতায়িত',
    excerpt: 'Two hundred women from climate-vulnerable communities have completed YCN\'s Women\'s Climate Leadership Program, gaining skills to lead community resilience initiatives.',
    excerpt_bn: 'জলবায়ু-ঝুঁকিপূর্ণ এলাকার ২০০ জন নারী ওয়াইসিএন-এর লিডারশিপ প্রোগ্রাম সম্পন্ন করে সমাজ পুনর্গঠন ও সহনশীলতার দক্ষতা অর্জন করেছেন।',
    content: 'The program covered climate science basics, community organizing, resource mobilization, and leadership skills. Graduates have already started 15 women-led savings groups and initiated community gardens.',
    content_bn: 'এই প্রোগ্রামে জলবায়ু বিজ্ঞান, নেতৃত্ব, সামাজিক সংগঠন ও সম্পদ সংগ্রহ শেখানো হয়। অংশগ্রহণকারীরা ইতিমধ্যে ১৫টি সমবায় সঞ্চয় দল এবং যৌথ বাগান চালু করেছেন।',
    date: '2024-06-10',
    category: 'Women Empowerment',
    category_bn: 'নারী ক্ষমতায়ন',
    image: 'https://images.unsplash.com/photo-1583971663176-dd7180de1b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwZGV2ZWxvcGluZyUyMHdvcmxkJTIwbGVhZGVyc2hpcHxlbnwxfHx8fDE3NzkyNTc1MzZ8MA&ixlib=rb-4.1.0&q=80&w=600',
    featured: false,
  },
];

const DEFAULT_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Annual Climate Symposium 2025',
    title_bn: 'বার্ষিক জলবায়ু সিম্পোজিয়াম ২০২৫',
    date: '2025-03-22',
    location: 'Dhaka, Bangladesh',
    location_bn: 'ঢাকা, বাংলাদেশ',
    description: 'Join climate scientists, policymakers, and youth advocates for a full-day symposium on South Asia\'s climate future. Registration open to youth under 35.',
    description_bn: 'দক্ষিণ এশিয়ার জলবায়ু ভবিষ্যত নিয়ে একদিনের সিম্পোজিয়ামে যোগ দিন। ৩৫ বছরের কম বয়সীদের জন্য নিবন্ধন উন্মুক্ত।',
    type: 'Conference',
    type_bn: 'সম্মেলন',
  },
  {
    id: '2',
    title: 'National Tree Plantation Drive 2025',
    title_bn: 'জাতীয় বৃক্ষরোপণ কর্মসূচি ২০২৫',
    date: '2025-06-05',
    location: 'Nationwide, Bangladesh',
    location_bn: 'সারাদেশে, বাংলাদেশ',
    description: 'Join thousands of volunteers across Bangladesh to plant 10,000 native trees on World Environment Day. Volunteer registration now open.',
    description_bn: 'বিশ্ব পরিবেশ দিবসে ১০,০০০ গাছ লাগাতে অংশ নিন। স্বেচ্ছাসেবক নিবন্ধন চলছে।',
    type: 'Campaign',
    type_bn: 'প্রচারণা',
  },
  {
    id: '3',
    title: 'Youth Leadership Academy 2025 — Applications Open',
    title_bn: 'যুব নেতৃত্ব একাডেমে ২০২৫ — আবেদন আহ্বান',
    date: '2025-01-15',
    location: 'Khulna & Online',
    location_bn: 'খুলনা এবং অনলাইন',
    description: 'Applications are now open for the 4th cohort of our flagship Youth Leadership Academy. 60 places available for youth aged 18–30.',
    description_bn: '৪র্থ যুব নেতৃত্ব একাডেমিতে ভর্তি চলছে। ১৮-৩০ বছর বয়সীদের ৬০টি আসন খালি আছে।',
    type: 'Program',
    type_bn: 'প্রোগ্রাম',
  },
  {
    id: '4',
    title: 'Climate Resilience Workshop — Coastal Communities',
    title_bn: 'জলবায়ু সহনশীলতা কর্মশালা — উপকূলীয় সম্প্রদায়',
    date: '2025-02-10',
    location: 'Satkhira, Bangladesh',
    location_bn: 'সাতক্ষীরা, বাংলাদেশ',
    description: 'A 2-day workshop for community leaders and farmers on climate-smart agriculture, flood preparedness, and disaster risk reduction.',
    description_bn: 'কৃষক ও সামাজিক নেতাদের জন্য জলবায়ু-সহনশীল কৃষি ও দুর্যোগ প্রস্তুতির ২ দিনের কর্মশালা।',
    type: 'Workshop',
    type_bn: 'কর্মশালা',
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  { id: '1', name: 'Arafat Hossain Akash', name_bn: '', role: 'Founder & Executive Director', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png', type: 'member' },
  { id: '2', name: 'Madhusudan Mondal', name_bn: '', role: 'Head of Programme & Climate Action', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /2. Madhusudan Mondal - Head of Programme & Climate Action.png', type: 'member' },
  { id: '3', name: 'Ariful Islam', name_bn: '', role: 'Community Engagement Officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /3. Ariful Islam -  Community Engagement Officer.png', type: 'member' },
  { id: '4', name: 'Jobaer Hossain', name_bn: '', role: 'Monitoring, Evaluation & Learning ( MEAL)  officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /4.  Jobaer Hossain - Monitoring, Evaluation & Learning ( MEAL)  officer.png', type: 'member' },
  { id: '5', name: 'Puja Gain', name_bn: '', role: 'Volunteer Coordinator', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /5.  Puja Gain -  Volunteer Coordinator.png', type: 'member' },
  { id: '6', name: 'Sadique Haseen Ratul', name_bn: '', role: 'Head of Digital Engagement & Advocacy', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /6.  Sadique Haseen Ratul  - Head of Digital Engagement & Advocacy.png', type: 'member' },
  { id: '7', name: 'Usha Bin Farid', name_bn: '', role: 'Communications & Content Officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /7. Usha Bin Farid - Communications & Content Officer.jpg', type: 'member' },
  { id: '8', name: 'Md Nahid Hosen', name_bn: '', role: 'Head of Partnerships & Resource Mobilization', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /8. Md Nahid Hosen - Head of Partnerships & Resource Mobilization.png', type: 'member' },
  { id: '9', name: 'Azibar Hossain', name_bn: '', role: 'Partnerships officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /9. Azibar Hossain - Partnerships officer. .png', type: 'member' },
  { id: '10', name: 'Antora Akter Nodee', name_bn: '', role: 'Fundraising Coordinator', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /10.  Antora Akter Nodee - Fundraising Coordinator.png', type: 'member' },
  { id: '11', name: 'Hasibul Alam Hridoy', name_bn: '', role: 'Head of Research,  Policy & Innovation', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /11. Hasibul Alam Hridoy  - Head of Research,  Policy & Innovation.jpg', type: 'member' },
  { id: '12', name: 'Rifat Sana', name_bn: '', role: 'Knowledge Management Officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /12. Rifat Sana -Knowledge Management Officer. .png', type: 'member' },
  { id: '13', name: 'Md. Arif Morol', name_bn: '', role: 'Finance & Adminstration Manager', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /13. Md. Arif Morol - Finance & Adminstration Manager_.png', type: 'member' },
  { id: '14', name: 'Ashikur Rahman', name_bn: '', role: 'Head of  Operations', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /14. Ashikur Rahman - Head of  Operations.png', type: 'member' },
  { id: '15', name: 'Imran Hosen', name_bn: '', role: 'Head of Logistics officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /14.Imran Hosen - Head of Logistics officer.png', type: 'member' },
  { id: '16', name: 'Anupurba Sarkar', name_bn: '', role: 'People & Culture Manager', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /16. Anupurba Sarkar -  People & Culture Manager. .png', type: 'member' },
  { id: '17', name: 'Riaz Afrin', name_bn: '', role: 'Learning & Development Officer', role_bn: '', bio: '', bio_bn: '', email: '', image: '/Formal Image -  Meet our team /17.  Riaz Afrin  - Learning & Development Officer.png', type: 'member' },
];

const DEFAULT_PARTNERS: Partner[] = [
  { id: '1', name: 'UNFCCC YOUNGO', category: 'International Youth', url: '#', logo: '' },
  { id: '2', name: 'UNDP Bangladesh', category: 'UN Agency', url: '#', logo: '' },
  { id: '3', name: 'UNICEF Bangladesh', category: 'UN Agency', url: '#', logo: '' },
  { id: '4', name: 'UN Women Bangladesh', category: 'UN Agency', url: '#', logo: '' },
  { id: '5', name: 'ActionAid Bangladesh', category: 'NGO', url: '#', logo: '' },
  { id: '6', name: 'Dept. of Youth Development', category: 'Government', url: '#', logo: '' },
  { id: '7', name: 'Dept. of Environment', category: 'Government', url: '#', logo: '' },
  { id: '8', name: 'Khulna University', category: 'Academic', url: '#', logo: '' },
  { id: '9', name: 'Dhaka University — Environmental Science', category: 'Academic', url: '#', logo: '' },
  { id: '10', name: 'Asia Pacific Youth Climate Coalition', category: 'Regional Network', url: '#', logo: '' },
  { id: '11', name: 'Practical Action Bangladesh', category: 'NGO', url: '#', logo: '' },
  { id: '12', name: 'WWF Bangladesh', category: 'NGO', url: '#', logo: '' },
];

const DEFAULT_ADVOCACY: AdvocacyItem[] = [
  {
    id: '1',
    title: 'Bangladesh Youth Climate Position Paper — COP29',
    title_bn: 'বাংলাদেশ যুব জলবায়ু অবস্থানপত্র — কপ-২৯',
    type: 'position-paper',
    date: '2024-11-01',
    summary: 'A comprehensive position paper representing the demands of Bangladesh\'s youth at COP29, focusing on loss and damage finance, just energy transition, and climate migration rights.',
    summary_bn: 'কপ-২৯ সম্মেলনে বাংলাদেশের যুবসমাজের দাবিসমূহ সম্বলিত অবস্থানপত্র, যেখানে ক্ষতি ও ঋণ তহবিল, শক্তি রূপান্তর এবং জলবায়ু উদ্বাস্তু অধিকারের ওপর জোর দেওয়া হয়েছে।',
    featured: true,
  },
  {
    id: '2',
    title: 'Statement on the Inadequacy of the New Collective Quantified Goal',
    title_bn: 'নতুন যৌথ পরিমাপিত লক্ষ্যমাত্রার (NCQG) অপর্যাপ্ততা নিয়ে বিবৃতি',
    type: 'statement',
    date: '2024-11-20',
    summary: 'YCN\'s official statement following COP29 outcomes, calling the NCQG insufficient and demanding developed nations deliver on their climate finance commitments.',
    summary_bn: 'কপ-২৯ সম্মেলন শেষে ওয়াইসিএন-এর অফিসিয়াল বিবৃতি, যেখানে নতুন তহবিল অপর্যাপ্ত ঘোষণা করে উন্নত দেশগুলোর জলবায়ু অর্থায়ন প্রদানের আহ্বান জানানো হয়েছে।',
    featured: true,
  },
  {
    id: '3',
    title: 'Youth Perspectives on Bangladesh\'s Updated NDC',
    title_bn: 'বাংলাদেশের হালনাগাদকৃত এনডিসির ওপর তরুণদের দৃষ্টিভঙ্গি',
    type: 'report',
    date: '2024-08-15',
    summary: 'An analysis of Bangladesh\'s updated Nationally Determined Contribution from a youth and frontline community perspective, with recommendations for enhanced ambition.',
    summary_bn: 'তরুণদের দৃষ্টিকোণ থেকে বাংলাদেশের হালনাগাদকৃত জাতীয় কার্বন নির্গমন কমানোর লক্ষ্যের ওপর এক বিশ্লেষণমূলক প্রতিবেদন ও সুপারিশ।',
    featured: false,
  },
  {
    id: '4',
    title: 'Press Release: YCN Calls for Emergency Climate Fund for Sundarbans',
    title_bn: 'প্রেস বিজ্ঞপ্তি: সুন্দরবনের জন্য জরুরি জলবায়ু তহবিলের আহ্বান ওয়াইসিএন-এর',
    type: 'press-release',
    date: '2024-07-01',
    summary: 'Following Cyclone Remal, YCN demands emergency climate adaptation funding for Sundarbans communities and an independent inquiry into coastal embankment failures.',
    summary_bn: 'ঘূর্ণিঝড় রিমালের আঘাতে সুন্দরবন ধ্বংসের পর জরুরি অভিযোজন তহবিল গঠন এবং ত্রুটিপূর্ণ বাঁধ নির্মাণের বিরুদ্ধে তদন্তের দাবি জানিয়ে প্রেস বিজ্ঞপ্তি।',
    featured: false,
  },
  {
    id: '5',
    title: 'Climate Migration & Displacement: Bangladesh\'s Silent Crisis',
    title_bn: 'জলবায়ু অভিবাসন ও বাস্তুচ্যুতি: বাংলাদেশের নীরব সংকট',
    type: 'position-paper',
    date: '2024-05-20',
    summary: 'A position paper documenting climate displacement in Bangladesh\'s coastal belt and calling for a regional framework on climate mobility rights.',
    summary_bn: 'বাংলাদেশের উপকূলীয় অঞ্চলে জলবায়ুজনিত বাস্তুচ্যুতির চিত্র এবং তাদের জন্য একটি আঞ্চলিক অধিকার কাঠামোর সুপারিশ করে অবস্থানপত্র।',
    featured: false,
  },
];

// Storage utility functions
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function initializeStorage(): void {
  // Safe migration check using v2 identifier
  if (!localStorage.getItem('ycn_initialized_v2')) {
    setItem('ycn_stats', DEFAULT_STATS);
    setItem('ycn_news', DEFAULT_NEWS);
    if (!getItem('ycn_team_v2', null)) {
      setItem('ycn_team_v2', DEFAULT_TEAM);
    }
    setItem('ycn_partners', DEFAULT_PARTNERS);
    setItem('ycn_advocacy', DEFAULT_ADVOCACY);

    // Retain existing records if present
    const oldApps = localStorage.getItem('ycn_volunteer_apps');
    if (!oldApps) setItem('ycn_volunteer_apps', []);
    const oldNews = localStorage.getItem('ycn_newsletter');
    if (!oldNews) setItem('ycn_newsletter', []);
    const oldContact = localStorage.getItem('ycn_contact_messages');
    if (!oldContact) setItem('ycn_contact_messages', []);
    const oldDonations = localStorage.getItem('ycn_donations');
    if (!oldDonations) setItem('ycn_donations', []);
    const oldPartnerships = localStorage.getItem('ycn_partnership_inquiries');
    if (!oldPartnerships) setItem('ycn_partnership_inquiries', []);
    const oldInternships = localStorage.getItem('ycn_internship_apps');
    if (!oldInternships) setItem('ycn_internship_apps', []);

    localStorage.setItem('ycn_initialized_v2', 'true');
    localStorage.setItem('ycn_initialized', 'true');
  }
}

// Media
export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'press' | 'pressKit';
  title: string;
  title_bn?: string;
  category?: string;
  category_bn?: string;
  url?: string;
  thumbnail?: string;
  location?: string;
  location_bn?: string;
  date?: string;
  duration?: string;
  outlet?: string;
  desc?: string;
  size?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  isSuperAdmin: boolean;
}

// Stats
export const getStats = (): ImpactStats => getItem('ycn_stats', DEFAULT_STATS);
export const saveStats = (stats: ImpactStats): void => setItem('ycn_stats', stats);

// News
export const getNews = (): NewsItem[] => getItem('ycn_news', DEFAULT_NEWS);
export const saveNews = (news: NewsItem[]): void => setItem('ycn_news', news);

// Events
export const getEvents = (): EventItem[] => getItem('ycn_events', DEFAULT_EVENTS);
export const saveEvents = (events: EventItem[]): void => setItem('ycn_events', events);

// Team
export const getTeam = (): TeamMember[] => getItem('ycn_team_v2', DEFAULT_TEAM);
export const saveTeam = (team: TeamMember[]): void => setItem('ycn_team_v2', team);

// Partners
export const getPartners = (): Partner[] => getItem('ycn_partners', DEFAULT_PARTNERS);
export const savePartners = (partners: Partner[]): void => setItem('ycn_partners', partners);

// Advocacy
export const getAdvocacy = (): AdvocacyItem[] => getItem('ycn_advocacy', DEFAULT_ADVOCACY);
export const saveAdvocacy = (items: AdvocacyItem[]): void => setItem('ycn_advocacy', items);

// Volunteer Applications
export const getVolunteerApps = (): VolunteerApp[] => getItem('ycn_volunteer_apps', []);
export const addVolunteerApp = (app: Omit<VolunteerApp, 'id' | 'date' | 'status'>): void => {
  const apps = getVolunteerApps();
  apps.push({ ...app, id: Date.now().toString(), date: new Date().toISOString(), status: 'pending' });
  setItem('ycn_volunteer_apps', apps);
};
export const updateVolunteerStatus = (id: string, status: VolunteerApp['status']): void => {
  const apps = getVolunteerApps();
  const idx = apps.findIndex(a => a.id === id);
  if (idx >= 0) { apps[idx].status = status; setItem('ycn_volunteer_apps', apps); }
};

// Newsletter
export const getNewsletter = (): NewsletterSub[] => getItem('ycn_newsletter', []);
export const addNewsletter = (email: string): boolean => {
  const subs = getNewsletter();
  if (subs.find(s => s.email === email)) return false;
  subs.push({ id: Date.now().toString(), email, date: new Date().toISOString() });
  setItem('ycn_newsletter', subs);
  return true;
};

// Contact Messages
export const getContactMessages = (): ContactMessage[] => getItem('ycn_contact_messages', []);
export const addContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>): void => {
  const messages = getContactMessages();
  messages.push({ ...msg, id: Date.now().toString(), date: new Date().toISOString(), read: false });
  setItem('ycn_contact_messages', messages);
};
export const markMessageRead = (id: string): void => {
  const messages = getContactMessages();
  const idx = messages.findIndex(m => m.id === id);
  if (idx >= 0) { messages[idx].read = true; setItem('ycn_contact_messages', messages); }
};

// Donations (confirmed)
export const getDonations = (): DonationRecord[] => getItem('ycn_donations', []);
export const addDonation = (d: Omit<DonationRecord, 'id' | 'date'>): void => {
  const donations = getDonations();
  donations.push({ ...d, id: Date.now().toString(), date: new Date().toISOString() });
  setItem('ycn_donations', donations);
};

// Donation Requests (pending gateway submissions)
export const getDonationRequests = (): DonationRequest[] => getItem('ycn_donation_requests', []);
export const addDonationRequest = (r: Omit<DonationRequest, 'id' | 'date' | 'status'>): void => {
  const requests = getDonationRequests();
  requests.push({ ...r, id: Date.now().toString(), date: new Date().toISOString(), status: 'pending' });
  setItem('ycn_donation_requests', requests);
};
export const updateDonationRequestStatus = (id: string, status: DonationRequest['status']): void => {
  const requests = getDonationRequests();
  const idx = requests.findIndex(r => r.id === id);
  if (idx >= 0) {
    requests[idx].status = status;
    setItem('ycn_donation_requests', requests);
    // If approved, also add to confirmed donations
    if (status === 'approved') {
      const r = requests[idx];
      addDonation({ name: r.name, email: r.email, amount: r.amount, currency: r.currency, type: r.type });
    }
  }
};

export const deleteDonationRequest = (id: string): void => {
  const requests = getDonationRequests();
  const updated = requests.filter(r => r.id !== id);
  setItem('ycn_donation_requests', updated);
};

// Partnership Inquiries
export const getPartnershipInquiries = (): PartnershipInquiry[] => getItem('ycn_partnership_inquiries', []);
export const addPartnershipInquiry = (inquiry: Omit<PartnershipInquiry, 'id' | 'date' | 'status'>): void => {
  const items = getPartnershipInquiries();
  items.push({ ...inquiry, id: Date.now().toString(), date: new Date().toISOString(), status: 'pending' });
  setItem('ycn_partnership_inquiries', items);
};
export const updatePartnershipInquiryStatus = (id: string, status: PartnershipInquiry['status']): void => {
  const items = getPartnershipInquiries();
  const idx = items.findIndex(i => i.id === id);
  if (idx >= 0) { items[idx].status = status; setItem('ycn_partnership_inquiries', items); }
};

// Internship Applications
export const getInternshipApps = (): InternshipApp[] => getItem('ycn_internship_apps', []);
export const addInternshipApp = (app: Omit<InternshipApp, 'id' | 'date' | 'status'>): void => {
  const apps = getInternshipApps();
  apps.push({ ...app, id: Date.now().toString(), date: new Date().toISOString(), status: 'pending' });
  setItem('ycn_internship_apps', apps);
};
export const updateInternshipAppStatus = (id: string, status: InternshipApp['status']): void => {
  const apps = getInternshipApps();
  const idx = apps.findIndex(a => a.id === id);
  if (idx >= 0) { apps[idx].status = status; setItem('ycn_internship_apps', apps); }
};

// Internship Posts
export const getInternshipPosts = (): InternshipPost[] => getItem('ycn_internship_posts', [
  {
    id: '1',
    title: 'Youth Leadership Academy',
    title_bn: 'যুব নেতৃত্ব একাডেমি',
    duration: '6 months · Intensive training',
    duration_bn: '৬ মাস · নিবিড় বহুমুখী প্রশিক্ষণ',
    desc: 'Our flagship leadership development program covering climate science, community organizing, policy advocacy, digital communications, and social entrepreneurship. 60 places annually for youth aged 18–30.',
    desc_bn: 'আমাদের প্রধান নেতৃত্ব বিকাশ কর্মসূচী যা জলবায়ু বিজ্ঞান, সামাজিক সংগঠন, নীতি অ্যাডভোকেসি, ডিজিটাল যোগাযোগ এবং সামাজিক উদ্যোক্তা কভার করে। প্রতি বছর ১৮-৩০ বছর বয়সীদের জন্য ৬০টি আসন।',
    requirements: ['Aged 18–30', 'Commit to 3 days/week minimum', 'Basic English or Bangla literacy', 'Passion for climate justice'],
    requirements_bn: ['বয়স ১৮-৩০ বছর', 'সপ্তাহে কমপক্ষে ৩ দিন সময় দিতে হবে', 'প্রাথমিক ইংরেজি বা বাংলা সাক্ষরতা', 'জলবায়ু ন্যায়বিচারের প্রতি আগ্রহ'],
    active: true,
    badgeColor: '#E8521A'
  },
  {
    id: '2',
    title: 'Program Internships',
    title_bn: 'প্রোগ্রাম ইন্টার্নশিপ',
    duration: 'Flexible · 3–5 days per week',
    duration_bn: 'নমনীয় সময় · সপ্তাহে ৩–৫ দিন',
    desc: 'Hands-on internships across all 15 program pillars — from field coordination and research to communications and advocacy. Ideal for university students and recent graduates.',
    desc_bn: 'ফিল্ড কোঅর্ডিনেশন ও গবেষণা থেকে শুরু করে মিডিয়া এবং অ্যাডভোকেসি — আমাদের সকল কার্যক্রমে সরাসরি ইন্টার্নশিপ করার সুযোগ। বিশ্ববিদ্যালয় শিক্ষার্থী এবং সদ্য স্নাতকদের জন্য আদর্শ।',
    requirements: ['University student or graduate', 'Available 3–5 days/week', 'Relevant academic background', 'Ability to work independently'],
    requirements_bn: ['বিশ্ববিদ্যালয় শিক্ষার্থী বা স্নাতক সম্পন্ন', 'সপ্তাহে ৩-৫ দিন উপলব্ধ থাকতে হবে', 'প্রাসঙ্গিক প্রাতিষ্ঠানিক ব্যাকগ্রাউন্ড', 'স্বাধীনভাবে কাজ করার ক্ষমতা'],
    active: true,
    badgeColor: '#1A6B3C'
  }
]);
export const saveInternshipPosts = (posts: InternshipPost[]): void => setItem('ycn_internship_posts', posts);

// Hero Carousel
export const getCarouselItems = (): HeroCarouselItem[] => getItem('ycn_carousel_items', DEFAULT_CAROUSEL);
export const saveCarouselItems = (items: HeroCarouselItem[]): void => setItem('ycn_carousel_items', items);

// Admin auth
export const checkAdminAuth = (): boolean => !!localStorage.getItem('ycn_admin_user');

export const getAdminUser = (): AdminUser | null => {
  const user = localStorage.getItem('ycn_admin_user');
  return user ? JSON.parse(user) : null;
};

export const adminLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || '/api';
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('ycn_admin_user', JSON.stringify(user));
      return true;
    }
  } catch (err) {
    console.error('Login failed', err);
  }
  return false;
};

export const adminLogout = (): void => localStorage.removeItem('ycn_admin_user');
