from flask import Flask, abort, jsonify, request, render_template
from flask_cors import CORS
from helpers import *

import os, shutil

# creates a Flask application, named app
app = Flask(__name__)

CORS(app)

app.config.from_object("config")

temp_base = os.path.expanduser("./tmp/")

# a route where we will display a welcome message via an HTML template
@app.route("/")
def hello():
  return render_template('index.html')

# resumable.js uses a GET request to check if it uploaded the file already.
# NOTE: your validation here needs to match whatever you do in the POST (otherwise it will NEVER find the files)
@app.route("/upload", methods=['GET'])
def resumable():
  resumablePath = request.args.get('path', type=str)
  resumableIdentfier = request.args.get('resumableIdentifier', type=str)
  resumableFilename = request.args.get('resumableFilename', type=str)
  resumableChunkNumber = request.args.get('resumableChunkNumber', type=int)

  if not resumableIdentfier or not resumableFilename or not resumableChunkNumber:
    # Parameters are missing or invalid
    abort(500, 'Parameter error')

  # chunk folder path based on the parameters
  temp_dir = os.path.join(temp_base, resumablePath, resumableIdentfier)

  # chunk path based on the parameters
  chunk_file = os.path.join(temp_dir, get_chunk_name(resumableFilename, resumableChunkNumber))
  app.logger.debug('Getting chunk: %s', chunk_file)

  if os.path.isfile(chunk_file):
    # Let resumable.js know this chunk already exists
    return 'OK', 200
  else:
    # Let resumable.js know this chunk does not exists and needs to be uploaded
    abort(404, 'Not found')


# if it didn't already upload, resumable.js sends the file here
@app.route("/upload", methods=['POST'])
def resumable_post():
  resumablePath = request.args.get('path', type=str)
  resumableType = request.form.get('resumableType', default='error', type=str)
  resumableFilename = request.form.get('resumableFilename', default='error', type=str)
  resumableIdentfier = request.form.get('resumableIdentifier', default='error', type=str)
  resumableTotalChunks = request.form.get('resumableTotalChunks', type=int)
  resumableChunkNumber = request.form.get('resumableChunkNumber', default=1, type=int)

  print(request.args)

  # get the chunk data
  chunk_data = request.files['file']

  # make our temp directory
  temp_dir = os.path.join(temp_base, resumablePath, resumableIdentfier)
  if not os.path.isdir(temp_dir):
    os.makedirs(temp_dir + '/.chunks')

  # save the chunk data
  chunk_name = get_chunk_name(resumableFilename, resumableChunkNumber)
  chunk_file = os.path.join(temp_dir, chunk_name)
  chunk_data.save(chunk_file)
  app.logger.debug('Saved chunk: %s', chunk_file)

  # check if the upload is complete
  chunk_paths = [os.path.join(temp_dir, get_chunk_name(resumableFilename, x)) for x in range(1, resumableTotalChunks+1)]
  upload_complete = all([os.path.exists(p) for p in chunk_paths])

  # combine all the chunks to create the final file
  if upload_complete:
    target_file_name = os.path.join(temp_dir, resumableFilename)
    with open(target_file_name, "ab") as target_file:
      for p in chunk_paths:
        stored_chunk_file_name = p
        stored_chunk_file = open(stored_chunk_file_name, 'rb')
        target_file.write(stored_chunk_file.read())
        stored_chunk_file.close()
        os.unlink(stored_chunk_file_name)
      target_file.close()

      if os.path.exists(temp_dir + '/.chunks'):
        os.rmdir(temp_dir + '/.chunks')
      app.logger.debug('File saved to: %s', target_file_name)

      s3_upload = upload_file_to_s3(target_file_name, resumableFilename, app.config["S3_BUCKET"])

      if s3_upload:
        app.logger.debug('File uploaded to: %s', s3_upload)

        shutil.rmtree(os.path.dirname(target_file_name))
        app.logger.debug('File removed: %s', target_file_name)

        return s3_upload, 200
  else:
    return 'OK', 200


def get_chunk_name(uploaded_filename, chunk_number):
  return uploaded_filename + "_part_%03d" % chunk_number

# run the application
if __name__ == "__main__":
  app.run(
    host='0.0.0.0',
    port=int(os.environ.get("PORT", 5000)),
    debug=str(os.environ.get("DEBUG", False))
  )
