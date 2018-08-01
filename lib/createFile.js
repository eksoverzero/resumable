'use strict';

const AWS = require('aws-sdk'),
      FS = require('fs'),
      S3 = new AWS.S3();

module.exports = function(filename, file, acl='private') {
  const bucket = process.env.BUCKET;

  return new Promise(function(resolve, reject) {
    S3.putObject({
      ACL: acl,
      Key: filename,
      Body: file.content,
      Bucket: bucket,
      ContentType: file.contentType
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
