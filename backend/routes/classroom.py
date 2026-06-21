from flask import Blueprint, request
from database.mongodb import db

classroom_bp = Blueprint("classroom", __name__)

@classroom_bp.route("/classroom/test")
def classroom_test():
    return {
        "message": "Classroom Route Working"
    }

@classroom_bp.route("/classroom/add", methods=["POST"])
def add_classroom():

    data = request.json

    classroom = {
        "department_code": data["department_code"],
        "year": data["year"],
        "section": data["section"],
        "class_name": data["class_name"]
    }

    db.classes.insert_one(classroom)

    return {
        "message": "Class Added Successfully"
    }