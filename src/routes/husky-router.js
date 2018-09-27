'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Husky = require('../model/husky');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// ================================================================================
// POST Create a new Husky
// ================================================================================
router.post('/api/huskies', jsonParser, (request, response, next) => {
  return new Husky(request.body).save()
    .then((savedHusky) => {
      logger.log(logger.INFO, 'Responding with 200 code');
      return response.json(savedHusky);
    })
    .catch(next);
});

// ======================================================================================
//  GET View a specific Husky
// ======================================================================================
router.get('/api/huskies/:id', (request, response, next) => {
  return Husky.findById(request.params.id)
    .then((husky) => {
      if (husky) {
        logger.log(logger.INFO, 'Responding with a 200 code and a husky');
        return response.json(husky);
      }
      logger.log(logger.INFO, 'Responding with a 404 code');
      return next(new HttpError(404, 'husky not found'));
    })
    .catch(next);
});

// ======================================================================================
//  DELETE Remove a specific Husky
// ======================================================================================
router.delete('/api/huskies/:id', (request, response, next) => {
  return Husky.findByIdAndRemove(request.params.id)
    .then((husky) => {
      if (husky) {
        logger.log(logger.INFO, 'Husky deleted');
        return response.json(204, husky);
      }
      logger.log(logger.INFO, 'Responding with 404 code');
      return next(new HttpError(404, 'husky not found'));
    })
    .catch(next);
});

// ======================================================================================
//  PUT Update a Husky
// ======================================================================================
router.put('/api/huskies/:id', jsonParser, (request, response, next) => {
  const updateOptions = {
    runValidators: true,
    new: true,
  };
  return Husky.findByIdAndUpdate(request.params.id, request.body, updateOptions)
    .then((updatedHusky) => {
      if (updatedHusky) {
        logger.log(logger.INFO, 'Responding with 200');
        return response.json(updatedHusky);
      }
      logger.log(logger.INFO, 'Responding with 404');
      return next(new HttpError(404, 'could not be found'));
    })
    .catch(error => next(error));
});
