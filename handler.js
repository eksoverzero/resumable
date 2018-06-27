'use strict';

const middy = require('middy');
const multipart = require('aws-lambda-multipart-parser');
const { cors } = require('middy/middlewares');

const checkFile = require('./lib/checkFile');
const createFile = require('./lib/createFile');
const mergeFiles = require('./lib/mergeFiles');
const getChunkFilename = require('./lib/getChunkFilename');

const bucket = process.env.BUCKET;

const resumableGET = (event, context, callback) => {
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
               body: `https://s3.amazonaws.com/${bucket}/${filename}`,
               statusCode: 200
             });
           } else {
             callback(null, {
               body: error,
               statusCode: 204
             });
           }
         })
         .catch(function(error) {
           callback(null, {
             body: error,
             statusCode: 500
           });
         });
};

const resumablePOST = (event, context, callback) => {
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

  return createFile(chunkFilename, file.content)
         .then(function(filename) {
           return mergeFiles(filename, numberOfChunks);
         })
         .then(function(filename) {
           callback(null, {
             body: `https://s3.amazonaws.com/${bucket}/${filename}`,
             statusCode: 200
           });
         })
         .catch(function(error) {
           callback(null, {
             body: error,
             statusCode: 404
           });
         });
};

const resumableGEThandler = middy(resumableGET).use(cors());
const resumablePOSThandler = middy(resumablePOST).use(cors());

module.exports = { resumableGEThandler }
module.exports = { resumablePOSThandler }
