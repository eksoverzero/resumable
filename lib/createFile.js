'use strict';

const AWS = require('aws-sdk'),
      S3 = new AWS.S3();

module.exports = function(filename, file) {
  const bucket = process.env.BUCKET;

  return new Promise(function(resolve, reject) {
    S3.putObject({
      Key: filename,
      Body: file.content,
      Bucket: bucket
    }, function(error, data) {
      if (error) {
        return reject(error.message);
      } else {
        console.log(`File uploaded: ${filename}`);
        return resolve(filename);
      }
    })
  });
};
