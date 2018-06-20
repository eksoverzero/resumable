$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: '/upload',
    chunkSize: 128*1024,
    simultaneousUploads: 2,
    prioritizeFirstAndLastChunk: true
  });
});
