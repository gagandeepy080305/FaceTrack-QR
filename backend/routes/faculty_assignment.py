from flask import Blueprint, request
from database.mongodb import db

assignment_bp = Blueprint("assignment", __name__)

# Test Route
@assignment_bp.route("/assignment/test")
def assignment_test():
    return {
        "message": "Assignment Route Working"
    }


# Add Faculty Assignment
@assignment_bp.route("/assignment/add", methods=["POST"])
def add_assignment():

    data = request.json

    assignment = {
        "faculty_id": data["faculty_id"],
        "department_code": data["department_code"],
        "class_name": data["class_name"],
        "subject_code": data["subject_code"]
    }

    db.faculty_assignments.insert_one(assignment)

    return {
        "message": "Assignment Added Successfully"
    }


# Get Assignments for a Faculty
@assignment_bp.route("/assignment/faculty/<faculty_id>")
def get_faculty_assignments(faculty_id):

    assignments = list(
        db.faculty_assignments.find(
            {"faculty_id": faculty_id},
            {"_id": 0}
        )
    )

    return assignments