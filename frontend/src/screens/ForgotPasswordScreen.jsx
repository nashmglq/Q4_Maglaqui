import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendPasswordRequest } from '../actions/userActions'; 
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState(''); 
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(sendPasswordRequest(identifier)); 
      setMessage('Password reset request sent successfully.');
    } catch (error) {
      setMessage('Error: Unable to send password reset request.');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="identifier">Email or Username:</label> {/* Changed label to accept email or username */}
        <input 
          type="text" 
          id="identifier" 
          value={identifier} 
          onChange={(e) => setIdentifier(e.target.value)} 
          required 
          style={{ color: "black" }} // Set text color to black
        /> {/* Changed input type to 'text' */}
        <button type="submit">Reset Password</button>
        <Link to="/"> Go back?</Link>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPasswordScreen;
