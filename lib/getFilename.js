'use strict';

const path = require('path');
const cleanIdentifier = require('./cleanIdentifier')

module.exports = function(filename, folder) {
  // Clean up the filename
  filename = cleanIdentifier(filename);
  // What would the file name be?
  return path.join(folder, filename);
}
