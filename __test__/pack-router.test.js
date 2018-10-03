'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');
const packMock = require('./lib/pack_mock');

const API_URL = `http://localhost:${process.env.PORT}/api/packs`;

describe('/api/packs', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(packMock.pCleanPackMocks);

  // =====================================================================================
  // POST TESTS
  // =====================================================================================
  test('should respond with 200 status code and a new json note', () => {
    const originalRequest = {
      name: faker.lorem.words(1),
      description: faker.lorem.words(12),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.description).toEqual(originalRequest.description);
        expect(response.body.name).toEqual(originalRequest.name);
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body._id.toString()).toBeTruthy();
      });
  });

  test('should respond with 400 status code', () => {
    const originalRequest = {
      description: faker.lorem.words(12),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // =====================================================================================
  // GET TESTS
  // =====================================================================================
  test('GET should respond with 200 status code and a json husky if there is a matching id', () => {
    let savedPackMock = null;
    return packMock.pCreatePackMock()
      .then((createdPackMock) => {
        savedPackMock = createdPackMock;
        return superagent.get(`${API_URL}/${createdPackMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedPackMock._id.toString());
        expect(getResponse.body.name).toEqual(savedPackMock.name);
      });
  });

  test('GET should respond with 404 for non-existent path', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskiesc`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});

// =====================================================================================
// PUT TESTS
// =====================================================================================
test('PUT should respond with a 404 when trying to update a non-existent husky', () => {
  return superagent.put(`${API_URL}/ewew`)
    .then(Promise.reject)
    .catch((response) => {
      expect(response.status).toEqual(404);
    });
});

test('PUT should respond with a 400 when body is not sent with request', () => {
  return packMock.pCreatePackMock()
    .then((createdPackMock) => {
      return superagent.put(`${API_URL}/${createdPackMock._id}`)
        .set('Content-type', 'application/json')
        .send({})
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
});

test('PUT should respond with an updated husky name', () => {
  let savedPackMock;
  return packMock.pCreatePackMock()
    .then((mock) => {
      savedPackMock = mock;
      const packPut = {
        name: faker.lorem.words(1),
        description: faker.lorem.words(12),
      };
      return superagent.put(`${API_URL}/${savedPackMock._id}`)
        .send(packPut)
        .then((response) => {
          expect(response.status).toEqual(200);
        });
    });
});
