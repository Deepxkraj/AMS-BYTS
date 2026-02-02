import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from '../models/Department.js';

dotenv.config();

const DEFAULT_DEPARTMENTS = [
  { name: 'Electrical', description: 'Streetlights, power-related public infrastructure' },
  { name: 'Roads', description: 'Roads, footpaths, traffic-related assets' },
  { name: 'Water', description: 'Water pipelines, valves, water supply assets' },
  { name: 'Buildings', description: 'Public buildings, structural maintenance' },
  { name: 'Public Utilities', description: 'Other municipal public utilities' },
];

async function seedDepartments() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ams_db');
    console.log('MongoDB connected');

    for (const d of DEFAULT_DEPARTMENTS) {
      await Department.updateOne(
        { name: d.name },
        { $setOnInsert: { name: d.name, description: d.description } },
        { upsert: true }
      );
    }

    const count = await Department.countDocuments();
    console.log(`Departments ready. Total: ${count}`);
    process.exit(0);
  } catch (e) {
    console.error('Error seeding departments:', e);
    process.exit(1);
  }
}

seedDepartments();


