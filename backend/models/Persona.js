const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  personaId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  tagline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  theme: {
    accentColor: String,
    bgColor: String,
    textColor: String,
    fontFamily: String,
    gradient: String,
  },
  skills: [{
    category: String,
    items: [{
      name: String,
      level: String
    }]
  }],
}, { timestamps: true, strict: false });

module.exports = mongoose.model('Persona', personaSchema);
