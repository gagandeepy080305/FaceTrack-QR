import os
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

load_dotenv()

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


import socket

@app.route("/")
def home():
    return {
        "message": "Backend Working"
    }


@app.route("/server/info")
def server_info():
    lan_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("10.255.255.255", 1))
        lan_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass

    port = int(os.environ.get("PORT", 5001))
    return {
        "lan_ip": lan_ip,
        "frontend_url": f"http://{lan_ip}:5173",
        "backend_url": f"http://{lan_ip}:{port}"
    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)