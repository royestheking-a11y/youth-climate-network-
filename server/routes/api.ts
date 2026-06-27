import express from 'express';
import { upload } from '../config/cloudinary';
import {
  News, Event, Team, Partner, VolunteerApp, NewsletterSub,
  ContactMessage, Donation, DonationRequest, HeroCarousel,
  Advocacy, PartnershipInquiry, InternshipApp, ImpactStats,
  Media
} from '../models';

const router = express.Router();

// Generic CRUD factory
const createCrudRoutes = (model: any, path: string) => {
  // Get all
  router.get(`/${path}`, async (req, res) => {
    try {
      const items = await model.find();
      // Map _id to id for frontend compatibility
      const mapped = items.map((i: any) => {
        const obj = i.toObject();
        obj.id = obj._id;
        return obj;
      });
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
createCrudRoutes(NewsletterSub, 'newsletter');
createCrudRoutes(ContactMessage, 'contact-messages');
createCrudRoutes(Donation, 'donations');
createCrudRoutes(DonationRequest, 'donation-requests');
createCrudRoutes(HeroCarousel, 'carousel');
createCrudRoutes(Advocacy, 'advocacy');
createCrudRoutes(PartnershipInquiry, 'partnership-inquiries');
createCrudRoutes(InternshipApp, 'internship-apps');
createCrudRoutes(Media, 'media');

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
      ImpactStats.deleteMany({}),
      Media.deleteMany({})
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
    if (data.stats) await new ImpactStats(data.stats).save();

    res.json({ success: true, message: 'Migration completed successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
