import express from 'express';
import bcrypt from 'bcryptjs';
import { upload } from '../config/cloudinary';
import {
  News, Event, Team, Partner, VolunteerApp, NewsletterSub,
  ContactMessage, Donation, DonationRequest, HeroCarousel,
  Advocacy, PartnershipInquiry, InternshipApp, InternshipPost, ImpactStats,
  Media, AdminUser, Blog, Program
} from '../models';

const router = express.Router();

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID || 'service_js7tgz8';
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || 'template_byqqj3n';
const EMAILJS_USER_ID = process.env.EMAILJS_PUBLIC_KEY || 'lnfsoU0tZZVZk15EY';      // Public Key
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || 'U6F85h13cCGXN3D6L6Egn'; // Private Key


const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_TTL = 60 * 1000; // 1 minute cache TTL to prevent stale data

// Generic CRUD factory
const createCrudRoutes = (model: any, path: string) => {
  // Get all
  router.get(`/${path}`, async (req, res) => {
    try {
      const now = Date.now();
      if (cache[path] && (now - cache[path].timestamp < CACHE_TTL)) {
        return res.json(cache[path].data);
      }
      
      const items = await model.find().sort(path === 'team' ? { order: 1 } : {}).lean();
      // Map _id to id for frontend compatibility
      const mapped = items.map((i: any) => {
        i.id = i._id;
        return i;
      });
      
      cache[path] = { data: mapped, timestamp: now };
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create
  router.post(`/${path}`, async (req, res) => {
    try {
      const newItem = new model(req.body);
      await newItem.save();
      const obj = newItem.toObject();
      obj.id = obj._id;
      delete cache[path]; // invalidate cache
      res.status(201).json(obj);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      const updated = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      const obj = updated.toObject();
      obj.id = obj._id;
      delete cache[path]; // invalidate cache
      res.json(obj);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      const deleted = await model.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      delete cache[path]; // invalidate cache
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reorder (custom for items with an order field)
  router.post(`/${path}/reorder`, async (req, res) => {
    try {
      const { items } = req.body; // { id, order }[]
      for (const item of items) {
        await model.findByIdAndUpdate(item.id, { order: item.order });
      }
      delete cache[path];
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
};

createCrudRoutes(News, 'news');
createCrudRoutes(Event, 'events');
createCrudRoutes(Team, 'team');
createCrudRoutes(Partner, 'partners');
createCrudRoutes(VolunteerApp, 'volunteer-apps');

// Admin Auth and Users
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
    delete obj.password; // Don't send password hash back
    res.json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Users CRUD (custom for password hashing)
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
      delete data.password; // Don't overwrite with blank
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

// Custom Newsletter Routes
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Check for duplicate
    const existing = await NewsletterSub.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'already_subscribed' });
    }

    // Save to DB
    const newItem = new NewsletterSub(req.body);
    await newItem.save();
    
    // Send Welcome Email via EmailJS
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
          user_email: email, // some templates use this instead
          email: email,      // this matches {{email}}
          to_name: 'Subscriber',
          name: 'Climate Advocate', // this matches {{name}}
          reply_to: 'youthclimatenetworkbd@gmail.com'
        }
      })
    });

    const obj = newItem.toObject() as any;
    obj.id = obj._id;
    res.status(201).json(obj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/newsletter/broadcast', async (req, res) => {
  try {
    const { subject, html } = req.body;
    
    // Fetch all subscribers
    const subs = await NewsletterSub.find();
    if (subs.length === 0) {
      return res.status(400).json({ error: 'No subscribers found.' });
    }

    const emails = subs.map(s => s.email).filter(Boolean) as string[];

    // Send broadcast via EmailJS (looping due to API limits/design)
    // NOTE: EmailJS free tier has a 200 emails/day limit.
    for (const email of emails) {
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
            reply_to: 'youthclimatenetworkbd@gmail.com'
          }
        })
      });
      // sleep a bit to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    res.status(200).json({ success: true, count: emails.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

createCrudRoutes(NewsletterSub, 'newsletter');
createCrudRoutes(ContactMessage, 'contact-messages');
createCrudRoutes(Donation, 'donations');
createCrudRoutes(DonationRequest, 'donation-requests');
createCrudRoutes(HeroCarousel, 'carousel');
createCrudRoutes(Advocacy, 'advocacy');
createCrudRoutes(PartnershipInquiry, 'partnership-inquiries');
createCrudRoutes(InternshipApp, 'internship-apps');
createCrudRoutes(InternshipPost, 'internship-posts');
createCrudRoutes(Media, 'media');
createCrudRoutes(Blog, 'blogs');
createCrudRoutes(Program, 'programs');

// Special route for stats (singleton)
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

// File upload route
router.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    res.json({ url: req.file.path });
  } else {
    res.status(400).json({ error: 'File upload failed' });
  }
});

// Migration endpoint to bulk insert localStorage data
router.post('/migrate-all', async (req, res) => {
  try {
    const data = req.body;

    // Clear existing data first
    await Promise.all([
      News.deleteMany({}),
      Event.deleteMany({}),
      Team.deleteMany({}),
      Partner.deleteMany({}),
      VolunteerApp.deleteMany({}),
      NewsletterSub.deleteMany({}),
      ContactMessage.deleteMany({}),
      Donation.deleteMany({}),
      DonationRequest.deleteMany({}),
      HeroCarousel.deleteMany({}),
      Advocacy.deleteMany({}),
      PartnershipInquiry.deleteMany({}),
      InternshipApp.deleteMany({}),
      InternshipPost.deleteMany({}),
      ImpactStats.deleteMany({}),
      Media.deleteMany({}),
      Blog.deleteMany({}),
      Program.deleteMany({})
    ]);

    // Insert new data if present
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

    res.json({ success: true, message: 'Migration completed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
