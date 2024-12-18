import React, { useState } from "react";
import Captcha from "./Captcha";
import "bootstrap/dist/css/bootstrap.min.css";
import { requestPasswordReset, verifyCode, resetPassword } from "../api";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [captchaCode, setCaptchaCode] = useState("");
    const [verificationInput, setVerificationInput] = useState("");
    const [emailVerificationCode, setEmailVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState({});
    const [step, setStep] = useState(1);
    const [tempToken, setTempToken] = useState("");

    const startCountdown = (seconds) => {
        setCountdown(seconds);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendEmailVerification = async () => {
        const validationErrors = {};
        if (!email) {
            validationErrors.email = "Email is required.";
        }
        if (!verificationInput.trim()) {
            validationErrors.captcha = "Captcha is required.";
        } else if (verificationInput.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
            validationErrors.captcha = "Captcha is incorrect.";
        }
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        try {
            setSending(true);
            await requestPasswordReset(email);
            setSending(false);
            setEmailSent(true);
            setError({});
            startCountdown(60);
            setStep(2);
        } catch (err) {
            setSending(false);
            if (err.response?.status === 404) {
                setError({ email: "This email is not registered." });
            } else {
                setError({ server: "Error sending verification email. Please try again." });
            }
        }
    };

    const handleVerifyCode = async () => {
        if (!emailVerificationCode.trim()) {
            setError({ emailVerification: "Verification code is required." });
            return;
        }

        try {
            const response = await verifyCode(email, emailVerificationCode);
            setTempToken(response.data.tempToken);
            setError({});
            setStep(3);
        } catch (err) {
            setError({ emailVerification: "Invalid or expired verification code." });
        }
    };

    const handleResetPassword = async () => {
        const validationErrors = {};
        if (!newPassword || newPassword.length < 8) {
            validationErrors.newPassword = "Password must be at least 8 characters.";
        }
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        try {
            await resetPassword(tempToken, newPassword);
            alert("Password reset successfully! Please log in with your new password.");
            window.location.href = "/login";
        } catch (err) {
            setError({ server: "Error resetting password. Please try again." });
        }
    };

    const navigateToLogin = () => {
        window.location.href = "/login";
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 mx-auto" style={{ maxWidth: "400px", backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                <h2 className="text-center">Password Reset</h2>

                {step === 1 && (
                    <>
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
                                disabled={sending || countdown > 0}
                            />
                            {error.email && <div className="text-danger">{error.email}</div>}
                        </div>

                        <Captcha
                            onValidate={(value) => setVerificationInput(value)}
                            setCaptchaCode={(code) => setCaptchaCode(code)}
                        />
                        {error.captcha && <div className="text-danger">{error.captcha}</div>}

                        <button
                            className={`btn w-100 mt-2 ${countdown > 0 || sending ? "btn-secondary disabled" : "btn-primary"}`}
                            onClick={sendEmailVerification}
                            disabled={sending || countdown > 0}
                        >
                            {sending
                                ? "Sending..."
                                : countdown > 0
                                ? `Resend in ${countdown}s`
                                : "Send Verification Code"}
                        </button>

                        <button
                            className="btn btn-link mt-3"
                            onClick={navigateToLogin}
                        >
                            Back to Login
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="emailVerificationCode" className="form-label">
                                Email Verification Code
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="emailVerificationCode"
                                value={emailVerificationCode}
                                onChange={(e) => setEmailVerificationCode(e.target.value)}
                            />
                            {error.emailVerification && (
                                <div className="text-danger">{error.emailVerification}</div>
                            )}
                        </div>
                        <button className="btn btn-primary w-100 mt-3" onClick={handleVerifyCode}>
                            Verify Code
                        </button>
                        <button
                            className="btn btn-link mt-3"
                            onClick={() => setStep(1)}
                        >
                            Back to Step 1
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            {error.newPassword && <div className="text-danger">{error.newPassword}</div>}
                        </div>
                        <button className="btn btn-primary w-100 mt-3" onClick={handleResetPassword}>
                            Reset Password
                        </button>
                        <button
                            className="btn btn-link mt-3"
                            onClick={() => setStep(2)}
                        >
                            Back to Step 2
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
