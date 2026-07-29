require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://youth_climate:youthclimate_0593@cluster0.4cfzohv.mongodb.net/youth_climate?retryWrites=true&w=majority&appName=Cluster0";

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

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

const teamList = [
    { name: 'Arafat Hossain Akash', role: 'Founder & Executive Director', image: '/Formal Image -  Meet our team /1. Arafat Hossain Akash - Founder & Executive Director .png' },
    { name: 'Madhusudan Mondal', role: 'Head of Programme & Climate Action', image: '/Formal Image -  Meet our team /2. Madhusudan Mondal - Head of Programme & Climate Action.png' },
    { name: 'Ariful Islam', role: 'Community Engagement Officer', image: '/Formal Image -  Meet our team /3. Ariful Islam -  Community Engagement Officer.png' },
    { name: 'Jobaer Hossain', role: 'Monitoring, Evaluation & Learning ( MEAL)  officer', image: '/Formal Image -  Meet our team /4.  Jobaer Hossain - Monitoring, Evaluation & Learning ( MEAL)  officer.png' },
    { name: 'Puja Gain', role: 'Volunteer Coordinator', image: '/Formal Image -  Meet our team /5.  Puja Gain -  Volunteer Coordinator.png' },
    { name: 'Sadique Haseen Ratul', role: 'Head of Digital Engagement & Advocacy', image: '/Formal Image -  Meet our team /6.  Sadique Haseen Ratul  - Head of Digital Engagement & Advocacy.png' },
    { name: 'Usha Bin Farid', role: 'Communications & Content Officer', image: '/Formal Image -  Meet our team /7. Usha Bin Farid - Communications & Content Officer.jpg' },
    { name: 'Md Nahid Hosen', role: 'Head of Partnerships & Resource Mobilization', image: '/Formal Image -  Meet our team /8. Md Nahid Hosen - Head of Partnerships & Resource Mobilization.png' },
    { name: 'Azibar Hossain', role: 'Partnerships officer', image: '/Formal Image -  Meet our team /9. Azibar Hossain - Partnerships officer. .png' },
    { name: 'Antora Akter Nodee', role: 'Fundraising Coordinator', image: '/Formal Image -  Meet our team /10.  Antora Akter Nodee - Fundraising Coordinator.png' },
    { name: 'Hasibul Alam Hridoy', role: 'Head of Research,  Policy & Innovation', image: '/Formal Image -  Meet our team /11. Hasibul Alam Hridoy  - Head of Research,  Policy & Innovation.jpg' },
    { name: 'Rifat Sana', role: 'Knowledge Management Officer', image: '/Formal Image -  Meet our team /12. Rifat Sana -Knowledge Management Officer. .png' },
    { name: 'Md. Arif Morol', role: 'Finance & Adminstration Manager', image: '/Formal Image -  Meet our team /13. Md. Arif Morol - Finance & Adminstration Manager_.png' },
    { name: 'Ashikur Rahman', role: 'Head of  Operations', image: '/Formal Image -  Meet our team /14. Ashikur Rahman - Head of  Operations.png' },
    { name: 'Imran Hosen', role: 'Head of Logistics officer', image: '/Formal Image -  Meet our team /14.Imran Hosen - Head of Logistics officer.png' },
    { name: 'Anupurba Sarkar', role: 'People & Culture Manager', image: '/Formal Image -  Meet our team /16. Anupurba Sarkar -  People & Culture Manager. .png' },
    { name: 'Riaz Afrin', role: 'Learning & Development Officer', image: '/Formal Image -  Meet our team /17.  Riaz Afrin  - Learning & Development Officer.png' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing team collection
    await Team.deleteMany({});
    console.log('Cleared existing team collection');

    // Insert new data
    const inserted = await Team.insertMany(teamList);
    console.log(`Successfully seeded ${inserted.length} team members`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
