'use strict';

const faker = require('faker');
const Pack = require('../../src/model/pack');

const packMock = module.exports = {};

packMock.pCreatePackMock = () => {
  return new Pack({
    name: faker.lorem.words(1),
    description: faker.lorem.words(12),
  }).save();
};

packMock.pCleanPackMocks = () => {
  return Pack.remove({});
};
