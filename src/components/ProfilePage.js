import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const email = localStorage.getItem("email");

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all stored user data
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");

    // Redirect to login
    navigate("/login");
  };

  if (!username || !email) {
    return (
      <Container sx={{ mt: 5 }}>
        <Typography variant="h6" color="error">
          Please log in to access your profile.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" flexDirection="column" mb={3}>
            <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{username}</Typography>
            <Typography color="text.secondary">{email}</Typography>
          </Box>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                First Name
              </Typography>
              <Typography>{firstName || "-"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Last Name
              </Typography>
              <Typography>{lastName || "-"}</Typography>
            </Grid>
          </Grid>
          <Box textAlign="center">
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
