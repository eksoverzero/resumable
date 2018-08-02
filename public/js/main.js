$(document).ready( function() {
  $('.dropzone').ṛesumable({
    query: { path: '10/1' },
    target: 'https://cloudburstuploads.herokuapp.com/resumable',
    fileType: ['gif', 'jpg', 'png', 'jpeg'],
    chunkSize: 128*1024,
    simultaneousUploads: 2,
    setChunkTypeFromFile: true,
    prioritizeFirstAndLastChunk: true
  });
});
