from flask import Blueprint, request
from database.mongodb import db

subject_bp = Blueprint("subject", __name__)

@subject_bp.route("/subject/test")
def subject_test():
    return {
        "message": "Subject Route Working"
    }

@subject_bp.route("/subject/add", methods=["POST"])
def add_subject():

    data = request.json

    subject = {
        "subject_code": data["subject_code"],
        "subject_name": data["subject_name"]
    }

    db.subjects.insert_one(subject)

    return {
        "message": "Subject Added Successfully"
    }