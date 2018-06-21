'use strict';

const Path = require('path'),
      AWS = require('aws-sdk'),
      S3 = new AWS.S3();

const checkFile = require('./checkFile');
const listFiles = require('./listFiles');

module.exports = function(filename, chunks) {
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
            // AWS S3 Get file and merge

            return resolve(completedFilename(filename));
          } else {
            console.log(`Missing chunks: ${completedFilename(filename)}`);
            return resolve(filename);
          }
        }).catch(function(error) {
          return resolve(filename);
        })
      } else {
        return resolve(filename);
      }
    }).catch(function(error) {
      return resolve(filename);
    })
  })
};
