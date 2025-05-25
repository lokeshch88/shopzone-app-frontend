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
        const userInfo = response.data.user; // assuming user details come here
        const username = response.data.username;
        const firstName = response.data.firstName;
        const lastName = response.data.lastName;
        const email = response.data.email;

        localStorage.setItem("authToken", token);
        // localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("username", username);
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("email", email);

        // You can replace alert with a Snackbar later
        window.location.href = "/home"; // redirect to home/dashboard
      })
      .catch((error) => {
        console.error(error);
        alert("Login failed");
      });
  };

  return (
    <Grid
      container
      sx={{
        height: "80vh",
        overflow: "hidden",
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={10} sm={8} md={4}>
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
