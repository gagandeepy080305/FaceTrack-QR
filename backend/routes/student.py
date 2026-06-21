from flask import Blueprint, request
from database.mongodb import db

student_bp = Blueprint("student", __name__)


@student_bp.route("/student/test")
def student_test():
    return {
        "message": "Student Route Working"
    }


@student_bp.route("/student/add", methods=["POST"])
def add_student():

    data = request.json

    student = {
        "name": data["name"],
        "usn": data["usn"],
        "email": data["email"],
        "department_code": data["department_code"],
        "class_name": data["class_name"]
    }

    db.students.insert_one(student)

    return {
        "message": "Student Added Successfully"
    }