import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Program } from './models/index.js';
import { allPrograms } from '../src/app/lib/data.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ycn';

async function restore() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find what we have
    const existing = await Program.find();
    const existingSlugs = existing.map(p => p.slug);
    console.log(`Found ${existing.length} existing programs.`);

    let added = 0;
    for (const p of allPrograms) {
      if (!existingSlugs.includes(p.id)) {
        // Find iconName by trying to get the name of the function/object.
        // Actually, we can just use a regex on the original file, but since the
        // frontend used an Icon map before, we can just grab the name property.
        const iconName = p.icon?.name || p.icon?.displayName || 'Box';
        
        await Program.create({
          slug: p.id,
          title: p.title,
          title_bn: p.title_bn,
          iconName: iconName,
          theme: p.theme,
          theme_bn: p.theme_bn,
          color: p.color,
          bg: p.bg,
          description: p.description,
          description_bn: p.description_bn,
          keyPrograms: p.keyPrograms,
          keyPrograms_bn: p.keyPrograms_bn,
        });
        added++;
        console.log(`Added missing program: ${p.id} with icon ${iconName}`);
      }
    }

    console.log(`Restored ${added} programs successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

restore();
