import os
from database.mongodb import db
from datetime import datetime, timedelta
import random
import uuid

def seed():
    print("Seeding initial data into MongoDB...")

    # 1. Faculty
    if db.faculty.count_documents({}) == 0:
        db.faculty.insert_one({
            "name": "Prof. Gagandeep",
            "faculty_id": "FAC001",
            "email": "faculty@college.edu",
            "password": "password123"
        })
        print("Inserted faculty FAC001 (password: password123)")

    # 2. Departments
    if db.departments.count_documents({}) == 0:
        db.departments.insert_many([
            {"department_code": "IS", "department_name": "Information Science"},
            {"department_code": "CSE", "department_name": "Computer Science & Engineering"},
            {"department_code": "AIML", "department_name": "Artificial Intelligence & Machine Learning"}
        ])
        print("Inserted departments")

    # 3. Classrooms
    if db.classes.count_documents({}) == 0:
        db.classes.insert_many([
            {"department_code": "IS", "year": "3", "section": "A", "class_name": "3IS-A"},
            {"department_code": "IS", "year": "3", "section": "B", "class_name": "3IS-B"},
            {"department_code": "CSE", "year": "3", "section": "A", "class_name": "3CS-A"},
            {"department_code": "CSE", "year": "3", "section": "B", "class_name": "3CS-B"},
            {"department_code": "AIML", "year": "3", "section": "A", "class_name": "3AI-A"},
            {"department_code": "AIML", "year": "3", "section": "B", "class_name": "3AI-B"}
        ])
        print("Inserted classrooms")

    # 4. Subjects
    if db.subjects.count_documents({}) == 0:
        db.subjects.insert_many([
            {"subject_code": "DBMS", "subject_name": "Database Management Systems"},
            {"subject_code": "ML", "subject_name": "Machine Learning"},
            {"subject_code": "AI", "subject_name": "Artificial Intelligence"},
            {"subject_code": "CN", "subject_name": "Computer Networks"},
            {"subject_code": "DL", "subject_name": "Deep Learning"},
            {"subject_code": "NLP", "subject_name": "Natural Language Processing"}
        ])
        print("Inserted subjects")

    # 5. Faculty Assignments
    if db.faculty_assignments.count_documents({}) == 0:
        db.faculty_assignments.insert_many([
            {"faculty_id": "FAC001", "department_code": "IS", "class_name": "3IS-A", "subject_code": "DBMS"},
            {"faculty_id": "FAC001", "department_code": "IS", "class_name": "3IS-B", "subject_code": "ML"},
            {"faculty_id": "FAC001", "department_code": "CSE", "class_name": "3CS-A", "subject_code": "AI"},
            {"faculty_id": "FAC001", "department_code": "CSE", "class_name": "3CS-B", "subject_code": "CN"},
            {"faculty_id": "FAC001", "department_code": "AIML", "class_name": "3AI-A", "subject_code": "DL"},
            {"faculty_id": "FAC001", "department_code": "AIML", "class_name": "3AI-B", "subject_code": "NLP"}
        ])
        print("Inserted faculty assignments")

    # 6. Students
    if db.students.count_documents({}) == 0:
        students = []
        for i in range(1, 11):
            students.append({"usn": f"1BM23IS{str(i).zfill(3)}", "name": f"IS Student {i}", "department_code": "IS", "class_name": "3IS-A"})
        for i in range(11, 21):
            students.append({"usn": f"1BM23IS{str(i).zfill(3)}", "name": f"IS Student {i}", "department_code": "IS", "class_name": "3IS-B"})
        for i in range(1, 11):
            students.append({"usn": f"1BM23CS{str(i).zfill(3)}", "name": f"CSE Student {i}", "department_code": "CSE", "class_name": "3CS-A"})
        for i in range(11, 21):
            students.append({"usn": f"1BM23CS{str(i).zfill(3)}", "name": f"CSE Student {i}", "department_code": "CSE", "class_name": "3CS-B"})
        for i in range(1, 11):
            students.append({"usn": f"1BM23AI{str(i).zfill(3)}", "name": f"AIML Student {i}", "department_code": "AIML", "class_name": "3AI-A"})
        for i in range(11, 21):
            students.append({"usn": f"1BM23AI{str(i).zfill(3)}", "name": f"AIML Student {i}", "department_code": "AIML", "class_name": "3AI-B"})
        db.students.insert_many(students)
        print(f"Inserted {len(students)} students")

    # 7. Attendance History
    if db.attendance_sessions.count_documents({}) == 0:
        SUBJECTS = [
            ("IS", "3IS-A", "DBMS"),
            ("IS", "3IS-B", "ML"),
            ("CSE", "3CS-A", "AI"),
            ("CSE", "3CS-B", "CN"),
            ("AIML", "3AI-A", "DL"),
            ("AIML", "3AI-B", "NLP")
        ]
        for dept, class_name, subject in SUBJECTS:
            class_students = list(db.students.find({"class_name": class_name}))
            for day in range(10):
                session_id = str(uuid.uuid4())
                session_date = datetime.utcnow() - timedelta(days=10-day)
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
                for student in class_students:
                    if random.random() < 0.75:
                        db.attendance_records.insert_one({
                            "session_id": session_id,
                            "usn": student["usn"],
                            "subject_code": subject,
                            "department_code": dept,
                            "class_name": class_name,
                            "status": "Present",
                            "marked_at": session_date
                        })
        print("Generated attendance history")

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed()
