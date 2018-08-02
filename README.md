# Resumable

Upload files to AWS S3 using [Resumable.js](http://www.resumablejs.com/).

The ResumableJS library splits large files into chunks. Each chunk is uploaded to the server and when all chunks have been received, they are merged back together into one.

The chunk size, number of chunks uploaded at once and more are configurable using the jQuery plugin (a bridge to the original JavaScript library). The jQuery plugin also provides a drag and drop interface and tracks the upload progress.

### Requirements

 - NodeJS > 6.10

**Chunks are NOT deleted from the bucket...**

Use [lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) to delete chunks after a certain amount of time

### Development

Install development dependencies...

```
npm install
```

Run server...

```
npm app.js
```

... and test uploads using the `pubic/index.html` file
