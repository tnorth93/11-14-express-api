'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Picture = require('../model/picture');
const bearerAuthMiddleWare = require('../lib/bearer-auth-middleware');

const jsonParser = bodyParser.json;
const router = module.exports = new express.Router();

router.post('/api/picture', bearerAuthMiddleWare, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'bad request'));
  }
  return new Picture({
    ...request.body,
  }).save()
    .then(picture => response.json(picture))
    .catch(next);
});
