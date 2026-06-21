import { useState } from "react";
import axios from "axios";

function FaceStatus() {

  const [usn, setUsn] = useState("");
  const [status, setStatus] = useState(null);

  const API_URL =
    "http://192.168.29.24:5000";

  const checkStatus = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/face/status/${usn}`
      );

      setStatus(
        response.data.registered
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed To Check Status"
      );
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white"
      }}
    >

      <h1>Face Status</h1>

      <input
        type="text"
        placeholder="Enter USN"
        value={usn}
        onChange={(e) =>
          setUsn(e.target.value)
        }
      />

      <button
        onClick={checkStatus}
        style={{
          marginLeft: "10px"
        }}
      >
        Check
      </button>

      {status === true && (
        <h3>
          ✅ Face Registered
        </h3>
      )}

      {status === false && (
        <h3>
          ❌ Face Not Registered
        </h3>
      )}

    </div>
  );
}

export default FaceStatus;