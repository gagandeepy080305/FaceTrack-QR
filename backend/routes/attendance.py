from flask import Blueprint, request, Response
from database.mongodb import db
from datetime import datetime
import csv
import io

attendance_bp = Blueprint("attendance", __name__)


@attendance_bp.route("/attendance/test")
def attendance_test():
    return {
        "message": "Attendance Route Working"
    }


@attendance_bp.route("/attendance/mark", methods=["POST"])
def mark_attendance():

    data = request.json

    client_ip = request.remote_addr

    print("Client IP:", client_ip)

    # Allow only devices on College WiFi
    if not client_ip.startswith("192.168.29."):
        return {
            "message": "Not Connected To College WiFi"
        }, 400

    session_id = data["session_id"]
    usn = data["usn"]

    session = db.attendance_sessions.find_one({
        "session_id": session_id
    })

    if not session:
        return {
            "message": "Invalid Session"
        }, 400

    if datetime.utcnow() > session["expires_at"]:
        return {
            "message": "Session Expired"
        }, 400

    existing = db.attendance_records.find_one({
        "session_id": session_id,
        "usn": usn
    })

    if existing:
        return {
            "message": "Attendance Already Marked"
        }, 400

    attendance = {
        "session_id": session_id,
        "usn": usn,
        "subject_code": session["subject_code"],
        "department_code": session["department_code"],
        "class_name": session["class_name"],
        "status": "Present",
        "marked_at": datetime.utcnow()
    }

    db.attendance_records.insert_one(attendance)

    return {
        "message": "Attendance Marked Successfully"
    }


@attendance_bp.route(
    "/attendance/session/<session_id>",
    methods=["GET"]
)
def get_attendance_by_session(session_id):

    records = db.attendance_records.find({
        "session_id": session_id
    })

    attendance_list = []

    for record in records:
        attendance_list.append({
            "usn": record["usn"],
            "status": record["status"]
        })

    return attendance_list


@attendance_bp.route(
    "/attendance/export/<session_id>",
    methods=["GET"]
)
def export_attendance(session_id):

    records = db.attendance_records.find({
        "session_id": session_id
    })

    output = io.StringIO()

    writer = csv.writer(output)

    writer.writerow([
        "USN",
        "Status",
        "Marked At"
    ])

    for record in records:
        writer.writerow([
            record["usn"],
            record["status"],
            record.get("marked_at", "")
        ])

    output.seek(0)

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition":
            f"attachment; filename=attendance_{session_id}.csv"
        }
    )


@attendance_bp.route(
    "/attendance/final/<session_id>",
    methods=["GET"]
)
def final_attendance(session_id):

    session = db.attendance_sessions.find_one({
        "session_id": session_id
    })

    if not session:
        return {
            "message": "Session Not Found"
        }, 404

    department_code = session["department_code"]
    class_name = session["class_name"]

    students = list(
        db.students.find(
            {
                "department_code": department_code,
                "class_name": class_name
            },
            {
                "_id": 0,
                "usn": 1,
                "name": 1
            }
        )
    )

    attendance_records = list(
        db.attendance_records.find(
            {
                "session_id": session_id
            },
            {
                "_id": 0,
                "usn": 1
            }
        )
    )

    present_usns = {
        record["usn"]
        for record in attendance_records
    }

    final_list = []

    present_count = 0
    absent_count = 0

    for student in students:

        if student["usn"] in present_usns:
            status = "Present"
            present_count += 1
        else:
            status = "Absent"
            absent_count += 1

        final_list.append({
            "usn": student["usn"],
            "name": student["name"],
            "status": status
        })

    total_students = len(students)

    attendance_percentage = 0

    if total_students > 0:
        attendance_percentage = round(
            (present_count / total_students) * 100,
            2
        )

    return {
        "total_students": total_students,
        "present": present_count,
        "absent": absent_count,
        "attendance_percentage": attendance_percentage,
        "students": final_list
    }


@attendance_bp.route(
    "/attendance/percentage/<usn>/<subject_code>",
    methods=["GET"]
)
def attendance_percentage(usn, subject_code):

    total_classes = db.attendance_sessions.count_documents({
        "subject_code": subject_code
    })

    attended_classes = db.attendance_records.count_documents({
        "usn": usn,
        "subject_code": subject_code,
        "status": "Present"
    })

    percentage = 0

    if total_classes > 0:
        percentage = round(
            (attended_classes / total_classes) * 100,
            2
        )

    return {
        "usn": usn,
        "subject_code": subject_code,
        "attended": attended_classes,
        "total": total_classes,
        "percentage": percentage
    }


@attendance_bp.route(
    "/attendance/defaulters/<subject_code>/<class_name>",
    methods=["GET"]
)
def defaulters(subject_code, class_name):

    students = list(
        db.students.find(
            {
                "class_name": class_name
            },
            {
                "_id": 0,
                "usn": 1,
                "name": 1
            }
        )
    )

    total_classes = db.attendance_sessions.count_documents({
        "subject_code": subject_code,
        "class_name": class_name
    })

    defaulters_list = []

    for student in students:

        attended = db.attendance_records.count_documents({
            "usn": student["usn"],
            "subject_code": subject_code,
            "status": "Present"
        })

        percentage = 0

        if total_classes > 0:
            percentage = round(
                (attended / total_classes) * 100,
                2
            )

        if percentage < 85:

            defaulters_list.append({
                "usn": student["usn"],
                "name": student["name"],
                "percentage": percentage
            })

    return defaulters_list


@attendance_bp.route(
    "/attendance/student/<usn>",
    methods=["GET"]
)
def student_attendance(usn):

    student = db.students.find_one({
        "usn": usn
    })

    if not student:
        return {
            "message": "Student Not Found"
        }, 404

    subject_codes = db.attendance_records.distinct(
        "subject_code",
        {"usn": usn}
    )

    attendance_data = []

    for subject in subject_codes:

        total_classes = (
            db.attendance_sessions.count_documents({
                "subject_code": subject
            })
        )

        attended = (
            db.attendance_records.count_documents({
                "usn": usn,
                "subject_code": subject,
                "status": "Present"
            })
        )

        percentage = 0

        if total_classes > 0:
            percentage = round(
                (attended / total_classes) * 100,
                2
            )

        attendance_data.append({
            "subject_code": subject,
            "attended": attended,
            "total": total_classes,
            "percentage": percentage
        })

        

    return {
        "usn": usn,
        "name": student["name"],
        "attendance": attendance_data
    }

@attendance_bp.route(
    "/attendance/analytics/<subject_code>/<class_name>",
    methods=["GET"]
)
def attendance_analytics(subject_code, class_name):

    students = list(
        db.students.find(
            {"class_name": class_name},
            {
                "_id": 0,
                "usn": 1
            }
        )
    )

    total_classes = db.attendance_sessions.count_documents({
        "subject_code": subject_code,
        "class_name": class_name
    })

    total_students = len(students)

    if total_students == 0:
        return {
            "message": "No Students Found"
        }

    total_percentage = 0
    above_85 = 0
    below_85 = 0

    for student in students:

        attended = db.attendance_records.count_documents({
            "usn": student["usn"],
            "subject_code": subject_code,
            "status": "Present"
        })

        percentage = 0

        if total_classes > 0:
            percentage = round(
                (attended / total_classes) * 100,
                2
            )

        total_percentage += percentage

        if percentage >= 85:
            above_85 += 1
        else:
            below_85 += 1

    average_attendance = round(
        total_percentage / total_students,
        2
    )

    return {
        "subject_code": subject_code,
        "class_name": class_name,
        "total_students": total_students,
        "average_attendance": average_attendance,
        "above_85": above_85,
        "below_85": below_85
    }

@attendance_bp.route(
    "/attendance/trend/<subject_code>/<class_name>",
    methods=["GET"]
)
def attendance_trend(subject_code, class_name):

    sessions = list(
        db.attendance_sessions.find(
            {
                "subject_code": subject_code,
                "class_name": class_name
            }
        ).sort("created_at", 1)
    )

    students_count = db.students.count_documents({
        "class_name": class_name
    })

    trend = []

    for session in sessions:

        present_count = db.attendance_records.count_documents({
            "session_id": session["session_id"]
        })

        percentage = 0

        if students_count > 0:
            percentage = round(
                (present_count / students_count) * 100,
                2
            )

        trend.append({
            "session_id": session["session_id"],
            "date": str(session["created_at"]),
            "attendance_percentage": percentage
        })

    return trend
@attendance_bp.route(
    "/attendance/eligibility/<usn>/<subject_code>",
    methods=["GET"]
)
def attendance_eligibility(usn, subject_code):

    total_classes = db.attendance_sessions.count_documents({
        "subject_code": subject_code
    })

    attended = db.attendance_records.count_documents({
        "usn": usn,
        "subject_code": subject_code,
        "status": "Present"
    })

    percentage = 0

    if total_classes > 0:
        percentage = round(
            (attended / total_classes) * 100,
            2
        )

    eligible = percentage >= 85

    return {
        "usn": usn,
        "subject_code": subject_code,
        "attendance_percentage": percentage,
        "eligible": eligible
    }