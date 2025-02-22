const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all interns (admin only)
// Explicitly select only the necessary fields, including collegeName
router.get('/', protect, admin, async (req, res) => {
  try {
    const interns = await User.find({ role: 'intern' }).select('email name collegeName');
    res.json(interns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interns' });
  }
});

// Create a new intern (admin only)
router.post('/', protect, admin, async (req, res) => {
  const { email, password, name, collegeName } = req.body;
  try {
    const intern = await User.create({ email, password, name, collegeName, role: 'intern' });
    res.json(intern);
  } catch (error) {
    res.status(500).json({ message: 'Error creating intern' });
  }
});

// Update intern details (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  const { email, name, password, collegeName } = req.body;
  try {
    const intern = await User.findById(req.params.id);
    if (!intern || intern.role !== 'intern')
      return res.status(404).json({ message: 'Intern not found' });
    intern.email = email || intern.email;
    intern.name = name || intern.name;
    if (collegeName !== undefined) intern.collegeName = collegeName;
    if (password) intern.password = password;
    await intern.save();
    res.json(intern);
  } catch (error) {
    res.status(500).json({ message: 'Error updating intern' });
  }
});

// Delete intern (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const intern = await User.findById(req.params.id);
    if (!intern || intern.role !== 'intern')
      return res.status(404).json({ message: 'Intern not found' });
    await intern.remove();
    res.json({ message: 'Intern deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting intern' });
  }
});

module.exports = router;
