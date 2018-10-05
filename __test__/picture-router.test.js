'use strict';

const faker = require('faker');
const Picture = require('../../src/model/picture');
const accountMock = require('./account-mock');

const pictureMock = module.exports = {};

pictureMock.pCreatePictureMock = () => {
  const resultMock = {};
  return accountMock.pCreateMock()
    .then((mockedAccount) => {
      resultMock.account = mockedAccount;
      return new Picture({
        title: faker.lorem.words(2),
        url: faker.internet.url(),
        account: mockedAccount.account._id,
      }).save();
    })
    .then((createdPicture) => {
      resultMock.picture = createdPicture;
      return resultMock;
    });
};

pictureMock.pCleanPictureMock = () => {
  return Promise.all([
    Picture.remove({}),
    accountMock.pCleanAccountMocks(),
  ]);
};
