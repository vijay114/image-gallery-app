import * as React from "react";
import { useState, useContext } from "react";
import { useHistory } from "react-router";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PasswordIcon from "@mui/icons-material/Password";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import * as Config from "./../../configurations/Config";
import AuthContext from "../../store/auth-context";
import locale from "./../../configurations/locale.json";
import api from "./../../configurations/api.json";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

require("dotenv").config();

export default function UpdatePassword() {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [sumbitEnabled, setSubmitEnabled] = useState(false);
  const [loader, showLoader] = useState(false);
  let [toast, showToast] = useState(false);
  let [toastMessage, setToastMessage] = useState("");
  let [toastSeverity, setToastSeverity] = useState("info");

  /**
   * Handler for closing Toast
   * @param event
   * @param reason
   * @returns
   */
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showToast(false);
  };

  /**
   * Method to validate name text field
   * @param value
   * @returns Boolean
   */
  const validateOldPassword = (value) => {
    if (value === "") {
      setErrors({
        ...errors,
        oldPassword: locale.VALIDATION.ERROR.REQUIRED.OLD_PASSWORD,
      });
      return false;
    } else {
      setErrors({ ...errors, oldPassword: undefined });
    }
    return true;
  };

  /**
   * Method to validate password field
   * @param value
   * @returns Boolean
   */
  const validatePassword = (value) => {
    if (value === "") {
      setErrors({
        ...errors,
        password: locale.VALIDATION.ERROR.REQUIRED.PASSWORD,
      });
      return false;
    } else if (!Config.PASSWORD_REGEX.test(value)) {
      setErrors({
        ...errors,
        password: locale.VALIDATION.ERROR.INVALID.PASSWORD,
      });
      return false;
    } else {
      setErrors({ ...errors, password: undefined });
    }
    return true;
  };

  /**
   * Method to validate confirm password field
   * @param value
   * @returns Boolean
   */
  const validateConfirmPassword = (value) => {
    if (value === "") {
      setErrors({
        ...errors,
        confirmPassword: locale.VALIDATION.ERROR.REQUIRED.CONFIRM_PASSWORD,
      });
      return false;
    } else if (password !== value) {
      setErrors({
        ...errors,
        confirmPassword: locale.VALIDATION.ERROR.INVALID.CONFIRM_PASSWORD,
      });
      return false;
    } else {
      setErrors({ ...errors, confirmPassword: undefined });
    }
    return true;
  };

  /**
   * if all text fields have some values and there are no errors
   * then enable the submit button
   */
  const enableSubmitButton = () => {
    if (oldPassword !== "" && password !== "" && confirmPassword !== "") {
      let anyError = false;
      Object.entries(errors).forEach(
        ([key, value]) => value !== undefined && (anyError = true)
      );
      if (!anyError) {
        setSubmitEnabled(true);
      } else {
        setSubmitEnabled(false);
      }
    } else {
      setSubmitEnabled(false);
    }
  };

  /**
   * Method to handle changes on text fields in form
   * It also enables submit button once all fields are filled in and validated
   * @param event
   */
  const handleChange = (event) => {
    const fieldName = event.target.name;
    const value = event.target.value;

    switch (fieldName) {
      case "oldPassword":
        setOldPassword(value);
        validateOldPassword(value);
        break;
      case "password":
        setPassword(value);
        validatePassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        validateConfirmPassword(value);
        break;
    }

    enableSubmitButton();
  };

  /**
   * Function to call server API to update password
   * @param event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      validateOldPassword(oldPassword) &&
      validatePassword(password) &&
      validateConfirmPassword(confirmPassword)
    ) {
      // Call API to update password
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.USER.UPDATE_PASSWORD}`;
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
        body: JSON.stringify({ oldPassword: oldPassword, password: password }),
      };
      showLoader(true);
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status === 422) {
            throw new Error(res.message);
          }
          if (res.status == 401) {
            throw new Error("Current password is invalid.");
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setToastMessage("Password updated Successfully!");
          setToastSeverity("success");
          showToast(true);
          setTimeout(
            function () {
              //Start the timer
              history.push("/profile"); //After 1 second, set render to true
            }.bind(this),
            1500
          );
          console.log(data.message);
        })
        .catch((error) => {
          showLoader(false);
          console.log(error);
          setToastMessage(error.message);
          setToastSeverity("error");
          showToast(true);
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PasswordIcon />
        </Avatar>
        <Typography component="h2" variant="h5">
          Update Password
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="current-password"
                name="oldPassword"
                required
                fullWidth
                id="oldPassword"
                label="Old Password"
                autoFocus
                type="password"
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.oldPassword)}
                helperText={errors?.oldPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.password)}
                helperText={errors?.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.confirmPassword)}
                helperText={errors?.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!sumbitEnabled}
          >
            Update Password
          </Button>
        </Box>
      </Box>
      {loader && <Loader />}
      {toast && (
        <Toast
          message={toastMessage}
          severity={toastSeverity}
          handleToastClose={handleToastClose}
        />
      )}
    </Container>
  );
}
