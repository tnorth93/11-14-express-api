'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../src/lib/server');
const accountMock = require('./lib/account-mock');
// const pictureMock = require('./lib/picture-mock.js');


const API_URL = `http://localhost:${process.env.PORT}/api/picture`;

describe('/api/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanAccountMocks);

  test('POST should respond with 200 and post a picture', () => {
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

  test('POST should respond with 400 if no token is provided', () => {
    return accountMock.pCreateMock()
      .then(() => {
        return superagent.post(API_URL)
          .send({
            title: faker.lorem.words(2),
            url: faker.internet.url(),
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('POST should respond with 400 if body is incorrect ', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            titlrreree: faker.lorem.words(2),
            urdl: faker.internet.url(),
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  // test('GET should respond with 200 and a picture', () => {
  //   let savedPicMock = null;
  //   return pictureMock.pCreatePictureMock()
  //     .then((mock) => {
  //       savedPicMock = mock;
  //       return superagent.get(`${API_URL}/${savedPicMock.account.account._id}`)
  //         .set('Authorization', `Bearer ${savedPicMock.account.token}`)
  //         return response.json(savedPicMock.account.url);
  //     })
  //     .then((response) => {
  //       expect(response.status).toEqual(200);
  //     });
  // });

  test('GET should respond with 404 if id could not be found', () => {
    let savedPicMock = null;
    return accountMock.pCreateMock()
      .then((mock) => {
        savedPicMock = mock;
        return superagent.get(`${API_URL}/${savedPicMock._id}`)
          .set('Authorization', `Bearer ${mock.token}`);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });

  test('GET should respond with 400 if no token provided', () => {
    let savedPicMock = null;
    return accountMock.pCreateMock()
      .then((mock) => {
        savedPicMock = mock;
        return superagent.get(`${API_URL}/${savedPicMock._id}`);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
