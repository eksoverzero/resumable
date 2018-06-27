$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
<<<<<<< HEAD:static/js/main.js
    target: '/upload',
    chunkSize: 1*1024*1024,
=======
    target: 'https://dodjy00g87.execute-api.eu-west-1.amazonaws.com/dev/resumable',
    chunkSize: 128*1024,
>>>>>>> nodejs:public/js/main.js
    simultaneousUploads: 2,
    prioritizeFirstAndLastChunk: true
  });
});
