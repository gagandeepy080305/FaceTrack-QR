from database.mongodb import db
from datetime import datetime, timedelta
import random
import uuid

SUBJECTS = [
    ("IS", "3IS-A", "DBMS"),
    ("IS", "3IS-B", "ML"),
    ("CSE", "3CS-A", "AI"),
    ("CSE", "3CS-B", "CN"),
    ("AIML", "3AI-A", "DL"),
    ("AIML", "3AI-B", "NLP")
]

for dept, class_name, subject in SUBJECTS:

    students = list(
        db.students.find({
            "class_name": class_name
        })
    )

    for day in range(15):

        session_id = str(uuid.uuid4())

        session_date = (
            datetime.utcnow()
            - timedelta(days=15-day)
        )

        db.attendance_sessions.insert_one({
            "session_id": session_id,
            "department_code": dept,
            "class_name": class_name,
            "subject_code": subject,
            "faculty_id": "FAC001",
            "status": "Expired",
            "created_at": session_date,
            "expires_at": session_date
        })

        for student in students:

            # 70% chance present
            if random.random() < 0.7:

                db.attendance_records.insert_one({
                    "session_id": session_id,
                    "usn": student["usn"],
                    "subject_code": subject,
                    "department_code": dept,
                    "class_name": class_name,
                    "status": "Present",
                    "marked_at": session_date
                })

print("Attendance history generated successfully")