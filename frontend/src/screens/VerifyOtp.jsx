import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { verifyOTP, resendOTP } from '../actions/userActions';

const VerifyOtp = () => {
  const { userId } = useParams(); 
  const [otp, setOTP] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP(userId, otp));
      navigate("/");
    } catch (error) {
      setErrorMessage('Error verifying OTP. Please try again.');
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResend = () => {
    dispatch(resendOTP(userId));
  };
  
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label htmlFor="otp" style={{ marginRight: '10px' }}>Enter OTP:</label>
        <input 
          type="text" 
          id="otp" 
          value={otp} 
          onChange={(e) => setOTP(e.target.value)} 
          style={{ 
            marginRight: '10px', 
            padding: '5px', 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            outline: 'none',
            color: '#000' // Add this line to set text color to black
          }}
        />
        <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Verify OTP</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <button onClick={handleResend} style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Resend OTP</button>
    </div>
  );
}

export default VerifyOtp;
  