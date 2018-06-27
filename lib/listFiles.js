'use strict';

const Path = require('path'),
      AWS = require('aws-sdk'),
      S3 = new AWS.S3();

module.exports = function(prefix) {
  const bucket = process.env.BUCKET;

  return new Promise(function(resolve, reject) {
    S3.listObjects({
      Prefix: prefix,
      Bucket: bucket
    }, function(error, data) {
      if (error) {
        return reject(error.message);
      } else {
        return resolve(data.Contents);
      }
    })
  });
};
