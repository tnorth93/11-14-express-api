'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const HttpError = require('http-errors');

const accountSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const TOKEN_SEED_LENGTH = 128;

function pVerifyPassword(plainTextPassword) {
  return bcrypt.compare(plainTextPassword, this.passwordHash)
    .then((compareResult) => {
      if (!compareResult) {
        throw new HttpError(401, 'Unauthorized');
      }
      return this;
    })
    .catch(console.error);
}

function pCreateToken() {
  this.tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save()
    .then((savedAccount) => {
      return jsonWebToken.sign({
        tokenSeed: savedAccount.tokenSeed,
      }, process.env.SECRET);
    })
    .catch((error) => {
      throw error;
    });
}

accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

const Account = module.exports = mongoose.model('account', accountSchema);

const HASH_ROUNDS = 10;

Account.create = (username, email, password) => {
  return bcrypt.hash(password, HASH_ROUNDS)
    .then((passwordHash) => {
      password = null; // eslint-disable-line
      const tokenSeed = crypto.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
      return new Account({
        username,
        email,
        tokenSeed,
        passwordHash,
      }).save();
    });
};
