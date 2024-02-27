import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; 
import { verifyOTP, resendOTP } from '../actions/userActions';

const VerifyOtp = () => {
  const { userId } = useParams(); 
  const [otp, setOTP] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP(userId, otp));
      navigate("/");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResend = () => {
    dispatch(resendOTP(userId));
  };
  
  return (
    <div>
      <h2>OTP Verification</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="otp">Enter OTP:</label>
        <input 
          type="text" 
          id="otp" 
          value={otp} 
          onChange={(e) => setOTP(e.target.value)} 
        />
        <button type="submit">Verify OTP</button>
      </form>
      
      <button onClick={handleResend}>Resend OTP</button>
    </div>
  );
}

export default VerifyOtp;
