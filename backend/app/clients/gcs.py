import json
from google.cloud import storage
from google.cloud.exceptions import NotFound

from app import config

_client = storage.Client(project=config.GCS_PROJECT_ID)
_bucket = _client.bucket(config.GCS_BUCKET_NAME)


class StorageError(Exception):
    """Raised when a GCS operation fails unexpectedly."""


class FileNotFoundInBucket(Exception):
    """Raised when a requested file does not exist in the bucket."""


def upload_json(filename: str, data: dict) -> str:
    try:
        blob = _bucket.blob(filename)
        blob.upload_from_string(json.dumps(data), content_type="application/json")
    except Exception as e:
        raise StorageError(f"failed to upload {filename}: {e}") from e
    return filename


def list_files() -> list[dict]:
    try:
        blobs = _bucket.list_blobs()
        return [
            {
                "name": blob.name,
                "size": blob.size,
                "created_at": blob.time_created.isoformat() if blob.time_created else None,
            }
            for blob in blobs
        ]
    except Exception as e:
        raise StorageError(f"failed to list files: {e}") from e


def read_json(filename: str) -> dict:
    blob = _bucket.blob(filename)
    try:
        content = blob.download_as_text()
    except NotFound:
        raise FileNotFoundInBucket(filename)
    except Exception as e:
        raise StorageError(f"failed to read {filename}: {e}") from e
    return json.loads(content)