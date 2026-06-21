from flask import Blueprint, request
from database.mongodb import db

department_bp = Blueprint("department", __name__)

@department_bp.route("/department/test")
def department_test():
    return {
        "message": "Department Route Working"
    }

@department_bp.route("/department/add", methods=["POST"])
def add_department():

    data = request.json

    department = {
        "department_code": data["department_code"],
        "department_name": data["department_name"]
    }

    db.departments.insert_one(department)

    return {
        "message": "Department Added Successfully"
    }