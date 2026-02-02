import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Streetlights', 'Roads', 'Buildings', 'Water Pipelines', 'Public Utilities'],
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Safe', 'Under Maintenance', 'Damaged', 'Recently Repaired'],
    default: 'Safe'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastInspectionDate: {
    type: Date
  },
  description: {
    type: String,
    trim: true
  },
  complaintCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
assetSchema.index({ location: '2dsphere' });

export default mongoose.model('Asset', assetSchema);

