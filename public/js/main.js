$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'http://localhost:3000/upload',
    chunkSize: 2*1024*1024,
    simultaneousUploads: 4,
    prioritizeFirstAndLastChunk: true
  });
});
