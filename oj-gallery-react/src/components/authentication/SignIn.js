import * as React from "react";
import { useState, useContext } from "react";
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
import * as Config from "./../../configurations/Config";
import locale from "./../../configurations/locale.json";
import api from "./../../configurations/api.json";
import AuthContext from "../../store/auth-context";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

require("dotenv").config();

/**
 * Method for sign in functionality and to render sign in page
 * @author: Vijay Pratap Singh
 */
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [sumbitEnabled, setSubmitEnabled] = useState(false);
  const history = useHistory();
  const authContext = useContext(AuthContext);
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
    } else {
      setErrors({ ...errors, password: undefined });
    }
    return true;
  };

  /**
   * if all text fields have some values and there are no errors
   * then enable the submit button
   */
  const enableSubmitButton = () => {
    if (email !== "" && password !== "") {
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
      case "email":
        setEmail(value);
        validateEmail(value);
        break;
      case "password":
        setPassword(value);
        validatePassword(value);
        break;
    }

    enableSubmitButton();
  };

  /**
   * Method to sign in the user
   * @param event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateEmail(email) && validatePassword(password)) {
      // Call API to register user
      showLoader(true);
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.AUTH.LOGIN}`;
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      };
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status === 422) {
            throw new Error(res.message);
          }
          if (res.status === 401) {
            throw new Error("Invalid email or password");
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
          const expirationTime = new Date(
            new Date().getTime() + +data.expiresIn
          );
          return authContext.login(data.token, expirationTime.toISOString());
        })
        .then(() => {
          history.push("/");
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
            onBlur={handleChange}
            error={Boolean(errors?.email)}
            helperText={errors?.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            onBlur={handleChange}
            error={Boolean(errors?.password)}
            helperText={errors?.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!sumbitEnabled}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
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
