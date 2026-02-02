import express from 'express';
import Department from '../models/Department.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Public (used by signup forms)
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find()
      .populate('hod', 'name email')
      .sort({ name: 1 });
    
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/departments
// @desc    Create department
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await Department.create({
      name,
      description
    });

    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Department already exists' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const { name, description, hod } = req.body;
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (hod !== undefined) department.hod = hod;

    await department.save();

    const populatedDept = await Department.findById(department._id)
      .populate('hod', 'name email');

    res.json(populatedDept);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

