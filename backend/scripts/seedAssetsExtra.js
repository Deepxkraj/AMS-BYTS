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

async function seedExtraAssets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ams_db');
    console.log('MongoDB connected');

    // Target another department, e.g., "Public Utilities"
    const dept = await Department.findOne({ name: 'Public Utilities' });
    if (!dept) {
      console.log('Department "Public Utilities" not found. Cannot seed extra assets.');
      process.exit(1);
    }

    // Clear existing assets in Public Utilities
    const deleted = await Asset.deleteMany({ department: dept._id });
    console.log(`Cleared ${deleted.deletedCount} existing assets in Public Utilities.`);

    const docs = [];
    for (let i = 1; i <= 10; i++) {
      docs.push({
        name: `Public Utility ${i.toString().padStart(3, '0')}`,
        category: 'Public Utilities',
        department: dept._id,
        location: {
          type: 'Point',
          coordinates: (() => {
            const coord = getRandomChennaiCoord();
            return [coord.lng, coord.lat]; // [longitude, latitude] for GeoJSON
          })(),
        },
        status: 'Safe',
        description: 'Public utility asset in Public Utilities department',
        lastInspectionDate: new Date(),
        complaintCount: 0,
      });
    }

    await Asset.insertMany(docs);
    console.log(`Inserted ${docs.length} extra assets into Public Utilities.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding extra assets:', err);
    process.exit(1);
  }
}

seedExtraAssets();


