const Path = require('path'),
      AWS = require('aws-sdk'),
      S3 = new AWS.S3();

const util = require('util')

const listFiles = require('./listFiles');
const getChunkFilename = require('./getChunkFilename');

module.exports = function(filename, chunks) {
  const bucket = process.env.BUCKET;
  const prefix = getChunkFilename(filename);

  return new Promise(function(resolve, reject) {
    listFiles(prefix)
    .then(function(files) {
      for(i=1;i<=chunks;i++) {
        const file = `${prefix}.${i}`;

        console.log(`mergeFiles: ${file}`)

        if(files.find(x => x.Key === file)) {
          count++
        }
      }

      console.log(count)

      if(chunks == count) {
        return resolve(files);
      } else {
        return reject(filename);
      }
    })
    .catch(function(error) {
      return reject(filename);
    });
  })
};
