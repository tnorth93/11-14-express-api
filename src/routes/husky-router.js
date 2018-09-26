'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');

const Husky = require('../model/husky');
const logger = require('../lib/logger');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

const storageById = [];
const storageByHash = {};

// ================================================================================
// POST Create a new Husky
// ================================================================================
router.post('/api/huskies', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'Processing a POST request on /api/huskies');
  if (!request.body) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }
  if (!request.body.name) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }
  if (!request.body.description) {
    logger.log(logger.INFO, 'Responding with a 400 status code');
    return response.sendStatus(400);
  }
  const husky = new Husky(request.body.name, request.body.description);
  storageById.push(husky.id);
  storageByHash[husky.id] = husky;
  logger.log(logger.INFO, 'Responding with a 200 status code and a json abject');
  logger.log(logger.INFO, storageById);
  logger.log(logger.INFO, storageByHash);
  return response.json(husky);
});

// ======================================================================================
//  GET View a specific Husky
// ======================================================================================
router.get('/api/huskies/:id', (request, response) => {
  logger.log(logger.INFO, 'Processing a GET request on /api/huskies');
  logger.log(logger.INFO, `Trying to get an object with id ${request.params.id}`);
  if (storageByHash[request.params.id]) {
    logger.log(logger.INFO, 'Responding with a 200 status code and json data');
    return response.json(storageByHash[request.params.id]); // O(1)
  }
  if (!request.params.id) {
    logger.log(logger.INFO, 'responding with 404 because no id included in url');
    return response.sendStatus(400);
  }
  logger.log(logger.INFO, 'Responding with a 404 status code. The husky was not found :(');
  return response.sendStatus(404);
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
