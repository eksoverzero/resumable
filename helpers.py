from config import S3_KEY, S3_SECRET, S3_BUCKET

import os, boto3, botocore, hashlib

s3 = boto3.client(
  "s3",
  aws_access_key_id=S3_KEY,
  aws_secret_access_key=S3_SECRET
)

def upload_file_to_s3(filepath, filename, bucket_name, acl="public-read"):
  file = open(os.path.join(filepath, filename), 'rb')
  upload_path = filepath.replace('./uploads/', '')

  try:
    s3.put_object(
      ACL=acl,
      Key=upload_path + '/' + filename,
      Body=file,
      Bucket=S3_BUCKET
    )
  except Exception as e:
    # This is a catch all exception, edit this part to fit your needs.
    print("S3 ERROR: ", e)
    return false

  return "{}{}".format('https://s3.amazonaws.com/' + S3_BUCKET + '/' + upload_path + '/' , filename)
