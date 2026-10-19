import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://gagan080305_db_user:xX4miCBE7lDUpktS@attendance-cluster.jmp5og6.mongodb.net/?appName=attendance-cluster"
)

client = MongoClient(MONGO_URI)

db = client["attendance_system"]