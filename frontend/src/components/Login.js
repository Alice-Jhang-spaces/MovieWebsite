import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Captcha from "./Captcha";
import { loginUser } from "../api";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [captchaCode, setCaptchaCode] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();


    const handleLogin = async () => {
      const validationErrors = {};
  
      // 验证 Captcha
      if (captchaInput.trim().toLowerCase() !== captchaCode.trim().toLowerCase()) {
          validationErrors.captcha = "Captcha is incorrect. Please try again.";
      }
  
      if (Object.keys(validationErrors).length > 0) {
          setError(validationErrors);
          return;
      }
  
      try {
          // 普通用户登录
          const response = await loginUser(email, password);
          console.log("Login response:", response.data);
  
          // 保存 Token
          localStorage.setItem("token", response.data.token);
  
          // 跳转到普通用户页面
          navigate("/home");
      } catch (err) {
          console.error("Login error:", err.response?.data || err.message);
          setError({ login: err.response?.data?.error || "Login failed" });
      }
  };
  
  const handleAdminLogin = async () => {
    try {
        // 管理员登录
        const response = await loginUser(email, password);
        console.log("Admin login response:", response.data);

        // 检查是否为管理员
        if (response.data.isAdmin) {
            localStorage.setItem("token", response.data.token);
            navigate("/admin");
        } else {
            setError({ login: "Not an admin account" });
        }
    } catch (err) {
        console.error("Admin login error:", err.response?.data || err.message);
        setError({ login: err.response?.data?.error || "Login failed" });
    }
};

    const navigateToSignup = () => {
        navigate("/signup/step1");
    };

    const navigateToForgotPassword = () => {
        navigate("/forgot-password");
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
                <h2 className="text-center">Login</h2>
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
                </div>
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
                </div>
                <Captcha
                    onValidate={(value) => setCaptchaInput(value)}
                    setCaptchaCode={(code) => setCaptchaCode(code)}
                />
                {error.captcha && <div className="text-danger">{error.captcha}</div>}
                {error.login && <div className="text-danger">{error.login}</div>}
                <button className="btn btn-primary w-100 mt-2" onClick={handleLogin}>
                    Login
                </button>
                <div className="mt-3 text-center">
                    Don't have an account?{" "}
                    <button className="btn btn-link p-0" onClick={navigateToSignup}>
                        Sign Up
                    </button>
                </div>
                <div className="mt-3 text-center">
                    Forgot Password?{" "}
                    <button
                        className="btn btn-link p-0"
                        onClick={navigateToForgotPassword}
                    >
                        Reset Password
                    </button>
                </div>
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={handleAdminLogin}
                        className="btn btn-secondary w-100"
                    >
                        Login as Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;