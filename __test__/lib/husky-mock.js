'use strict';

const faker = require('faker');
const Husky = require('../../src/model/husky');

const huskyMock = module.exports = {};

huskyMock.pCreateHuskyMock = () => {
  return new Husky({
    name: faker.lorem.words(1),
    description: faker.lorem.words(12),
  }).save();
};

huskyMock.pCleanHuskyMocks = () => {
  return Husky.remove({});
};
