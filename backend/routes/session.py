from flask import Blueprint, request
from database.mongodb import db
import uuid
from datetime import datetime, timedelta

session_bp = Blueprint("session", __name__)


@session_bp.route("/session/test")
def session_test():
    return {
        "message": "Session Route Working"
    }


@session_bp.route("/session/create", methods=["POST"])
def create_session():

    data = request.json

    created_at = datetime.utcnow()
    expires_at = created_at + timedelta(minutes=2)

    session = {
        "session_id": str(uuid.uuid4()),
        "faculty_id": data["faculty_id"],
        "department_code": data["department_code"],
        "class_name": data["class_name"],
        "subject_code": data["subject_code"],
        "status": "active",
        "created_at": created_at,
        "expires_at": expires_at
    }

    db.attendance_sessions.insert_one(session)

    return {
        "message": "Session Created",
        "session_id": session["session_id"]
    }


@session_bp.route(
    "/session/history/<faculty_id>",
    methods=["GET"]
)
@session_bp.route(
    "/session/history/<faculty_id>",
    methods=["GET"]
)
def session_history(faculty_id):

    sessions = db.attendance_sessions.find({
        "faculty_id": faculty_id
    }).sort("created_at", -1)

    session_list = []

    for session in sessions:

        if datetime.utcnow() > session["expires_at"]:
            status = "Expired"
        else:
            status = "Active"

        session_list.append({
            "session_id": session["session_id"],
            "department_code": session["department_code"],
            "class_name": session["class_name"],
            "subject_code": session["subject_code"],
            "status": status,
            "created_at": str(session["created_at"])
        })

    return session_list

    session_list = []

    for session in sessions:
        session_list.append({
            "session_id": session["session_id"],
            "department_code": session["department_code"],
            "class_name": session["class_name"],
            "subject_code": session["subject_code"],
            "status": session["status"],
            "created_at": str(session["created_at"])
        })

    return session_list