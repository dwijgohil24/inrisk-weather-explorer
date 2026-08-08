from google.cloud import storage
from dotenv import load_dotenv
import os

load_dotenv()

bucket_name = os.getenv("GCS_BUCKET_NAME")
project_id = os.getenv("GCS_PROJECT_ID")

client = storage.Client(project=project_id)
bucket = client.bucket(bucket_name)

blob = bucket.blob("phase0-test.txt")
blob.upload_from_string("hello from phase 0")
print("Uploaded ok.")

print("Files in bucket:")
for b in bucket.list_blobs():
    print(" -", b.name)