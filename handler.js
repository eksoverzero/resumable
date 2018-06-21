'use strict';

const multipart = require('aws-lambda-multipart-parser');
const checkFile = require('./lib/checkFile');
const createFile = require('./lib/createFile');
const mergeFiles = require('./lib/mergeFiles');
const getChunkFilename = require('./lib/getChunkFilename');

module.exports.resumableGET = (event, context, callback) => {
  const params = event.queryStringParameters;

  const folder = params.path,
        filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  const chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  return checkFile(chunkFilename)
         .then(function(filename) {
           return mergeFiles(filename, numberOfChunks);
         })
         .then(function(filename) {
           if(typeof(filename)!='undefined') {
             callback(null, {
               statusCode: 200,
               headers: { 'Content-Type': 'application/json' },
               body: filename
             });
           } else {
             callback(null, {
               statusCode: 204,
               headers: { 'Content-Type': 'application/json' },
               body: error
             });
           }
         })
         .catch(function(error) {
           callback(null, {
             statusCode: 500,
             headers: { 'Content-Type': 'application/json' },
             body: error
           });
         });
};

module.exports.resumablePOST = (event, context, callback) => {
  const params = multipart.parse(event, false);

  const file = params.file,
        folder = params.path,
        filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  const chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  return createFile(chunkFilename, file)
         .then(function(filename) {
           callback(null, {
             statusCode: 200,
             headers: { 'Content-Type': 'application/json' },
             body: filename
           });
         })
         .catch(function(error) {
           callback(null, {
             statusCode: 404,
             headers: { 'Content-Type': 'application/json' },
             body: error
           });
         });
};
