import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin.userInfo);
  useEffect(() => {
    if (userLogin === null) {
      navigate('/')
    }
  }, [userLogin]);

  return (
    <Container maxWidth="sm" sx={{ marginTop: 8, color: "inherit" }}>
      <Paper sx={{ marginTop: 8, backgroundColor: "inherit", color: "white" }}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar alt="User Avatar" src="/avatar.jpg" />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="h5" gutterBottom>
              {userLogin ? userLogin.username : null}
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="body1" color="white">
              {userLogin ? userLogin.email : null}
            </Typography>
          </Grid>
          
          <Grid item xs={12} container justifyContent="center">
            <Button variant="contained" color="primary">
              Change Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileScreen;
