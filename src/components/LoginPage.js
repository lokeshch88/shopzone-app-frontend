import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogin = () => {
    axios
      .post("http://localhost:8080/user/login", { username, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("authToken", token);
        alert(`Logged in successfully as: ${username}`);
      })
      .catch((error) => {
        alert("Login failed");
        console.error(error);
      });
  };

  return (
    <Grid
      container
      style={{ minHeight: "100vh" }}
      alignItems="center"
      justifyContent="center"
    >
      {/* Left Ad/Info Section */}
      {!isMobile && (
        <Grid item md={6} sx={{ textAlign: "center", p: 4 }}>
          <img
            src="https://via.placeholder.com/400x400?text=Ad+Banner"
            alt="Advertisement"
            style={{ width: "100%", maxWidth: 400 }}
          />
        </Grid>
      )}

      {/* Right Login Section */}
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography variant="h5" gutterBottom align="center">
            Login
          </Typography>
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
