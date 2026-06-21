from flask import Blueprint, request
from database.mongodb import db

faculty_bp = Blueprint("faculty", __name__)


@faculty_bp.route("/faculty/test")
def faculty_test():
    return {
        "message": "Faculty Route Working"
    }


@faculty_bp.route("/faculty/add", methods=["POST"])
def add_faculty():

    data = request.json

    faculty = {
        "name": data["name"],
        "faculty_id": data["faculty_id"],
        "email": data["email"],
        "password": data["password"]
    }

    db.faculty.insert_one(faculty)

    return {
        "message": "Faculty Added Successfully"
    }


@faculty_bp.route("/faculty/login", methods=["POST"])
def faculty_login():

    data = request.json

    faculty_id = data["faculty_id"]
    password = data["password"]

    faculty = db.faculty.find_one({
        "faculty_id": faculty_id,
        "password": password
    })

    if not faculty:
        return {
            "message": "Invalid Faculty ID or Password"
        }, 401

    return {
        "message": "Login Successful",
        "faculty_id": faculty["faculty_id"],
        "name": faculty["name"]
    }