'use strict';

const superagent = require('superagent');
const server = require('../src/lib/server');
const huskyMock = require('./lib/husky-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/huskies`;

describe('/api/huskies', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(huskyMock.pCleanHuskyMocks);

  test('POST should respond with 200 status code and a new json husky', () => {
    let savedHuskyMock;
    let originalRequest;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        originalRequest = {
          name: 'Chuck',
          description: 'is a bad dog that tracks mud everywhere in the house',
          pack: savedHuskyMock._id,
        };
        return superagent.post(API_URL)
          .set('Content-Type', 'application/json')
          .send(originalRequest);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
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
    let savedHuskyMock;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        return superagent.get(`${API_URL}/${createdHuskyMock.husky._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body._id.toString()).toEqual(savedHuskyMock.husky._id.toString());
        expect(getResponse.body.name).toEqual(savedHuskyMock.husky.name);
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
            expect(response.status).toEqual(404);
          });
      });
  });

  test('PUT should respond with an updated husky name', () => {
    let savedHuskyMock;
    return huskyMock.pCreateHuskyMock()
      .then((mock) => {
        savedHuskyMock = mock;
        return superagent.put(`${API_URL}/${savedHuskyMock.husky._id}`)
          .send({
            name: 'Charles',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.name).toEqual('Charles');
      });
  });


  test('PUT should respond with an updated husky description', () => {
    let savedHuskyMock;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedHuskyMock = createdHuskyMock;
        return superagent.put(`${API_URL}/${savedHuskyMock.husky._id}`)
          .send({
            description: 'is a real bad dog',
          });
      })
      .then((putResponse) => {
        expect(putResponse.status).toEqual(200);
        expect(putResponse.body.name).toEqual(savedHuskyMock.husky.name);
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
    let savedMock;
    return huskyMock.pCreateHuskyMock()
      .then((createdHuskyMock) => {
        savedMock = createdHuskyMock;
        return superagent.delete(`${API_URL}/${savedMock.husky._id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(204);
      });
  });
});
