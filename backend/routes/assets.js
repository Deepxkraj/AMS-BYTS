import express from 'express';
import Asset from '../models/Asset.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

function parseLocation(body) {
  // Accept:
  // - body.location as object: { latitude, longitude } or { lat, lng }
  // - body.location as JSON string
  // - body.latitude/body.longitude as strings (FormData)
  let loc = body.location;
  if (typeof loc === 'string') {
    try {
      loc = JSON.parse(loc);
    } catch {
      loc = null;
    }
  }

  const latitude =
    (loc && (loc.latitude ?? loc.lat)) ??
    (body.latitude ?? body.lat);
  const longitude =
    (loc && (loc.longitude ?? loc.lng)) ??
    (body.longitude ?? body.lng);

  const latNum = Number(latitude);
  const lngNum = Number(longitude);

  if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
    return { latitude: latNum, longitude: lngNum };
  }
  return null;
}

// @route   GET /api/assets
// @desc    Get all assets
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // HOD sees only their department assets
    if (req.user.role === 'hod') {
      query.department = req.user.department;
    }
    
    // Technician sees only assigned assets
    if (req.user.role === 'technician') {
      query.assignedTechnician = req.user._id;
    }

    const assets = await Asset.find(query)
      .populate('department', 'name')
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/assets/:id
// @desc    Get single asset
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('department', 'name')
      .populate('assignedTechnician', 'name email');
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check access permissions
    if (req.user.role === 'hod' && asset.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'technician' && asset.assignedTechnician?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/assets
// @desc    Create asset
// @access  Private/Admin or HOD
router.post('/', protect, authorize('admin', 'hod'), async (req, res) => {
  try {
    const { name, category, department, description } = req.body;
    const loc = parseLocation(req.body);
    if (!loc) {
      return res.status(400).json({ message: 'Valid location (latitude/longitude) is required' });
    }

    // HOD can only create assets in their department
    if (req.user.role === 'hod') {
      if (department !== req.user.department.toString()) {
        return res.status(403).json({ message: 'Not authorized to create asset in this department' });
      }
    }

    const asset = await Asset.create({
      name,
      category,
      department,
      location: {
        type: 'Point',
        coordinates: [loc.longitude, loc.latitude]
      },
      description
    });

    const populatedAsset = await Asset.findById(asset._id)
      .populate('department', 'name')
      .populate('assignedTechnician', 'name email');

    res.status(201).json(populatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/assets/:id
// @desc    Update asset
// @access  Private/Admin or HOD
router.put('/:id', protect, authorize('admin', 'hod', 'technician'), async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check permissions
    if (req.user.role === 'hod' && asset.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role === 'technician' && asset.assignedTechnician?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, category, status, description, assignedTechnician, lastInspectionDate } = req.body;

    if (name) asset.name = name;
    if (category) asset.category = category;
    if (status) asset.status = status;
    if (description !== undefined) asset.description = description;
    if (assignedTechnician !== undefined && (req.user.role === 'admin' || req.user.role === 'hod')) {
      asset.assignedTechnician = assignedTechnician;
    }
    if (lastInspectionDate) asset.lastInspectionDate = lastInspectionDate;
    
    asset.updatedAt = new Date();

    await asset.save();

    const populatedAsset = await Asset.findById(asset._id)
      .populate('department', 'name')
      .populate('assignedTechnician', 'name email');

    res.json(populatedAsset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    await asset.deleteOne();
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

