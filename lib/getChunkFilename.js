'use strict';

const path = require('path');
const cleanIdentifier = require('./cleanIdentifier')

module.exports = function(filename, folder, chunkNumber) {
  // Clean up the filename
  filename = cleanIdentifier(filename);

  if(typeof(chunkNumber)!='undefined') {
    filename = filename + '.' + chunkNumber
  }

  // What would the file name be?
  return path.join('.chunks', folder, filename);
}
