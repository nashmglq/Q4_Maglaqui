import React from "react";
import { Alert } from "@mui/material";

function Message({ severity, variant, children }) {
  return (
    <Alert

      severity={severity}
      variant={variant}
      sx={{ width: "auto", mt: 2, color: "inherit", justifyContent: "center" }}
    >
      {children}
    </Alert>
  );
}

export default Message;
