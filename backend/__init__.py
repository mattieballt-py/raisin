# backend/__init__.py

import os
from dotenv import load_dotenv

# Load environment variables from .env
# This allows any backend script to automatically have access
# to LIVEKIT_API_KEY, LIVEKIT_API_SECRET, etc.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, '..', '.env')

load_dotenv(dotenv_path=ENV_PATH)
