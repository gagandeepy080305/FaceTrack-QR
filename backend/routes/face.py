from flask import Blueprint, request
from database.mongodb import db
from werkzeug.utils import secure_filename
from deepface import DeepFace
import os
import tempfile

face_bp = Blueprint("face", __name__)

UPLOAD_FOLDER = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "uploads", "faces")
)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@face_bp.route("/face/test")
def face_test():
    return {
        "message": "Face Route Working"
    }


@face_bp.route("/face/register", methods=["POST"])
def register_face():

    usn = request.form["usn"].strip().upper()

    student = db.students.find_one({
        "usn": usn
    })

    if not student:
        dept = "IS"
        for code in ["IS", "CS", "AI", "EC", "EE", "ME"]:
            if code in usn:
                dept = "CSE" if code == "CS" else ("AIML" if code == "AI" else code)
                break

        student = {
            "usn": usn,
            "name": f"Student {usn}",
            "department_code": dept,
            "class_name": f"3{dept}-A"
        }
        db.students.insert_one(student)

    if "image" not in request.files:
        return {
            "message": "No Image Uploaded"
        }, 400

    image = request.files["image"]

    filename = secure_filename(f"{usn}.jpg")

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    image.save(filepath)

    existing = db.student_faces.find_one({
        "usn": usn
    })

    if existing:

        db.student_faces.update_one(
            {"usn": usn},
            {
                "$set": {
                    "image_path": filepath
                }
            }
        )

        return {
            "message": "Face Updated Successfully"
        }

    db.student_faces.insert_one({
        "usn": usn,
        "image_path": filepath
    })

    return {
        "message": "Face Registered Successfully"
    }


@face_bp.route("/face/verify", methods=["POST"])
def verify_face():

    usn = request.form["usn"].strip().upper()

    student = db.students.find_one({
        "usn": usn
    })

    if not student:
        return {
            "message": "Invalid USN"
        }, 404

    if "image" not in request.files:
        return {
            "message": "No Image Uploaded"
        }, 400

    face_record = db.student_faces.find_one({
        "usn": usn
    })

    if not face_record:
        return {
            "message": "Face Not Registered"
        }, 404

    registered_image = face_record["image_path"]

    uploaded_image = request.files["image"]

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temp:
            temp_path = temp.name
            uploaded_image.save(temp_path)

        result = DeepFace.verify(
            img1_path=registered_image,
            img2_path=temp_path,
            enforce_detection=False
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

    print(result)

    return {
        "verified": result["verified"],
        "distance": float(
            result["distance"]
        )
    }


@face_bp.route(
    "/face/status/<usn>",
    methods=["GET"]
)
def face_status(usn):
    usn = usn.strip().upper()

    face = db.student_faces.find_one({
        "usn": usn
    })

    return {
        "registered": face is not None
    }


@face_bp.route(
    "/face/delete/<usn>",
    methods=["DELETE"]
)
def delete_face(usn):
    usn = usn.strip().upper()

    face = db.student_faces.find_one({
        "usn": usn
    })

    if not face:
        return {
            "message": "Face Not Found"
        }, 404

    db.student_faces.delete_one({
        "usn": usn
    })

    return {
        "message": "Face Deleted Successfully"
    }