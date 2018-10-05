'use strict';

const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    default: new Date(),
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('picture', pictureSchema);