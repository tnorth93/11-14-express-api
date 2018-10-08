'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Picture = require('../model/picture');
const bearerAuthMiddleWare = require('../lib/bearer-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// ===============================================================================================
// POST
// ===============================================================================================
router.post('/api/picture', bearerAuthMiddleWare, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  return new Picture({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(picture => response.json(picture))
    .catch(next);
});

// ===============================================================================================
// GET
// ===============================================================================================
router.get('/api/picture/:id', bearerAuthMiddleWare, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  return Picture.findById(request.params.id)
    .then((picture) => {
      if (picture) {
        return response.json(picture);
      }
      return next(new HttpError(404, 'Picture not found'));
    })
    .catch(next);
});
