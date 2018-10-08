'use strict';

const awsSDKMock = require('aws-sdk-mock');
const faker = require('faker');

process.env.PORT = 4000;
process.env.MONGODB_URI = 'mongodb://localhost/testdb';
process.env.SECRET = 'FrGH5GddfhaWEgjLirpPechf39Fv39aGRE9urnnae1BtWWer67FD4fdsgw';
process.emv.AWS_SECRET_ACCESS_KEY = 'SECRET';
process.emv.AWS_ACCESS_KEY_ID = 'SECRET ID';
process.emv.AWS_BUCKET = 'test-bucket';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('error', 'missing args in upload request'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('error', 'ACL should be "public-read"'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('error', 'wrong bucket'));
  }
  return callback(null, { Location: faker.internet.url() });
});
