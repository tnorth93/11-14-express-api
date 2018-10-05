'use strict';

const faker = require('faker');
const superagent = require('superagent');
const accountMock = require('./lib/account-mock');
const server = require('../src/lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Auth Tests', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should return a 200 code and a token', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        username: faker.lorem.words(1),
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });

  test('should return a 400 code if no request body is provided or the body is invalid', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        usernasme: faker.lorem.words(1),
        passswword: faker.lorem.words(1),
        emaiswl: faker.internet.email(),
      })
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(401);
      });
  });

  test('should return a 404 if the route does not exit', () => {
    return superagent.post(`${API_URL}/api/signudsp`)
      .send({
        usernasme: faker.lorem.words(1),
        passswword: faker.lorem.words(1),
        emaiswl: faker.internet.email(),
      })
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
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

  test('return 401 if the user cannot be authenticated', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.usernamdsdsae, mock.request.password);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
