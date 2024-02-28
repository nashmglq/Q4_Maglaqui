import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userNewPassword } from "../actions/userActions";

function NewPasswordScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uidb64, setUidb64] = useState("");
  const [token, setToken] = useState("");
  const newPasswordState = useSelector((state) => state.userNewPassword);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      navigate("/homepage");
    }
  }, [navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uidb64Param = urlParams.get("uidb64");
    const tokenParam = urlParams.get("token");

    console.log("UIDB64:", uidb64Param);
    console.log("Token:", tokenParam);

    if (uidb64Param && tokenParam) {
      setUidb64(uidb64Param);
      setToken(tokenParam);
    } else {
      navigate("/invalid");
    }
  }, [navigate]);

  useEffect(() => {
    if (newPasswordState && newPasswordState.success) {
      navigate("/");
    } else if (newPasswordState && newPasswordState.error) {
      navigate("/invalid");
    }
  }, [newPasswordState, navigate]);

  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "none",
    borderBottom: "1px solid #ccc",
    fontSize: "16px",
    color: "black", // Set password color to black
  };

  const containerStyle = {
    marginBottom: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !uidb64 || !token) {
      setMessage("All fields are required for password reset.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(userNewPassword(uidb64, token, password, confirmPassword));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h2>New Password</h2>
      <form onSubmit={handleResetPassword}>
        <div style={containerStyle}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={containerStyle}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={loading}>
          Reset Password
        </button>
        {loading && <p>Loading...</p>}
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default NewPasswordScreen;
