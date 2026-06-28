const express = require('express');
const router = express.Router();
const Persona = require('../models/Persona');
const auth = require('../middleware/auth');

// @route   GET /api/personas
// @desc    Get all personas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const personas = await Persona.find();
    res.json(personas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/personas
// @desc    Create or Update a persona by personaId
// @access  Private (Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { personaId } = req.body;
    let persona = await Persona.findOne({ personaId });

    if (persona) {
      // Update
      persona = await Persona.findOneAndUpdate(
        { personaId },
        { $set: req.body },
        { new: true }
      );
      return res.json(persona);
    }

    // Create
    persona = new Persona(req.body);
    await persona.save();
    res.json(persona);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/personas/:id
// @desc    Update a persona by id
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const persona = await Persona.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(persona);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/personas/:id
// @desc    Delete a persona
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) return res.status(404).json({ msg: 'Persona not found' });
    await persona.deleteOne();
    res.json({ msg: 'Persona removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
