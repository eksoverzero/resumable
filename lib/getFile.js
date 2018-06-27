'use strict';

const AWS = require('aws-sdk'),
      FS = require('fs'),
      S3 = new AWS.S3();

module.exports = function(filename) {
  const bucket = process.env.BUCKET;

  return new Promise(function(resolve, reject) {
    S3.getObject({
      Key: filename,
      Bucket: bucket
    }, function(error, data) {
      if (error) {
        return reject(error.message);
      } else {
        return resolve(data);
      }
    })
  });
};
