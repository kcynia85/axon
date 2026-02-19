import boto3
from botocore.exceptions import ClientError
from typing import Union, BinaryIO
from app.config import settings
from app.shared.domain.ports.storage import StoragePort

class S3StorageAdapter(StoragePort):
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.STORAGE_ENDPOINT,
            aws_access_key_id=settings.STORAGE_ACCESS_KEY,
            aws_secret_access_key=settings.STORAGE_SECRET_KEY,
            region_name=settings.STORAGE_REGION
        )
        self.bucket = settings.STORAGE_BUCKET_NAME

    def upload(self, file: Union[bytes, BinaryIO], path: str, content_type: str = "application/octet-stream") -> str:
        try:
            self.client.put_object(
                Bucket=self.bucket,
                Key=path,
                Body=file,
                ContentType=content_type,
                ACL="public-read" # Assuming public bucket policy for MVP
            )
            return self.get_url(path)
        except ClientError as e:
            print(f"S3 Upload Error: {e}")
            raise e

    def delete(self, path: str) -> bool:
        try:
            self.client.delete_object(Bucket=self.bucket, Key=path)
            return True
        except ClientError as e:
            print(f"S3 Delete Error: {e}")
            return False

    def get_url(self, path: str) -> str:
        # Construct public URL for MinIO/S3
        # For MinIO local: http://localhost:9000/bucket/path
        return f"{settings.STORAGE_ENDPOINT}/{self.bucket}/{path}"

storage_client = S3StorageAdapter()
