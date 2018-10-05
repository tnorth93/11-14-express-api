'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');
const accountMock = require('./lib/account-mock');


const API_URL = `http://localhost:${process.env.PORT}/api/picture`;

describe('/api/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanAccountMocks);

  test('should respond with 200 and a picture', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            title: faker.lorem.words(2),
            url: faker.internet.url(),
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
});
