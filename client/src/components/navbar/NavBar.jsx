import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext";
import { Button } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import "./navbar.css";

export default function NavBar(props) {
  
  const currUser = localStorage.getItem("username");
  console.log(currUser)
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = ["", "View Profile", "Logout"];

  const appContext = useContext(AuthContext);
  const { login, setLogin } = appContext;

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    if (options[index] === "View Profile") window.location = "/dashboard";
    else {
      localStorage.removeItem("login");
      localStorage.removeItem("access-token");
      localStorage.removeItem("username");
      setLogin(false);
      window.location = "/";
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="navLeft">
          <Link to="/" className="logo">
            Senior Playground
          </Link>
          <div className="navbarList">
            <Link to="/problemset" className="navbarItem">
              Problemset
            </Link>
            {login && (currUser ==="Admin" || currUser ==="ayush")  ? (
              <>
                <Link to="/addproblem" className="navbarItem">
                  Add Problem
                </Link>
                
              </>
            ) : null}
            {login ? (
              <>
                
                <Link to="/usersubmission" className="navbarItem">
                  My Submissions
                </Link>
              </>
            ) : null}
          </div>
        </div>
        <div className="navRight">
          {login ? (
            <>
              <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClickListItem}
              >
                <img
                  src="https://img.freepik.com/premium-photo/man-with-glasses-tie-with-tie-it_745528-2818.jpg?w=740"
                  alt="avatar"
                  className="navbarAvatar"
                />
              </Button>
              <Menu
                id="simple-menu"
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    disabled={index === 0}
                    selected={index === selectedIndex}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className="signin-btn"
                fullWidth
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
