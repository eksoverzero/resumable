'use strict';

var fs = require('fs'),
    express = require('express'),
    multipart = require('connect-multiparty');

var config = require('./config'),
    checkFile = require('./lib/checkFile'),
    createFile = require('./lib/createFile'),
    mergeFiles = require('./lib/mergeFiles'),
    getChunkFilename = require('./lib/getChunkFilename');

var app = express();

app.use(multipart());
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/resumable', function(req, res) {
  var params = req.query;

  var folder = params.path,
      filename = params.resumableFilename,
      filetype = params.resumableType,
      chunkSize = parseInt(params.resumableChunkSize),
      totalSize = parseInt(params.resumableTotalSize),
      chunkNumber = parseInt(params.resumableChunkNumber),
      numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  var chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  checkFile(chunkFilename)
  .then(function(filename) {
    return mergeFiles(filename, filetype, numberOfChunks);
  })
  .then(function(filename) {
    if(typeof(filename)!='undefined') {
      res.status(200).send(`https://s3.amazonaws.com/${config.s3.Bucket}/${filename}`);
    } else {
      res.status(204).send(error);
    }
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

app.post('/resumable', function(req, res) {
  var params = req.query;

  var folder = params.path,
      filename = params.resumableFilename,
      filetype = params.resumableType,
      chunkSize = parseInt(params.resumableChunkSize),
      totalSize = parseInt(params.resumableTotalSize),
      chunkNumber = parseInt(params.resumableChunkNumber),
      numberOfChunks = Math.max(Math.floor(totalSize/(chunkSize*1.0)), 1);

  var file = req.files.file;
  var chunkFilename = getChunkFilename(filename, folder, chunkNumber);

  createFile({name: chunkFilename, type: filetype, buffer: fs.readFileSync(file.path)})
  .then(function(filename) {
    return mergeFiles(filename, filetype, numberOfChunks);
  })
  .then(function(filename) {
    res.status(200).send(`https://s3.amazonaws.com/${config.s3.Bucket}/${filename}`);
  })
  .catch(function(error) {
    res.status(500).send(error);
  });
});

app.listen(config.port, function() {
  console.log(`Server listening on port ${config.port}`);
});
