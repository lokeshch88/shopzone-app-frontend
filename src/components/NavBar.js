import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Login", path: "/login" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Admin Dashboard", path: "/admin-dashboard" },
    { label: "Register User", path: "/register-user" },
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ShopZone
        </Typography>

        {isMobile ? (
          <>
            <IconButton color="inherit" edge="start" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.label}
                  component={Link}
                  to={item.path}
                  onClick={handleMenuClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              component={Link}
              to={item.path}
            >
              {item.label}
            </Button>
          ))
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
