from database.mongodb import db

students = []

# ---------- IS ----------
for i in range(1, 11):
    students.append({
        "usn": f"1BM23IS{str(i).zfill(3)}",
        "name": f"IS Student {i}",
        "department_code": "IS",
        "class_name": "3IS-A"
    })

for i in range(11, 21):
    students.append({
        "usn": f"1BM23IS{str(i).zfill(3)}",
        "name": f"IS Student {i}",
        "department_code": "IS",
        "class_name": "3IS-B"
    })

# ---------- CSE ----------
for i in range(1, 11):
    students.append({
        "usn": f"1BM23CS{str(i).zfill(3)}",
        "name": f"CSE Student {i}",
        "department_code": "CSE",
        "class_name": "3CS-A"
    })

for i in range(11, 21):
    students.append({
        "usn": f"1BM23CS{str(i).zfill(3)}",
        "name": f"CSE Student {i}",
        "department_code": "CSE",
        "class_name": "3CS-B"
    })

# ---------- AIML ----------
for i in range(1, 11):
    students.append({
        "usn": f"1BM23AI{str(i).zfill(3)}",
        "name": f"AIML Student {i}",
        "department_code": "AIML",
        "class_name": "3AI-A"
    })

for i in range(11, 21):
    students.append({
        "usn": f"1BM23AI{str(i).zfill(3)}",
        "name": f"AIML Student {i}",
        "department_code": "AIML",
        "class_name": "3AI-B"
    })

db.students.insert_many(students)

print(f"{len(students)} students inserted successfully")