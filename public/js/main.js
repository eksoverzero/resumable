$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'http://localhost:3000/resumable',
    chunkSize: 128*1024,
    simultaneousUploads: 2,
    prioritizeFirstAndLastChunk: true
  });
});
