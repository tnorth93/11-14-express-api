'use strict';

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');
const huskyRoutes = require('../routes/husky-router');

const app = express();

//-------------------------------------------------------------------------------------------------
// Routes
//-------------------------------------------------------------------------------------------------
app.use(loggerMiddleware);

app.use(huskyRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from catch-all/default route (the route was not found');
  return response.sendStatus(404);
});

app.use(errorMiddleware);
//-------------------------------------------------------------------------------------------------
const server = module.exports = {};
let internalServer = null;

server.start = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      return internalServer = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `server is on at PORT: ${process.env.PORT}`);
      });
    });
};

server.stop = () => {
  return mongoose.disconnect()
    .then(() => {
      return internalServer.close(() => {
        logger.log(logger.INFO, 'the server is off');
      });
    });
};
