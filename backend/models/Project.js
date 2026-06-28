const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    default: '',
  },
  liveLink: {
    type: String,
    default: '',
  },
  githubLink: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['software', 'writing', 'other'],
    default: 'software'
  },
  featured: {
    type: Boolean,
    default: false,
  },
  personaId: {
    type: String,
    default: 'developer',
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
