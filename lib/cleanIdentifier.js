'use strict';

module.exports = function(identifier) {
  return identifier.replace(/^0-9A-Za-z_-/img, '');
}
