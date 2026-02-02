import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Asset from '../models/Asset.js';
import Department from '../models/Department.js';

dotenv.config();

// Chennai land boundaries (avoiding Bay of Bengal waters)
// Latitude: 12.95 to 13.15 (north-south)
// Longitude: 80.10 to 80.25 (west-east, staying inland from coast)
const CHENNAI_BOUNDS = {
  latMin: 12.95,
  latMax: 13.15,
  lngMin: 80.10,
  lngMax: 80.25
};

function getRandomChennaiCoord() {
  const lat = CHENNAI_BOUNDS.latMin + Math.random() * (CHENNAI_BOUNDS.latMax - CHENNAI_BOUNDS.latMin);
  const lng = CHENNAI_BOUNDS.lngMin + Math.random() * (CHENNAI_BOUNDS.lngMax - CHENNAI_BOUNDS.lngMin);
  return { lat, lng };
}

async function seedAssets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ams_db');
    console.log('MongoDB connected');

    // Clear existing assets
    const deleted = await Asset.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing assets.`);

    const departments = await Department.find({});
    if (!departments.length) {
      console.log('No departments found. Seed departments first.');
      process.exit(1);
    }

    const byName = Object.fromEntries(departments.map((d) => [d.name, d]));

    const plan = [
      { name: 'Electrical', category: 'Streetlights', count: 10 },
      { name: 'Roads', category: 'Roads', count: 10 },
      { name: 'Buildings', category: 'Buildings', count: 10 },
      { name: 'Water', category: 'Water Pipelines', count: 10 },
    ];

    const statuses = ['Safe', 'Under Maintenance', 'Damaged', 'Recently Repaired'];

    const docs = [];

    for (const group of plan) {
      const dept = byName[group.name];
      if (!dept) continue;

      for (let i = 1; i <= group.count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        docs.push({
          name: `${group.category} ${i.toString().padStart(3, '0')}`,
          category: group.category,
          department: dept._id,
          location: {
            type: 'Point',
            coordinates: (() => {
              const coord = getRandomChennaiCoord();
              return [coord.lng, coord.lat]; // [longitude, latitude] for GeoJSON
            })(),
          },
          status,
          description: `${group.category} asset in ${group.name} department`,
          lastInspectionDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
          complaintCount: Math.floor(Math.random() * 5),
        });
      }
    }

    if (!docs.length) {
      console.log('No assets to insert (check department names).');
      process.exit(1);
    }

    await Asset.insertMany(docs);
    console.log(`Inserted ${docs.length} assets.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding assets:', err);
    process.exit(1);
  }
}

seedAssets();


