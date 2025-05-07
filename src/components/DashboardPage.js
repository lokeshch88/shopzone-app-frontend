
import React from 'react';
import { Typography, Button, Paper } from '@mui/material';

const DashboardPage = () => {
  return (
    <Paper elevation={3} style={{ padding: 20, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the Dashboard
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Log out
      </Button>
    </Paper>
  );
};

export default DashboardPage;
