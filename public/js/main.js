$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'https://dodjy00g87.execute-api.eu-west-1.amazonaws.com/dev/resumable',
    chunkSize: 128*1024,
    simultaneousUploads: 2,
    prioritizeFirstAndLastChunk: true
  });
});
