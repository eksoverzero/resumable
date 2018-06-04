import os

PORT = 5000
DEBUG = True
SECRET_KEY = os.urandom(32)

S3_KEY = os.environ.get("S3_ACCESS_KEY")
S3_BUCKET = os.environ.get("S3_BUCKET_NAME")
S3_SECRET = os.environ.get("S3_SECRET_ACCESS_KEY")
S3_LOCATION = 'http://{}.s3.amazonaws.com/'.format(S3_BUCKET)
