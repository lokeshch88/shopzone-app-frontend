import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Delete } from "@mui/icons-material";

const ProfilePage = () => {
  const username = localStorage.getItem("username");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const email = localStorage.getItem("email");

  const [addresses, setAddresses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/addresses")
  //     .then((res) => res.json())
  //     .then((data) => setAddresses(data))
  //     .catch((err) => console.error("Failed to fetch addresses", err));
  // }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleOpenDialog = (index = -1) => {
    setEditingIndex(index);
    setNewAddress(index >= 0 ? addresses[index].address : "");
    setOpenDialog(true);
  };

  const handleSaveAddress = () => {
    const updatedAddresses = [...addresses];
    if (editingIndex >= 0) {
      updatedAddresses[editingIndex].address = newAddress;
      // update address API call here
    } else {
      updatedAddresses.push({ address: newAddress });
      // create address API call here
    }
    setAddresses(updatedAddresses);
    setOpenDialog(false);
  };

  const handleDelete = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    // delete API call here
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
      {/* User Info Card */}
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
            {/* <Grid item xs={6}>
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
            </Grid> */}
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

      {/* Address Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Saved Addresses
          </Typography>
          <List>
            {addresses.map((addr, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <>
                    <IconButton onClick={() => handleOpenDialog(idx)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(idx)}>
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={addr.address} />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            onClick={() => handleOpenDialog()}
            sx={{ mt: 1 }}
          >
            Add New Address
          </Button>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingIndex >= 0 ? "Edit Address" : "Add Address"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAddress}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
