'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const multer = require('multer');
const Picture = require('../model/picture');
const bearerAuthMiddleWare = require('../lib/bearer-auth-middleware');

// const jsonParser = bodyParser.json();
const upload = multer({ dest: `${__dirname}/../temp` });
const s3 = require('../lib/s3');

const router = module.exports = new express.Router();

// ===============================================================================================
// UPLOAD
// ===============================================================================================
router.post('/api/picture', bearerAuthMiddleWare, upload.any(), (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  if (!request.body.title || request.files.length > 1) {
  return next(new HttpError(400, 'bad request'));
  }
  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  return s3.pUpload(file.path, key)
    .then((s3URL) => {
    return new Picture({
      title: request.body.title,
      url: s3URL,
      account: request.account._id,
    }).save()
    })
    .then(picture => response.json(picture))
    .catch(next);
});