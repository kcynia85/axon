from abc import ABC, abstractmethod
from typing import BinaryIO, Union

class StoragePort(ABC):
    @abstractmethod
    def upload(self, file: Union[bytes, BinaryIO], path: str, content_type: str = "application/octet-stream") -> str:
        """Uploads a file and returns its public URL/Path."""
        pass

    @abstractmethod
    def delete(self, path: str) -> bool:
        """Deletes a file."""
        pass

    @abstractmethod
    def get_url(self, path: str) -> str:
        """Generates a presigned or public URL."""
        pass
