import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function FormContainer({ children }) {
  return (
    <Container maxWidth="xs" sx={{ color: "inherit" }}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "inherit",
        }}
      >
        {children}
      </Box>
    </Container>
  );
}

export default FormContainer;
