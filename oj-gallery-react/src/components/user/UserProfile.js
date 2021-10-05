import * as React from "react";
import { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import locale from "./../../configurations/locale.json";
import api from "./../../configurations/api.json";
import Loader from "../common/Loader";
import Toast from "../common/Toast";

require("dotenv").config();

export default function UserProfile({ setUser }) {
  const authContext = useContext(AuthContext);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [sumbitEnabled, setSubmitEnabled] = useState(false);
  const [email, setEmail] = useState("");
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
   * Getting user on profile page load
   */
  useEffect(() => {
    if (!email || email === "") {
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.USER.GET_USER_DETAILS}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
      };
      showLoader(true);
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setEmail(data.email);
          setName(data.name);
        })
        .catch((error) => {
          showLoader(false);
          console.log(error);
          setToastMessage(error.message);
          setToastSeverity("error");
          showToast(true);
        });
    }
  }, [email, authContext.token]);

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
   * if all text fields have some values and there are no errors
   * then enable the submit button
   */
  const enableSubmitButton = () => {
    if (name !== "") {
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
    }

    enableSubmitButton();
  };

  /**
   * Function to submit user update request
   * via API
   * @param event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateName(name)) {
      // Call API to register user
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.USER.UPDATE}`;
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
        body: JSON.stringify({ name: name }),
      };
      showLoader(true);
      fetch(apiUrl, requestOptions)
        .then((res) => {
          showLoader(false);
          if (res.status === 422) {
            throw new Error(res.message);
          }
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          setToastMessage("Profile update is successful");
          setToastSeverity("success");
          showToast(true);
          setUser({ name: name, email: email });
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
          <PersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update Profile
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
                value={name}
                onChange={handleChange}
                onBlur={handleChange}
                error={Boolean(errors?.name)}
                helperText={errors?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                id="email"
                value={email}
                label="Email Address"
                name="email"
                autoComplete="email"
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
            Update Profile
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/update-password" variant="body2">
                {"Want to change password?"}
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
