import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "..")))

from backend.app.shared.infrastructure.storage.s3_adapter import storage_client

def test_storage():
    print("Testing Storage Adapter...")
    data = b"Hello MinIO!"
    path = "test/hello.txt"
    
    try:
        print(f"Uploading to {path}...")
        url = storage_client.upload(data, path, "text/plain")
        print(f"Success! URL: {url}")
        
        print("Deleting...")
        storage_client.delete(path)
        print("Deleted.")
        
    except Exception as e:
        print(f"Error: {e}")
        print("Ensure Docker is running: `docker-compose up -d`")

if __name__ == "__main__":
    test_storage()
