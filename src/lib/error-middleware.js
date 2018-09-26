'use strict';

const logger = require('./logger');

module.exports = (error, request, response, next) => { //eslint-disable-line
  logger.log(logger.ERROR, 'error middleware');
  logger.log(logger.ERROR, error);
  if (error.status) {
    logger.log(logger.ERROR, `Responding with a ${error.status} code and a message ofo ${error.message}`);
    return response.sendStatus(error.status);
  }
  logger.log(logger.ERROR, 'Responding with 500 error code');
  return response.sendStatus(500);
};
