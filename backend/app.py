from flask import Flask
from flask_cors import CORS

from routes.student import student_bp
from routes.faculty import faculty_bp
from routes.department import department_bp
from routes.classroom import classroom_bp
from routes.subject import subject_bp
from routes.faculty_assignment import assignment_bp
from routes.session import session_bp
from routes.attendance import attendance_bp
from routes.face import face_bp

app = Flask(__name__)

CORS(app)

# Register Blueprints
app.register_blueprint(student_bp)
app.register_blueprint(faculty_bp)
app.register_blueprint(department_bp)
app.register_blueprint(classroom_bp)
app.register_blueprint(subject_bp)
app.register_blueprint(assignment_bp)
app.register_blueprint(session_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(face_bp)


@app.route("/")
def home():
    return {
        "message": "Backend Working"
    }


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)