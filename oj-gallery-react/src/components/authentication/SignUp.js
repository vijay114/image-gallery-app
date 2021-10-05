import * as React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Loader from "../common/Loader";
import Toast from "../common/Toast";
import * as Config from "./../../configurations/Config";
import locale from "./../../configurations/locale.json";
import api from "./../../configurations/api.json";

require("dotenv").config();

/**
 * Method for sign up functionality and to render sign up page
 * @author: Vijay Pratap Singh
 */
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [sumbitEnabled, setSubmitEnabled] = useState(false);
  const [loader, showLoader] = useState(false);
  const history = useHistory();
  const [toast, showToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("info");

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
  const validateName = (value) => {
    if (value === "") {
      setErrors({ ...errors, name: locale.VALIDATION.ERROR.REQUIRED.NAME });
      return false;
    } else {
      setErrors({ ...errors, name: undefined });
    }
    return true;
  };

  /**
   * Method to validate email text field
   * @param value
   * @returns Boolean
   */
  const validateEmail = (value) => {
    if (value === "") {
      setErrors({ ...errors, email: locale.VALIDATION.ERROR.REQUIRED.EMAIL });
      return false;
    } else if (!Config.EMAIL_REGEX.test(value)) {
      setErrors({ ...errors, email: locale.VALIDATION.ERROR.INVALID.EMAIL });
      return false;
    } else {
      setErrors({ ...errors, email: undefined });
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
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
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
      case "name":
        setName(value);
        validateName(value);
        break;
      case "email":
        setEmail(value);
        validateEmail(value);
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
   * Method to handle Submit event to sign up the user
   * This will also validate if the user has already been registered
   * @param event
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      validateName(name) &&
      validateEmail(email) &&
      validatePassword(password) &&
      validateConfirmPassword(confirmPassword)
    ) {
      // Call API to register user
      showLoader(true);
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.AUTH.REGISTER}`;
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, email: email, password: password }),
      };
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status === 422) {
            throw new Error("A user already exist with same email");
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setToastMessage("Registration Successfull!");
          setToastSeverity("success");
          showToast(true);
          setTimeout(
            function () {
              history.push("/sign-in");
            }.bind(this),
            1500
          );
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.name)}
                helperText={errors?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.email)}
                helperText={errors?.email}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
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
