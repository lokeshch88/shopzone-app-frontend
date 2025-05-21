import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';

const RegisterPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOtp = () => {
    axios.post('http://localhost:8080/user/send-otp', { email: form.email })
      .then(() => {
        alert('OTP sent to your email');
        setOtpSent(true);
      })
      .catch((error) => {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP');
      });
  };

  const verifyOtp = () => {
    axios.post('http://localhost:8080/user/verify-otp', {
      email: form.email,
      otp: form.otp,
    })
      .then(() => {
        alert('OTP verified');
        setOtpVerified(true);
      })
      .catch((error) => {
        console.error('OTP verification failed:', error);
        alert('Invalid OTP');
      });
  };

  const handleRegister = () => {
    if (!otpVerified) return alert('Please verify OTP first.');

    axios.post('http://localhost:8080/user/register', {
      username: form.username,
      email: form.email,
      password: form.password,
    })
      .then(() => {
        alert('Registration successful');
      })
      .catch((error) => {
        console.error('Registration failed:', error);
        alert('Registration failed');
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: { xs: 4, sm: 6 } }}>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          gutterBottom
          textAlign="center"
        >
          Register
        </Typography>

        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={form.username}
          onChange={handleChange}
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={handleChange}
        />

        <Grid container spacing={1} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
              fullWidth={isMobile}
              onClick={sendOtp}
              disabled={otpSent}
            >
              {otpSent ? 'OTP Sent' : 'Send OTP'}
            </Button>
          </Grid>
        </Grid>

        {otpSent && (
          <>
            <TextField
              label="Enter OTP"
              name="otp"
              fullWidth
              margin="normal"
              value={form.otp}
              onChange={handleChange}
            />

            {!otpVerified && (
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                sx={{ mt: 2 }}
                onClick={verifyOtp}
              >
                Verify OTP
              </Button>
            )}
          </>
        )}

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={form.password}
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
