'use strict';

process.env.PORT = 3000;

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');

//! Vinicio - setting up the testing port, by HAND
const API_URL = `http://localhost:${process.env.PORT}/api/huskies`;

describe('/api/huskies', () => {
  beforeAll(server.start);
  afterAll(server.stop);

  test('should respond with 200 status code and a new json husky', () => {
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send({
        name: 'Dubs',
        description: 'is a good boy',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.description).toEqual('is a good boy');
        expect(response.body.name).toEqual('Dubs');
        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.id).toBeTruthy();
      });
  });

  test('should respond with 400 status code if there is no name', () => {
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

  test('should respond with 404 for no id included in url', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskies/`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('should respond with 200 status code and a json husky if there is a matching id', () => {
    const originalRequest = {
      name: faker.lorem.words(3),
      description: faker.lorem.words(6),
    };
    return superagent.post(API_URL)
      .set('Content-Type', 'application/json')
      .send(originalRequest)
      .then((postResponse) => {
        originalRequest.id = postResponse.body.id;
        return superagent.get(`${API_URL}/${postResponse.body.id}`);
      })
      .then((getResponse) => {
        expect(getResponse.status).toEqual(200);
        expect(getResponse.body.timestamp).toBeTruthy();
        expect(getResponse.body.id).toEqual(originalRequest.id);
        expect(getResponse.body.name).toEqual(originalRequest.name);
      });
  });

  test('should respond with 404 for non-existent path', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskiesc`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('should respond with 404 for non-existent husky', () => {
    return superagent.get(`http://localhost:${process.env.PORT}/api/huskies/4545454545454`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
