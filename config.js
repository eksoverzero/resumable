'use strict';

var config = {
  s3: {
    bucket: 'resumeable-uploads'
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  port: process.env.PORT || 3000
};

module.exports = config;
