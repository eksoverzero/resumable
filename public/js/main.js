$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'http://localhost:3000/upload',
    simultaneousUploads: 2,
    prioritizeFirstAndLastChunk: true
  });
});
