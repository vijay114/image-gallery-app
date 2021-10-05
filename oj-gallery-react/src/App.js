import "./App.css";
import * as React from "react";
import { useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ListImages from "./components/gallery/ListImages";
import Header from "./components/Header";
import SignUp from "./components/authentication/SignUp";
import SignIn from "./components/authentication/SignIn";
import UserProfile from "./components/user/UserProfile";
import Error404 from "./components/Error404";
import Footer from "./components/Footer";
import UpdatePassword from "./components/user/UpdatePassword";
import AuthContext from "./store/auth-context";
import api from "./configurations/api.json";

require("dotenv").config();

function App(props) {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isLoggedIn && !user) {
      const apiUrl = `${process.env.REACT_APP_API_SERVER_URL}${api.USER.GET_USER_DETAILS}`;
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authContext.token}`,
        },
      };
      fetch(apiUrl, requestOptions)
        .then((res) => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error(
              "An error occurred while processing your request. Please try again"
            );
          }
          return res.json();
        })
        .then((data) => {
          // setToastMessage("Registration Successfull!");
          // setToastSeverity("success");
          // setShowToast(true);
          setUser({
            name: data.name,
            email: data.email,
          });
        })
        .catch((error) => {
          console.log(error);
          // setToastMessage(error.message);
          // setToastSeverity("error");
          // setShowToast(true);
        });
    }
  });

  return (
    <Router>
      <React.Fragment>
        <CssBaseline />
        <Header user={user} setUser={setUser} {...props} />
        <Route path="/" exact>
          {authContext.isLoggedIn && <ListImages />}
          {!authContext.isLoggedIn && <Redirect to="/sign-in" />}
        </Route>
        <Route path="/sign-up">
          {!authContext.isLoggedIn && <SignUp />}
          {authContext.isLoggedIn && <Redirect to="/" />}
        </Route>
        <Route path="/sign-in">
          {!authContext.isLoggedIn && <SignIn />}
          {authContext.isLoggedIn && <Redirect to="/" />}
        </Route>
        <Route path="/profile">
          {authContext.isLoggedIn && user && (
            <UserProfile user={user} setUser={setUser} />
          )}
          {!authContext.isLoggedIn && <Redirect to="/sign-in" />}
        </Route>
        <Route path="/update-password">
          {authContext.isLoggedIn && <UpdatePassword />}
          {!authContext.isLoggedIn && <Redirect to="/sign-in" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
        <Footer />
      </React.Fragment>
    </Router>
  );
}

export default App;
