'use strict';

const AWS = require('aws-sdk'),
      S3 = new AWS.S3();

module.exports = function(filename) {
  return new Promise(function(resolve, reject) {
    S3.headObject({
      Key: filename,
      Bucket: process.env.BUCKET
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
