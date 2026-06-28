const express = require('express');
const router = express.Router();
const Stat = require('../models/Stat');
const auth = require('../middleware/auth');

// @route   GET /api/stats
// @desc    Get all stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.personaId) filter.personaId = req.query.personaId;
    const stats = await Stat.find(filter);
    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// @route   POST /api/stats
// @desc    Create a stat
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const newStat = new Stat(req.body);
    const stat = await newStat.save();
    res.json(stat);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// @route   PUT /api/stats/:id
// @desc    Update a stat
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const stat = await Stat.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(stat);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// @route   DELETE /api/stats/:id
// @desc    Delete a stat
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Stat.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Stat removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = router;
