'use strict';

const faker = require('faker');
const packMock = require('./pack_mock');
const Husky = require('../../src/model/husky');

const huskyMock = module.exports = {};

huskyMock.pCreateHuskyMock = () => {
  const resultMock = {};

  return packMock.pCreatePackMock()
    .then((createdPackMock) => {
      resultMock.pack = createdPackMock;

      return new Husky({
        name: faker.lorem.words(1),
        description: faker.lorem.words(12),
        pack: createdPackMock._id,
      }).save();
    })
    .then((createdHuskyMock) => {
      resultMock.husky = createdHuskyMock;
      return resultMock;
    });
};

huskyMock.pCleanHuskyMocks = () => {
  return Promise.all([
    Husky.remove({}),
    packMock.pCleanPackMocks(),
  ]);
};
