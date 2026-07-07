const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  coverImage: {
    type: String,
    default: '',
  },
  published: {
    type: Boolean,
    default: true,
  },
  personaId: {
    type: String,
    default: 'developer',
  },
  category: {
    type: String,
    default: 'Development',
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
