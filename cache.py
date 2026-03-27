from datetime import datetime, timedelta
from typing import Any, Optional


class CacheManager:
    """Manages caching of API responses to improve performance and reduce API calls"""

    def __init__(self, cacheDuration: timedelta):
        """
        Initialize the cache manager

        Args:
            cacheDuration: How long to keep cached data before it expires
        """
        self.cache: dict = {}  # Stores: {key: (data, timestamp)}
        self.cacheDuration = cacheDuration

    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve cached data if it exists and hasn't expired

        Args:
            key: The cache key (e.g., city name)

        Returns:
            Cached data if valid, None if expired or not found
        """
        if key not in self.cache:
            return None

        data, cachedTime = self.cache[key]

        # Check if cache has expired
        if datetime.now() - cachedTime > self.cacheDuration:
            del self.cache[key]  # Remove expired data
            return None

        return data

    def set(self, key: str, data: any) -> None:
        """
        Store data in cache with current timestamp

        Args:
            key: The cache key (e.g., city name)
            data: The data to cache
        """
        self.cache[key] = (data, datetime.now())
