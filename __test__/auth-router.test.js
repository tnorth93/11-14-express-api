'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');
const API_URL = `http://localhost:${process.env.PORT}/api/signup`;

describe('Auth Tests', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return a 200 code and a token', () => {
    return superagent.post(API_URL)
      .send({
        username: faker.lorem.words(1),
        password:faker.lorem.words(1),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
    });
  });

  test('return 200 and a token if logging in', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.username, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
});
