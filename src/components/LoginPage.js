
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

 const handleLogin = () => {
    axios.post('http://localhost:8080/user/login', {
      username,
      password,
    })
    .then(response => {
      const token = response.data.token;
      localStorage.setItem('authToken', token); // Save token
      alert(`Logged in successfully as: ${username}`);
      console.log(response.data);
    })
    .catch(error => {
      alert('Login failed');
      console.error(error);
    });
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '50vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <TextField
            label="username"
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
            style={{ marginTop: 20 }}
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
