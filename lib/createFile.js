'use strict';

var AWS = require('aws-sdk'),
    config = require('../config');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

module.exports = function(file, acl='private') {
  return new Promise(function(resolve, reject) {
    S3.putObject({
      ACL: acl,
      Key: file.name,
      Body: file.buffer,
      Bucket: config.s3.bucket,
      ContentType: file.type
    }, function(error, data) {
      if (error) {
        console.log(error);
        return reject(error.message);
      } else {
        console.log(`File uploaded: ${file.name}`);
        return resolve(file.name);
      }
    })
  });
};
