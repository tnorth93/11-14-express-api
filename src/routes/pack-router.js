'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Pack = require('../model/pack');
const logger = require('../lib/logger');
const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

router.post('/api/packs', jsonParser, (request, response, next) => {
  return new Pack(request.body).save()
    .then((savedPack) => {
      logger.log(logger.INFO, 'Responding with a 200 status code');
      return response.json(savedPack);
    })
    .catch(next);
});

router.get('/api/packs/:id', (request, response, next) => {
  return Pack.findById(request.params.id)
    .then((pack) => {
      if (pack) {
        logger.log(logger.INFO, 'Responding with a 200 status code and a pack');
        return response.json(pack);
      }
      logger.log(logger.INFO, 'Responding with 404 code. Pack not found');
      return next(new HttpError(404, 'pack not found'));
    })
    .catch(next);
});