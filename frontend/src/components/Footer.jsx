import React from "react";
import { AppBar, Container, Typography, Box, Link } from "@mui/material";

const Footer = () => {
  return (
    <footer>
      <AppBar
        color="primary"
        sx={{ top: "auto", bottom: 0, bgcolor: "#242424", width: "100"}}
      >
        <Container maxWidth="xl">
          <Box
            py={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body2" color="inherit" textAlign="center">
              &copy; {new Date().getFullYear()} DSALGO. All rights reserved.
            </Typography>
            <Box mx={2}>
              <Link href="#" color="inherit" underline="hover">
                Privacy Policy
              </Link>
            </Box>
            <Box mx={2}>
              <Link href="#" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Box>
        </Container>
      </AppBar>
    </footer>
  );
};

export default Footer;
