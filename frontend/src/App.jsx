import { useState } from "react";

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileScreen from "./screens/ProfileScreen";
import VerifyOtp from "./screens/VerifyOtp";
import ResetPassworScreen from "./screens/ForgotPasswordScreen";
import NewPasswordScreen from "./screens/NewpasswordScreen";

function App() {
  return (
    <>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} exact/>
              <Route path='login/' element={<LoginScreen />} />
              <Route path='register/' element={<RegisterScreen />} />
              <Route path='profile/' element={<ProfileScreen />} />
              <Route path='verify-otp/:userId' element={<VerifyOtp />} />
              <Route path='/reset-password' element={<ResetPassworScreen/>} />
              <Route path="/new-password" element= {<NewPasswordScreen />} />



            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
