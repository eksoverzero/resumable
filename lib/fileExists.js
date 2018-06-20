'use strict';

const AWS = require('aws-sdk'),
      S3 = new AWS.S3();

const listFiles = require('./listFiles');

module.exports = function(filename) {
  const bucket = process.env.BUCKET;

  return new Promise(function(resolve, reject) {
    listFiles(filename)
    .then(function(files) {
      return files.find(file => file.Key === filename);
    })
    .then(function(file) {
      if (file) {
        console.log(`File exists: ${filename}`);
        return resolve(filename);
      } else {
        console.log(`File not found: ${filename}`);
        return reject();
      }
    })
    .catch(function(error) {
      return reject(error.message);
    });
  })
};
