import React, { useState } from "react";

let logoutTimer;

/**
 * Defining Authentical Context
 */
const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

/**
 * Function to calculate remaining time
 * @param expirationTime 
 * @returns 
 */
const calculateTimeRemaining = (expirationTime) => {
  const currentTime = new Date().getTime();
  const calcExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = calcExpirationTime - currentTime;
  return remainingDuration;
};

/**
 * Fundtion to retrive stored token
 * @returns
 */
const retriveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateTimeRemaining(storedExpirationTime);

  if (remainingTime <= 60000) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

/**
 * Authentication Context Provider function
 * which handles login and logout
 * @param props 
 * @returns 
 */
export const AuthContextProvider = (props) => {
  const tokenData = retriveStoredToken();
  let storedToken;
  if (tokenData) {
    storedToken = localStorage.getItem("token");
  }

  const [token, setToken] = useState(storedToken);

  const userIsLoggedIn = !!token;

  /**
   * Function for handling login
   * @param token 
   * @param tokenExpirationIn 
   */
  const loginHandler = (token, tokenExpirationIn) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", tokenExpirationIn);
    setToken(token);

    logoutTimer = setTimeout(
      logoutHandler,
      calculateTimeRemaining(tokenExpirationIn)
    );
  };

  /**
   * Function for handling logout
   */
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
