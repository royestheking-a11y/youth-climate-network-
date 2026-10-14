import express from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { upload } from '../config/cloudinary';
import {
  News, Event, Team, Partner, VolunteerApp, NewsletterSub,
  ContactMessage, Donation, DonationRequest, HeroCarousel,
  Advocacy, PartnershipInquiry, InternshipApp, InternshipPost, ImpactStats,
  Media, AdminUser, Blog, Program, Author, FounderBrief,
  NavigationItem, RobotsConfig, PageSchema, SDG,
  OurWorkItem, AboutContent,
  SiteSettings, ImpactReport, CaseStudy, VolunteerTrack,
  CopHistory, PolicyPosition
} from '../models';

const router = express.Router();

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_js7tgz8';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_byqqj3n';
const EMAILJS_USER_ID = process.env.EMAILJS_PUBLIC_KEY || 'lnfsoU0tZZVZk15EY';
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'U6F85h13cCGXN3D6L6Egn';

const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 30 * 1000; // 30s cache TTL

const invalidateCache = (prefix?: string) => {
  if (prefix) {
    Object.keys(cache).forEach(k => {
      if (k.startsWith(prefix)) delete cache[k];
    });
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};

// Generic CRUD factory
const createCrudRoutes = (model: any, pathName: string, defaultSort: any = {}) => {
  // Get all
  router.get(`/${pathName}`, async (req, res) => {
    try {
      const now = Date.now();
      const cacheKey = `${pathName}_${JSON.stringify(req.query)}`;
      if (req.headers['cache-control'] !== 'no-cache' && cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_TTL)) {
        return res.json(cache[cacheKey].data);
      }
      
      const filter: any = {};
      Object.keys(req.query).forEach(k => {
        if (k !== 'sort' && k !== 'limit' && k !== 'no-cache') {
          filter[k] = req.query[k];
        }
      });

      const items = await model.find(filter).sort(defaultSort).lean();
      const mapped = items.map((i: any) => {
        i.id = i._id;
        return i;
      });
      
      cache[cacheKey] = { data: mapped, timestamp: now };
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get one by id
  router.get(`/${pathName}/:id`, async (req, res) => {
    try {
      const item = await model.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ error: 'Not found' });
      item.id = item._id;
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create
  router.post(`/${pathName}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      await newItem.save();
      const obj = newItem.toObject();
      obj.id = obj._id;
      invalidateCache(pathName);
      res.status(201).json(obj);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update
  router.put(`/${pathName}/:id`, async (req, res) => {
    try {
      const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      const obj = updated.toObject();
      obj.id = obj._id;
      invalidateCache(pathName);
      res.json(obj);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete
  router.delete(`/${pathName}/:id`, async (req, res) => {
    try {
      const deleted = await model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      invalidateCache(pathName);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reorder
  router.post(`/${pathName}/reorder`, async (req, res) => {
    try {
      const { items } = req.body; // { id, order }[]
      if (Array.isArray(items)) {
        for (const item of items) {
          await model.findByIdAndUpdate(item.id, { order: item.order });
        }
      }
      invalidateCache(pathName);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
};

/* ──────────────────────────────────────────────────────────────
   TEAM MANAGEMENT (Advisors, Executive Directors, Team Members)
   Chronological Numbering, Departments, Display Order
   ────────────────────────────────────────────────────────────── */
router.get('/team', async (req, res) => {
  try {
    const filter: any = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.department) filter.department = req.query.department;

    let items = await Team.find(filter).sort({ order: 1, _id: 1 }).lean();
    
    // Ensure chronological numbering exists and is synchronized
    let needsUpdate = false;
    const mapped = items.map((t: any, index: number) => {
      t.id = t._id;
      if (!t.number || t.number !== index + 1) {
        t.number = index + 1;
        needsUpdate = true;
      }
      return t;
    });

    if (needsUpdate && items.length > 0) {
      // Background sync of chronological numbers without blocking
      Promise.all(mapped.map((t: any) => Team.findByIdAndUpdate(t.id, { number: t.number }))).catch(() => {});
    }

    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/team', async (req, res) => {
  try {
    const totalCount = await Team.countDocuments();
    const data = { ...req.body };
    if (typeof data.order !== 'number') data.order = totalCount + 1;
    data.number = totalCount + 1;

    const newItem = new Team(data);
    await newItem.save();
    const obj = newItem.toObject() as any;
    obj.id = obj._id;
    invalidateCache('team');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/team/:id', async (req, res) => {
  try {
    const updated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Team member not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('team');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/team/:id', async (req, res) => {
  try {
    const deleted = await Team.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Team member not found' });

    // Re-sequence remaining members' numbering & order
    const remaining = await Team.find().sort({ order: 1, _id: 1 });
    for (let i = 0; i < remaining.length; i++) {
      await Team.findByIdAndUpdate(remaining[i]._id, { order: i + 1, number: i + 1 });
    }
    invalidateCache('team');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/team/reorder', async (req, res) => {
  try {
    const { items } = req.body; // { id, order }[]
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        await Team.findByIdAndUpdate(items[i].id, {
          order: items[i].order !== undefined ? items[i].order : i + 1,
          number: i + 1
        });
      }
    }
    invalidateCache('team');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   FOUNDER'S BRIEF & STORY MANAGEMENT
   ────────────────────────────────────────────────────────────── */
const DEFAULT_FOUNDER_STORY = `On 25 May 2009, Cyclone Aila struck the coast of Bangladesh. Our home, everything we had — washed away in hours. I was nine years old, and I lost my school before I ever fully understood what I was losing. That was not the only storm of my childhood.

I grew up watching cyclone after cyclone tear through our coast — Sidr, Aila, Fani, Amphan — each one arriving with a different name but the same devastating signature: homes destroyed, harvests lost, children pulled out of school, families pushed deeper into hardship. Year after year, I watched the same communities rebuild, only to be struck down again.

That repetition — of suffering, survival, and starting over — moved something in me that has never left. In 2021, that conviction led me to establish Humanity Public Library, and subsequently the Youth Climate Network (YCN).

Our Mission is to mobilize, equip, and amplify the power of young people to drive transformative action on climate change, environmental justice, and sustainable development — building the capacity of youth leaders and frontline communities, so that no community is left behind.`;

router.get('/founder-brief', async (req, res) => {
  try {
    let brief = await FounderBrief.findOne().lean();
    if (!brief) {
      const created = new FounderBrief({
        title: "From a Simple Belief to a Growing Movement",
        subtitle: "FOUNDER'S STORY",
        content: "YCN Bangladesh began with a simple belief — that young people can drive real change for our climate, communities and future. Our founder's journey reflects this belief and the story behind the network.",
        founderName: "Arafat Hossain Akash",
        founderRole: "Founder & Executive Director, Youth Climate Network",
        founderImage: "/Arafat Hossain Akash - Founder & Executive Director.jpg",
        videoUrl: "",
        articleLink: "/about",
        buttonText: "Read the Full Founder's Story",
        fullStory: DEFAULT_FOUNDER_STORY,
      });
      await created.save();
      brief = created.toObject();
    }
    const b = brief as any;
    b.id = b._id;
    if (!b.fullStory) b.fullStory = DEFAULT_FOUNDER_STORY;
    if (!b.author) b.author = b.founderName || "Arafat Hossain Akash";
    if (!b.authorRole) b.authorRole = b.founderRole || "Founder & Executive Director, Youth Climate Network";
    if (!b.image) b.image = b.founderImage || "/Arafat Hossain Akash - Founder & Executive Director.jpg";
    if (!b.articleUrl) b.articleUrl = b.articleLink || "/about";
    res.json(b);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/founder-brief', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.author && !data.founderName) data.founderName = data.author;
    if (data.founderName && !data.author) data.author = data.founderName;
    if (data.authorRole && !data.founderRole) data.founderRole = data.authorRole;
    if (data.founderRole && !data.authorRole) data.authorRole = data.founderRole;
    if (data.image && !data.founderImage) data.founderImage = data.image;
    if (data.founderImage && !data.image) data.image = data.founderImage;
    if (data.articleUrl && !data.articleLink) data.articleLink = data.articleUrl;
    if (data.articleLink && !data.articleUrl) data.articleUrl = data.articleLink;

    let brief = await FounderBrief.findOne();
    if (brief) {
      brief = await FounderBrief.findByIdAndUpdate(brief._id, data, { new: true });
    } else {
      brief = new FounderBrief(data);
      await brief.save();
    }
    const obj = brief!.toObject() as any;
    obj.id = obj._id;
    invalidateCache('founder-brief');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   OUR WORK (FOCUS AREAS & INITIATIVES) MANAGEMENT
   ────────────────────────────────────────────────────────────── */
const DEFAULT_OUR_WORK = [
  {
    slug: 'climate-action',
    title: 'Climate Action',
    title_bn: 'জলবায়ু কার্যক্রম',
    desc: 'Advocacy, awareness and on-ground climate initiatives.',
    desc_bn: 'অ্যাডভোকেসি, সচেতনতা ও মাঠপর্যায়ের জলবায়ু উদ্যোগ।',
    iconName: 'Sprout',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/climate-action',
    order: 1,
  },
  {
    slug: 'education-research',
    title: 'Education & Research',
    title_bn: 'শিক্ষা ও গবেষণা',
    desc: 'Building climate knowledge and youth leadership.',
    desc_bn: 'জলবায়ু জ্ঞান ও যুব নেতৃত্ব বিকাশ।',
    iconName: 'BookOpen',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/education-research',
    order: 2,
  },
  {
    slug: 'wash',
    title: 'WASH',
    title_bn: 'ওয়াশ (পানি ও স্যানিটেশন)',
    desc: 'Promoting clean water, sanitation and hygiene.',
    desc_bn: 'নিরাপদ পানি, স্যানিটেশন ও স্বাস্থ্যবিধি নিশ্চিতকরণ।',
    iconName: 'Droplets',
    image: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/wash',
    order: 3,
  },
  {
    slug: 'disaster-risk-reduction',
    title: 'Disaster Risk Reduction',
    title_bn: 'দুর্যোগ ঝুঁকি হ্রাস',
    desc: 'Stronger communities through preparedness.',
    desc_bn: 'পূর্বপ্রস্তুতির মাধ্যমে দুর্যোগ সহনশীল সমাজ গঠন।',
    iconName: 'ShieldAlert',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/disaster-risk-reduction',
    order: 4,
  },
  {
    slug: 'livelihoods-agriculture',
    title: 'Livelihoods & Agriculture',
    title_bn: 'জীবিকা ও কৃষি',
    desc: 'Climate-resilient and sustainable livelihoods.',
    desc_bn: 'জলবায়ু সহনশীল ও টেকসই কৃষিজীবিকা।',
    iconName: 'Trees',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/livelihoods-agriculture',
    order: 5,
  },
  {
    slug: 'renewable-energy',
    title: 'Renewable Energy',
    title_bn: 'নবায়নযোগ্য শক্তি',
    desc: 'Supporting clean and sustainable energy solutions.',
    desc_bn: 'স্বচ্ছ ও টেকসই জ্বালানি প্রযুক্তির সম্প্রসারণ।',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    link: '/our-work/renewable-energy',
    order: 6,
  },
];

router.get('/our-work', async (req, res) => {
  try {
    let items = await OurWorkItem.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await OurWorkItem.insertMany(DEFAULT_OUR_WORK);
      items = await OurWorkItem.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => {
      i.id = i._id;
      return i;
    });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/our-work', async (req, res) => {
  try {
    const count = await OurWorkItem.countDocuments();
    const data = { ...req.body };
    if (typeof data.order !== 'number') data.order = count + 1;
    const newItem = new OurWorkItem(data);
    await newItem.save();
    const obj = newItem.toObject() as any;
    obj.id = obj._id;
    invalidateCache('our-work');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/our-work/:id', async (req, res) => {
  try {
    const updated = await OurWorkItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('our-work');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/our-work/:id', async (req, res) => {
  try {
    await OurWorkItem.findByIdAndDelete(req.params.id);
    invalidateCache('our-work');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/our-work/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      for (const item of items) {
        await OurWorkItem.findByIdAndUpdate(item.id, { order: item.order });
      }
    }
    invalidateCache('our-work');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   ABOUT PAGE CONTENT & PILLARS MANAGEMENT
   ────────────────────────────────────────────────────────────── */
router.get('/about-content', async (req, res) => {
  try {
    let content = await AboutContent.findOne().lean();
    if (!content) {
      const created = new AboutContent({});
      await created.save();
      content = created.toObject();
    }
    (content as any).id = (content as any)._id;
    res.json(content);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/about-content', async (req, res) => {
  try {
    let content = await AboutContent.findOne();
    if (content) {
      content = await AboutContent.findByIdAndUpdate(content._id, req.body, { new: true });
    } else {
      content = new AboutContent(req.body);
      await content.save();
    }
    const obj = content!.toObject() as any;
    obj.id = obj._id;
    invalidateCache('about-content');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   SITE SETTINGS (General, Contact, Socials, Registration, Donations)
   ────────────────────────────────────────────────────────────── */
router.get('/site-settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      const created = new SiteSettings({});
      await created.save();
      settings = created.toObject();
    }
    (settings as any).id = (settings as any)._id;
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/site-settings', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (settings) {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = new SiteSettings(req.body);
      await settings.save();
    }
    const obj = settings!.toObject() as any;
    obj.id = obj._id;
    invalidateCache('site-settings');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   IMPACT REPORTS (Annual Reports, Assessments, Evaluations)
   ────────────────────────────────────────────────────────────── */
const DEFAULT_IMPACT_REPORTS = [
  { title: 'YCN Annual Report 2024', title_bn: 'ওয়াইসিএন বার্ষিক প্রতিবেদন ২০২৪', date: 'January 2025', pages: '48', type: 'Annual Report', fileUrl: '/reports/ycn-annual-report-2024.pdf', order: 1 },
  { title: 'Climate Impact Assessment 2024', title_bn: 'জলবায়ু প্রভাব মূল্যায়ন ২০২৪', date: 'December 2024', pages: '32', type: 'Research Report', fileUrl: '', order: 2 },
  { title: 'Youth Leadership Academy Outcomes Report', title_bn: 'যুব নেতৃত্ব একাডেমি ফলাফল প্রতিবেদন', date: 'October 2024', pages: '24', type: 'Program Report', fileUrl: '', order: 3 },
  { title: 'WASH Program Evaluation 2023–24', title_bn: 'ওয়াশ কার্যক্রম মূল্যায়ন ২০২৩-২৪', date: 'September 2024', pages: '36', type: 'Evaluation', fileUrl: '', order: 4 },
  { title: 'Sundarbans Mangrove Restoration Progress', title_bn: 'সুন্দরবন ম্যানগ্রোভ পুনরুদ্ধার অগ্রগতি', date: 'August 2024', pages: '20', type: 'Field Report', fileUrl: '', order: 5 },
];

router.get('/impact-reports', async (req, res) => {
  try {
    let items = await ImpactReport.find().sort({ order: 1, date: -1 }).lean();
    if (items.length === 0) {
      await ImpactReport.insertMany(DEFAULT_IMPACT_REPORTS);
      items = await ImpactReport.find().sort({ order: 1, date: -1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/impact-reports', async (req, res) => {
  try {
    const item = new ImpactReport(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('impact-reports');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/impact-reports/:id', async (req, res) => {
  try {
    const updated = await ImpactReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('impact-reports');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/impact-reports/:id', async (req, res) => {
  try {
    await ImpactReport.findByIdAndDelete(req.params.id);
    invalidateCache('impact-reports');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   CASE STUDIES / VOICES FROM THE FRONTLINE
   ────────────────────────────────────────────────────────────── */
const DEFAULT_CASE_STUDIES = [
  {
    name: 'Azim Kha',
    name_bn: 'আজিম খাঁ',
    location: 'Age 26 · Paikgaca, Khulna',
    location_bn: 'বয়স ২৬ · পাইকগাছা, খুলনা',
    program: 'Climate Action',
    program_bn: 'জলবায়ু পদক্ষেপ',
    story: 'A frontline climate activist working to protect his community from the impacts of coastal salinity and extreme weather events in Paikgaca.',
    story_bn: 'পাইকগাছায় উপকূলীয় লবণাক্ততা এবং চরম আবহাওয়ার প্রভাব থেকে তার সম্প্রদায়কে রক্ষা করার জন্য কাজ করা একজন সম্মুখ সমরের জলবায়ু কর্মী।',
    impact: 'Community Resilience · Coastal Protection',
    impact_bn: 'সামাজিক স্থিতিস্থাপকতা · উপকূল সুরক্ষা',
    image: '/voice_frontline/azim_kha.jpg',
    color: '#0A3320',
    bg: '#E8F5EE',
    order: 1
  },
  {
    name: 'Nurul Islam Fakir',
    name_bn: 'নুরুল ইসলাম ফকির',
    location: 'Age 65 · Dacope, Khulna',
    location_bn: 'বয়স ৬৫ · দাকোপ, খুলনা',
    program: 'Livelihoods',
    program_bn: 'জীবিকা',
    story: 'An experienced community member adapting traditional farming methods to survive amidst the growing climate challenges in Dacope.',
    story_bn: 'দাকোপে ক্রমবর্ধমান জলবায়ু চ্যালেঞ্জের মধ্যে টিকে থাকার জন্য ঐতিহ্যবাহী কৃষি পদ্ধতিগুলো মানিয়ে নেওয়া একজন অভিজ্ঞ সম্প্রদায়ের সদস্য।',
    impact: 'Climate Adaptation · Sustainable Farming',
    impact_bn: 'জলবায়ু অভিযোজন · টেকসই কৃষি',
    image: '/voice_frontline/nurul_islam.jpg',
    color: '#E8521A',
    bg: '#FFF3EE',
    order: 2
  },
  {
    name: 'Taslima Begum',
    name_bn: 'তাসলিমা বেগম',
    location: 'Age 32 · Dacope, Khulna',
    location_bn: 'বয়স ৩২ · দাকোপ, খুলনা',
    program: 'WASH & Clean Water',
    program_bn: 'ওয়াশ ও বিশুদ্ধ পানি',
    story: 'Empowering women through rainwater harvesting and clean drinking water initiatives in remote saline coastal zones.',
    story_bn: 'লবণাক্ত উপকূলীয় এলাকায় বৃষ্টির পানি সংরক্ষণ এবং বিশুদ্ধ খাবার পানির উদ্যোগের মাধ্যমে নারীদের ক্ষমতায়ন।',
    impact: 'Clean Water · Women Leadership',
    impact_bn: 'বিশুদ্ধ পানি · নারী নেতৃত্ব',
    image: '/voice_frontline/taslima_begum.jpg',
    color: '#0E7490',
    bg: '#ECFEFF',
    order: 3
  },
  {
    name: 'Robiul Islam',
    name_bn: 'রবিউল ইসলাম',
    location: 'Age 24 · Shyamnagar, Satkhira',
    location_bn: 'বয়স ২৪ · শ্যামনগর, সাতক্ষীরা',
    program: 'Youth Leadership',
    program_bn: 'যুব নেতৃত্ব',
    story: 'Leading youth volunteer groups in disaster preparedness, cyclone relief and mangrove planting along the coast.',
    story_bn: 'উপকূলীয় অঞ্চলে দুর্যোগ প্রস্তুতি, ঘূর্ণিঝড় ত্রাণ ও ম্যানগ্রোভ বৃক্ষরোপণে তরুণ স্বেচ্ছাসেবকদের নেতৃত্ব দান।',
    impact: 'Youth Mobilization · Disaster Action',
    impact_bn: 'যুব সমন্বয় · দুর্যোগ মোকাবিলা',
    image: '/voice_frontline/robiul_islam.jpg',
    color: '#7C3AED',
    bg: '#F5F3FF',
    order: 4
  },
  {
    name: 'Milon Sarker',
    name_bn: 'মিলন সরকার',
    location: 'Age 28 · Koyra, Khulna',
    location_bn: 'বয়স ২৮ · কয়রা, খুলনা',
    program: 'Climate Justice',
    program_bn: 'জলবায়ু ন্যায়বিচার',
    story: 'Advocating for fair compensation and loss and damage support for displaced coastal farming families.',
    story_bn: 'বাস্তুচ্যুত উপকূলীয় কৃষক পরিবারের জন্য ক্ষতিপূরণ ও লস অ্যান্ড ড্যামেজ সহায়তার পক্ষে সোচ্চার কণ্ঠস্বর।',
    impact: 'Climate Advocacy · Loss & Damage',
    impact_bn: 'জলবায়ু অ্যাডভোকেসি · ক্ষয়ক্ষতি সহায়তা',
    image: '/voice_frontline/milon_sarker.jpg',
    color: '#D97706',
    bg: '#FFFBEB',
    order: 5
  },
  {
    name: 'Mst. Rekha Khatun',
    name_bn: 'মোছাঃ রেখা খাতুন',
    location: 'Age 22 · Dacope, Khulna',
    location_bn: 'বয়স ২২ · দাকোপ, খুলনা',
    program: 'Climate Education',
    program_bn: 'জলবায়ু শিক্ষা',
    story: 'Teaching climate resilience and plastic waste reduction in village primary and high schools.',
    story_bn: 'গ্রামের প্রাথমিক ও মাধ্যমিক বিদ্যালয়গুলোতে জলবায়ু সহনশীলতা ও প্লাস্টিক বর্জ্য হ্রাসের পাঠদান।',
    impact: 'Youth Education · Community Change',
    impact_bn: 'যুব শিক্ষা · সামাজিক রূপান্তর',
    image: '/voice_frontline/rekha_khatun.jpg',
    color: '#059669',
    bg: '#ECFDF5',
    order: 6
  }
];

router.get('/case-studies', async (req, res) => {
  try {
    let items = await CaseStudy.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await CaseStudy.insertMany(DEFAULT_CASE_STUDIES);
      items = await CaseStudy.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/case-studies', async (req, res) => {
  try {
    const item = new CaseStudy(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('case-studies');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/case-studies/:id', async (req, res) => {
  try {
    const updated = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('case-studies');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/case-studies/:id', async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    invalidateCache('case-studies');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   VOLUNTEER TRACKS (Get Involved Page)
   ────────────────────────────────────────────────────────────── */
const DEFAULT_VOLUNTEER_TRACKS = [
  {
    slug: 'grassroots-mobilizer',
    title: 'Grassroots Climate Mobilizer',
    title_bn: 'তৃণমূল জলবায়ু সমন্বয়কারী',
    badge: 'Field & Community',
    commitment: '4–6 hrs / week',
    location: 'Coastal & Delta Districts / Local Chapters',
    description: 'Engage frontline youth, organize community dialogues, and lead environmental awareness workshops in vulnerable regions.',
    description_bn: 'উপকূলীয় ও দুর্যোগপ্রবণ এলাকায় তরুণদের উদ্বুদ্ধকরণ, সচেতনতামূলক কর্মশালা এবং স্থানীয় জলবায়ু কর্মসূচি পরিচালনা।',
    responsibilities: [
      'Organize localized climate awareness sessions in schools & communities',
      'Coordinate tree plantation drives and community clean-up campaigns',
      'Liaise with local youth groups and community elders',
      'Document local climate vulnerability case studies'
    ],
    responsibilities_bn: [
      'স্কুল ও সমাজে স্থানীয় জলবায়ু সচেতনতা সেশন আয়োজন',
      'বৃক্ষরোপণ কর্মসূচি এবং পরিচ্ছন্নতা অভিযান সমন্বয়',
      'স্থানীয় যুবসমাজ ও গণ্যমান্য ব্যক্তিদের সাথে যোগাযোগ রক্ষা',
      'স্থানীয় জলবায়ু ঝুঁকিপূর্ণ ঘটনা ও কেস স্টাডি নথিভুক্তকরণ'
    ],
    skills: ['Communication', 'Community Engagement', 'Leadership', 'Empathy'],
    benefits: ['Official Volunteer Certificate', 'Leadership Training Workshops', 'YCN National Alumni Network'],
    order: 1
  },
  {
    slug: 'wash-advocate',
    title: 'WASH & Clean Water Campaigner',
    title_bn: 'পানি ও স্বাস্থ্যবিধি (WASH) প্রচারক',
    badge: 'Public Health',
    commitment: '3–5 hrs / week',
    location: 'Saline-Prone Coastal Belts & Remote Areas',
    description: 'Promote safe drinking water access, menstrual hygiene equity, and water testing drives across saline-affected communities.',
    description_bn: 'লবণাক্ততা কবলিত এলাকায় নিরাপদ খাবার পানি নিশ্চিতকরণ, মাসিক স্বাস্থ্যবিধি ও পানির মান পরীক্ষা কর্মসূচি পরিচালনা।',
    responsibilities: [
      'Support community water testing and filtration demonstration drives',
      'Facilitate menstrual hygiene awareness in rural schools and community centers',
      'Distribute clean water and hygiene kits in cyclone-affected zones',
      'Collect feedback and health indicators from women-led household groups'
    ],
    responsibilities_bn: [
      'পানির মান পরীক্ষা এবং ফিল্টারিং প্রদর্শনী পরিচালনা',
      'গ্রামীণ স্কুলে মাসিক স্বাস্থ্যবিধি সচেতনতা বৃদ্ধি',
      'ঘূর্ণিঝড় কবলিত অঞ্চলে খাবার পানি ও স্বাস্থ্যবিধি কিট বিতরণ',
      'নারীপ্রধান পরিবারের কাছ থেকে স্বাস্থ্য তথ্য ও প্রতিক্রিয়া সংগ্রহ'
    ],
    skills: ['Public Health', 'Empathy', 'Workshop Facilitation', 'Bengali / Local Dialect'],
    benefits: ['Field Experience in Coastal Public Health', 'Water-Testing Certification from Partners', 'Impact Story Features'],
    order: 2
  },
  {
    slug: 'climate-education',
    title: 'Climate Education & Youth Trainer',
    title_bn: 'জলবায়ু শিক্ষা ও যুব প্রশিক্ষক',
    badge: 'Education & Schools',
    commitment: '3–4 hrs / week',
    location: 'Dhaka, Divisional Capitals & Rural Schools',
    description: 'Deliver interactive climate literacy modules, plastic-free school initiatives, and science workshops for young students.',
    description_bn: 'স্কুল-কলেজের শিক্ষার্থীদের মধ্যে জলবায়ু সাক্ষরতা, প্লাস্টিকমুক্ত ক্যাম্পাস ও পরিবেশ বিজ্ঞান কর্মশালা পরিচালনা।',
    responsibilities: [
      'Conduct interactive "Climate in the Classroom" workshops',
      'Help schools establish eco-clubs and school-ground vegetable gardens',
      'Train school students on waste segregation and plastic reduction',
      'Translate climate science concepts into fun, accessible student activities'
    ],
    responsibilities_bn: [
      '"শ্রেণিকক্ষে জলবায়ু" ইন্টারেক্টিভ কর্মশালা পরিচালনা',
      'স্কুলে ইকো-ক্লাব এবং পরিবেশবান্ধব বাগান প্রতিষ্ঠায় সহায়তা',
      'বর্জ্য পৃথকীকরণ এবং প্লাস্টিক হ্রাসে শিক্ষার্থীদের প্রশিক্ষণ',
      'জলবায়ু বিজ্ঞানকে সহজ ও আনন্দদায়ক কার্যকলাপে রূপান্তর'
    ],
    skills: ['Teaching / Public Speaking', 'Youth Mentorship', 'Curriculum Design', 'Patience'],
    benefits: ['Training of Trainers (ToT) Certification', 'Published Educational Module Credits', 'School Network Recognition'],
    order: 3
  },
  {
    slug: 'disaster-response',
    title: 'Disaster Risk & Emergency Volunteer',
    title_bn: 'দুর্যোগ প্রস্তুতি ও জরুরি সহায়ক',
    badge: 'Disaster & Relief',
    commitment: 'On-Call + Periodic Drills (2–4 hrs/mo)',
    location: 'Coastal Belts (Khulna, Barishal, Chattogram, Satkhira)',
    description: 'Deploy during cyclones, seasonal floods, and storm surges to assist with early warning dissemination, relief coordination, and shelter support.',
    description_bn: 'ঘূর্ণিঝড় ও বন্যার সময় আগাম সতর্কবার্তা প্রচার, জরুরি আশ্রয়কেন্দ্র ও ত্রাণ বিতরণে মাঠপর্যায়ে সহায়তা।',
    responsibilities: [
      'Disseminate early warning signals across remote coastal villages',
      'Assist local authorities and Red Crescent with evacuation to cyclone shelters',
      'Manage relief supply chains, dry food, and emergency water purification tablets',
      'Conduct rapid damage assessments and post-disaster needs mapping'
    ],
    responsibilities_bn: [
      'উপকূলের প্রত্যন্ত গ্রামে আগাম সতর্কবার্তা প্রচার',
      'ঘূর্ণিঝড় আশ্রয়কেন্দ্রে নারী, শিশু ও বয়স্কদের নিরাপদ আশ্রয়ে সহায়তা',
      'জরুরি খাদ্যসামগ্রী ও পানি বিশুদ্ধকরণ ট্যাবলেট বিতরণ সমন্বয়',
      'দুর্যোগ পরবর্তী ক্ষয়ক্ষতি দ্রুত নিরূপণ ও তথ্য সংগ্রহ'
    ],
    skills: ['First Aid / Basic Safety', 'Crisis Management', 'Physical Fitness', 'Team Coordination'],
    benefits: ['Emergency Disaster Response Certificate', 'Priority Volunteer Safety Gear', 'Direct Frontline Impact Experience'],
    order: 4
  }
];

router.get('/volunteer-tracks', async (req, res) => {
  try {
    let items = await VolunteerTrack.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await VolunteerTrack.insertMany(DEFAULT_VOLUNTEER_TRACKS);
      items = await VolunteerTrack.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/volunteer-tracks', async (req, res) => {
  try {
    const item = new VolunteerTrack(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('volunteer-tracks');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/volunteer-tracks/:id', async (req, res) => {
  try {
    const updated = await VolunteerTrack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('volunteer-tracks');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/volunteer-tracks/:id', async (req, res) => {
  try {
    await VolunteerTrack.findByIdAndDelete(req.params.id);
    invalidateCache('volunteer-tracks');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   ADVOCACY & POLICY POSITIONS (Advocacy Page)
   ────────────────────────────────────────────────────────────── */
const DEFAULT_ADVOCACY_ITEMS = [
  {
    title: 'Bangladesh Youth Climate Position Paper — COP29',
    title_bn: 'বাংলাদেশ যুব জলবায়ু অবস্থানপত্র — কপ-২৯',
    type: 'position-paper',
    date: '2024-11-01',
    summary: 'A comprehensive position paper representing the demands of Bangladesh\'s youth at COP29, focusing on loss and damage finance, just energy transition, and climate migration rights.',
    summary_bn: 'কপ-২৯ সম্মেলনে বাংলাদেশের যুবসমাজের দাবিসমূহ সম্বলিত অবস্থানপত্র, যেখানে ক্ষতি ও ঋণ তহবিল, শক্তি রূপান্তর এবং জলবায়ু উদ্বাস্তু অধিকারের ওপর জোর দেওয়া হয়েছে।',
    file: '',
    pdfUrl: '',
    featured: true,
    order: 1,
  },
  {
    title: 'Statement on the Inadequacy of the New Collective Quantified Goal',
    title_bn: 'নতুন যৌথ পরিমাপিত লক্ষ্যমাত্রার (NCQG) অপর্যাপ্ততা নিয়ে বিবৃতি',
    type: 'statement',
    date: '2024-11-20',
    summary: 'YCN\'s official statement following COP29 outcomes, calling the NCQG insufficient and demanding developed nations deliver on their climate finance commitments.',
    summary_bn: 'কপ-২৯ সম্মেলন শেষে ওয়াইসিএন-এর অফিসিয়াল বিবৃতি, যেখানে নতুন তহবিল অপর্যাপ্ত ঘোষণা করে উন্নত দেশগুলোর জলবায়ু অর্থায়ন প্রদানের আহ্বান জানানো হয়েছে।',
    file: '',
    pdfUrl: '',
    featured: true,
    order: 2,
  },
  {
    title: 'Youth Perspectives on Bangladesh\'s Updated NDC',
    title_bn: 'বাংলাদেশের হালনাগাদকৃত এনডিসির ওপর তরুণদের দৃষ্টিভঙ্গি',
    type: 'report',
    date: '2024-08-15',
    summary: 'An analysis of Bangladesh\'s updated Nationally Determined Contribution from a youth and frontline community perspective, with recommendations for enhanced ambition.',
    summary_bn: 'তরুণদের দৃষ্টিকোণ থেকে বাংলাদেশের হালনাগাদকৃত জাতীয় কার্বন নির্গমন কমানোর লক্ষ্যের ওপর এক বিশ্লেষণমূলক প্রতিবেদন ও সুপারিশ।',
    file: '',
    pdfUrl: '',
    featured: false,
    order: 3,
  },
  {
    title: 'Press Release: YCN Calls for Emergency Climate Fund for Sundarbans',
    title_bn: 'প্রেস বিজ্ঞপ্তি: সুন্দরবনের জন্য জরুরি জলবায়ু তহবিলের আহ্বান ওয়াইসিএন-এর',
    type: 'press-release',
    date: '2024-07-01',
    summary: 'Following Cyclone Remal, YCN demands emergency climate adaptation funding for Sundarbans communities and an independent inquiry into coastal embankment failures.',
    summary_bn: 'ঘূর্ণিঝড় রিমালের আঘাতে সুন্দরবন ধ্বংসের পর জরুরি অভিযোজন তহবিল গঠন এবং ত্রুটিপূর্ণ বাঁধ নির্মাণের বিরুদ্ধে তদন্তের দাবি জানিয়ে প্রেস বিজ্ঞপ্তি।',
    file: '',
    pdfUrl: '',
    featured: false,
    order: 4,
  },
  {
    title: 'Climate Migration & Displacement: Bangladesh\'s Silent Crisis',
    title_bn: 'জলবায়ু অভিবাসন ও বাস্তুচ্যুতি: বাংলাদেশের নীরব সংকট',
    type: 'position-paper',
    date: '2024-05-20',
    summary: 'A position paper documenting climate displacement in Bangladesh\'s coastal belt and calling for a regional framework on climate mobility rights.',
    summary_bn: 'বাংলাদেশের উপকূলীয় অঞ্চলে জলবায়ুজনিত বাস্তুচ্যুতির চিত্র এবং তাদের জন্য একটি আঞ্চলিক অধিকার কাঠামোর সুপারিশ করে অবস্থানপত্র।',
    file: '',
    pdfUrl: '',
    featured: false,
    order: 5,
  },
];

router.get('/advocacy', async (req, res) => {
  try {
    let items = await Advocacy.find().sort({ order: 1, date: -1 }).lean();
    if (items.length === 0) {
      await Advocacy.insertMany(DEFAULT_ADVOCACY_ITEMS);
      items = await Advocacy.find().sort({ order: 1, date: -1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/advocacy', async (req, res) => {
  try {
    const item = new Advocacy(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('advocacy');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/advocacy/:id', async (req, res) => {
  try {
    const updated = await Advocacy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('advocacy');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/advocacy/:id', async (req, res) => {
  try {
    await Advocacy.findByIdAndDelete(req.params.id);
    invalidateCache('advocacy');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ── COP / INTERNATIONAL NEGOTIATIONS HISTORY ── */
const DEFAULT_COP_HISTORY = [
  {
    event: 'COP29 — Baku, Azerbaijan',
    event_bn: 'কপ-২৯ — বাকু, আজারবাইজান',
    year: '২০২৪',
    role: 'Official Delegation',
    role_bn: 'অফিসিয়াল প্রতিনিধি দল',
    outcome: 'Submitted Bangladesh youth position paper on NCQG; participated in loss and damage negotiations; presented in 3 side events',
    outcome_bn: 'NCQG-এর ওপর বাংলাদেশের যুবসমাজের অবস্থানপত্র পেশ; ক্ষয়ক্ষতি ও ক্ষতিপূরণ আলোচনায় অংশ নিয়ে ৩টি সাইড ইভেন্টে উপস্থাপন',
    highlight: true,
    order: 1
  },
  {
    event: 'COP28 — Dubai, UAE',
    event_bn: 'কপ-২৮ — দুবাই, সংযুক্ত আরব আমিরাত',
    year: '২০২৩',
    role: 'Observer & Advocate',
    role_bn: 'পর্যবেক্ষক ও অ্যাডভোকেট',
    outcome: 'First YCN delegation; connected with YOUNGO; presented at CSO side event on South Asian climate finance gaps',
    outcome_bn: 'প্রথম ওয়াইসিএন প্রতিনিধি দল; ইয়াঙ্গোর (YOUNGO) সাথে যুক্ত হয়ে দক্ষিণ এশিয়ার জলবায়ু অর্থায়ন সংকটের ওপর সিএসও সাইড ইভেন্টে উপস্থাপন',
    highlight: false,
    order: 2
  },
  {
    event: 'Asia Pacific Regional Forum on Climate',
    event_bn: 'এশিয়া প্যাসিফিক রিজিওনাল ক্লাইমেট ফোরাম',
    year: '২০২৪',
    role: 'Youth Representative',
    role_bn: 'যুব প্রতিনিধি',
    outcome: 'Presented Bangladesh coastal community resilience case study; advocated for climate mobility regional framework',
    outcome_bn: 'বাংলাদেশের উপকূলীয় এলাকার অভিযোজন সক্ষমতা বিষয়ক কেস স্টাডি উপস্থাপন এবং জলবায়ু অভিবাসনের আঞ্চলিক কাঠামোর পক্ষে কথা বলা',
    highlight: false,
    order: 3
  },
  {
    event: 'National Youth Climate Summit — Dhaka',
    event_bn: 'জাতীয় যুব জলবায়ু সম্মেলন — ঢাকা',
    year: '২০২৪',
    role: 'Co-organizer',
    role_bn: 'সহ-আয়োজনকারী',
    outcome: 'Co-organized 300-person summit with participation from 8 South Asian countries',
    outcome_bn: 'দক্ষিণ এশিয়ার ৮টি দেশের অংশগ্রহণে ৩০০ জনের এই জাতীয় যুব জলবায়ু সম্মেলনের সহ-আয়োজন',
    highlight: false,
    order: 4
  }
];

router.get('/cop-history', async (req, res) => {
  try {
    let items = await CopHistory.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await CopHistory.insertMany(DEFAULT_COP_HISTORY);
      items = await CopHistory.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/cop-history', async (req, res) => {
  try {
    const item = new CopHistory(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('cop-history');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/cop-history/:id', async (req, res) => {
  try {
    const updated = await CopHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('cop-history');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/cop-history/:id', async (req, res) => {
  try {
    await CopHistory.findByIdAndDelete(req.params.id);
    invalidateCache('cop-history');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POLICY DEMANDS & POSITIONS ── */
const DEFAULT_POLICY_POSITIONS = [
  {
    title: 'Loss & Damage Finance',
    title_bn: 'ক্ষয়ক্ষতি ও ক্ষতিপূরণ তহবিল',
    desc: 'Wealthy nations must deliver adequate, accessible, and predictable loss and damage finance to frontline nations like Bangladesh. The Santiago Network must be operational and funded at scale.',
    desc_bn: 'ধনী দেশগুলোকে বাংলাদেশের মতো ভুক্তভোগী দেশগুলোর জন্য পর্যাপ্ত ও সরাসরি প্রবেশযোগ্য ক্ষতিপূরণ তহবিল দিতে হবে। সান্তিয়াগো নেটওয়ার্ককে পুরোপুরি সচল এবং অর্থায়ন করতে হবে।',
    order: 1
  },
  {
    title: 'Just Energy Transition',
    title_bn: 'ন্যায়সঙ্গত জ্বালানি রূপান্তর',
    desc: "Bangladesh's energy transition must be just, affordable, and community-driven — not locked into new fossil fuel infrastructure. Developed nations must fund this transition.",
    desc_bn: 'বাংলাদেশের জ্বালানি খাতের রূপান্তর হতে হবে ন্যায়সঙ্গত, সাশ্রয়ী ও স্থানীয় মানুষের স্বার্থ রক্ষাকারী — নতুন জীবাশ্ম জ্বালানি পরিকাঠামোয় আবদ্ধ হওয়া যাবে না। উন্নত দেশগুলোকে এই রূপান্তরে অর্থায়ন করতে হবে।',
    order: 2
  },
  {
    title: 'Climate Migration Rights',
    title_bn: 'জলবায়ু উদ্বাস্তুদের অধিকার',
    desc: 'Climate-displaced persons need legal protection under international law. A regional framework for climate mobility rights in South Asia and Asia Pacific is urgently needed.',
    desc_bn: 'জলবায়ু পরিবর্তনের কারণে বাস্তুচ্যুত মানুষের আন্তর্জাতিক আইনের অধীনে আইনি সুরক্ষা প্রয়োজন। দক্ষিণ এশিয়া ও এশিয়া প্যাসিফিক অঞ্চলে জলবায়ু অভিবাসন অধিকারের জন্য একটি আঞ্চলিক কাঠামো জরুরি।',
    order: 3
  },
  {
    title: 'Youth in Decision-Making',
    title_bn: 'সিদ্ধান্ত গ্রহণে তরুণদের অংশগ্রহণ',
    desc: 'Youth must have formal, meaningful roles in climate negotiations at all levels — not token representation. Young people represent the generation most affected by climate decisions made today.',
    desc_bn: 'জলবায়ু আলোচনার প্রতিটি স্তরে তরুণদের আনুষ্ঠানিক ও অর্থপূর্ণ ভূমিকা থাকতে হবে — কেবল লোকদেখানো প্রতিনিধিত্ব নয়। আজকের সিদ্ধান্তের দ্বারা যুবসমাজই সবচেয়ে বেশি ক্ষতিগ্রস্ত হবে।',
    order: 4
  },
  {
    title: 'Adaptation Finance Parity',
    title_bn: 'অভিযোজন অর্থায়নের সমতা',
    desc: 'Adaptation finance must match mitigation finance. For Bangladesh and other frontline nations, adaptation is not optional — it is an existential requirement.',
    desc_bn: 'অভিযোজন অর্থায়ন কার্বন নির্গমন কমানোর তহবিলের সমতুল্য হতে হবে। বাংলাদেশ এবং অন্যান্য ক্ষতিগ্রস্ত দেশের জন্য অভিযোজন কোনো ঐচ্ছিক বিষয় নয় — এটি বেঁচে থাকার লড়াই।',
    order: 5
  },
  {
    title: 'Nature-Based Solutions',
    title_bn: 'প্রকৃতি-ভিত্তিক সমাধান',
    desc: 'Investment in mangroves, wetlands, and coastal ecosystems must be recognized as legitimate, fundable climate solutions with measurable outcomes for communities and carbon.',
    desc_bn: 'ম্যানগ্রোভ, জলাভূমি এবং উপকূলীয় বাস্তুতন্ত্রে বিনিয়োগকে বৈধ ও অর্থায়নযোগ্য জলবায়ু সমাধান হিসেবে স্বীকৃতি দিতে হবে, যা কার্বন শোষণ ও জনগণের জীবন রক্ষা করবে।',
    order: 6
  }
];

router.get('/policy-positions', async (req, res) => {
  try {
    let items = await PolicyPosition.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await PolicyPosition.insertMany(DEFAULT_POLICY_POSITIONS);
      items = await PolicyPosition.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => { i.id = i._id; return i; });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/policy-positions', async (req, res) => {
  try {
    const item = new PolicyPosition(req.body);
    await item.save();
    const obj = item.toObject() as any;
    obj.id = obj._id;
    invalidateCache('policy-positions');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/policy-positions/:id', async (req, res) => {
  try {
    const updated = await PolicyPosition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('policy-positions');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/policy-positions/:id', async (req, res) => {
  try {
    await PolicyPosition.findByIdAndDelete(req.params.id);
    invalidateCache('policy-positions');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});




/* ──────────────────────────────────────────────────────────────
   NAVIGATION MANAGEMENT
   Dynamic Navbar items, labels, URLs, ordering
   ────────────────────────────────────────────────────────────── */
const DEFAULT_NAV_ITEMS = [
  { label: 'Home', label_bn: 'হোম', path: '/', order: 1, isActive: true, isExternal: false },
  { label: 'About', label_bn: 'আমাদের সম্পর্কে', path: '/about', order: 2, isActive: true, isExternal: false },
  { label: 'Our Work', label_bn: 'আমাদের কাজ', path: '/our-work', order: 3, isActive: true, isExternal: false },
  { label: 'Programs', label_bn: 'প্রোগ্রামসমূহ', path: '/programs', order: 4, isActive: true, isExternal: false },
  { label: 'Stories', label_bn: 'গল্প ও ব্লগ', path: '/blog', order: 5, isActive: true, isExternal: false },
  { label: 'Get Involved', label_bn: 'যুক্ত হোন', path: '/get-involved', order: 6, isActive: true, isExternal: false },
  { label: 'Contact', label_bn: 'যোগাযোগ', path: '/contact', order: 7, isActive: true, isExternal: false },
];

router.get('/navigation', async (req, res) => {
  try {
    let items = await NavigationItem.find().sort({ order: 1 }).lean();
    if (items.length === 0) {
      await NavigationItem.insertMany(DEFAULT_NAV_ITEMS);
      items = await NavigationItem.find().sort({ order: 1 }).lean();
    }
    const mapped = items.map((i: any) => {
      i.id = i._id;
      return i;
    });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/navigation', async (req, res) => {
  try {
    const count = await NavigationItem.countDocuments();
    const data = { ...req.body };
    if (typeof data.order !== 'number') data.order = count + 1;
    const newItem = new NavigationItem(data);
    await newItem.save();
    const obj = newItem.toObject() as any;
    obj.id = obj._id;
    invalidateCache('navigation');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/navigation/:id', async (req, res) => {
  try {
    const updated = await NavigationItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Navigation item not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('navigation');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/navigation/:id', async (req, res) => {
  try {
    const deleted = await NavigationItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Navigation item not found' });
    invalidateCache('navigation');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/navigation/reorder', async (req, res) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      for (const item of items) {
        await NavigationItem.findByIdAndUpdate(item.id, { order: item.order });
      }
    }
    invalidateCache('navigation');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   BLOG MANAGEMENT, AUTHORS, SEO/GEO/AEO, SDGs, LINKING
   ────────────────────────────────────────────────────────────── */
createCrudRoutes(Author, 'authors', { name: 1 });

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

router.get('/blogs', async (req, res) => {
  try {
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.sdg) filter.sdgs = Number(req.query.sdg);

    const items = await Blog.find(filter).sort({ date: -1, _id: -1 }).lean();
    const mapped = items.map((i: any) => {
      i.id = i._id;
      return i;
    });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/blogs/:slugOrId', async (req, res) => {
  try {
    const param = req.params.slugOrId;
    let blog: any = null;

    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(param).lean();
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: param }).lean();
    }
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    blog.id = blog._id;
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/blogs/validate-slug', async (req, res) => {
  try {
    const { slug, currentId } = req.body;
    if (!slug) return res.json({ available: false, error: 'Slug is required' });

    const existing = await Blog.findOne({ slug });
    if (existing && existing._id.toString() !== currentId) {
      return res.json({ available: false, message: 'Slug is already in use' });
    }
    return res.json({ available: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/blogs', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug) {
      data.slug = generateSlug(data.title || 'untitled');
    } else {
      data.slug = generateSlug(data.slug);
    }

    // Ensure slug uniqueness
    let finalSlug = data.slug;
    let counter = 1;
    while (await Blog.findOne({ slug: finalSlug })) {
      finalSlug = `${data.slug}-${counter}`;
      counter++;
    }
    data.slug = finalSlug;

    // Attach author details if authorId provided
    if (data.authorId) {
      const author = await Author.findById(data.authorId);
      if (author) {
        data.authorName = author.name;
        data.authorRole = author.role;
        data.authorImage = author.image;
      }
    }

    if (!data.date) data.date = new Date().toISOString();

    const newBlog = new Blog(data);
    await newBlog.save();
    const obj = newBlog.toObject() as any;
    obj.id = obj._id;
    invalidateCache('blogs');
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.slug) {
      data.slug = generateSlug(data.slug);
      const existing = await Blog.findOne({ slug: data.slug });
      if (existing && existing._id.toString() !== req.params.id) {
        data.slug = `${data.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    if (data.authorId) {
      const author = await Author.findById(data.authorId);
      if (author) {
        data.authorName = author.name;
        data.authorRole = author.role;
        data.authorImage = author.image;
      }
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updated) return res.status(404).json({ error: 'Blog not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    invalidateCache('blogs');
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blogs/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    invalidateCache('blogs');
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   SDGs MANAGEMENT
   ────────────────────────────────────────────────────────────── */
const DEFAULT_SDGS = [
  { number: 1, name: 'No Poverty', color: '#E5243B' },
  { number: 2, name: 'Zero Hunger', color: '#DDA63A' },
  { number: 3, name: 'Good Health and Well-being', color: '#4C9F38' },
  { number: 4, name: 'Quality Education', color: '#C5192D' },
  { number: 5, name: 'Gender Equality', color: '#FF3A21' },
  { number: 6, name: 'Clean Water and Sanitation', color: '#26BDE2' },
  { number: 7, name: 'Affordable and Clean Energy', color: '#FCC30B' },
  { number: 8, name: 'Decent Work and Economic Growth', color: '#A21942' },
  { number: 9, name: 'Industry, Innovation and Infrastructure', color: '#FD6925' },
  { number: 10, name: 'Reduced Inequalities', color: '#DD1367' },
  { number: 11, name: 'Sustainable Cities and Communities', color: '#FD9D24' },
  { number: 12, name: 'Responsible Consumption and Production', color: '#BF8B2E' },
  { number: 13, name: 'Climate Action', color: '#3F7E44' },
  { number: 14, name: 'Life Below Water', color: '#0A97D9' },
  { number: 15, name: 'Life on Land', color: '#56C02B' },
  { number: 16, name: 'Peace, Justice and Strong Institutions', color: '#00689D' },
  { number: 17, name: 'Partnerships for the Goals', color: '#19486A' },
];

router.get('/sdgs', async (req, res) => {
  try {
    let list = await SDG.find().sort({ number: 1 }).lean();
    if (list.length === 0) {
      await SDG.insertMany(DEFAULT_SDGS);
      list = await SDG.find().sort({ number: 1 }).lean();
    }
    const mapped = list.map((s: any) => {
      s.id = s._id;
      return s;
    });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
createCrudRoutes(SDG, 'sdgs', { number: 1 });

/* ──────────────────────────────────────────────────────────────
   ROBOTS.TXT & SCHEMA MARKUP MANAGEMENT
   ────────────────────────────────────────────────────────────── */
router.get('/robots', async (req, res) => {
  try {
    let cfg = await RobotsConfig.findOne().lean();
    if (!cfg) {
      cfg = {
        content: "User-agent: *\nAllow: /\n\nSitemap: https://ycnbd.org/sitemap.xml",
        updatedAt: new Date(),
      } as any;
      await new RobotsConfig(cfg).save();
    }
    res.json(cfg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/robots', async (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== 'string') return res.status(400).json({ error: 'Content must be a string' });

    let cfg = await RobotsConfig.findOne();
    if (cfg) {
      cfg.content = content;
      cfg.updatedAt = new Date();
      await cfg.save();
    } else {
      cfg = new RobotsConfig({ content, updatedAt: new Date() });
      await cfg.save();
    }

    // Also sync to public/robots.txt file for static serving
    try {
      const publicPath = path.join(process.cwd(), 'public', 'robots.txt');
      fs.writeFileSync(publicPath, content, 'utf-8');
    } catch (fsErr) {
      console.warn('Could not write robots.txt to public folder:', fsErr);
    }

    res.json(cfg);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/page-schemas', async (req, res) => {
  try {
    const schemas = await PageSchema.find().lean();
    res.json(schemas.map((s: any) => { s.id = s._id; return s; }));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/page-schemas/:page', async (req, res) => {
  try {
    const schema = await PageSchema.findOne({ page: req.params.page }).lean();
    if (!schema) return res.json({ page: req.params.page, structuredData: '' });
    res.json(schema);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/page-schemas/:page', async (req, res) => {
  try {
    const { structuredData, schemaType } = req.body;
    const updated = await PageSchema.findOneAndUpdate(
      { page: req.params.page },
      { structuredData, schemaType, page: req.params.page },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   CENTRALIZED INQUIRY MANAGEMENT & FORMS PERSISTENCE
   Contact Messages, Partner Inquiries, Volunteers, Internships
   ────────────────────────────────────────────────────────────── */

// Contact Form Handler
router.post('/contact-messages', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const newMsg = new ContactMessage({
      name,
      email,
      subject: subject || 'General Contact Inquiry',
      message,
      date: new Date().toISOString(),
      read: false,
      status: 'pending',
    });
    await newMsg.save();
    const obj = newMsg.toObject() as any;
    obj.id = obj._id;
    invalidateCache('contact-messages');
    invalidateCache('inquiries');
    res.status(201).json({ success: true, message: 'Message submitted successfully', data: obj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Partner Inquiry Handler
router.post('/partnership-inquiries', async (req, res) => {
  try {
    const name = req.body.name || req.body.contactPerson || req.body.contactName;
    const org = req.body.org || req.body.organizationName || req.body.orgName || '';
    const email = req.body.email;
    const phone = req.body.phone || '';
    const type = req.body.type || req.body.partnershipType || 'General Partnership';
    const message = req.body.message;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    const newInquiry = new PartnershipInquiry({
      name,
      org,
      email,
      phone,
      type,
      message,
      date: new Date().toISOString(),
      status: 'pending',
    });
    await newInquiry.save();
    const obj = newInquiry.toObject() as any;
    obj.id = obj._id;
    invalidateCache('partnership-inquiries');
    invalidateCache('inquiries');
    res.status(201).json({ success: true, message: 'Partnership inquiry submitted successfully', data: obj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteer Application Handler
router.post('/volunteer-apps', async (req, res) => {
  try {
    const { name, email, phone, interest, skills, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newApp = new VolunteerApp({
      name,
      email,
      phone: phone || '',
      interest: interest || 'General Volunteer',
      skills: skills || '',
      message: message || '',
      date: new Date().toISOString(),
      status: 'pending',
    });
    await newApp.save();
    const obj = newApp.toObject() as any;
    obj.id = obj._id;
    invalidateCache('volunteer-apps');
    invalidateCache('inquiries');
    res.status(201).json({ success: true, message: 'Volunteer application submitted successfully', data: obj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Internship Application Handler
router.post('/internship-apps', async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone || '';
    const program = req.body.program || req.body.department || 'Youth Leadership Internship';
    const university = req.body.university || '';
    const skills = req.body.skills || '';
    const message = req.body.message || req.body.coverLetter || '';

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newApp = new InternshipApp({
      name,
      email,
      phone,
      program,
      university,
      skills,
      message,
      date: new Date().toISOString(),
      status: 'pending',
    });
    await newApp.save();
    const obj = newApp.toObject() as any;
    obj.id = obj._id;
    invalidateCache('internship-apps');
    invalidateCache('inquiries');
    res.status(201).json({ success: true, message: 'Internship application submitted successfully', data: obj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Unified Centralized Inquiries Endpoint
router.get('/inquiries', async (req, res) => {
  try {
    const { type, status, search } = req.query;

    const [contacts, partners, volunteers, interns] = await Promise.all([
      ContactMessage.find().lean(),
      PartnershipInquiry.find().lean(),
      VolunteerApp.find().lean(),
      InternshipApp.find().lean(),
    ]);

    let unified: any[] = [];

    if (!type || type === 'all' || type === 'contact') {
      unified.push(...contacts.map((c: any) => ({
        id: c._id.toString(),
        originalId: c._id.toString(),
        type: 'contact',
        typeName: 'Contact Message',
        name: c.name,
        email: c.email,
        phone: '',
        title: c.subject || 'General Inquiry',
        message: c.message,
        details: c.message,
        date: c.date,
        status: c.status || (c.read ? 'reviewed' : 'pending'),
        read: !!c.read,
        data: { subject: c.subject, message: c.message },
      })));
    }

    if (!type || type === 'all' || type === 'partner' || type === 'partnership') {
      unified.push(...partners.map((p: any) => ({
        id: p._id.toString(),
        originalId: p._id.toString(),
        type: 'partnership',
        typeName: 'Partner Inquiry',
        name: p.name,
        email: p.email,
        phone: p.phone || '',
        title: `${p.org ? p.org + ' - ' : ''}${p.type || 'Partnership'}`,
        message: p.message,
        details: `${p.org ? 'Organization: ' + p.org + '\n' : ''}${p.type ? 'Partnership Type: ' + p.type + '\n' : ''}${p.phone ? 'Phone: ' + p.phone + '\n' : ''}${p.message || ''}`,
        date: p.date,
        status: p.status || 'pending',
        data: { organizationName: p.org, partnershipType: p.type, phone: p.phone, message: p.message },
      })));
    }

    if (!type || type === 'all' || type === 'volunteer') {
      unified.push(...volunteers.map((v: any) => ({
        id: v._id.toString(),
        originalId: v._id.toString(),
        type: 'volunteer',
        typeName: 'Volunteer Application',
        name: v.name,
        email: v.email,
        phone: v.phone || '',
        title: v.interest || 'Volunteer Action',
        message: `${v.skills ? 'Skills: ' + v.skills + '\n' : ''}${v.message || ''}`,
        details: `${v.interest ? 'Track / Interest: ' + v.interest + '\n' : ''}${v.skills ? 'Skills: ' + v.skills + '\n' : ''}${v.phone ? 'Phone: ' + v.phone + '\n' : ''}${v.message || ''}`,
        date: v.date,
        status: v.status || 'pending',
        data: { interest: v.interest, skills: v.skills, phone: v.phone, message: v.message },
      })));
    }

    if (!type || type === 'all' || type === 'intern' || type === 'internship') {
      unified.push(...interns.map((i: any) => ({
        id: i._id.toString(),
        originalId: i._id.toString(),
        type: 'internship',
        typeName: 'Internship Application',
        name: i.name,
        email: i.email,
        phone: i.phone || '',
        title: `${i.program || 'Internship'}${i.university ? ' (' + i.university + ')' : ''}`,
        message: `${i.skills ? 'Skills: ' + i.skills + '\n' : ''}${i.message || ''}`,
        details: `${i.program ? 'Program: ' + i.program + '\n' : ''}${i.university ? 'University: ' + i.university + '\n' : ''}${i.skills ? 'Skills: ' + i.skills + '\n' : ''}${i.phone ? 'Phone: ' + i.phone + '\n' : ''}${i.message || ''}`,
        date: i.date,
        status: i.status || 'pending',
        data: { program: i.program, university: i.university, skills: i.skills, phone: i.phone, message: i.message },
      })));
    }

    // Apply Status filter
    if (status && status !== 'all') {
      unified = unified.filter(item => item.status === status);
    }

    // Apply Search filter
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      unified = unified.filter(item =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.message && item.message.toLowerCase().includes(q)) ||
        (item.details && item.details.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q))
      );
    }

    // Sort by Date Descending
    unified.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

    res.json(unified);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update status of any inquiry
router.put('/inquiries/:type/:id/status', async (req, res) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;

    if (type === 'contact') {
      await ContactMessage.findByIdAndUpdate(id, { status, read: status !== 'pending' });
      invalidateCache('contact-messages');
    } else if (type === 'partner' || type === 'partnership') {
      await PartnershipInquiry.findByIdAndUpdate(id, { status });
      invalidateCache('partnership-inquiries');
    } else if (type === 'volunteer') {
      await VolunteerApp.findByIdAndUpdate(id, { status });
      invalidateCache('volunteer-apps');
    } else if (type === 'intern' || type === 'internship') {
      await InternshipApp.findByIdAndUpdate(id, { status });
      invalidateCache('internship-apps');
    } else {
      return res.status(400).json({ error: 'Invalid inquiry type' });
    }

    invalidateCache('inquiries');
    res.json({ success: true, status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   NEWSLETTER SUBSCRIPTIONS & CSV EXPORT
   ────────────────────────────────────────────────────────────── */
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    const existing = await NewsletterSub.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ error: 'already_subscribed', message: 'This email is already subscribed.' });
    }

    const newItem = new NewsletterSub({
      email: email.toLowerCase().trim(),
      date: new Date().toISOString(),
      status: 'active',
    });
    await newItem.save();

    // Send Welcome Email in background (safe, non-blocking)
    try {
      fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_USER_ID,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            to_email: email,
            user_email: email,
            email: email,
            to_name: 'Subscriber',
            name: 'Climate Advocate',
            reply_to: 'youthclimatenetworkbd@gmail.com',
          },
        }),
      }).catch((e) => console.warn('EmailJS non-blocking warning:', e.message));
    } catch (ignore) {}

    const obj = newItem.toObject() as any;
    obj.id = obj._id;
    invalidateCache('newsletter');
    res.status(201).json({ success: true, message: 'Successfully subscribed to the newsletter!', data: obj });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/newsletter/export-csv', async (req, res) => {
  try {
    const subs = await NewsletterSub.find().sort({ date: -1 }).lean();
    let csv = 'Email,Subscription Date,Status\n';
    subs.forEach((s: any) => {
      const email = `"${(s.email || '').replace(/"/g, '""')}"`;
      const date = `"${(s.date || '').replace(/"/g, '""')}"`;
      const status = `"${(s.status || 'active').replace(/"/g, '""')}"`;
      csv += `${email},${date},${status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="ycn-newsletter-subscribers.csv"');
    res.status(200).send(csv);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/newsletter/broadcast', async (req, res) => {
  try {
    const { subject, html } = req.body;
    const subs = await NewsletterSub.find({ status: { $ne: 'unsubscribed' } });
    if (subs.length === 0) {
      return res.status(400).json({ error: 'No active subscribers found.' });
    }

    const emails = subs.map(s => s.email).filter(Boolean) as string[];

    // Send in small batches to respect limits
    (async () => {
      for (const email of emails) {
        try {
          await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_id: EMAILJS_SERVICE_ID,
              template_id: EMAILJS_TEMPLATE_ID,
              user_id: EMAILJS_USER_ID,
              accessToken: EMAILJS_PRIVATE_KEY,
              template_params: {
                to_email: email,
                user_email: email,
                email: email,
                name: 'Climate Advocate',
                subject: subject || 'Update from Youth Climate Network',
                message: html,
                reply_to: 'youthclimatenetworkbd@gmail.com',
              },
            }),
          });
          await new Promise(r => setTimeout(r, 400));
        } catch (e) {
          console.warn(`Failed broadcast to ${email}:`, e);
        }
      }
    })();

    res.status(200).json({ success: true, count: emails.length, message: `Broadcasting to ${emails.length} subscribers` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* ──────────────────────────────────────────────────────────────
   REMAINING CORE CRUD & UTILITIES
   ────────────────────────────────────────────────────────────── */
createCrudRoutes(News, 'news', { date: -1 });
createCrudRoutes(Event, 'events', { date: 1 });
createCrudRoutes(Partner, 'partners', { name: 1 });
createCrudRoutes(VolunteerApp, 'volunteer-apps', { date: -1 });
createCrudRoutes(NewsletterSub, 'newsletter', { date: -1 });
createCrudRoutes(ContactMessage, 'contact-messages', { date: -1 });
createCrudRoutes(Donation, 'donations', { date: -1 });
createCrudRoutes(DonationRequest, 'donation-requests', { date: -1 });
createCrudRoutes(HeroCarousel, 'carousel', { order: 1 });
createCrudRoutes(PartnershipInquiry, 'partnership-inquiries', { date: -1 });
createCrudRoutes(InternshipApp, 'internship-apps', { date: -1 });
createCrudRoutes(InternshipPost, 'internship-posts');
createCrudRoutes(Media, 'media');
createCrudRoutes(Program, 'programs');

// Admin Auth
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const obj = user.toObject() as any;
    obj.id = obj._id;
    delete obj.password;
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Users CRUD
router.get('/admin-users', async (req, res) => {
  try {
    const users = await AdminUser.find().select('-password');
    const mapped = users.map((u: any) => {
      const obj = u.toObject();
      obj.id = obj._id;
      return obj;
    });
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin-users', async (req, res) => {
  try {
    const data = req.body;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const newUser = new AdminUser(data);
    await newUser.save();
    const obj = newUser.toObject() as any;
    obj.id = obj._id;
    delete obj.password;
    res.status(201).json(obj);
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

router.put('/admin-users/:id', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password;
    }
    const updated = await AdminUser.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject() as any;
    obj.id = obj._id;
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admin-users/:id', async (req, res) => {
  try {
    const deleted = await AdminUser.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Stats Singleton
router.get('/stats', async (req, res) => {
  try {
    let stats = await ImpactStats.findOne();
    if (!stats) {
      stats = new ImpactStats({
        peopleReached: 12500,
        treesPlanted: 50000,
        volunteers: 850,
        projects: 45,
        partners: 28,
        districts: 8,
      });
      await stats.save();
    }
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/stats', async (req, res) => {
  try {
    let stats = await ImpactStats.findOne();
    if (stats) {
      stats = await ImpactStats.findByIdAndUpdate(stats._id, req.body, { new: true });
    } else {
      stats = new ImpactStats(req.body);
      await stats.save();
    }
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Single and Multiple Image Uploads
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

router.post('/upload-multiple', upload.array('files', 10), (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    const urls = files.map(f => f.path);
    res.json({ urls });
  } else {
    res.status(400).json({ error: 'No files uploaded or file upload failed' });
  }
});

// Remove Demo Data safely
router.post('/clean-demo-data', async (req, res) => {
  try {
    // Delete only dummy test records without deleting real production data
    const blogRes = await Blog.deleteMany({
      $or: [
        { title: { $regex: /test|sample|dummy|lorem/i } },
        { excerpt: { $regex: /test|sample|dummy|lorem/i } }
      ]
    });
    const newsRes = await News.deleteMany({
      $or: [
        { title: { $regex: /test|sample|dummy|lorem/i } },
        { excerpt: { $regex: /test|sample|dummy|lorem/i } }
      ]
    });
    const eventRes = await Event.deleteMany({
      title: { $regex: /test|sample|dummy/i }
    });
    const contactRes = await ContactMessage.deleteMany({
      $or: [
        { name: { $regex: /test|sample|dummy/i } },
        { email: { $regex: /test@|example\.com/i } }
      ]
    });
    const partnerRes = await PartnershipInquiry.deleteMany({
      $or: [
        { name: { $regex: /test|sample|dummy/i } },
        { email: { $regex: /test@|example\.com/i } }
      ]
    });
    const volRes = await VolunteerApp.deleteMany({
      $or: [
        { name: { $regex: /test|sample|dummy/i } },
        { email: { $regex: /test@|example\.com/i } }
      ]
    });
    const internRes = await InternshipApp.deleteMany({
      $or: [
        { name: { $regex: /test|sample|dummy/i } },
        { email: { $regex: /test@|example\.com/i } }
      ]
    });

    invalidateCache();
    res.json({
      success: true,
      message: 'Demo and placeholder records cleaned successfully',
      deleted: {
        blogs: blogRes.deletedCount,
        news: newsRes.deletedCount,
        events: eventRes.deletedCount,
        contacts: contactRes.deletedCount,
        partners: partnerRes.deletedCount,
        volunteers: volRes.deletedCount,
        interns: internRes.deletedCount,
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Migration endpoint
router.post('/migrate-all', async (req, res) => {
  try {
    const data = req.body;
    if (data.news?.length) await News.insertMany(data.news);
    if (data.events?.length) await Event.insertMany(data.events);
    if (data.team?.length) await Team.insertMany(data.team);
    if (data.partners?.length) await Partner.insertMany(data.partners);
    if (data.volunteerApps?.length) await VolunteerApp.insertMany(data.volunteerApps);
    if (data.newsletter?.length) await NewsletterSub.insertMany(data.newsletter);
    if (data.contactMessages?.length) await ContactMessage.insertMany(data.contactMessages);
    if (data.donations?.length) await Donation.insertMany(data.donations);
    if (data.donationRequests?.length) await DonationRequest.insertMany(data.donationRequests);
    if (data.carousel?.length) await HeroCarousel.insertMany(data.carousel);
    if (data.advocacy?.length) await Advocacy.insertMany(data.advocacy);
    if (data.partnershipInquiries?.length) await PartnershipInquiry.insertMany(data.partnershipInquiries);
    if (data.internshipApps?.length) await InternshipApp.insertMany(data.internshipApps);
    if (data.internshipPosts?.length) await InternshipPost.insertMany(data.internshipPosts);
    if (data.stats) await new ImpactStats(data.stats).save();
    if (data.blogs?.length) await Blog.insertMany(data.blogs);
    if (data.programs?.length) await Program.insertMany(data.programs);

    invalidateCache();
    res.json({ success: true, message: 'Migration completed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
