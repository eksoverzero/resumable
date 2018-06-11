$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'https://cloudburst-functions.herokuapp.com//upload',
    chunkSize: 2*1024*1024,
    simultaneousUploads: 4,
    prioritizeFirstAndLastChunk: true
  });
});
