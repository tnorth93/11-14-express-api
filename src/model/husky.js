'use strict';

const mongoose = require('mongoose');
const HttpError = require('http-errors');
const Pack = require('./pack');

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
  pack: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'pack',
  },
});

module.exports = mongoose.model('husky', huskySchema);
