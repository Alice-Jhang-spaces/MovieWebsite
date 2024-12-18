import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "./Captcha";
import "bootstrap/dist/css/bootstrap.min.css";
import {saveEmail, verifyCode } from "../api";

const SignUpStep1 = () => {
  const [email, setEmail] = useState("");
  const [emailVerificationInput, setEmailVerificationInput] = useState("");
  const [verificationInput, setVerificationInput] = useState(""); // Graphic verification code entered by the user
  const [captchaCode, setCaptchaCode] = useState(""); // Currently generated graphic verification code
  const [emailSent, setEmailSent] = useState(false); // Mail sending status
  const [sending, setSending] = useState(false); // Button send state
  const [countdown, setCountdown] = useState(0); // count down
  const [resend, setResend] = useState(false); // Control button displays status
  const [error, setError] = useState({});
  const navigate = useNavigate();

  // Verification mailbox format
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // start the countdown
  const startCountdown = (seconds) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResend(true); // Update button status after countdown ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const navigateToLogin = () => {
    if (window.confirm("Are you sure you want to go back? Your data will be cleared.")) {
      clearForm();
      navigate("/login");
    }
  };

  const clearForm = () => {
    setEmail("");
    setVerificationInput("");
    setCaptchaCode("");
    setEmailSent(false);
    setError({});
  };

  // Process sending email verification codes
  const sendEmailVerification = async () => {
    const validationErrors = {};
    if (!validateEmail(email)) {
      validationErrors.email = "Email must be a valid Northeastern email address.";
    }
    if (!verificationInput.trim()) {
      validationErrors.captcha = "Captcha is required.";
    } else if (verificationInput.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
      validationErrors.captcha = "Captcha is incorrect. Please try again.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      setSending(true); // Set sending status
      await saveEmail(email); // Call the back end to save the mailbox and send the verification code
      setEmailSent(true);
      setResend(false); // Reset button status
      setError({});
      console.log("Email saved and verification code sent!");
      startCountdown(60); // start the countdown
    } catch (err) {
      if (err.response?.status === 409) {
        setError({ email: "This email is already registered." });
      } else {
        setError({ server: "Error sending email. Please try again later." });
      }
    } finally {
      setSending(false); // Reset send status
    }
  };

  // Process next button
  const handleNext = async () => {
    const validationErrors = {};
    if (!emailVerificationInput.trim()) {
      validationErrors.emailVerification = "Email verification code is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const response = await verifyCode(email, emailVerificationInput); // Invoke the back-end verification code
      const tempToken = response.data.tempToken; // Get a temporary Token from the backend
      localStorage.setItem("tempToken", tempToken); // Save the temporary Token to localStorage
      navigate("/signup/step2");
    } catch (err) {
      setError({ emailVerification: "Invalid or expired verification code. Please try again." });
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card p-4 mx-auto"
        style={{
          maxWidth: "400px",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      >
        <h2 className="text-center">Sign Up - Step 1</h2>

        {/* Mailbox input field */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <div className="text-danger">{error.email}</div>}
        </div>

        {/* Graphic verification code component */}
        <Captcha
          onValidate={(value) => setVerificationInput(value)} // The verification code entered by the user
          setCaptchaCode={(code) => setCaptchaCode(code)} // Set the generated graphic verification code
        />
        {error.captcha && <div className="text-danger">{error.captcha}</div>}

        {/* Send mail button */}
        <div className="d-flex align-items-center mb-3">
          <button
            className="btn btn-primary"
            onClick={sendEmailVerification}
            disabled={sending || countdown > 0} // Disable button in sending or countdown
          >
            {sending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : resend
              ? "Send Again"
              : "Send Verification Code"}
          </button>
          {emailSent && !sending && (
            <span className="text-success ms-3">Verification code sent! Please check your email.</span>
          )}
        </div>

        {/* Email verification code input field */}
        {emailSent && (
          <div className="mb-3 mt-3">
            <label htmlFor="emailVerificationCode" className="form-label">
              Enter Email Verification Code
            </label>
            <input
              type="text"
              className="form-control"
              id="emailVerificationCode"
              value={emailVerificationInput}
              onChange={(e) => setEmailVerificationInput(e.target.value)}
            />
            {error.emailVerification && (
              <div className="text-danger">{error.emailVerification}</div>
            )}
          </div>
        )}

        {/* Next button */}
        <button
          className={`btn w-100 mt-2 ${emailSent ? "btn-primary" : "btn-secondary disabled"}`}
          onClick={handleNext}
          disabled={!emailSent}
        >
          Next
        </button>

        {/* 返回登录按钮 */}
        <button className="btn btn-link mt-3" onClick={navigateToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignUpStep1;
