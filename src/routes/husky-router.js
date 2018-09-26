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
    .catch(next)
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
  logger.log(logger.INFO, 'Processing a DELETE request on /api/huskies');
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Element to be deleted has been found');
    const indexToRemove = storageById.indexOf(request.params.id);
    storageById.splice(indexToRemove, 1);
    delete storageByHash[request.params.id];
    return response.sendStatus(204);
  }
  return next(new HttpError(404, 'Husky was not found'));
});

// ======================================================================================
//  PUT Update a Husky
// ======================================================================================
router.put('/api/huskies/:id', jsonParser, (request, response, next) => {
  logger.log(logger.INFO, `Trying to update an object with id ${request.params.id}`);
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'We found the right element to update');
    if (request.body.name) {
      storageByHash[request.params.id].name = request.body.name;
    }
    if (request.body.description) {
      storageByHash[request.params.id].description = request.body.description;
    }
    return response.json(storageByHash[request.params.id]);
  }
  return next(new HttpError(404, 'Husky not found'));
});
