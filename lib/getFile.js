'use strict';

var AWS = require('aws-sdk'),
    config = require('../config');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

module.exports = function(filename) {
  return new Promise(function(resolve, reject) {
    S3.getObject({
      Key: filename,
      Bucket: config.s3.bucket
    }, function(error, data) {
      if (error) {
        return reject(error.message);
      } else {
        return resolve(data);
      }
    })
  });
};
