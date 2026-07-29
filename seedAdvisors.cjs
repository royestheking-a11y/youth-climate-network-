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
  type: { type: String, default: 'member' },
});

const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

const advisorsList = [
    { name: 'Dr. Sue Maxam', role: 'Assistant Provost for Wellness at Pace University, USA and Inaugural Co Chair of the MCN Civic Learning Council', image: '/Formal Image -  Meet our team /Dr. Sue Maxam ,  Assistant Provost for Wellness at  Pace University , USA  and  Inaugural Co Chair of the MCN ( Millennium Campus Network ) Civic Learning Council  - Advisor .webp', type: 'advisor' },
    { name: 'Dr. Dave Dowland', role: 'Registrar, BRAC University and Inaugural Co Chair of the MCN Civic Learning Council', image: '/Formal Image -  Meet our team /Dr. Dave Dowland , Registrar, BRAC University  and Inaugural Co Chair of the MCN ( Millennium Campus Network ) Civic Learning Council - Advisor .jpg', type: 'advisor' },
    { name: 'Dr. Navid Saleh', role: 'Professor, Department of Civil, Architectural and Environmental Engineering at the University of Texas at Austin, USA', image: '/Formal Image -  Meet our team /Dr. Navid Saleh ,  Professor , Department of Civil , Architectural and Environmental Engineering at the University of Texas at Austin , USA..jpg', type: 'advisor' },
    { name: 'Abel Atares', role: 'Humanitarian', image: '/Formal Image -  Meet our team /Abel Atares - Humanitarian .jpg', type: 'advisor' },
    { name: 'Pablo Bescos', role: 'Humanitarian', image: '/Formal Image -  Meet our team /Pablo Bescos - Humanitarian .jpg', type: 'advisor' },
    { name: 'Dr. Tuhin Roy', role: 'Sociology Discipline, University of Khulna', email: 'tuhinroy@soc.ku.ac.bd', image: '/Formal Image -  Meet our team /Dr. Tuhin Roy , Sociology Discipline , University of Khulna .jpeg', type: 'advisor' },
    { name: 'Dr Hanif Miah', role: 'Associate Professor, Department of Sociology at University of Chittagong', email: 'miah.hanif@cu.ac.bd', image: '/Formal Image -  Meet our team /Dr Hanif Miah , Associate Professor , Department of Sociology at University of Chittagong   - Advisor .jpg', type: 'advisor' },
    { name: 'Dr. Md. Wasiul Islam', role: 'Professor, Forestry and Wood Technology Discipline, University of Khulna', email: 'wislam@fwt.ku.ac.bd', image: '/Formal Image -  Meet our team /Dr. Md. Wasiul Islam , Professor ,  Forestry and Wood Technology Discipline , University of Khulna  .jpg', type: 'advisor' },
    { name: 'Dr. Md Hafizur Rahman', role: 'Founder & Executive Director - Education for Development and Sustainability - EDS', image: '/Formal Image -  Meet our team /Dr. Md Hafizur Rahman , Founder & Executive Director - Education for Development  and Sustainability - EDS - Advisor .jpg', type: 'advisor' },
    { name: 'Dr. Md. Hasan Howlader', role: 'Associate Professor, Development Studies Discipline, University of Khulna', email: 'hasan@ds.ku.ac.bd', image: '/Formal Image -  Meet our team /Dr. Md.  Hasan  Howlader , Associate Professor , Development Studies Discipline , University of Khulna .jpg', type: 'advisor' },
    { name: 'Dr. Shapla Singha', role: 'Assistant Professor, Drawing and Painting Discipline, University of Khulna', email: 'shaplasingha@ku.ac.bd', image: '/Formal Image -  Meet our team /Dr. Shapla Singha, Assistant Professor , Drawing and Painting Discipline , University of Khulna  .jpg', type: 'advisor' },
    { name: 'M RIAD AKTER (Aadib)', role: 'Founder & CEO at EDAXIS Global', email: 'mail.me@riyadaadib.com', image: '/Formal Image -  Meet our team /M RIAD AKTER (Aadib).jpeg', type: 'advisor' },
    { name: 'MUTLUBA NACHRIN (Meete)', role: 'Founder & CEO @ Tourng Travelers', email: 'director@tourng.com', image: '/Formal Image -  Meet our team /MUTLUBA NACHRIN (Meete).jpeg', type: 'advisor' },
    { name: 'MD. Matiur Rahman Talukder', role: 'Retired Deputy Director - Department of Youth Development', image: '/Formal Image -  Meet our team /MD. Matiur Rahman Talukder  Retired Deputy Director - Department of Youth Development,  Ministry of Youth and Sports_.jpg', type: 'advisor' },
    { name: 'Mohammed Mofizur Rahman', role: 'Scientist, Potsdam Institute for Climate Impact Research', image: '/Formal Image -  Meet our team /Mohammed Mofizur Rahman - Scientist , Potsdam Institute for Climate Impact Research ..jpg', type: 'advisor' },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert advisors directly
    const inserted = await Team.insertMany(advisorsList);
    console.log(`Successfully seeded ${inserted.length} advisors`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
