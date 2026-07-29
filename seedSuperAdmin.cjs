require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://youth_climate:youthclimate_0593@cluster0.4cfzohv.mongodb.net/youth_climate?retryWrites=true&w=majority&appName=Cluster0";

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: { type: [String], default: [] },
  isSuperAdmin: { type: Boolean, default: false },
});

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);

async function seedSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@ycnbd.org';
    const password = 'ycn@admin2024';

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log('Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = new AdminUser({
      name: 'Master Admin',
      email: email,
      password: hashedPassword,
      isSuperAdmin: true,
      permissions: [] // Super admin has implicit access to everything
    });

    await superAdmin.save();
    console.log('Successfully created super admin account: admin@ycnbd.org / ycn@admin2024');

  } catch (error) {
    console.error('Error seeding super admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedSuperAdmin();
