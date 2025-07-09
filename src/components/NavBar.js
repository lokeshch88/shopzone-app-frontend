import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [role, setRole] = useState(null);
  const [address, setAddress] = useState("Select Address");
  const [openDialog, setOpenDialog] = useState(false);
  const [tempAddress, setTempAddress] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [detectedAddress, setDetectedAddress] = useState(null);

  const isLoggedIn = !!localStorage.getItem("authToken");

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setRole(storedRole);

    const storedAddresses = localStorage.getItem("userAddresses");
    let parsed = [];
    try {
      parsed = storedAddresses ? JSON.parse(storedAddresses) : [];
    } catch (e) {
      console.error("Invalid JSON in userAddresses", e);
    }
    setAddressList(parsed);

    if (!parsed.length && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await res.json();

            const tempDetectedAddress = {
              addressLine: data.display_name || "Detected Address",
              city: data.address?.city || data.address?.town || "",
              district: data.address?.county || "",
              state: data.address?.state || "",
              country: data.address?.country || "",
              pincode: data.address?.postcode || "",
              latitude,
              longitude,
            };

            setDetectedAddress(tempDetectedAddress);
            setTempAddress(formatAddress(tempDetectedAddress));
          } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setDetectedAddress(null);
          }
        },
        (err) => {
          console.warn("Geolocation denied or unavailable:", err);
          setDetectedAddress(null);
        }
      );
    }
  }, []);

  const formatAddress = (addr) => {
    return [
      addr.addressLine,
      addr.city,
      addr.district,
      addr.state,
      addr.country,
      addr.pincode ? `Pincode: ${addr.pincode}` : "",
    ]
      .filter(Boolean)
      .join(", ");
  };

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileMenuOpen = (e) => setProfileAnchorEl(e.currentTarget);
  const handleProfileMenuClose = () => setProfileAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    handleProfileMenuClose();
    navigate("/login");
  };

  const handleAddressClick = () => {
    setTempAddress(address);
    setOpenDialog(true);
  };

  const saveAddressToAPI = async (addressObj) => {
    const response = await fetch("/api/save-address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressObj),
    });

    if (!response.ok) throw new Error("Failed to save address");
  };

  const publicNav = [
    { label: "Home", path: "/home" },
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register-user" },
  ];

  const userNav = [
    { label: "Home", path: "/home" },
    { label: "Cart", path: "/cart" },
    { label: "Orders", path: "/orders" },
  ];

  const adminNav = [
    ...userNav,
    { label: "Admin Dashboard", path: "/admin-dashboard" },
  ];
  const navItems = !isLoggedIn
    ? publicNav
    : role === "ADMIN"
    ? adminNav
    : userNav;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#2e7dff", color: "#fff" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontFamily: "'Poppins', sans-serif",
                cursor: "pointer",
              }}
              onClick={() => navigate("/home")}
            >
              Shop
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
              onClick={handleAddressClick}
            >
              <LocationOnIcon fontSize="small" />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  maxWidth: "180px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {address}
              </Typography>
            </Box>
          </Box>

          {!isMobile ? (
            <Box>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  sx={{ textTransform: "none", mx: 1 }}
                >
                  {item.label}
                </Button>
              ))}
              {isLoggedIn && (
                <IconButton onClick={handleProfileMenuOpen} color="inherit">
                  <Avatar sx={{ width: 32, height: 32 }} />
                </IconButton>
              )}
            </Box>
          ) : (
            <>
              <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
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
                {isLoggedIn && (
                  <MenuItem onClick={handleProfileMenuOpen}>Profile</MenuItem>
                )}
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleProfileMenuClose}
        >
          My Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Set Delivery Address</DialogTitle>
        <DialogContent>
          {addressList.length > 0 &&
            addressList.map((addr, i) => (
              <Box
                key={i}
                onClick={() => {
                  const formatted = formatAddress(addr);
                  setAddress(formatted);
                  setOpenDialog(false);
                }}
                sx={{
                  border: "1px solid #ccc",
                  p: 1,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                <Typography variant="body2">{formatAddress(addr)}</Typography>
              </Box>
            ))}

          {addressList.length === 0 && detectedAddress && (
            <Box
              sx={{ border: "1px dashed #999", p: 2, borderRadius: 2, mb: 2 }}
            >
              <Typography variant="body2">
                {formatAddress(detectedAddress)}
              </Typography>
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    await saveAddressToAPI(detectedAddress);
                    const updated = [...addressList, detectedAddress];
                    setAddressList(updated);
                    setAddress(formatAddress(detectedAddress));
                    setOpenDialog(false);
                  } catch (err) {
                    console.error("Failed to save address", err);
                  }
                }}
              >
                Save This Address
              </Button>
            </Box>
          )}

          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            variant="outlined"
            label="Enter full address"
            placeholder="e.g., 123 Street, Area, City, Pincode"
            value={tempAddress}
            onChange={(e) => setTempAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setAddress(tempAddress);
              setOpenDialog(false);
            }}
            variant="contained"
            disabled={!tempAddress.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NavBar;
