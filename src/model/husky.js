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

// ========================================================================
// HOOKS
// ========================================================================
function huskyPreHook(done) {
  return Pack.findById(this.pack)
    .then((packFound) => {
      if(!packFound) {
        throw new HttpError(404, 'pack not found');
      }
      packFound.dawgPacks.push(this._id);
      return packFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
}

const huskyPostHook = (document, done) => {
  return Pack.findById(document.pack)
    .then((packFound) => {
      if (!packFound) {
        throw new HttpError(500, 'pack not found');
      }
      packFound.blogPosts = packFound.dawgPacks.filter((husky) => {
        return husky._id.toString() !== document._id.toString();
      });
      return packFound.save();
    })
    .then(() => done())
    .catch(error => done(error));
};

huskySchema.pre('save', huskyPreHook);
huskySchema.post('remove', huskyPostHook);

module.exports = mongoose.model('husky', huskySchema);
