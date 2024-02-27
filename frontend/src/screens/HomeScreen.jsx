import React from 'react';
import { Link } from 'react-router-dom'; 

function HomeScreen() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h1>DSALGO-QUIZ4</h1>
        <h2>CHANGE PASSWORD</h2>
        <Link to="/change-password">Change Password</Link>
    </div>
  );
}

export default HomeScreen;
