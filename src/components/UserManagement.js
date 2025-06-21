import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowBack, Add, Search } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Add this

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserDialogOpen, setUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate(); // ✅ Use this for routing

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:8080/user/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("User fetch error:", err));
  };

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      axios
        .delete(`http://localhost:8080/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("User deleted successfully");
          fetchUsers();
        })
        .catch((err) => {
          alert("Failed to delete user");
          console.error(err);
        });
    }
  };

  const handleUserSubmit = () => {
    if (!selectedUser.username || !selectedUser.email) {
      alert("Please fill all required fields");
      return;
    }

    if (dialogMode === "add") {
      axios
        .post("http://localhost:8080/user/register", selectedUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("User added successfully");
          setUserDialogOpen(false);
          fetchUsers();
        })
        .catch((err) => {
          alert("Failed to add user");
          console.error(err);
        });
    } else if (dialogMode === "update") {
      axios
        .put(`http://localhost:8080/user/${selectedUser.id}`, selectedUser, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          alert("User updated successfully");
          setUserDialogOpen(false);
          fetchUsers();
        })
        .catch((err) => {
          alert("Failed to update user");
          console.error(err);
        });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/admin-dashboard")} sx={{ mr: 2 }}>
          {/* ✅ Navigates back to the dashboard */}
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search Users"
            variant="outlined"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            sx={{ flexGrow: 1, minWidth: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setDialogMode("add");
              setSelectedUser({ username: "", email: "", password: "" });
              setUserDialogOpen(true);
            }}
          >
            Add User
          </Button>
        </Box>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Username</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => {
                        setDialogMode("view");
                        setSelectedUser(user);
                        setUserDialogOpen(true);
                      }}
                      sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setDialogMode("update");
                        setSelectedUser(user);
                        setUserDialogOpen(true);
                      }}
                      sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" color="text.secondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* User Dialog */}
      <Dialog
        open={isUserDialogOpen}
        onClose={() => setUserDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {dialogMode === "add"
            ? "Add New User"
            : dialogMode === "update"
            ? "Update User"
            : "User Details"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            variant="outlined"
            value={selectedUser?.username || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, username: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={selectedUser?.email || ""}
            disabled={dialogMode === "view"}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
          {dialogMode === "add" && (
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={selectedUser?.password || ""}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, password: e.target.value })
              }
            />
          )}
          {dialogMode === "view" && (
            <>
              <TextField
                margin="dense"
                label="User ID"
                fullWidth
                variant="outlined"
                value={selectedUser?.id || ""}
                disabled
              />
              <TextField
                margin="dense"
                label="Role"
                fullWidth
                variant="outlined"
                value={selectedUser?.role || "User"}
                disabled
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          {(dialogMode === "add" || dialogMode === "update") && (
            <Button onClick={handleUserSubmit} variant="contained">
              {dialogMode === "add" ? "Add User" : "Update User"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;
