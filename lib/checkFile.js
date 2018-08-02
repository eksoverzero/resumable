'use strict';

var AWS = require('aws-sdk'),
    config = require('../config');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

module.exports = function(filename) {
  return new Promise(function(resolve, reject) {
    S3.headObject({
      Key: filename,
      Bucket: config.s3.bucket
    }, function(error, data) {
      if(error) {
        if(error.code == 'NotFound') {
          console.log(`File not found: ${filename}`);
          return resolve();
        } else {
          return reject(error);
        }
      } else {
        console.log(`File exists: ${filename}`);
        return resolve(filename);
      }
    })
  });
}
