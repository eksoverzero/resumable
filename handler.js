'use strict';

const multipart = require('aws-lambda-multipart-parser');
const checkFile = require('./lib/checkFile');
const createFile = require('./lib/createFile');
const mergeFiles = require('./lib/mergeFiles');
const getFilename = require('./lib/getFilename');
const validateRequest = require('./lib/validateRequest');
const getChunkFilename = require('./lib/getChunkFilename');

module.exports.get = (event, context, callback) => {
  const params = event.queryStringParameters;

  const folder = params.path,
        filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  const Filename = getFilename(filename, folder);
  const chunkFilename = getChunkFilename(Filename, chunkNumber);

  return checkFile(chunkFilename)
         .then(mergeFiles(Filename, numberOfChunks))
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

module.exports.post = (event, context, callback) => {
  const params = multipart.parse(event, false);

  const file = params.file,
        folder = params.path,
        filename = params.resumableFilename,
        chunkSize = parseInt(params.resumableChunkSize),
        totalSize = parseInt(params.resumableTotalSize),
        identifier = params.resumableIdentifier,
        chunkNumber = parseInt(params.resumableChunkNumber),
        numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  const Filename = getFilename(filename, folder);
  const chunkFilename = getChunkFilename(Filename, chunkNumber);

  return createFile(chunkFilename, file)
         .then(function(filename) {
           return mergeFiles(filename, numberOfChunks);
         })
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
