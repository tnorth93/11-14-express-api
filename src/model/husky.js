'use strict';

const mongoose = require('mongoose');

const huskySchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    minlength: 8,
  }
});

module.exports = mongoose.model('husky', huskySchema);

