'use strict';

var AWS = require('aws-sdk'),
    config = require('../config');

var S3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

const getFile = require('./getFile');
const checkFile = require('./checkFile');
const listFiles = require('./listFiles');
const createFile = require('./createFile');

module.exports = function(filename, filetype, chunks) {
  const prefix = filename.replace(/\.[^/.]+$/, '');

  function completedFilename(filename) {
    return filename.replace('.chunks/', '')
                   .replace(/\.[^/.]+$/, '');
  }

  return new Promise(function(resolve, reject) {
    checkFile(completedFilename(filename))
    .then(function(file) {
      if(typeof(file)=='undefined') {
        listFiles(prefix)
        .then(function(files) {
          if(files.length == chunks) {
            console.log(`Received all chunks: ${completedFilename(filename)}`);

            return Promise.all(files.map(function(item) {
              return item.Key
            }).map(getFile)).then(function(files) {
              return Buffer.concat(files.map(function(item) {
                return item.Body
              }))
            }).then(function(buffer) {
              return createFile({name: completedFilename(filename), type: filetype, buffer: buffer}, 'public-read')
            }).then(function(file) {
              return resolve(completedFilename(filename));
            }).catch(function(error) {
              return resolve(filename);
            })
          } else {
            console.log(`Missing chunks: ${completedFilename(filename)}`);
            return resolve(filename);
          }
        }).catch(function(error) {
          return resolve(filename);
        })
      } else {
        return resolve(completedFilename(filename));
      }
    }).catch(function(error) {
      return resolve(filename);
    })
  })
};
