import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

/**
 * Component function for displaying toast
 * which changes color according to the severity
 * of the alert
 * @param props
 * @returns
 */
export default function Toast({ message, severity, handleToastClose }) {
  return (
    <Snackbar
      open={true}
      autoHideDuration={4500}
      onClose={handleToastClose}
      >
      <Alert onClose={handleToastClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
