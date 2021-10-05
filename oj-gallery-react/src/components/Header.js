import * as React from "react";
import { useContext, useState, useEffect } from "react";

import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HideOnScroll from "./util/HideOnScroll";
import { Link } from "react-router-dom";
import AuthContext from "../store/auth-context";

function Header({ user, setUser, props }) {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    setAnchorEl(null);
    setUser(null)
    authContext.logout();
  };

  return (
    <HideOnScroll {...props}>
      <AppBar>
        <Toolbar style={{ backgroundColor: "#282C35" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "#f2f2f2" }}>
              OJ Gallery
            </Link>
          </Typography>
          {isLoggedIn && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {user && <Typography style={{ marginRight: "5px" }}>
                  {user.name}
                </Typography>}
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Upload Pictures</MenuItem>
                <Link style={{ color: "#000000" }} to="/profile">
                  <MenuItem onClick={handleClose}>Manage Profile</MenuItem>
                </Link>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

export default Header;
