import express from 'express';
import User from '../models/User.js';
import Department from '../models/Department.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/pending-approvals
// @desc    Get users pending approval
// @access  Private/Admin or HOD
router.get('/pending-approvals', protect, authorize('admin', 'hod'), async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'admin') {
      // Same rules as /api/approvals/pending
      query = {
        isActive: true,
        $or: [
          { role: 'hod', adminApproved: false },
          { role: 'technician', hodApproved: true, adminApproved: false }
        ]
      };
    } else if (req.user.role === 'hod') {
      query = {
        role: 'technician',
        department: req.user.department,
        hodApproved: false,
        isActive: true
      };
    }

    const users = await User.find(query)
      .select('-password')
      .populate('department')
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/technicians
// @desc    Get technicians in department (HOD only)
// @access  Private/HOD
router.get('/technicians', protect, authorize('hod'), async (req, res) => {
  try {
    const technicians = await User.find({
      role: 'technician',
      department: req.user.department,
      adminApproved: true,
      hodApproved: true
    })
      .select('-password')
      .sort({ name: 1 });
    
    res.json(technicians);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/approve
// @desc    Approve user
// @access  Private/Admin or HOD
router.put('/:id/approve', protect, authorize('admin', 'hod'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role === 'admin') {
      if (user.role === 'hod') {
        if (!user.department) {
          return res.status(400).json({ message: 'HOD must select a department before approval' });
        }

        const dept = await Department.findById(user.department);
        if (!dept) {
          return res.status(400).json({ message: 'Department not found' });
        }

        if (dept.hod && dept.hod.toString() !== user._id.toString()) {
          return res.status(400).json({ message: 'This department already has a Head of Department' });
        }

        dept.hod = user._id;
        await dept.save();
      }
      user.adminApproved = true;
    } else if (req.user.role === 'hod') {
      if (user.role === 'technician' && user.department.toString() === req.user.department.toString()) {
        user.hodApproved = true;
      } else {
        return res.status(403).json({ message: 'Not authorized to approve this user' });
      }
    }

    await user.save();

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Users can only update themselves, unless admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, phone, isActive } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Admin can activate/deactivate non-admin accounts
    if (typeof isActive === 'boolean' && req.user.role === 'admin') {
      if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'Cannot change active status of other admin accounts' });
      }
      user.isActive = isActive;
    }

    await user.save();

    const sanitized = await User.findById(user._id).select('-password').populate('department', 'name');
    res.json(sanitized);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

