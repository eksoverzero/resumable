'use strict';

const AWS = require('aws-sdk');

const s3 = new AWS.S3();

module.exports = function(file) {
  return new Promise(function(resolve, reject) {
    s3.headObject({
      Key: file,
      Bucket: process.env.BUCKET
    }).on('success', function(response) {
        file = response.request.params.Key
        console.log(`File exists: ${file}`);

        return resolve(file);
    }).on('error',function(error) {
        console.log(`File not found: ${file}`);

        return reject(error);
    }).send();
  });
}
