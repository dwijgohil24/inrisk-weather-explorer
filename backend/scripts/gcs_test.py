from app.clients import gcs

gcs.upload_json("test-storage-client.json", {"hello": "world"})
print(gcs.list_files())
print(gcs.read_json("test-storage-client.json"))