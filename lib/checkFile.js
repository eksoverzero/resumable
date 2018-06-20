'use strict';

const AWS = require('aws-sdk'),
      S3 = new AWS.S3();

module.exports = function(filename) {
  return new Promise(function(resolve, reject) {
    S3.headObject({
      Key: filename,
      Bucket: process.env.BUCKET
    }).on('success', function(response) {
        filename = response.request.params.Key
        console.log(`File exists: ${filename}`);

        return resolve(filename);
    }).on('error',function(error) {
        console.log(`File not found: ${filename}`);

        return reject(error);
    }).send();
  });
}
