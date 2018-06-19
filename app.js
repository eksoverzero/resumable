'use strict';

var express = require('express'),
    multipart = require('connect-multiparty')

var app = express();

app.use(multipart());
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   next();
})

app.get('/upload', function(req, res) {
  var filename = req.param('resumableFilename', ''),
      chunkSize = req.param('resumableChunkSize', 0),
      totalSize = req.param('resumableTotalSize', 0),
      identifier = req.param('resumableIdentifier', ''),
      chunkNumber = req.param('resumableChunkNumber', 0);
});
