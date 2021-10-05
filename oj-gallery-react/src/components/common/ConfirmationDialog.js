import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

/**
 * Component function to display confirmation dialog
 * @param props
 * @returns
 */
export default function ConfirmationDialog({
  title,
  message,
  agreeText,
  notAgreeText,
  handleDisagree,
  handleAgree,
}) {
  return (
    <Dialog
      open={true}
      onClose={() => handleDisagree()}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => handleDisagree()}>
          {notAgreeText}
        </Button>
        <Button onClick={() => handleAgree()} autoFocus>
          {agreeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
