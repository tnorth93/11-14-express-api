'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');
const huskyMock = require('./lib/husky-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/huskies`;

describe('/api/huskies', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(huskyMock.pCleanHuskyMocks);

  test('POST should respond with 200 status code and a new json husky', () => {
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

  test('POST should respond with 400 status code if there is no body', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        description: 'is a good boy',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });


  test('GET should respond with 200 status code and a json husky if there is a matching id', () => {
    let savedHuskyMock = null;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        return superagent.get(`${API_URL}/${createdHuskyMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedHuskyMock._id.toString());
        expect(getResponse.body.name).toEqual(savedHuskyMock.name);
      });
  });

  test('GET should respond with 404 for non-existent path', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskiesc`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('GET should respond with 404 for non-existent husky', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskies/4545454545454`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('PUT should respond with a 404 when trying to update a non-existent husky', () => {
    return superagent.put(`http://localhost:${process.env.PORT}/api/huskies/2012913813`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('PUT should respond with a 400 when body is not sent with request', () => {
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        return superagent.put(`${API_URL}/${createdHuskyMock._id}`)
          .set('Content-type', 'application/json')
          .send({})
          .then(Promise.reject)
          .catch((response) => {
            expect(response.status).toEqual(undefined);
          });
      });
  });

  test('PUT should respond with an updated husky name', () => {
    let savedHuskyMock = null;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        return superagent.put(`${API_URL}/${createdHuskyMock._id}`)
          .send({
            name: 'Charles',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.name).toEqual('Charles');
        expect(putResponse.body.description).toEqual(savedHuskyMock.description);
      });
  });


  test('PUT should respond with an updated husky description', () => {
    let savedHuskyMock = null;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        return superagent.put(`${API_URL}/${createdHuskyMock._id}`)
          .send({
            description: 'is a real bad dog',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.name).toEqual(savedHuskyMock.name);
        expect(putResponse.body.description).toEqual('is a real bad dog');
      });
  });

  test(' DELETE should respond with a 404 if there is no husky to remove', () => {
    return superagent.delete(`${API_URL}/beeeeebooooooooop`)
      .then(Promise.reject)
      .catch((getResponse) => {
        expect(getResponse.status).toEqual(404);
      });
  });

  test('DELETE respond with a 204 and removes a husky', () => {
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        return superagent.delete(`${API_URL}/${createdHuskyMock._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(204);
      });
  });
});
