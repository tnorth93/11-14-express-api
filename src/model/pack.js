'use strict';

const mongoose = require('mongoose');

const packSchema = mongoose.Schema({
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
    minlength: 12,
  },
  dawgPacks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'packHusky',
    },
  ],
},
{
  usePushEach: true,
});

module.exports = mongoose.model('pack', packSchema);
