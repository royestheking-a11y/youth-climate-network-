import mongoose from 'mongoose';

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
  bio: String,
  bio_bn: String,
  email: String,
  image: String,
});

const partnerSchema = new mongoose.Schema({
  name: String,
  category: String,
  url: String,
  logo: String,
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
  email: String,
  date: String,
});

const contactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: String,
  read: { type: Boolean, default: false },
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
  tag: String,
  headlineEn: String,
  headlineBn: String,
  descEn: String,
  descBn: String,
});

const advocacySchema = new mongoose.Schema({
  title: String,
  title_bn: String,
  type: String, // 'position-paper' | 'statement' | 'press-release' | 'report'
  date: String,
  summary: String,
  summary_bn: String,
  file: String,
  featured: Boolean,
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
export const ImpactStats = mongoose.model('ImpactStats', impactStatsSchema);
export const Media = mongoose.model('Media', mediaSchema);
