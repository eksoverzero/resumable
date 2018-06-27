# Resumable

Upload files to AWS S3 using [Resumable.js](http://www.resumablejs.com/) and AWS Lambda.


Requires:
 - NodeJS > 6.10
 - [Serverless](https://serverless.com/)

**Chunks are NOT deleted from the bucket...**

Use [lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) to delete chunks after a certain amount of time

### Deployment

```
serverless deploy
```

### Development

Run Serverless offline...

```
serverless offline start
```

... and test uploads using the `pubic/index.html` file
