'use strict';

const fileExists = require('./lib/fileExists');
const validateRequest = require('./lib/validateRequest');

module.exports.get = (event, context, callback) => {
  return validateRequest(event)
         .then(function(message) {
           return fileExists(filename);
         })
         .then(function(message) {
           callback(null, {
             statusCode: 200,
             // headers: { 'Content-Type': 'application/json' },
             body: message,
           });
         })
         .catch(function(message) {
           callback(null, {
             statusCode: 404,
             // headers: { 'Content-Type': 'application/json' },
             body: message,
           });
         });
};
