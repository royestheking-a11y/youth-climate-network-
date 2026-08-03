import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Program } from './models/index.js';

dotenv.config();

// Since allPrograms is a TS file containing React components (LucideIcon),
// running this in Node might throw errors without ts-node or transpilation if it imports react.
// Let's just define the data here for seeding to be safe.

const allPrograms = [
  {
    id: 'climate-justice',
    title: 'Climate Justice & Environmental Advocacy',
    title_bn: 'জলবায়ু ন্যায়বিচার ও পরিবেশগত অ্যাডভোকেসি',
    iconName: 'Scale',
    theme: 'Climate',
    theme_bn: 'জলবায়ু',
    color: '#1A6B3C',
    bg: '#E8F5EE',
    description: "YCN places climate justice at the heart of everything we do. Bangladesh is among the world's most climate-vulnerable nations — facing rising sea levels, cyclones, floods, salinity intrusion, and extreme heat — yet contributes less than 0.5% of global emissions. We advocate fiercely and unapologetically for the rights of affected communities.",
    description_bn: 'YCN জলবায়ু ন্যায়বিচারকে আমাদের সমস্ত কাজের কেন্দ্রে রাখে। বাংলাদেশ সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি, ঘূর্ণিঝড়, বন্যা, লবণাক্ততার অনুপ্রবেশ এবং চরম তাপপ্রবাহের মুখোমুখি — অথচ বৈশ্বিক নির্গমনে আমাদের অবদান ০.৫%-এরও কম। আমরা ক্ষতিগ্রস্থ জনগোষ্ঠীর অধিকারের জন্য অবিচলভাবে কথা বলি।',
    keyPrograms: [
      'Regional Climate Advocacy — Representing Bangladesh and South Asian youth at UN climate negotiations (UNFCCC/COP), Asia Pacific regional forums, and international environmental justice platforms.',
      'Environmental Legal Literacy — Educating communities on their environmental rights under national law and international frameworks.',
      'Biodiversity Conservation Campaigns — Community-based mangrove restoration, wetland protection, and biodiversity monitoring in the Sundarbans and coastal belt.',
      'Anti-Pollution Awareness — Campaigns targeting industrial pollution, plastic contamination, and air quality degradation.',
      'Climate Litigation Support — Assisting frontline communities in documenting climate harms for advocacy and legal proceedings.',
    ],
    keyPrograms_bn: [
      'আঞ্চলিক জলবায়ু অ্যাডভোকেসি — জাতিসংঘের জলবায়ু আলোচনা (UNFCCC/COP), এশিয়া প্যাসিফিক আঞ্চলিক ফোরাম এবং আন্তর্জাতিক পরিবেশগত ন্যায়বিচার প্ল্যাটফর্মগুলোতে বাংলাদেশ ও দক্ষিণ এশিয়ার যুবকদের প্রতিনিধিত্ব।',
      'পরিবেশগত আইনি সাক্ষরতা — জাতীয় আইন এবং আন্তর্জাতিক কাঠামোর অধীনে পরিবেশগত অধিকার সম্পর্কে সমাজকে শিক্ষিত করা।',
      'জীববৈচিত্র্য সংরক্ষণ অভিযান — সুন্দরবন এবং উপকূলীয় অঞ্চলে সামাজিক-ভিত্তিক ম্যানগ্রোভ পুনরুদ্ধার, জলাভূমি সুরক্ষা এবং জীববৈচিত্র্য পর্যবেক্ষণ।',
      'দূষণ বিরোধী সচেতনতা — শিল্প দূষণ, প্লাস্টিক দূষণ এবং বায়ুর মান হ্রাসকে লক্ষ্য করে প্রচারণা।',
      'জলবায়ু মামলা সহায়তা — অ্যাডভোকেসি এবং আইনি প্রক্রিয়ার জন্য জলবায়ুজনিত ক্ষয়ক্ষতি নথিবদ্ধ করতে ফ্রন্টলাইন সম্প্রদায়কে সহায়তা করা।',
    ],
  },
  {
    id: 'education',
    title: 'Education, Research & Knowledge Management',
    title_bn: 'শিক্ষা, গবেষণা ও জ্ঞান ব্যবস্থাপনা',
    iconName: 'BookOpen',
    theme: 'Education',
    theme_bn: 'শিক্ষা',
    color: '#0E7490',
    bg: '#E0F7FA',
    description: 'Education is both a right and a tool for transformation. YCN builds climate literacy and critical thinking from the classroom to the community hall, while producing original research that informs national and regional policy.',
    description_bn: 'শিক্ষা একই সাথে অধিকার এবং পরিবর্তনের হাতিয়ার। YCN ক্লাসরুম থেকে কমিউনিটি হল পর্যন্ত জলবায়ু সচেতনতা ও যৌক্তিক চিন্তাভাবনা তৈরি করে, এবং জাতীয় ও আঞ্চলিক নীতি নির্ধারণে ভূমিকা রাখে এমন মৌলিক গবেষণা পরিচালনা করে।',
    keyPrograms: [
      'Climate & Environment Education in Schools — Integrating climate change modules into school curricula in partnership with local education boards.',
      'Youth Research Fellowship — Annual fellowships supporting young researchers to conduct community-based climate and environmental studies.',
      'Climate Research Assistance — Supporting academic institutions and NGOs with field data collection, community surveys, and participatory research.',
      'Knowledge Exchange Platform — Annual symposiums, publications, and digital platforms to share findings with policymakers and practitioners.',
      'Public Awareness Campaigns — Mass media, social media, and street campaigns on climate change, biodiversity, and environmental health.',
    ],
    keyPrograms_bn: [
      'বিদ্যালয়ে জলবায়ু ও পরিবেশ শিক্ষা — স্থানীয় শিক্ষা বোর্ডের সাথে অংশীদারিত্বে স্কুলের পাঠ্যসূচিতে জলবায়ু পরিবর্তনের মডিউল অন্তর্ভুক্ত করা।',
      'যুব গবেষণা ফেলোশিপ — তরুণ গবেষকদের সামাজিক-ভিত্তিক জলবায়ু এবং পরিবেশগত অধ্যয়ন পরিচালনা করতে বার্ষিক ফেলোশিপের সহায়তা।',
      'জলবায়ু গবেষণা সহায়তা — মাঠ পর্যায়ের তথ্য সংগ্রহ, সামাজিক সমীক্ষা এবং অংশগ্রহণমূলক গবেষণার মাধ্যমে শিক্ষা প্রতিষ্ঠান এবং এনজিওগুলোকে সহায়তা করা।',
      'জ্ঞান বিনিময় প্ল্যাটফর্ম — নীতিনির্ধারক এবং অনুশীলনকারীদের সাথে গবেষণার ফলাফল শেয়ার করার জন্য বার্ষিক সিম্পোজিয়াম, প্রকাশনা এবং ডিজিটাল প্ল্যাটফর্ম।',
      'জনসচেতনতা মূলক ক্যাম্পেইন — জলবায়ু পরিবর্তন, জীববৈচিত্র্য এবং পরিবেশগত স্বাস্থ্য নিয়ে গণমাধ্যম, সামাজিক যোগাযোগ মাধ্যম এবং সড়ক প্রচার।',
    ],
  },
  {
    id: 'wash',
    title: 'Water, Sanitation & Hygiene (WASH)',
    title_bn: 'পানি, স্যানিটেশন ও স্বাস্থ্যবিধি (WASH)',
    iconName: 'Droplets',
    theme: 'Water',
    theme_bn: 'পানি',
    color: '#1565C0',
    bg: '#E3F2FD',
    description: "Safe water and dignified sanitation are non-negotiable human rights. Climate change is intensifying water stress across Bangladesh and the wider region, disproportionately harming women, children, and coastal communities. YCN's WASH programs deliver tangible, life-changing improvements in water security and sanitary conditions.",
    description_bn: 'নিরাপদ পানি এবং মর্যাদাপূর্ণ স্যানিটেশন মানুষের অবিচ্ছেদ্য অধিকার। জলবায়ু পরিবর্তন বাংলাদেশ ও সমগ্র অঞ্চলে পানির সংকটকে তীব্র করে তুলছে, যা নারী, শিশু এবং উপকূলীয় সম্প্রদায়ের জন্য মারাত্মক ক্ষতির কারণ হচ্ছে। YCN-এর WASH কার্যক্রম পানির নিরাপত্তা এবং স্বাস্থ্যকর ব্যবস্থার বাস্তব উন্নতি নিশ্চিত করছে।',
    keyPrograms: [
      'Safe Drinking Water Access — Installation and maintenance of arsenic-free tube wells, rainwater harvesting systems, and community water purification units.',
      'Sanitation Infrastructure — Construction of climate-resilient latrines and hygiene facilities in flood-prone and coastal areas.',
      'Menstrual Hygiene Management — Providing products, education, and safe facilities for girls and women in schools and communities.',
      'WASH in Schools — Ensuring every partner school meets minimum WASH standards.',
      'Community Hygiene Education — Behavior change communication on handwashing, open defecation-free communities, and waterborne disease prevention.',
    ],
    keyPrograms_bn: [
      'নিরাপদ খাবার পানির ব্যবস্থা — আর্সেনিকমুক্ত নলকূপ স্থাপন, বৃষ্টির পানি সংগ্রহ পদ্ধতি এবং সামাজিক পানি বিশুদ্ধকরণ ইউনিট স্থাপন ও রক্ষণাবেক্ষণ।',
      'স্যানিটেশন অবকাঠামো — বন্যাপ্রবণ এবং উপকূলীয় এলাকায় জলবায়ু-সহনশীল ল্যাট্রিন এবং স্বাস্থ্যবিধি সুবিধা নির্মাণ।',
      'ঋতুস্রাবের স্বাস্থ্যবিধি ব্যবস্থাপনা — স্কুল এবং সম্প্রদায়ে মেয়ে ও নারীদের জন্য পণ্য, শিক্ষা এবং নিরাপদ সুবিধা প্রদান।',
      'বিদ্যালয়ে ওয়াশ (WASH) — প্রতিটি অংশীদার বিদ্যালয় যাতে ন্যূনতম WASH মান পূরণ করে তা নিশ্চিত করা।',
      'সামাজিক স্বাস্থ্যবিধি শিক্ষা — হাত ধোয়া, উন্মুক্ত মলত্যাগ মুক্ত সমাজ এবং পানিবাহিত রোগ প্রতিরোধে আচরণ পরিবর্তনের প্রচারণা।',
    ],
  }
];

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ycn';

async function seedPrograms() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const count = await Program.countDocuments();
    if (count > 0) {
      console.log('Programs already exist. Skipping seed.');
      process.exit(0);
    }

    const programsToInsert = allPrograms.map(p => ({
      slug: p.id,
      title: p.title,
      title_bn: p.title_bn,
      iconName: p.iconName,
      theme: p.theme,
      theme_bn: p.theme_bn,
      color: p.color,
      bg: p.bg,
      description: p.description,
      description_bn: p.description_bn,
      keyPrograms: p.keyPrograms,
      keyPrograms_bn: p.keyPrograms_bn,
    }));

    await Program.insertMany(programsToInsert);
    console.log(`Seeded ${programsToInsert.length} programs successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding programs:', error);
    process.exit(1);
  }
}

seedPrograms();
