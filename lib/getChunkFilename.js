'use strict';

module.exports = function(chunkNumber, identifier) {
  // Clean up the identifier
  identifier = cleanIdentifier(identifier);
  // What would the file name be?
  return path.join($.temporaryFolder, './resumable-'+identifier+'.'+chunkNumber);
}
