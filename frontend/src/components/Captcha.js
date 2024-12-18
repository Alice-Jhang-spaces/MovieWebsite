import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Captcha = ({ onValidate, setCaptchaCode }) => {
  const canvasRef = useRef(null);
  const [generatedCode, setGeneratedCode] = useState([]);

  // Generate random verification codes
  const generateCaptchaCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const codeArray = [];
    for (let i = 0; i < 4; i++) {
      codeArray.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    setGeneratedCode(codeArray);
    setCaptchaCode(codeArray.join("")); // Update the status of the parent component
  };

  // Random color generation function
  const randomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  };

  // Draw captcha
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background fill
    ctx.fillStyle = "#f9f9f9";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw CAPtcha characters
    generatedCode.forEach((char, index) => {
      const x = 15 + index * 25; // X coordinates for each character
      const y = 20 + Math.random() * 4; // Random Y coordinate
      const deg = Math.random() * 30 * (Math.PI / 180); // Random rotation Angle

      ctx.save(); // Save current state
      ctx.translate(x, y); // moving coordinate system
      ctx.rotate(deg); // Rotate text
      ctx.font = "bold 18px Arial"; // Smaller font
      ctx.fillStyle = randomColor(); // random color
      ctx.fillText(char, 0, 0); // Draw text
      ctx.restore(); // recovery mode
    });

    // Draw interference line
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = randomColor();
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      ctx.lineTo(Math.random() * canvasWidth, Math.random() * canvasHeight);
      ctx.stroke();
    }

    // Plot interference points
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = randomColor();
      ctx.beginPath();
      const x = Math.random() * canvasWidth;
      const y = Math.random() * canvasHeight;
      ctx.moveTo(x, y);
      ctx.lineTo(x + 1, y + 1);
      ctx.stroke();
    }
  };

  // Refresh verification code
  const refreshCaptcha = () => {
    generateCaptchaCode();
  };

  useEffect(() => {
    generateCaptchaCode();
  }, []);

  useEffect(() => {
    if (generatedCode.length > 0) {
      drawCaptcha();
    }
  }, [generatedCode]);

  return (
    <div className="mb-3">
      <label className="form-label">Captcha</label>
      <div className="d-flex align-items-center">
        <canvas
          ref={canvasRef}
          width="120" 
          height="36"
          style={{
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={refreshCaptcha}
          title="Click to refresh"
        ></canvas>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={refreshCaptcha}
        >
          Refresh
        </button>
      </div>
      <input
        type="text"
        className="form-control mt-2"
        placeholder="Enter Captcha"
        onChange={(e) => onValidate(e.target.value)} // Pass user input back to the parent component
      />
    </div>
  );
};

export default Captcha;
