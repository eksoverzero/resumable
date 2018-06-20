'use strict';

var cleanIdentifier = require("./cleanIdentifier");

module.exports = function(chunkNumber, chunkSize, totalSize, identifier, filename, fileSize) {
  return new Promise(function(resolve, reject) {
    // Clean up the identifier
    identifier = cleanIdentifier(identifier);

    // Check if the request is sane
    if (chunkNumber==0 || chunkSize==0 || totalSize==0 || identifier.length==0 || filename.length==0) {
      return reject('non_resumable_request');
    }

    if (chunkNumber>numberOfChunks) {
      return reject('invalid_resumable_request1');
    }

    // Is the file too big?
    // if($.maxFileSize && totalSize>$.maxFileSize) {
    //   return 'invalid_resumable_request2';
    // }

    if(typeof(fileSize)!='undefined') {
      if(chunkNumber<numberOfChunks && fileSize!=chunkSize) {
        // The chunk in the POST request isn't the correct size
        return reject('invalid_resumable_request3');
      }
      if(numberOfChunks>1 && chunkNumber==numberOfChunks && fileSize!=((totalSize%chunkSize)+chunkSize)) {
        // The chunks in the POST is the last one, and the file is not the correct size
        return reject('invalid_resumable_request4');
      }
      if(numberOfChunks==1 && fileSize!=totalSize) {
        // The file is only a single chunk, and the data size does not fit
        return reject('invalid_resumable_request5');
      }
    }

    return resolve('valid');
  });
}
