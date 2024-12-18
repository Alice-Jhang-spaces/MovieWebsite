import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { registerUser } from "../api";

const SignUpStep2 = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [showModal, setShowModal] = useState(false); // Control popup display
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the temporary token exists
    const tempToken = localStorage.getItem("tempToken");
    if (!tempToken) {
      // If the temporary token does not exist, redirect to Step 1
      navigate("/signup/step1");
    }
  }, [navigate]);

  const handleSignUp = async () => {
    const validationErrors = {};
    if (password.length < 8) {
        validationErrors.password = "Password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match.";
    }
    if (Object.keys(validationErrors).length > 0) {
        setError(validationErrors);
        return;
    }

    try {
        const tempToken = localStorage.getItem("tempToken"); // Gets a temporary token from localStorage
        if (!tempToken) {
            setError({ token: "No token found. Please verify your email again." });
            return;
        }
        await registerUser(tempToken, password);
        localStorage.removeItem("tempToken");
        setShowModal(true);
    } catch (err) {
        setError({ server: err.response?.data?.error || "Registration failed." });
    }
};

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/login"); // Go to the login page
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px",backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
        <h2 className="text-center">Sign Up - Step 2</h2>

        {/* Password Field */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <div className="text-danger">{error.password}</div>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error.confirmPassword && (
            <div className="text-danger">{error.confirmPassword}</div>
          )}
        </div>

        {/* Sign Up Button */}
        <button className="btn btn-primary w-100" onClick={handleSignUp}>
          Sign Up
        </button>

        {/* Success Modal */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Registration Successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>Congratulations! Your account has been created.</Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary" onClick={handleModalClose}>
              Go to Login
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SignUpStep2;
