'use strict';

const multipart = require('aws-lambda-multipart-parser');
const fileExists = require('./lib/fileExists');
const validateRequest = require('./lib/validateRequest');

module.exports.get = (event, context, callback) => {
  const params = event.queryStringParameters;
  const filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  return validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename)
         .then(function(message) {
           return fileExists(filename);
         })
         .then(function(filename) {
           callback(null, {
             statusCode: 200,
             // headers: { 'Content-Type': 'application/json' },
             body: filename,
           });
         })
         .catch(function(error) {
           callback(null, {
             statusCode: 404,
             // headers: { 'Content-Type': 'application/json' },
             body: error,
           });
         });
};

module.exports.post = (event, context, callback) => {
  const params = multipart.parse(event, false)
  const file = params.file,
        filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);
  // return validateRequest(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize)

  callback(null, {
    statusCode: 404,
     // headers: { 'Content-Type': 'application/json' },
    body: file,
  });
};
