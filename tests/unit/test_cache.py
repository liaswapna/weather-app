import pytest
from datetime import timedelta, datetime
from unittest.mock import patch
from cache import CacheManager


class TestCacheSet:
    def test_set_stores_data_in_cache(self):
        # Arrange
        cache = CacheManager(timedelta(minutes=10))
        testData = {"city": "London", "temp": 15}

        # Act
        cache.set("london", testData)

        # Assert
        assert "london" in cache.cache
        assert cache.cache["london"][0] == testData

    def test_set_stores_timestamp_with_data(self):
        # Arrange
        cache = CacheManager(timedelta(minutes=10))
        testData = {"city": "London"}

        # Act
        cache.set("london", testData)

        # Assert
        data, timestamp = cache.cache["london"]
        assert isinstance(timestamp, datetime)


class TestCacheGet:
    def test_get_cache_hit_returns_data(self):
        # Arrange
        cache = CacheManager(timedelta(minutes=10))
        testData = {"city": "London"}
        cache.set("london", testData)

        # Act
        result = cache.get("london")

        # Assert
        assert result == testData

    def test_get_cache_miss_returns_none(self):
        # Arrange
        cache = CacheManager(timedelta(minutes=10))

        # Act
        result = cache.get("nonexistent")

        # Assert
        assert result is None

    def test_get_expired_cache_returns_none(self):
        # Arrange
        cache = CacheManager(timedelta(seconds=1))
        testData = {"city": "London"}
        cache.set("london", testData)

        # Mock datetime to simulate time passing
        oldTime = datetime.now() - timedelta(seconds=2)
        cache.cache["london"] = (testData, oldTime)

        # Act
        result = cache.get("london")

        # Assert
        assert result is None

    def test_get_expired_cache_removes_key(self):
        # Arrange
        cache = CacheManager(timedelta(seconds=1))
        testData = {"city": "London"}
        cache.set("london", testData)

        # Mock expired timestamp
        oldTime = datetime.now() - timedelta(seconds=2)
        cache.cache["london"] = (testData, oldTime)

        # Act
        cache.get("london")

        # Assert
        assert "london" not in cache.cache
