import logging
import os
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
LOG_LEVEL_STR = os.getenv("LOG_LEVEL", "INFO")


def configureLogging():
    """Configure logging based on environment"""
    log_level = getattr(logging, LOG_LEVEL_STR)

    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured for {ENVIRONMENT} environment")
