import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is not set. Add it to backend/.env (local) or to the "
        "hosting provider's environment variables."
    )

client = MongoClient(MONGO_URI)

db = client["attendance_system"]
