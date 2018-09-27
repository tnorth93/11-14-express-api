'use strict';

const mongoose = require('mongoose');

const huskySchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 8,
  },
});

module.exports = mongoose.model('husky', huskySchema);
